<div align="center">

<img src="https://raw.githubusercontent.com/Vleonone/Opensage/main/assets/aeonsage_Banner.svg" alt="OPENSAGE" width="100%">

**The Reference Implementation of Sovereign Intelligence**

**Architected by VelonLabs · Powered by AeonSage**

<p>
  <a href="https://aeonsage.org">Official Site</a> •
  <a href="docs/sovereign-kernel.md">Kernel Documentation</a>
</p>

<p align="center">
  <a href="https://github.com/Vleonone/AeonsagePro/blob/main/docs/install.md">
    <img src="https://img.shields.io/badge/MAC-INSTALL-7209b7?style=for-the-badge&logo=apple&logoColor=white&labelColor=black" alt="Mac Install">
  </a>
  <a href="https://github.com/Vleonone/AeonsagePro/blob/main/docs/install.md#50-docker-deployment-containerized-isolation">
    <img src="https://img.shields.io/badge/WIN-DOCKER-7209b7?style=for-the-badge&logo=docker&logoColor=white&labelColor=black" alt="Windows Docker">
  </a>
</p>

[![License](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](./LICENSE)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](./LICENSE)

</div>

---

### 1.0 The Nervous System for Autonomous Agents

**OpenSage** is a production-grade **Cognitive Router** designed to sit between your User and your LLMs. It decouples **Intelligence** (Routing) from **Execution** (Inference), allowing you to build agents that are simultaneously **smarter**, **faster**, and **95% cheaper**.

> "Don't rent intelligence. Own it."

## 2.0 Technical Highlights

### 2.1 Sovereign Cognitive Router
*   **Local Oracle**: A tiny, specialized SLM (Small Language Model) runs locally to analyze user intent, complexity, and domain *before* any request leaves your machine.
*   **95% Cost Reduction**: Automatically routes "easy" tasks (80% of traffic) to free/cheap models like **Llama 3** (via Groq) or local quantized models.
*   **Zero-Latency Handoff**: <10ms routing overhead.

### 2.2 System Architecture (Data Flow)

```mermaid
graph TD
    User([User Request]) --> Gateway[Gateway Node]
    Gateway --> Oracle{Local Oracle<br>(Small LM)}
    Oracle -->|High Entropy| Router[Router Logic]
    Router -->|Tier 1: Reflex| LocalLLM[Local Llama3]
    Router -->|Tier 2: Reasoning| CloudLLM[Groq / OpenRouter]
    LocalLLM -->|Token Stream| Response
    CloudLLM -->|Token Stream| Response
    Response --> User
```

### 2.3 Ecosystem Integration Matrix

OpenSage acts as the **Connective Tissue** between these sovereign technologies.
> **USER GUIDE**: For detailed operation of the Neural Uplink, refer to the [Sovereign Cognitive Kernel Manual](docs/sovereign-kernel.md).

| COMPONENT | TECHNOLOGY | ROLE |

## 1. Kernel Abstract

**OpenSage** is the **Cognitive Runtime Environment (CRE)** extracted from the AeonSage OS. It serves as the local-first decision engine for autonomous agents.

Unlike simplified "router" libraries, OpenSage is a **Deterministic Substrate** that enforces:
1.  **Entropy Reduction**: Routing logic based on task complexity, not just model availability.
2.  **Sovereign Execution**: Prefers local inference (Ollama/Llama3) over cloud APIs when possible.

## 2. Technical Specifications

### 2.1 The Routing Matrix (Optimistic Cascading)
The kernel implements a tiered logic system to optimize Cognitive Economics.

| Matrix Tier | Model Class | Task Type | Throughput |
| :--- | :--- | :--- | :--- |
| **Reflex (T1)** | Local SLM (7B) | Formatting, JSON Repair | **< 10ms** |
| **Reasoning (T2)**| GPT-4o-mini | Logic, Planning | ~600ms |
| **Synthesis (T3)**| Claude 3.5 Sonnet | Code Generation | ~4000ms |

### 2.3 Ecosystem Integration Matrix

OpenSage acts as the **Connective Tissue** between these sovereign technologies.
> **USER GUIDE**: For detailed operation of the Neural Uplink, refer to the [Sovereign Cognitive Kernel Manual](../docs/sovereign-kernel.md).

| COMPONENT | TECHNOLOGY | ROLE |
| :--- | :--- | :--- |
| **CORE ENGINE** | ![Ollama](https://img.shields.io/badge/Ollama-Local_Inference-black?style=flat-square) ![OpenRouter](https://img.shields.io/badge/OpenRouter-Unified_API-7434eb?style=flat-square) | Execution & Inference |
| **MEMORY** | ![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_Store-red?style=flat-square) ![Memo](https://img.shields.io/badge/Memo-Long_Term_Recall-gray?style=flat-square) | Semantic Retrieval |
| **ORCHESTRATION** | ![LangChain](https://img.shields.io/badge/LangChain-Flow_Control-1c3c3c?style=flat-square) ![VercelAI](https://img.shields.io/badge/Vercel_AI-Streaming-black?style=flat-square) | Process Management |
| **ACCELERATION** | ![Groq](https://img.shields.io/badge/Groq-LPU_Inference-f55036?style=flat-square) | Low-Latency Token Generation |

> **ARCHITECTURE NOTE**: This matrix represents the *validated* stack. OpenSage is agnostic but optimized for these specific vector/inference pairs.

// Initialize the Sovereign Runtime
const kernel = new CognitiveKernel({
  uplink: process.env.NEURAL_UPLINK_TOKEN,
  sovereignty: 'local-first'
});

// Execute a signed cognitive task
const decision = await kernel.execute({
  intent: 'analyze_market_entropy',
  context: { system_load: 0.45 }
});
```

---

<div align="center">
  <sub><strong>EST. 2025 · VELONLABS RESEARCH · MIT LICENSE</strong></sub>
</div>
