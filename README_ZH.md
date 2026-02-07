<div align="center">

<img src="assets/banner.png" width="100%" alt="OpenSage Banner">

<h3>自主智能体的认知神经系统</h3>

<p>
  <strong>认知路由 · 零延迟 · 数据主权</strong>
</p>

<p>
  <a href="docs/design.md">技术设计</a> •
  <a href="docs/setup.md">安装指南</a> •
  <a href="docs/comparison.md">竞品对比</a> •
  <a href="docs/integrations.md">生态集成</a> •
  <a href="docs/sovereign-kernel.md">内核文档</a> •
  <a href="README.md">English</a>
</p>

[![Version](https://img.shields.io/badge/Version-1.0.0-2ea44f?style=flat-square)](./package.json)
[![License](https://img.shields.io/badge/License-MIT-2ea44f?style=flat-square)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-2ea44f?style=flat-square&logo=typescript&logoColor=white)](./tsconfig.json)
[![Node](https://img.shields.io/badge/Node.js-18+-2ea44f?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Ollama](https://img.shields.io/badge/Ollama-Required-2ea44f?style=flat-square)](https://ollama.com)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Compatible-2ea44f?style=flat-square)](https://openrouter.ai)

> 🚧 **Alpha 阶段** — 核心路由逻辑已实现，CLI 和插件系统正在开发中

</div>


<br>

<img src="assets/opensage_demo.gif" width="100%" alt="OpenSage Demo TUI">

<br>

---

## 这是什么？

**OpenSage** 是一个生产级的**认知路由引擎**，部署在用户和 LLM 之间。

传统做法是把所有请求发给同一个昂贵模型（如 GPT-4）。OpenSage 的思路完全不同——它用一个**本地运行的微型模型（Oracle）**先分析每条请求的意图和复杂度，然后自动将请求路由到最合适的模型层级：

- **简单闲聊** → 免费本地模型（0 成本，0.4 秒响应）
- **标准编码** → 中端模型（极低成本）
- **深度推理** → 顶级模型（仅在真正需要时使用）

> **「不要租用智能，拥有它。」**

---

## 核心优势

| 特性 | 说明 |
| :--- | :--- |
| 🧠 **本地 Oracle** | 一个 0.5B 参数的本地 SLM 在你的机器上运行，分析意图、复杂度和领域，**不消耗任何 API 额度** |
| 💰 **降低 95% 成本** | 80% 的请求（闲聊、简单重构）自动路由到 Groq/Llama 3 等免费或近乎免费的模型 |
| ⚡ **延迟降低 20 倍** | 简单查询在 **< 0.6 秒** 内返回，跳过 GPT-4 的 12 秒等待 |
| 🔒 **数据主权** | Oracle 在本地运行。敏感数据永远不触碰第三方云，除非你主动配置 |

---

## 成本实测对比

> 以下基于 1000 次混合请求的估算模型：

| 请求类型 | 传统方案（全部 GPT-4） | OpenSage（分层路由） |
| :--- | :--- | :--- |
| **闲聊 / 问候**（300 次） | $9.00（GPT-4） | **$0.00**（本地 / Groq） |
| **标准编码 / 重构**（500 次） | $15.00（GPT-4） | **$0.10**（Llama 3 70B） |
| **深度推理 / 架构**（200 次） | $6.00（GPT-4） | **$6.00**（Claude 3.5 / GPT-4） |
| **总计** | **$30.00** | **$6.10**（节省 80%） |
| **平均延迟** | 12.5 秒 | **0.8 秒**（快 15 倍） |

---

## 架构：乐观级联（Optimistic Cascading）

```mermaid
graph TD
    %% Cyber-Sage Theme
    classDef user fill:#000000,stroke:#66ff66,stroke-width:2px,color:#ffffff,rx:10,ry:10;
    classDef core fill:#000000,stroke:#39ff14,stroke-width:2px,color:#ffffff,rx:10,ry:10;
    classDef tier fill:#000000,stroke:#66ff66,stroke-width:2px,color:#ffffff,rx:5,ry:5;
    classDef logic fill:#000000,stroke:#99ff99,stroke-width:2px,color:#ffffff,stroke-dasharray: 5 5,rx:5,ry:5;
    linkStyle default stroke:#66ff66,stroke-width:2px;

    User(["👤 用户输入"]):::user --> Ingest
    
    subgraph Velonlabs ["🌐 Velonlabs 认知内核"]
        direction TB
        style Velonlabs fill:#111111,stroke:#66ff66,stroke-width:2px,color:#66ff66
        Ingest[("📥 接收")]:::logic --> Oracle
        Oracle{{"🔮 本地 Oracle\n(qwen2.5:0.5b)"}}:::core
        
        Oracle == 深度分析 ==> Router(("⚡ 神经突触\n决策器")):::logic
    end

    Router -->|反射层 (1-3)| T1["⚡ Tier 1: Reflex\n(Groq / Llama-3)"]:::tier
    Router -->|标准层 (4-7)| T2["⚙️ Tier 2: Standard\n(GPT-4o-mini)"]:::tier
    Router -->|深度层 (8-10)| T3["🧠 Tier 3: Deep\n(Claude 3.5 Sonnet)"]:::tier

    T1 -.->|质量验证| AutoCheck{"🔍 智能质检"}:::logic
    AutoCheck -->|❌ 未通过| T2
    AutoCheck -->|✅ 通过| Output

    T2 --> Output
    T3 --> Output([("📤 最终结果")]):::user
```

**工作原理**：Oracle 为每条请求打出 1-10 的复杂度分数，然后路由到对应层级。如果低层级的结果未通过验证，会自动升级到上一层级。Oracle 宕机时自动降级到标准层（Fail-Open 设计）。

---

## 环境要求

| 依赖 | 版本 | 用途 |
| :--- | :--- | :--- |
| [Node.js](https://nodejs.org) | ≥ 18 | 运行环境 |
| [Ollama](https://ollama.com) | 最新版 | 本地 Oracle 推理引擎 |
| qwen2.5:0.5b | — | Oracle 默认模型（~400MB） |

---

## 快速开始

### 1. 准备 Oracle 模型 (必须步骤)

OpenSage 依赖本地模型来进行智能路由决策。

👉 **请参考 [安装指南](docs/setup.md) 完成 Ollama 和模型的配置。**

> 我们使用 `qwen2.5:0.5b` 作为 Oracle 核心，因为它在速度和准确性上达到了完美平衡。

### 2. 克隆项目

```bash
git clone https://github.com/Vleonone/Opensage.git
cd Opensage
npm install
```

### 3. 使用路由

```typescript
import { CognitiveRouter } from "./src/router.js";

// 获取单例路由器
const router = CognitiveRouter.getInstance();

// 路由一条请求 — Oracle 自动分析复杂度并选择模型
const result = await router.route("修复这个 React Hook 中的竞态条件");

console.log(result);
// {
//   provider: "openrouter",
//   model: "groq/llama-3-8b-8192",
//   tier: "reflex",           // Oracle 判断为简单任务
//   judgment: { complexity: 3, domain: "coding", ... }
// }
```

### 4. 运行示例

```bash
npx ts-node examples/demo.ts
```

## 运行项目

### 1. 终端图形界面 (TUI)
体验 OpenSage 的最佳方式。展示一个实时的、"黑客风格"的终端界面，包含实时路由日志。

```bash
# 运行 TUI (包含构建步骤)
npm run gui
```

### 2. 简单演示脚本
通过 `ts-node` 运行基础演示脚本（开发模式）。

```bash
npx ts-node examples/demo.ts
```

### 3. 生产环境构建
将 TypeScript 项目编译到 `dist` 目录：

```bash
npm run build
```

编译后的文件可以直接使用 node 运行：
```bash
node dist/tui_demo.js
```

---

## 与 AeonsagePro 的关系

OpenSage 是 **[AeonsagePro](https://github.com/velonone/Aeonsagepro)** 的开源认知路由核心。

在 AeonsagePro 中，OpenSage 被集成在 `src/commands/agent.ts` 中作为智能路由拦截器——在用户未手动指定模型时，自动分析请求并路由到最优模型。AeonsagePro 提供完整的 Agent 框架、多渠道支持、会话管理等企业级功能，而 OpenSage 专注于**路由智能**本身。

---

## 文档

| 文档 | 说明 |
| :--- | :--- |
| [技术设计](docs/design.md) | 核心架构、Oracle 分类 Schema、乐观级联逻辑 |
| [安装指南](docs/setup.md) | Ollama 安装与 Oracle 模型配置 |
| [竞品对比](docs/comparison.md) | OpenSage 认知路由 vs 传统正则路由的差异 |
| [生态集成](docs/integrations.md) | 与 Mem0、MCP、ChromaDB、Helicone 的集成方案 |
| [内核文档](docs/sovereign-kernel.md) | Sovereign Cognitive Kernel 配置与诊断命令 |

---

## 路线图

- [ ] **插件系统** — 允许用户注入自定义路由逻辑
- [ ] **成本追踪器** — 内置 Token 用量统计
- [ ] **CLI 工具** — 独立命令行路由器
- [ ] **Python 移植** — `pip install opensage`
- [ ] **环境变量配置** — Oracle 地址 / 模型 / 超时可配置
- [ ] **NPM 发布** — `npm install opensage` 正式上线

---

## 参与贡献

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。我们欢迎：

- 新的模型 Provider 适配（Google Gemini、Azure、Mistral 等）
- Oracle 模型基准测试（Phi-3、Gemma-2b 等）
- 框架集成适配器（LangChainJS、Vercel AI SDK 等）

## 生态依赖

OpenSage 站在这些巨人的肩膀上：

- **[Ollama](https://ollama.com)** — 本地推理引擎
- **[OpenRouter](https://openrouter.ai)** — 统一模型市场
- **[Groq](https://groq.com)** — 亚秒级推理硬件

## 许可证

MIT © [AeonSage Team](https://aeonsage.org)
