# Setup Guide: Installing the Local Oracle

OpenSage relies on a **Local Small Language Model (SLM)** to analyze user intent without cost or privacy risks.
We recommend **Ollama** as the easiest way to run this model.

## 1. Install Ollama

If you don't have Ollama installed, download it for your OS:

*   **macOS**: [Download](https://ollama.com/download/mac)
*   **Windows**: [Download](https://ollama.com/download/windows)
*   **Linux**: `curl -fsSL https://ollama.com/install.sh | sh`

Once installed, ensure it is running by opening your terminal and typing:
```bash
ollama --version
```

## 2. Download the Model

OpenSage uses **`qwen2.5:0.5b`** by default. It is chosen for its incredible speed and reasoning capability despite being only **0.5 Billion parameters** (approx 400MB).

### Option A: Automatic Setup (Recommended)
Inside the `opensage` project folder, run:
```bash
npm run setup
```

### Option B: Manual Pull
If the script fails, you can pull the model manually:
```bash
ollama pull qwen2.5:0.5b
```

## 3. Verify Installation

Run the following command to test if the "Oracle" is listening:

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:0.5b",
  "prompt": "Are you ready?",
  "stream": false
}'
```

If you see a JSON response, **you are ready to use OpenSage.**
