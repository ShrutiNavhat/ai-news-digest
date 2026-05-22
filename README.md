# 📰 AI News Digest App

A full-stack news analyst platform built with React (Vite) and Node.js (Express) that leverages open-source LLMs to transform raw news articles into customized summaries, simplified explanations, key facts, or bias reports.

## 🤖 LLM Choice & Prompt Engineering
- **LLM Used**: Groq (Llama 3 8B)
- **Prompt Strategy**: Rather than hardcoding prompts, instructions are separated into a configuration matrix. Using a low temperature (0.3) ensures the AI strictly adheres to the requested layout constraints (e.g., exactly 5 sentences for summaries).
- **Array Architecture**: A configuration array is dynamically parsed using a `.reduce()` pipeline on the backend to match instructions directly to the user's requested execution mode.

## 🛠️ Required JavaScript Concepts Implemented
- **`map()`**: Frontend uses it to dynamically build the mode selection buttons from a configuration file.
- **`reduce()`**: Backend uses it to combine prompt components dynamically without nested `if/else` clusters.
- **`filter()`**: Cleans the input text by stripping out empty lines and trailing whitespaces before processing.
- **`async/await`**: Handles all asynchronous fetches and LLM requests wrapped safely inside `try/catch` layers.
- **`useState`**: Tracks exactly 5 explicit values on the frontend (`text`, `activeMode`, `loading`, `result`, `error`).

## 🏃 How to Run Locally

### 1. Backend Setup
1. Navigate to `/backend`.
2. Run `npm install` to download dependencies.
3. Create a `.env` file with your credentials:
   ```env
   GROQ_API_KEY=your_actual_groq_api_key
   PORT=5000