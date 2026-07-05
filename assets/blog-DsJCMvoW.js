import{t as e}from"./browser-Cj0_s6SK.js";var t=`---
title: "我到底在“写”什么？"
slug: "what-writing"
summary: "探讨在AI时代，我们到底在“写”什么"
created: "2026-03-15"
updated: "2026-03-16"
categories: ["AI"]
tags: ["结构化", "复用"]
draft: false
---

# 我到底在“写”什么？

## 一、现象：能力没有显著提升，但产出显著提升

以我入职第一天与现在做对比：

- 在纯前端技术深度上，并没有显著提升：
  - 某技术栈有哪些完整 API，我并不系统掌握；
  - React hooks 出错时，除常见问题外，很多场景仍然不会定位；
  - 对框架底层机制理解仍然有限。

    从“什么都不会”，到“勉强算入门”。
    基础并未发生质变。
    但与此同时：

    > 我却可以借助 AI，在数小时内完成过去需要数天才能勉强实现的需求。

    这说明一个关键问题：

    > 产出能力 ≠ 纯技术积累
    > 产出能力 = 技术理解 × 工具使用能力

    核心变量发生变化的，是对 AI 的理解与使用方式。

---

## 二、一个具体例子：Playwright

> 在与老板沟通中提到使用 Playwright（端到端测试工具）。

我当时产生一个思考：

如果我要让 AI 快速帮我生产测试代码，我至少要知道两件事：

1. 它“能写什么”？（语法层面）
   - React 函数组件怎么写？
   - props 如何传递？
   - Playwright 测试文件结构是什么？
   - async/await 如何组织？

   > 这是语法层问题。

2. 它“能做什么”？（能力边界）
   例如在端到端测试中，我需要知道：
   - 是否可以跳转页面？
   - 是否可以获取页面元素？
   - 是否可以模拟点击？
   - 是否可以等待网络请求？
   - 是否可以校验文本？

   > 这是能力边界问题。

   如果你不知道工具能做什么，就无法判断：

   > 这个需求是否可以被自动化？

   AI 不是替你“思考”，而是替你“实现”。

---

## 三、为什么“不会”却依然可以产出？

关键原因：

> 我知道 AI 能做什么。

而不是：

> 我知道每个 API 的完整细节。

这两者差异极大。

---

## 四、AI 使用的三个核心认知

### 1. 必须理解 AI 的基本原理

#### （1）它来自大规模数据训练

AI 并不是“理解”代码，而是：

- 在海量数据中学习模式
- 在当前上下文下预测最可能的输出

#### （2）输出是概率选择

它的生成机制是：

- 每个 token（字 / 单词）都是概率选择
- 并不是“想好整句话再输出”
- 而是一步一步预测

因此：

- 如果上下文模糊 → 输出必然模糊
- 如果描述不精确 → 结果不可控

---

### 2. 理解原理之后，必须学会“如何提问”

对人而言：

> 一句话可能表达一个明确意思。

对 AI 而言：

> 每个词都可能存在歧义。

例如：

“帮我优化一下这个组件”

优化什么？

- 性能？
- 可读性？
- 重构？
- 拆分？
- 增加抽象层？

如果你不给上下文，AI 只能猜。

因此高质量提问需要：

- 明确目标
- 明确现状
- 明确约束条件
- 明确技术栈
- 明确输出格式

本质是：

> 你要替 AI 定义问题空间。

---

### 3. 熟悉 AI 的真正意义：用它达成目标

在计算机世界：

> 万物皆为 0 和 1。

在软件开发领域：

> 万物皆为代码。

对 AI 而言：

- 写组件
- 写测试
- 写文档
- 写接口
- 写 SQL
- 写脚本

  本质没有区别。

  区别只在于：

  > 你是否清楚你要什么。

---

## 五、用 AI 写代码，需要达到什么程度？

以我个人实践为例，最低要求是三点：

### 1. 你必须理解要写的是什么

- 是组件？
- 是工具函数？
- 是测试？
- 是中间层逻辑？
  如果连目标都模糊，AI 只能输出模板。

---

### 2. 你必须知道可以用什么实现

例如：

- 端到端测试 → Playwright
- 单元测试 → Vitest / Jest
- 状态管理 → Zustand / Redux
- 表格 → TanStack Table
  不知道工具能力边界，就无法构造问题。

---

### 3. 你必须判断该需求是否可实现

例如：

- 是否存在浏览器 API 限制？
- 是否受跨域限制？
- 是否受权限限制？
- 是否是产品逻辑问题而非技术问题？
  AI 不负责判断业务合理性。

---

## 六、总结：AI 并没有让人“变强”，而是放大了认知结构

我当前的能力变化，不是：

> 技术深度大幅提升。

而是：

- 更清楚工具能力边界
- 更清楚如何表达问题
- 更清楚如何拆解需求

  因此可以在短时间内完成过去需要大量试错的工作。

---

## 一句话结论

> AI 的价值，不在于“替你写代码”，
> 而在于“当你知道目标与路径时，它可以替你高速实现”。

如果目标不清晰，AI 只会放大混乱。

如果结构清晰，AI 会放大效率。
`,n=Object.assign({"../../blog/ai/what-writing.md":t}),r=e=>Array.isArray(e)?e.map(e=>String(e)).filter(Boolean):typeof e==`string`?e.split(`,`).map(e=>e.trim()).filter(Boolean):[],i=(e,t)=>typeof t==`string`&&t.trim()?t.trim():e.replace(/\\/g,`/`).replace(/^\/?blog\//,``).replace(/\.md$/i,``).replace(/\//g,`-`),a=t=>{let n=t.replace(/^\uFEFF/,``),r=n.match(/^\s*---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]+/);return r?{data:e(r[1])||{},content:n.slice(r[0].length)}:{data:{},content:n}},o=(e,t)=>{let{data:n,content:o}=a(t);return{meta:{title:typeof n.title==`string`?n.title:`未命名文档`,slug:i(e,n.slug),summary:typeof n.summary==`string`?n.summary:void 0,created:typeof n.created==`string`?n.created:void 0,updated:typeof n.updated==`string`?n.updated:void 0,categories:r(n.categories),tags:r(n.tags),draft:typeof n.draft==`boolean`?n.draft:void 0},content:o,sourcePath:e}},s=Object.entries(n).map(([e,t])=>o(e,t)),c=e=>{let t=e.meta.updated||e.meta.created||`1970-01-01`;return Date.parse(t)||0},l=()=>s.filter(e=>!e.meta.draft).sort((e,t)=>c(t)-c(e)),u=e=>s.find(t=>t.meta.slug===e&&!t.meta.draft);export{u as n,l as t};