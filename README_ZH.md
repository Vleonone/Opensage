<div align="center">

<img src="assets/Opensage_banner.svg" width="100%" alt="OpenSage Banner">

<h3>自主智能体的认知神经系统</h3>

<p>
  <strong>意图感知 • 分层路由 • 故障逃逸</strong>
</p>

<p>
  <a href="docs/design.md">技术设计</a> |
  <a href="docs/setup.md">安装指南</a> |
  <a href="docs/comparison.md">方案对比</a> |
  <a href="docs/integrations.md">集成文档</a> |
  <a href="README.md">English Doc</a>
</p>

[![Version](https://img.shields.io/badge/Version-1.0.0-39ff14?style=flat-square&labelColor=c2c2c2)](./package.json)
[![License](https://img.shields.io/badge/License-MIT-39ff14?style=flat-square&labelColor=c2c2c2)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-39ff14?style=flat-square&logo=typescript&logoColor=white&labelColor=c2c2c2)](./tsconfig.json)
[![Node](https://img.shields.io/badge/Node.js-18+-39ff14?style=flat-square&logo=node.js&logoColor=white&labelColor=c2c2c2)](https://nodejs.org)
[![Ollama](https://img.shields.io/badge/Ollama-Required-39ff14?style=flat-square&labelColor=c2c2c2)](https://ollama.com)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Compatible-39ff14?style=flat-square&labelColor=c2c2c2)](https://openrouter.ai)

</div>

<br>

<img src="assets/opensage_demo.gif" width="100%" alt="OpenSage Demo TUI">

<br>



## 1. 项目概述 (Overview)

OpenSage 是一个专为 LLM 智能体设计的**认知路由引擎**。与传统的静态网关不同，OpenSage 在执行任何模型调用之前，会先对用户的 Prompt 进行**语义意图分析**。

它通过一个本地运行的轻量级“神谕”模型（Local Oracle），智能判断任务的复杂度与领域，从而将请求分发给最合适的模型。这种机制在保证任务完成质量的前提下，显著降低了 API 调用成本并提升了响应速度。

**核心能力：**
*   **本地神谕引擎**：利用 `qwen2.5:0.5b` 对 Prompt 进行 1-10 级的复杂度评分与领域分类。
*   **三级分层路由**：根据评分将任务分发至反射层（Reflex）、标准层（Standard）或深度层（Deep）。
*   **故障逃逸设计**：Fail-Open 架构，确保在本地模型无响应时自动降级到云端标准模型，保障业务连续性。

### 1.1 当前实现状态
当前版本 (`v1.0.0`) 已包含完整的核心路由逻辑、本地 Ollama 集成以及用于监控的终端 UI。

| 模块 | 状态 | 说明 |
| :--- | :--- | :--- |
| **Oracle 引擎** | ✅ 就绪 | 支持 500ms 超时熔断的本地分类器。 |
| **分层决策** | ✅ 就绪 | 定义了精确的分层映射逻辑。 |
| **模型解析** | ✅ 就绪 | 支持 `provider:model` 格式的智能解析。 |
| **自动反思** | 🚧 计划中 | 正在开发输出结果的自动化质量验证与重试机制。 |



## 2. How It Works (运行机制)

OpenSage 采用流水线式架构，确保从输入到决策的极低延迟。下图展示了数据流的全过程：

```mermaid
graph TD
    %% Cyber-Sage Theme
    classDef user fill:#000000,stroke:#66ff66,stroke-width:2px,color:#ffffff,rx:10,ry:10;
    classDef core fill:#000000,stroke:#39ff14,stroke-width:2px,color:#ffffff,rx:10,ry:10;
    classDef tier fill:#000000,stroke:#66ff66,stroke-width:2px,color:#ffffff,rx:5,ry:5;
    classDef logic fill:#000000,stroke:#99ff99,stroke-width:2px,color:#ffffff,stroke-dasharray: 5 5,rx:5,ry:5;
    linkStyle default stroke:#66ff66,stroke-width:2px;

    User(["用户输入"]):::user --> Ingest
    
    subgraph Velonlabs ["Velonlabs 认知内核"]
        direction TB
        style Velonlabs fill:#111111,stroke:#66ff66,stroke-width:2px,color:#66ff66
        Ingest[("接收")]:::logic --> Oracle
        Oracle{{"本地 Oracle\n(qwen2.5:0.5b)"}}:::core
        
        Oracle == 深度分析 ==> Router(("神经突触\n决策器")):::logic
    end

    Router -->|反射层 (1-3)| T1["Tier 1: Reflex\n(Groq / Llama-3)"]:::tier
    Router -->|标准层 (4-7)| T2["Tier 2: Standard\n(GPT-4o-mini)"]:::tier
    Router -->|深度层 (8-10)| T3["Tier 3: Deep\n(Claude 3.5 Sonnet)"]:::tier

    T1 -.->|质量验证| AutoCheck{"智能质检"}:::logic
    AutoCheck -->|未通过| T2
    AutoCheck -->|通过| Output
    
    T2 --> Output
    T3 --> Output([("最终结果")]):::user
```



## 3. 成本效益分析 (ROI)

OpenSage 的设计基于一个核心洞察：**80% 的日常对话并不需要 GPT-4 级别的算力。**

通过将简单查询卸载到本地或廉价模型，机构用户可以在混合负载下实现显著的成本节约，同时为复杂任务保留足够的算力预算。

| 请求类型 | 典型占比 | 传统成本 | OpenSage 优化成本 |
| :--- | :---: | :--- | :--- |
| **日常闲聊 / 简单查询** | ~30% | $0.03 / 次 (GPT-4) | **$0.00** (Local/Groq) |
| **常规逻辑 / 代码补全** | ~50% | $0.03 / 次 (GPT-4) | **$0.0002** (Llama 3) |
| **深度推理 / 复杂架构** | ~20% | $0.03 / 次 (GPT-4) | **$0.03** (Claude 3.5) |

> **预期收益**：在混合场景下，API 总体支出可降低约 **80%**。



## 4. 安装与配置 (Setup)

### 4.1 前置要求
OpenSage 依赖本地推理引擎来运行 Oracle 模型。我们官方支持并推荐使用 **Ollama**。

1.  **安装 Ollama**: 请访问 [ollama.com](https://ollama.com) 下载并安装。
2.  **获取 Oracle 模型**:
    ```bash
    ollama pull qwen2.5:0.5b
    ```
    *注：`qwen2.5:0.5b` 因其极快的推理速度和优秀的分类准确率被选为默认 Oracle。*

### 4.2 快速开始
克隆仓库并安装依赖：

```bash
git clone https://github.com/Vleonone/Opensage.git
cd Opensage
npm install
```



## 5. 使用指南 (Usage)

### 5.1 代码集成
OpenSage 设计为可以直接嵌入到您的 Agent 决策循环中。

```typescript
import { CognitiveRouter } from "./src/router.js";

// 初始化路由单例
const router = CognitiveRouter.getInstance();

// 路由一个请求
const result = await router.route("帮我优化这个 React Hook 的竞态问题");

// result 对象包含最佳的模型选择建议
console.log(result);
// 输出示例:
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

### 5.2 终端仪表盘 (TUI)
用于开发调试的实时监控界面。

```bash
npm run gui
```

### 5.3 生产构建
编译 TypeScript 源码以供生产环境使用：

```bash
npm run build
node dist/tui_demo.js
```



## 6. 框架集成 (Integration)

### 6.1 与 AeonsagePro 集成
在 AeonsagePro 中，OpenSage 作为中间件拦截器运行。它在 `src/commands/agent.ts` 中拦截用户消息，在建立会话前覆盖默认的模型配置。

### 6.2 通用集成模式 (OpenClaw / LangChain)
OpenSage 是框架无关的，适用于任何支持动态模型选择的系统。

```typescript
// 通用集成示例
async function handleRequest(prompt: string) {
    // 1. 获取路由决策
    const decision = await router.route(prompt);
    
    // 2. 根据决策配置 LLM 客户端
    const llmClient = new LLMClient({
        provider: decision.provider,
        model: decision.model
    });
    
    // 3. 执行请求
    return await llmClient.complete(prompt);
}
```



## 7. 配置与规划 (Roadmap)

### 7.1 自定义模型映射
您可以在 `src/routing/cascading.ts` 中修改层级与模型的映射关系，以适配您的 API 订阅情况。

```typescript
export const TIER_MODEL_MAP = {
    reflex:   ["openrouter:groq/llama-3-8b-8192", "ollama:qwen2.5:0.5b"],
    standard: ["gpt-4o-mini", "claude-3-haiku"],
    deep:     ["claude-3-5-sonnet-20240620", "gpt-4o"],
};
```

### 7.2 路线图
*   **智能反思环**：实现基于执行结果的自动升格重试机制。
*   **插件系统**：支持加载外部定义的自定义路由策略。
*   **全链路监控**：内置 Token 消耗统计与成本实时可视化。
*   **多语言 SDK**：计划推出 Python 版本 SDK 以支持 AI 研究工作流。



## 8. 项目结构 (Structure)

```
src/
  router.ts              -- CognitiveRouter (核心入口)
  oracle/
    engine.ts            -- OracleEngine (基于 Ollama 的本地推理)
  routing/
    cascading.ts         -- CascadingRouter (分层与模型映射逻辑)
docs/
  design.md              -- 技术架构白皮书
  setup.md               -- 环境搭建指南
  comparison.md          -- 方案对比分析
  integrations.md        -- 生态集成指南 (Mem0, MCP, ChromaDB)
examples/
  demo.ts                -- 演示脚本
```



## 9. 贡献指南 (Contributing)

我们欢迎社区贡献！请确保在提交 PR 前运行并通过所有测试用例。
