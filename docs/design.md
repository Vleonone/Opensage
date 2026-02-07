# Sovereign Cognitive Router: Technical Design (Internal)

## 1. Overview
This module implements the **Sovereign Cognitive Router**, a local intelligence layer that dynamically routes queries to the most appropriate model based on semantic complexity rather than rigid heuristics. It is designed to be "Smarter, Not Harder" by employing a zero-cost Local SLM Oracle.

**Phased Strategy:**
1.  **Phase A (Internal)**: Integrate into `src/cognitive-router` for AeonSage Pro.
2.  **Phase B (Public)**: Extract and release as a standalone sovereign alternative to existing routers.

## 2. Core Architecture

### 2.1 The "Oracle" (Local SLM)
A lightweight, quantized model running locally (Wasm/WebGPU or localized Node process).
*   **Model**: `Qwen-2.5-0.5B-Instruct` or `Llama-3.2-1B-Instruct` (Quantized q4_k_m).
*   **Role**: "The Vibe Checker". Reads the prompt and outputs a JSON classification.
*   **Latency Budget**: < 200ms.

### 2.2 The Classification Schema
The Oracle analyzes prompts for:
*   **Complexity**: 1 (Trivial) to 10 (Impossibly Hard).
*   **Domain**: `coding`, `creative_writing`, `reasoning`, `fact_retrieval`, `conversation`.
*   **Constraints**: `censorship_sensitive`, `json_format`, `long_context`.

### 2.3 Visual Architecture (Mermaid)

![OpenSage Banner](../assets/Opensage_banner.svg)
![OpenSage Flow](../assets/Flow.png)

### 2.4 Optimistic Cascading (The Routing Logic)

| Tier | Oracle Score | Target Model | Fallback // Verifier | Cost Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1 (Reflex)** | 1-3 | **OpenRouter (Groq/Llama-3)** | None (Human verifies) | **Near Free ($0.08/M)** & **Instant (0.6s)** |
| **Tier 2 (Standard)** | 4-7 | GPT-4o-mini / Haiku | JSON/Code Linter | Low Cost ($0.15/M) |
| **Tier 3 (Deep)** | 8-10 | Claude 3.5 Sonnet / GPT-4o | Auto-Escalation to o1/o3 | High Value Only |

### 2.5 The "Fast & Cheap" Philosophy
By integrating **OpenRouter**, we access the **Groq LPU** inference engine.
*   **Speed**: Groq runs Llama 3 at ~800 tokens/sec. It is effectively "instant".
*   **Cost**: At ~$0.08 per million tokens, it is 99% cheaper than GPT-4.
*   **Role**: The Oracle's job is to aggressively route 80% of traffic here.

## 3. Implementation Plan

### 3.1 Directory Structure
```
src/
  cognitive-router/
    oracle/
      engine.ts       // Wraps node-llama-cpp or similar
      prompts.ts      // System prompts for the Oracle
    routing/
      manager.ts      // The main routing logic
      cascading.ts    // Retry/Escalation logic
    verifiers/
      code-verifier.ts
      json-verifier.ts
```

### 3.2 Integration Point
*   Intercept calls in `gateway/index.ts`.
*   Replace direct model calls with `CognitiveRouter.route(prompt)`.

## 4. Token Optimization (QMD Integration)
*   **Pre-Routing**: Before the Oracle sees the prompt, use `qmd`-style local RAG to retrieve only relevant context chunks.
*   **Zero-Waste**: pass `[Reduced Context] + [Prompt]` to the Oracle to decide the model.

## 5. Next Steps
1.  Core: Set up `node-llama-cpp` or `ollama` binding for the Oracle.
2.  Logic: Implement the "Optimistic Cascading" flowchart.
3.  UI: Add a "Router Debugger" panel to visualize the Oracle's decisions.
