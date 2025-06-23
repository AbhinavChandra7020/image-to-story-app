# ImageineIt

##  Project Overview

A picture is worth a thousand words. Let me prove that. ImageineIt is a sophisticated full-stack AI application that bridges computer vision and natural language processing to transform static images into dynamic, engaging narratives. This project demonstrates advanced integration of modern web technologies with cutting-edge AI models, showcasing expertise in both frontend development and AI system architecture.

## Demo Video


---

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15 with App Router.
- **Language**: TypeScript for type safety.
- **Styling**: Tailwind CSS with custom design system.
- **UI Components**: Material-UI icons with custom component library.
- **State Management**: React hooks with context for theme management.

### Backend & AI Integration
- **API Routes**: Next.js API routes for serverless functions
- **AI Models**: 
  - Qwen2.5VL:7B for image caption generation
  - Llama3.1:8B for story generation, polishing, and title creation.
- **Model Hosting**: Ollama for local AI model deployment.
- **Streaming**: Real-time response streaming for enhanced UX.

---
## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Ollama installed locally
- Required AI models: `qwen2.5vl:7b` and `llama3.1:8b`

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbhinavChandra7020/image-to-story-app
   cd image-to-story-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up AI models**
   ```bash
   # Install Ollama models
   ollama pull qwen2.5vl:7b
   ollama pull llama3.1:8b
   
   # Start Ollama server
   ollama serve
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Data Flow Architecture
```
Image Upload → Base64 Encoding → Qwen2.5VL Analysis → 
Caption Generation → User Settings → Llama3.1 Processing → 
Story Generation → Text Polishing → Export Options
```

---

### File Structure
```
├── app/
│   ├── _components/          # Reusable UI components
│   ├── _lib/                # AI integration logic
│   ├── _pages/              # Page components
│   ├── _types/              # TypeScript type definitions
│   ├── _utils/              # Utility functions
│   └── api/                 # API route handlers
├── public/                   # Static assets
└── configuration files
```
## AI Model Configuration

### Qwen2.5VL:7B (Vision Model)
- **Purpose**: Image analysis and caption generation
- **Parameters**: 7 billion parameters for visual understanding
- **Capabilities**: Object detection, scene analysis, mood interpretation

### Llama3.1:8B (Language Model)
- **Purpose**: Story generation, text polishing, title creation
- **Parameters**: 8 billion parameters for language understanding
- **Optimization**: Custom temperature and sampling settings per use case


## Features
- **AI-Powered Storytelling**: Leverages Qwen2.5VL (7B parameters) for image analysis and Llama3.1 (8B parameters) for story generation.
- **Dual Generation Modes**: Interactive chat-based storytelling and automated one-shot generation.
- **Flexible Export System**: Multiple format support (TXT, DOCX, PDF) with proper formatting.
- **Advanced Customization**: Genre selection, creativity levels, focus modes, and consistency controls.
- **Responsive Design**: Mobile-first approach with dark/light theme support.

### Smart Image Analysis
- **Multi-format Support**: PNG, JPG, JPEG, WebP with 10MB limit.
- **Context Understanding**: Object recognition, scene composition, mood detection.
- **Flexible Detail Levels**: Quick summary or comprehensive analysis.
- **Real-time Processing**: Optimized for responsive user experience.

### Advanced Story Generation

#### Interactive Mode
- **Conversational Interface**: Chat-based story development.
- **User Guidance**: Real-time direction and plot influence.
- **Dynamic Adaptation**: AI responds to user instructions contextually.
- **Progressive Building**: Chapter-by-chapter story construction.

#### One-Shot Mode
- **Automated Generation**: Set target word count and let AI complete the story.
- **Progress Tracking**: Real-time word count and chapter monitoring.
- **Structured Narrative**: Automatic story arc management (beginning → development → conclusion).
- **Scalable Length**: 500 to 50,000+ words with intelligent pacing.

### Customization

#### Generation Parameters
- **Creativity Levels**: Conservative, Balanced, Creative (different temperature settings).
- **Focus Modes**: Descriptive, Dialogue-heavy, Action-packed, Balanced.
- **Genre Flexibility**: 12+ genres with custom genre support.
- **Consistency Mode**: Reduced randomness for coherent long-form narratives.

#### Technical Controls
- **Chunk Targeting**: Configurable response length (100-1500 words).
- **Context Management**: Dynamic context window sizing.
- **Stop Sequences**: Intelligent story completion detection.
- **Seed Control**: Reproducible vs. creative generation modes.

### Flexible Export System
- **Multiple Formats**: TXT, DOCX, and PDF with proper formatting.
- **Metadata Inclusion**: Genre, creation date, generation settings.
- **Title Generation**: AI-powered title suggestions.
- **Copy Functionality**: Quick clipboard integration.

---

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
