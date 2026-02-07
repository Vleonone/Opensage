# Contributing to OpenSage

**We need your help to build the standard nervous system for AI agents.**

OpenSage is designed to be **agnostic**. It currently supports:
*   **Providers**: OpenAI, Anthropic, OpenRouter, Ollama.
*   **Frameworks**: Compatible with Next.js, Express, NestJS, LangChain, etc.

## How to Contribute

We welcome Pull Requests (PRs) for:
1.  **New Providers**: Add support for Google Gemini, Azure OpenAI, Mistral API, etc.
2.  **New Oracle Models**: Test and benchmark other SLMs (e.g., Phi-3, Gemma-2b).
3.  **Adapters**: Integrations with LangChainJS or Vercel AI SDK.

## Development Workflow

1.  **Fork & Clone**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/Opensage.git
    cd opensage
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Tests (Manual)**:
    Use the demo script to verify your changes:
    ```bash
    npx ts-node examples/demo.ts
    ```

4.  **Submit PR**:
    *   Describe your change clearly.
    *   If adding a Provider, please include a test case.

## Roadmap

*   [ ] **Plugin System**: Allow users to inject custom routing logic.
*   [ ] **Cost Tracker**: Built-in token accounting.
*   [ ] **Python Port**: `pip install opensage` (Coming soon).

Join us in democratizing AI intelligence!
