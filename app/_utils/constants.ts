// Base URL for your local Ollama server
export const OLLAMA_API_URL = "http://localhost:11434/api";

export const MODELS = {
    caption: "qwen2.5vl:7b",
    polish: "llama3.1:8b",
    story: "llama3.1:8b",
    title: "llama3.1:8b"
}

export const GENERATION_PRESETS = {
    default: {
        conservative: {temperature: 0.4, top_p: 0.7, repeat_penalty: 1.15, top_k: 20},
        balanced:     {temperature: 0.7, top_p: 0.85, repeat_penalty: 1.1, top_k: 40},
        creative:     {temperature: 0.9, top_p: 0.75, repeat_penalty: 1.05, top_k: 80},
    }, 
    oneShot: {
        conservative: {temperature: 0.6, top_p: 0.8, repeat_penalty: 1.15, top_k: 30},
        balanced:     {temperature: 0.75, top_p: 0.85, repeat_penalty: 1.1, top_k: 50},
        creative:     {temperature: 0.9, top_p: 0.95, repeat_penalty: 1.05, top_k: 80},
    }
}

export const POLISH_PRESETS = {
    conservative: { temperature: 0.3, top_p: 0.7, repeat_penalty: 1.1 },
    balanced:     { temperature: 0.6, top_p: 0.8, repeat_penalty: 1.1 },
    creative:     { temperature: 0.9, top_p: 0.95, repeat_penalty: 1.05 },
};