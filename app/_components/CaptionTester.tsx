"use client";

import { useState } from "react";

export default function CaptionTester() {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [detailLevel, setDetailLevel] = useState<"short" | "detailed">("detailed");
  const [loading, setLoading] = useState(false);
  
  // handles the uploaded image and sens it to thje backend for captioning
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("detailLevel", detailLevel);

    const res = await fetch("/api/caption", { // image data is sent to the backend
      method: "POST",
      body: formData
    });

    const data = await res.json(); // the caption is recieved from the backend
    setLoading(false);
    setCaption(data.caption ?? "Error generating caption");
  };

  return ( // css for display
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

        <select
          className="block w-full px-3 py-2 border border-gray-300 rounded"
          value={detailLevel}
          onChange={(e) => setDetailLevel(e.target.value as "short" | "detailed")}
        >
          <option className="text-black" value="detailed">Detailed Caption</option>
          <option  className="text-black" value="short">Short Caption</option>
        </select>

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? "Generating..." : "Generate Caption"}
        </button>
      </form>

      {caption && (
        <div className="mt-4 p-2 border rounded bg-gray-100">
          <strong>Caption:</strong>
          <p>{caption}</p>
        </div>
      )}
    </div>
  );
}
