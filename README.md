<div align="center">

<img src="assets/OpenSage_Logo.svg" width="100%" alt="OpenSage Logo">

<h3>The Cognitive Routing Core for LLM Agents</h3>

<p>
  <strong>Intent Analysis • Tiered Model Selection • Fail-Open Design</strong>
</p>

<p>
  <a href="docs/design.md">Design</a> |
  <a href="docs/setup.md">Setup</a> |
  <a href="docs/comparison.md">Comparison</a> |
  <a href="docs/integrations.md">Integrations</a> |
  <a href="README_ZH.md">中文文档</a>
</p>

[![Version](https://img.shields.io/badge/Version-1.0.0-00B51A?style=flat-square&labelColor=c2c2c2)](./package.json)
[![License](https://img.shields.io/badge/License-Hybrid_Apache_2.0_&_OSCL-00B51A?style=flat-square&labelColor=c2c2c2)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-00B51A?style=flat-square&logo=typescript&logoColor=white&labelColor=c2c2c2)](./tsconfig.json)
[![Node](https://img.shields.io/badge/Node.js-18+-00B51A?style=flat-square&logo=nodedotjs&logoColor=white&labelColor=c2c2c2)](https://nodejs.org)
[![Ollama](https://img.shields.io/badge/Ollama-Required-00B51A?style=flat-square&logo=ollama&logoColor=white&labelColor=c2c2c2)](https://ollama.com)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Compatible-00B51A?style=flat-square&labelColor=c2c2c2)](https://openrouter.ai)

### Built With

[![Express](https://img.shields.io/badge/Express-00B51A?style=flat-square&logo=express&logoColor=white&labelColor=c2c2c2)](https://expressjs.com)
[![Socket.io](https://img.shields.io/badge/Socket.io-00B51A?style=flat-square&logo=socketdotio&logoColor=white&labelColor=c2c2c2)](https://socket.io)
[![Zod](https://img.shields.io/badge/Zod-00B51A?style=flat-square&logo=zod&logoColor=white&labelColor=c2c2c2)](https://zod.dev)

</div>

<br>

<img src="assets/opensage_demo.gif" width="100%" alt="OpenSage Demo TUI">

<br>



## 1. Overview

OpenSage is a specialized **routing decision engine** engineered to optimize Large Language Model (LLM) workflows. Unlike traditional gateways that simply pass through requests, OpenSage analyzes the *semantic intent* of every prompt before execution.

It functions as a cognitive pre-processor that determines the optimal model for a given task, balancing cost, latency, and capability. By offloading routing logic to a local, lightweight oracle, OpenSage acts as an intelligent switchboard for your AI agent infrastructure.

**Core Capabilities:**
*   **Oracle Engine**: Utilizes a local Small Language Model (qwen2.5:0.5b) to classify prompt complexity (1-10) and domain.
*   **Tiered Routing**: Maps analysis results to three distinct performance tiers: Reflex, Standard, and Deep.
*   **Fail-Open Architecture**: Ensures zero downtime by defaulting to a standard model if the local oracle is unresponsive.

### 1.1 Current Implementation Status
The current release (`v1.0.0`) includes the core routing logic, local oracle integration, and a terminal user interface (TUI) for real-time monitoring.

| Component | Status | Description |
| :--- | :--- | :--- |
| **Oracle Engine** | ✅ Ready | Local classification with strict 500ms timeout. |
| **Tier Decision** | ✅ Ready | Reflex (1-3), Standard (4-7), Deep (8-10). |
| **Provider Parsing** | ✅ Ready | Intelligent recursive splitting of provider strings. |
| **Verification** | 🚧 Planned | Automated output quality checks and retry logic. |



## 2. How It Works

OpenSage operates a multi-stage pipeline designed to minimize latency while maximizing routing accuracy. The following diagram illustrates the critical path from user input to final response.

![OpenSage Flow](assets/Flow.png)

**Workflow Safety**: The system is designed to be "fail-open". If the local Ollama instance is unreachable or times out, the router automatically defaults to the **Standard Tier**, ensuring that the agent pipeline is never blocked by a routing failure.



## 3. Cost Efficiency Analysis

The primary economic driver for OpenSage is the "80/20 rule" of LLM traffic: a significant portion of user interactions do not require state-of-the-art model capabilities.

By dynamically routing simple queries to free or low-cost models, organizations can achieve substantial cost reductions without compromising user experience on complex tasks.

| Request Type | Typical Volume | Traditional Cost Basis | OpenSage Optimized Cost |
| :--- | :--- | :--- | :--- |
| **Conversational / Chit-chat** | ~30% | $0.03 / req (GPT-4) | **$0.00** (Local/Groq) |
| **Standard Logic / Coding** | ~50% | $0.03 / req (GPT-4) | **$0.0002** (Llama 3) |
| **Deep Reasoning** | ~20% | $0.03 / req (GPT-4) | **$0.03** (Claude 3.5) |

> **projected Savings**: Up to **80%** reduction in API costs for mixed-workload institutional deployments.



## 4. Installation & Setup

### 4.1 Prerequisites
OpenSage requires a local inference engine to serve the Oracle model. We officially support **Ollama** for this purpose.

1.  **Install Ollama**: Follow the instructions at [ollama.com](https://ollama.com).
2.  **Pull the Oracle Model**:
    ```bash
    ollama pull qwen2.5:0.5b
    ```
    *Note: The `qwen2.5:0.5b` model is chosen for its exceptional balance of speed and classification accuracy.*

### 4.2 Quick Start
Clone the repository and install dependencies:

```bash
git clone https://github.com/Vleonone/Opensage.git
cd Opensage
npm install
```



## 5. Usage Guide

### 5.1 Programmatic Integration
OpenSage is designed to be embedded directly into your agent's decision loop.

```typescript
import { CognitiveRouter } from "./src/router.js";

// Initialize the singleton router
const router = CognitiveRouter.getInstance();

// Route a prompt
const result = await router.route("Fix the race condition in this React hook");

// The result object contains the optimal provider and model
console.log(result);
// Output:
// {
//   provider: "openrouter",
//   model: "groq/llama-3-8b-8192",
//   tier: "reflex",
//   judgment: { 
//     complexity: 3, 
//     domain: "coding" 
//   }
// }
```

### 5.2 Terminal Dashboard (TUI)
For development and monitoring, OpenSage includes a high-fidelity terminal user interface.

```bash
npm run gui
```

### 5.3 Production Build
To compile the TypeScript source for production deployment:

```bash
npm run build
node dist/tui_demo.js
```



## 6. Framework Integration

### 6.1 Integration with AeonsagePro
In the AeonsagePro environment, OpenSage acts as a middleware interceptor in `src/commands/agent.ts`. It evaluates the user message and overrides the default model configuration before the session is initialized.

### 6.2 Universal Integration (OpenClaw / LangChain)
OpenSage is framework-agnostic. It can be integrated into any system that facilitates dynamic model selection.

```typescript
// Generic Integration Pattern
async function handleRequest(prompt: string) {
    const decision = await router.route(prompt);
    
    // Configure your LLM client with the decision
    const llmClient = new LLMClient({
        provider: decision.provider,
        model: decision.model
    });
    
    return await llmClient.complete(prompt);
}
```



## 7. Configuration & Roadmap

### 7.1 Tier Map Configuration
The mapping between performance tiers and specific model IDs is defined in `src/routing/cascading.ts`. This can be customized to match your available API keys and enterprise agreements.

```typescript
export const TIER_MODEL_MAP = {
    reflex:   ["openrouter:groq/llama-3-8b-8192"],
    standard: ["gpt-4o-mini"],
    deep:     ["claude-3-5-sonnet-20240620"],
};
```

### 7.2 Development Roadmap
*   **Verification Layer**: Implementing the "Self-Correction" loop for automatic tier escalation upon failure.
*   **Plugin Architecture**: Allowing external modules to inject custom routing logic.
*   **Telemetry**: Built-in token accounting and real-time cost visualization.
*   **Python SDK**: Native Python port for integration with PyTorch/TensorFlow pipelines.



## 8. Project Structure

The codebase is organized to separate core logic, local inference handling, and documentation.

*   `src/router.ts`: Main entry point and singleton manager.
*   `src/oracle/`: Contains the interface to the local Ollama instance.
*   `src/routing/`: Implements the decision logic and tier mapping.
*   `docs/`: Detailed technical documentation and architectural decision records.
*   `examples/`: Reference implementations and demo scripts.

See [CONTRIBUTING.md](./CONTRIBUTING.md). We welcome pull requests for:

- New provider adapters (Google Gemini, Azure, Mistral)
- Oracle model benchmarks (Phi-3, Gemma-2b)
- Framework integration adapters (LangChainJS, Vercel AI SDK)



## ● Ecosystem

OpenSage is the open-source routing core of [AeonsagePro](https://github.com/velonone/Aeonsagepro). It relies on:

- [Ollama](https://ollama.com) — Local inference engine
- [OpenRouter](https://openrouter.ai) — Unified model marketplace
- [Groq](https://groq.com) — Sub-second inference hardware



## ● License

MIT - [AeonSage Team](https://aeonsage.org)
