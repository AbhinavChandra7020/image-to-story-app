"use client";

import { useState } from "react";
import type { CreativityLevel, FocusMode, GenerationInstruction } from "@/app/_types/promptTypes";

const GENRES = [
  "General", "Fantasy", "Science Fiction", "Mystery", "Romance", "Horror", 
  "Adventure", "Drama", "Comedy", "Thriller", "Historical Fiction", "Western"
];

const CREATIVITY_LEVELS: CreativityLevel[] = ["conservative", "balanced", "creative"];
const FOCUS_MODES: FocusMode[] = ["descriptive", "dialogue", "action", "balanced"];
const GENERATION_INSTRUCTIONS: GenerationInstruction[] = ["start", "continue", "conclusion", "final"];

export default function CaptionTester() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [detailLevel, setDetailLevel] = useState<"detailed" | "short">("detailed");
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);

  // Story generation settings
  const [genre, setGenre] = useState("General");
  const [creativityLevel, setCreativityLevel] = useState<CreativityLevel>("balanced");
  const [focusMode, setFocusMode] = useState<FocusMode>("balanced");
  const [consistencyMode, setConsistencyMode] = useState(false);
  const [chunkTarget, setChunkTarget] = useState(500);
  const [instruction, setInstruction] = useState<GenerationInstruction>("start");
  const [userPrompt, setUserPrompt] = useState("");
  const [storySoFar, setStorySoFar] = useState("");
  const [autoGenerateAfterCaption, setAutoGenerateAfterCaption] = useState(false);
  const [maxWords, setMaxWords] = useState(2000);
  const [progressiveInstruction, setProgressiveInstruction] = useState("");

  // Custom dropdown state
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [filteredGenres, setFilteredGenres] = useState(GENRES);

  // Story generation results
  const [oneShotStory, setOneShotStory] = useState("");
  const [interactiveStory, setInteractiveStory] = useState("");
  const [isGeneratingOneShot, setIsGeneratingOneShot] = useState(false);
  const [isGeneratingInteractive, setIsGeneratingInteractive] = useState(false);
  const [fullStory, setFullStory] = useState("");
  const [storyTitle, setStoryTitle] = useState("");
  const [titleOptions, setTitleOptions] = useState<string[]>([]);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCaption = async () => {
    if (!selectedImage) return;

    setIsGeneratingCaption(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("detailLevel", detailLevel);

      const response = await fetch("/api/caption", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to generate caption");
      
      const data = await response.json();
      setCaption(data.caption);
      
      // Auto-generate story if enabled
      if (autoGenerateAfterCaption) {
        setTimeout(() => {
          generateOneShotStory();
        }, 500); // Small delay to let the caption render
      }
    } catch (error) {
      console.error("Caption generation failed:", error);
      alert("Failed to generate caption. Make sure your Ollama server is running.");
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const generateOneShotStory = async () => {
    if (!caption) {
      alert("Please generate a caption first!");
      return;
    }

    setIsGeneratingOneShot(true);
    let totalStory = "";
    let wordCount = 0;

    try {
      while (wordCount < maxWords) {
        console.log(`[ONE-SHOT] Generating chunk ${Math.floor(wordCount / chunkTarget) + 1}...`);
        
        const response = await fetch("/api/story/one-shot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            caption,
            genre,
            storySoFar: totalStory,
            chunkTarget: chunkTarget,
            instruction: totalStory ? "continue" : "start",
            focusMode,
            creativityLevel,
            consistencyMode,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("One-shot error response:", errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const newChunk = data.story || "";
        
        // Append new chunk to total story
        totalStory += (totalStory ? "\n\n" : "") + newChunk;
        wordCount = totalStory.trim().split(/\s+/).length;
        
        // Update all relevant states
        setOneShotStory(totalStory);
        setStorySoFar(totalStory);
        
        // Add to full story compilation with proper formatting
        if (!fullStory && !totalStory.includes("--- Next Chapter ---")) {
          // First chunk
          appendToFullStory(newChunk, "one-shot");
        } else {
          // Subsequent chunks
          appendToFullStory(newChunk, "one-shot");
        }

        const percent = ((wordCount / maxWords) * 100).toFixed(1);
        console.log(`📚 Progress: ${wordCount}/${maxWords} words (${percent}%)`);
        
        if (wordCount >= maxWords) {
          alert(`🎉 One-shot story completed at ${wordCount} words!`);
          break;
        }
        
        // Small delay between generations to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("One-shot story generation failed:", error);
      alert(`Failed to generate one-shot story: ${error.message}\n\nCheck console for details and make sure your Ollama server is running on localhost:11434`);
    } finally {
      setIsGeneratingOneShot(false);
    }
  };

  const generateInteractiveStory = async () => {
    if (!caption) {
      alert("Please generate a caption first!");
      return;
    }

    setIsGeneratingInteractive(true);
    try {
      // Auto-determine story state based on progressive instruction content
      let nearingEnd = false;
      let ending = false;
      let currentInstruction = instruction;
      
      if (progressiveInstruction.trim()) {
        const currentWordCount = storySoFar.trim().split(/\s+/).length;
        const progressPercentage = currentWordCount / maxWords;
        
        if (progressPercentage >= 0.9) {
          ending = true;
          currentInstruction = "final";
        } else if (progressPercentage >= 0.75) {
          nearingEnd = true;
          currentInstruction = "conclusion";
        } else if (!storySoFar.trim()) {
          currentInstruction = "start";
        } else {
          currentInstruction = "continue";
        }
      }

      console.log("Sending interactive payload:", {
        caption,
        genre,
        storySoFar,
        userInstruction: userPrompt,
        chunkTarget,
        nearingEnd,
        ending,
        creativityLevel,
        consistencyMode,
        focusMode,
      });

      const response = await fetch("/api/story/interactive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption,
          genre,
          storySoFar,
          userInstruction: userPrompt,
          chunkTarget,
          nearingEnd,
          ending,
          creativityLevel,
          consistencyMode,
          focusMode,
        }),
      });

      console.log("Interactive response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Interactive error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Interactive success data:", data);
      
      setInteractiveStory(data.story);
      appendToFullStory(data.story, "interactive");
      
      // If progressive instruction is provided, update storySoFar for next generation
      if (progressiveInstruction.trim()) {
        setStorySoFar(prev => prev ? prev + "\n\n" + data.story : data.story);
        
        // Show progress notification
        const newWordCount = (storySoFar + "\n\n" + data.story).trim().split(/\s+/).length;
        const progressPercent = (newWordCount / maxWords * 100).toFixed(1);
        
        if (ending) {
          alert(`🎉 Story completed! Final word count: ${newWordCount}/${maxWords} words`);
        } else if (nearingEnd) {
          alert(`📝 Story is nearing completion: ${newWordCount}/${maxWords} words (${progressPercent}%)`);
        }
      }
    } catch (error) {
      console.error("Interactive story generation failed:", error);
      alert(`Failed to generate interactive story: ${error.message}\n\nCheck console for details and make sure your Ollama server is running on localhost:11434`);
    } finally {
      setIsGeneratingInteractive(false);
    }
  };

  const generateTitle = async () => {
    if (!fullStory && !oneShotStory && !interactiveStory) {
      alert("Please generate a story first!");
      return;
    }

    setIsGeneratingTitle(true);
    try {
      // Use the fullStory if available, otherwise use the individual stories
      const storyText = fullStory || oneShotStory || interactiveStory;
      
      console.log("Generating title for story...");
      
      const response = await fetch("/api/generate-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyText,
          genre,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Title generation error:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Title generation success:", data);
      
      if (data.titles && Array.isArray(data.titles)) {
        setTitleOptions(data.titles);
        if (data.titles.length > 0) {
          setStoryTitle(data.titles[0]); // Set first option as default
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Title generation failed:", error);
      alert(`Failed to generate title: ${error.message}\n\nCheck console for details and make sure your Ollama server is running on localhost:11434`);
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const clearAll = () => {
    setSelectedImage(null);
    setImagePreview("");
    setCaption("");
    setOneShotStory("");
    setInteractiveStory("");
    setStorySoFar("");
    setUserPrompt("");
    setFullStory("");
    setProgressiveInstruction("");
    setStoryTitle("");
    setTitleOptions([]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleGenreChange = (value: string) => {
    setGenre(value);
    const filtered = GENRES.filter(g => 
      g.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredGenres(filtered);
  };

  const selectGenre = (selectedGenre: string) => {
    setGenre(selectedGenre);
    setShowGenreDropdown(false);
    setFilteredGenres(GENRES);
  };

  const appendToFullStory = (newContent: string, type: "one-shot" | "interactive") => {
    const timestamp = new Date().toLocaleTimeString();
    const wordCount = newContent.trim().split(/\s+/).length;
    const separator = fullStory ? "\n\n--- Next Chapter ---\n\n" : "";
    const header = `[${type.toUpperCase()} - ${timestamp} - ${wordCount} words]\n\n`;
    setFullStory(prev => prev + separator + header + newContent);
  };

  const downloadStory = () => {
    if (!fullStory) {
      alert("No story content to download!");
      return;
    }

    // Use custom title if available, otherwise fall back to genre
    const finalTitle = storyTitle || `${genre} Story`;
    
    const storyContent = `Story Title: ${finalTitle}
Generated from: ${caption ? caption.substring(0, 100) + "..." : "Image Caption"}
Generated on: ${new Date().toLocaleString()}

========================================

${fullStory}

========================================
Story completed using AI story generation tool.`;

    const blob = new Blob([storyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Use custom title for filename too, with fallback to genre
    const fileName = storyTitle ? 
      `${storyTitle.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}_${Date.now()}.txt` :
      `${genre.replace(/\s+/g, '_')}_Story_${Date.now()}.txt`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Image Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Image Upload & Caption Generation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border-2 border-gray-400 rounded-md mb-4 text-gray-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-900 mb-2">Caption Detail Level:</label>
              <select
                value={detailLevel}
                onChange={(e) => setDetailLevel(e.target.value as "detailed" | "short")}
                className="w-full p-2 border-2 border-gray-400 rounded-md text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
              >
                <option value="detailed">Detailed</option>
                <option value="short">Short</option>
              </select>
            </div>

            <button
              onClick={generateCaption}
              disabled={!selectedImage || isGeneratingCaption}
              className="w-full bg-blue-600 text-white font-bold p-3 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed mb-3"
            >
              {isGeneratingCaption ? "Generating Caption..." : "Generate Caption"}
            </button>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoGenerate"
                checked={autoGenerateAfterCaption}
                onChange={(e) => setAutoGenerateAfterCaption(e.target.checked)}
                className="mr-2 w-4 h-4"
              />
              <label htmlFor="autoGenerate" className="text-sm font-bold text-gray-900">
                Auto-generate story after caption
              </label>
            </div>
          </div>

          <div>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-md border"
              />
            )}
          </div>
        </div>

        {caption && (
          <div className="mt-4">
            <label className="block text-sm font-bold text-gray-900 mb-2">Generated Caption:</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-3 border-2 border-gray-400 rounded-md h-24 resize-none text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
              placeholder="Generated caption will appear here..."
            />
            <button
              onClick={() => copyToClipboard(caption)}
              className="mt-2 px-4 py-2 bg-gray-700 text-white font-bold rounded-md text-sm hover:bg-gray-800"
            >
              Copy Caption
            </button>
          </div>
        )}
      </div>

      {/* Story Generation Settings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Story Generation Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Genre:</label>
            <div className="relative">
              <input
                type="text"
                value={genre}
                onChange={(e) => handleGenreChange(e.target.value)}
                onFocus={() => setShowGenreDropdown(true)}
                onBlur={() => setTimeout(() => setShowGenreDropdown(false), 150)}
                className="w-full p-2 pr-10 border-2 border-gray-400 rounded-md text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
                placeholder="Enter custom genre or select from dropdown"
              />
              <button
                type="button"
                onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                className="absolute inset-y-0 right-0 flex items-center pr-2 hover:bg-gray-50 rounded-r-md"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showGenreDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-400 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredGenres.length > 0 ? (
                    filteredGenres.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => selectGenre(g)}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 text-gray-900 border-b border-gray-200 last:border-b-0"
                      >
                        {g}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 italic">
                      No matching genres - type your custom genre
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Creativity Level:</label>
            <select
              value={creativityLevel}
              onChange={(e) => setCreativityLevel(e.target.value as CreativityLevel)}
              className="w-full p-2 border-2 border-gray-400 rounded-md text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
            >
              {CREATIVITY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Focus Mode:</label>
            <select
              value={focusMode}
              onChange={(e) => setFocusMode(e.target.value as FocusMode)}
              className="w-full p-2 border-2 border-gray-400 rounded-md text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
            >
              {FOCUS_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Generation Instruction:</label>
            <select
              value={instruction}
              onChange={(e) => setInstruction(e.target.value as GenerationInstruction)}
              disabled={progressiveInstruction.trim() !== ""}
              className="w-full p-2 border-2 border-gray-400 rounded-md text-gray-900 bg-white focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {GENERATION_INSTRUCTIONS.map((inst) => (
                <option key={inst} value={inst}>
                  {inst.charAt(0).toUpperCase() + inst.slice(1)}
                </option>
              ))}
            </select>
            {progressiveInstruction.trim() !== "" && (
              <div className="text-xs text-orange-600 mt-1 font-medium">
                🤖 Auto-managed in Progressive Mode
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Chunk Target (words):</label>
            <input
              type="number"
              value={chunkTarget}
              onChange={(e) => setChunkTarget(Number(e.target.value))}
              className="w-full p-2 border-2 border-gray-400 rounded-md text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
              min="100"
              max="1500"
              step="50"
            />
            <div className="text-xs text-gray-600 mt-1 font-medium">
              📝 Controls how long each story chapter will be (100-1500 words)
            </div>
          </div>

          <div className="flex items-center pt-6">
            <input
              type="checkbox"
              id="consistencyMode"
              checked={consistencyMode}
              onChange={(e) => setConsistencyMode(e.target.checked)}
              className="mr-2 w-4 h-4"
            />
            <label htmlFor="consistencyMode" className="text-sm font-bold text-gray-900">
              Consistency Mode
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-900 mb-2">User Prompt/Instruction:</label>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="w-full p-3 border-2 border-gray-400 rounded-md h-20 resize-none text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter specific instructions for the story generation..."
          />
        </div>

        {/* Progressive Story Building Settings */}
        <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-md">
          <h3 className="text-lg font-bold text-gray-900 mb-3">📈 Progressive Story Building</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Progressive Instructions:</label>
              <textarea
                value={progressiveInstruction}
                onChange={(e) => setProgressiveInstruction(e.target.value)}
                className="w-full p-3 border-2 border-gray-400 rounded-md h-20 resize-none text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
                placeholder="Enter instructions for progressive story building (leave empty to disable progressive mode)..."
              />
              <div className="text-xs text-blue-700 mt-1 font-medium">
                💡 Enter any text to enable progressive mode. The story will automatically manage progression toward completion.
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Maximum Story Length (words):</label>
              <input
                type="number"
                value={maxWords}
                onChange={(e) => setMaxWords(Number(e.target.value))}
                className="w-full p-2 border-2 border-gray-400 rounded-md text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
                min="500"
                max="10000"
                step="100"
              />
              <div className="text-xs text-blue-700 mt-1 font-medium">
                🎯 Story will automatically wrap up when approaching this limit
              </div>
            </div>
            
            {storySoFar && progressiveInstruction.trim() && (
              <div className="bg-white p-3 rounded-md border border-blue-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-900">📊 Current Progress:</span>
                  <span className="text-sm font-bold text-blue-700">
                    {storySoFar.trim().split(/\s+/).length}/{maxWords} words 
                    ({((storySoFar.trim().split(/\s+/).length / maxWords) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (storySoFar.trim().split(/\s+/).length / maxWords) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-xs text-blue-700 mt-2">
            💡 <strong>Progressive Mode:</strong> Automatically manages story progression when instructions are provided. 
            {progressiveInstruction.trim() ? " Generation instruction is auto-selected based on progress." : " Enter progressive instructions above to enable automatic story management."}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-900 mb-2">Story So Far:</label>
          <textarea
            value={storySoFar}
            onChange={(e) => setStorySoFar(e.target.value)}
            className="w-full p-3 border-2 border-gray-400 rounded-md h-32 resize-y text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter the existing story content (for continuation)..."
          />
        </div>
      </div>

      {/* Story Generation Buttons */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Generate Stories</h2>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={generateOneShotStory}
            disabled={!caption || isGeneratingOneShot}
            className="flex-1 bg-green-600 text-white font-bold p-3 rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isGeneratingOneShot ? "Generating One-Shot..." : "Generate One-Shot Story"}
          </button>
          
          <button
            onClick={generateInteractiveStory}
            disabled={!caption || isGeneratingInteractive}
            className="flex-1 bg-purple-600 text-white font-bold p-3 rounded-md hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isGeneratingInteractive ? "Generating Interactive..." : "Generate Interactive Story"}
          </button>
          
          <button
            onClick={generateTitle}
            disabled={(!fullStory && !oneShotStory && !interactiveStory) || isGeneratingTitle}
            className="px-6 bg-yellow-600 text-white font-bold p-3 rounded-md hover:bg-yellow-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isGeneratingTitle ? "Generating Title..." : "Generate Title"}
          </button>
          
          <button
            onClick={clearAll}
            className="px-6 bg-red-600 text-white font-bold p-3 rounded-md hover:bg-red-700"
          >
            Clear All
          </button>
        </div>

        {!caption && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 font-bold">
                  📝 Generate a caption first to enable story generation!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Story Results */}
      {(oneShotStory || interactiveStory) && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Generated Stories</h2>
          
          {oneShotStory && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">One-Shot Story:</h3>
                <button
                  onClick={() => copyToClipboard(oneShotStory)}
                  className="px-4 py-2 bg-gray-700 text-white font-bold rounded-md text-sm hover:bg-gray-800"
                >
                  Copy Story
                </button>
              </div>
              <textarea
                value={oneShotStory}
                onChange={(e) => setOneShotStory(e.target.value)}
                className="w-full p-3 border-2 border-gray-400 rounded-md h-64 resize-y text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
                readOnly
              />
            </div>
          )}

          {interactiveStory && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">Interactive Story:</h3>
                <button
                  onClick={() => copyToClipboard(interactiveStory)}
                  className="px-4 py-2 bg-gray-700 text-white font-bold rounded-md text-sm hover:bg-gray-800"
                >
                  Copy Story
                </button>
              </div>
              <textarea
                value={interactiveStory}
                onChange={(e) => setInteractiveStory(e.target.value)}
                className="w-full p-3 border-2 border-gray-400 rounded-md h-64 resize-y text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
                readOnly
              />
            </div>
          )}
        </div>
      )}

      {/* Full Story Compilation */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Complete Story Compilation</h2>
          <div className="flex gap-2 items-center">
            {fullStory && (
              <div className="text-sm text-gray-600 font-bold bg-gray-100 px-3 py-1 rounded-md">
                📊 {fullStory.trim().split(/\s+/).length} words total
              </div>
            )}
            <button
              onClick={() => copyToClipboard(fullStory)}
              disabled={!fullStory}
              className="px-4 py-2 bg-gray-700 text-white font-bold rounded-md text-sm hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Copy Full Story
            </button>
            <button
              onClick={downloadStory}
              disabled={!fullStory}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              📥 Download as TXT
            </button>
          </div>
        </div>

        {/* Title Section */}
        {titleOptions.length > 0 && (
          <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-md">
            <h3 className="text-lg font-bold text-gray-900 mb-3">📚 Story Title Options</h3>
            <div className="space-y-2">
              {titleOptions.map((title, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    id={`title-${index}`}
                    name="storyTitle"
                    value={title}
                    checked={storyTitle === title}
                    onChange={() => setStoryTitle(title)}
                    className="mr-3 w-4 h-4"
                  />
                  <label htmlFor={`title-${index}`} className="text-gray-900 font-medium cursor-pointer flex-1">
                    {title}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <label className="block text-sm font-bold text-gray-900 mb-1">Custom Title:</label>
              <input
                type="text"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                className="w-full p-2 border-2 border-gray-400 rounded-md text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
                placeholder="Or enter your own custom title..."
              />
            </div>
          </div>
        )}
        
        <textarea
          value={fullStory}
          onChange={(e) => setFullStory(e.target.value)}
          className="w-full p-3 border-2 border-gray-400 rounded-md h-64 resize-y text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
          placeholder="Your complete story will appear here as you generate chapters. Each generation will be appended with timestamps and chapter markers."
        />
        
        {!fullStory && (
          <div className="mt-2 text-sm text-gray-600 italic">
            💡 Tip: Generate stories above and they'll automatically be compiled here. You can edit the text before downloading!
          </div>
        )}
      </div>
    </div>
  );
}