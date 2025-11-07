<div align="right">
  <span>[<a href="./README.md">English</a>]<span>
  </span>[<a href="./README_CN.md">简体中文</a>]</span>
</div>  

<div align="center">

  <h1>ChatTutor</h1>

  <p>可视化与交互式 AI 教师</p>
  
  <div align="center">
    <img src="https://img.shields.io/github/package-json/v/sheepbox8646/ChatTutor" alt="Version" />
    <img src="https://img.shields.io/github/license/sheepbox8646/ChatTutor" alt="License" />
    <img src="https://img.shields.io/github/stars/sheepbox8646/ChatTutor?style=social" alt="Stars" />
    <img src="https://img.shields.io/github/forks/sheepbox8646/ChatTutor?style=social" alt="Forks" />
    <img src="https://img.shields.io/github/last-commit/sheepbox8646/ChatTutor" alt="Last Commit" />
    <img src="https://img.shields.io/github/issues/sheepbox8646/ChatTutor" alt="Issues" />
  </div>
  
</div>

---

ChatTutor 是一个配备了电子白板功能的 AI 教师。

传统的聊天机器人主要通过文字与用户交互，这在大多数场景下已经足够。然而，随着近年来大语言模型（LLM）的发展，越来越多的人开始使用 AI 来辅助学习。在真实课堂中，教师拥有许多教学工具——粉笔、电脑、黑板等——这些都能帮助学生更好地理解知识。但对于聊天机器人来说，仅靠文字传递信息是非常有限的，尤其是在 STEM 学科中。

ChatTutor 有效地解决了这一问题。它将现实教育场景中的各种教学工具数字化呈现，让用户能够通过电子设备与之交互。我们赋予了 AI 使用这些教学工具的能力，使其真正成为一个“能动手”的教师。

## Features

- [x] 数学画板
![数学画板](./public/demo1.png)
- [ ] 代码页面
- [x] 思维导图
![思维导图](./public/demo2.png)
- [ ] 物理画板
- [ ] 数字逻辑画板
- [ ] AI 为用户自动生成题目与解答

## Roadmap
请参考我们的 [v0.1 路线图](https://github.com/sheepbox8646/ChatTutor/issues/1) 以了解详细计划。

## 快速开始

### 环境要求

- Node.js >= 20
- Postgres
- PNPM

### 环境变量配置

```bash
cp .env.example .env
```

在 `.env` 文件中填写你的配置信息：

- `MODELS`: 要使用的模型，使用逗号 `,` 分隔多个模型。
- `API_KEY`: 所使用的 API 密钥。
- `BASE_URL`: 接口基础地址。
- `DATABASE_URL`: Postgres 数据库连接地址。

### 初始化

```bash
pnpm i
pnpm db:push # 初始化数据库
```

### Run

```bash
pnpm dev
```

## 核心功能所用项目

- [xsai](https://github.com/moeru-ai/xsai): 轻量级 AI SDK。
- [jsxgraph](https://jsxgraph.org/): 交互式几何、函数绘图与数据可视化库。

---
**MIT 许可证**

*版权  (c) 2025 Acbox, 保留所有权利。*