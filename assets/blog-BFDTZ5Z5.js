import{n as e}from"./createLucideIcon-WHa57mEm.js";var t=`---\r
title: "我到底在“写”什么？"\r
slug: "what-writing"\r
summary: "探讨在AI时代，我们到底在“写”什么"\r
created: "2026-03-15"\r
updated: "2026-03-16"\r
categories: ["AI"]\r
tags: ["结构化", "复用"]\r
draft: false\r
---\r
\r
# 我到底在“写”什么？\r
\r
## 一、现象：能力没有显著提升，但产出显著提升\r
\r
以我入职第一天与现在做对比：\r
\r
- 在纯前端技术深度上，并没有显著提升：\r
  - 某技术栈有哪些完整 API，我并不系统掌握；\r
  - React hooks 出错时，除常见问题外，很多场景仍然不会定位；\r
  - 对框架底层机制理解仍然有限。\r
\r
    从“什么都不会”，到“勉强算入门”。\r
    基础并未发生质变。\r
    但与此同时：\r
\r
    > 我却可以借助 AI，在数小时内完成过去需要数天才能勉强实现的需求。\r
\r
    这说明一个关键问题：\r
\r
    > 产出能力 ≠ 纯技术积累\r
    > 产出能力 = 技术理解 × 工具使用能力\r
\r
    核心变量发生变化的，是对 AI 的理解与使用方式。\r
\r
---\r
\r
## 二、一个具体例子：Playwright\r
\r
> 在与老板沟通中提到使用 Playwright（端到端测试工具）。\r
\r
我当时产生一个思考：\r
\r
如果我要让 AI 快速帮我生产测试代码，我至少要知道两件事：\r
\r
1. 它“能写什么”？（语法层面）\r
   - React 函数组件怎么写？\r
   - props 如何传递？\r
   - Playwright 测试文件结构是什么？\r
   - async/await 如何组织？\r
\r
   > 这是语法层问题。\r
\r
2. 它“能做什么”？（能力边界）\r
   例如在端到端测试中，我需要知道：\r
   - 是否可以跳转页面？\r
   - 是否可以获取页面元素？\r
   - 是否可以模拟点击？\r
   - 是否可以等待网络请求？\r
   - 是否可以校验文本？\r
\r
   > 这是能力边界问题。\r
\r
   如果你不知道工具能做什么，就无法判断：\r
\r
   > 这个需求是否可以被自动化？\r
\r
   AI 不是替你“思考”，而是替你“实现”。\r
\r
---\r
\r
## 三、为什么“不会”却依然可以产出？\r
\r
关键原因：\r
\r
> 我知道 AI 能做什么。\r
\r
而不是：\r
\r
> 我知道每个 API 的完整细节。\r
\r
这两者差异极大。\r
\r
---\r
\r
## 四、AI 使用的三个核心认知\r
\r
### 1. 必须理解 AI 的基本原理\r
\r
#### （1）它来自大规模数据训练\r
\r
AI 并不是“理解”代码，而是：\r
\r
- 在海量数据中学习模式\r
- 在当前上下文下预测最可能的输出\r
\r
#### （2）输出是概率选择\r
\r
它的生成机制是：\r
\r
- 每个 token（字 / 单词）都是概率选择\r
- 并不是“想好整句话再输出”\r
- 而是一步一步预测\r
\r
因此：\r
\r
- 如果上下文模糊 → 输出必然模糊\r
- 如果描述不精确 → 结果不可控\r
\r
---\r
\r
### 2. 理解原理之后，必须学会“如何提问”\r
\r
对人而言：\r
\r
> 一句话可能表达一个明确意思。\r
\r
对 AI 而言：\r
\r
> 每个词都可能存在歧义。\r
\r
例如：\r
\r
“帮我优化一下这个组件”\r
\r
优化什么？\r
\r
- 性能？\r
- 可读性？\r
- 重构？\r
- 拆分？\r
- 增加抽象层？\r
\r
如果你不给上下文，AI 只能猜。\r
\r
因此高质量提问需要：\r
\r
- 明确目标\r
- 明确现状\r
- 明确约束条件\r
- 明确技术栈\r
- 明确输出格式\r
\r
本质是：\r
\r
> 你要替 AI 定义问题空间。\r
\r
---\r
\r
### 3. 熟悉 AI 的真正意义：用它达成目标\r
\r
在计算机世界：\r
\r
> 万物皆为 0 和 1。\r
\r
在软件开发领域：\r
\r
> 万物皆为代码。\r
\r
对 AI 而言：\r
\r
- 写组件\r
- 写测试\r
- 写文档\r
- 写接口\r
- 写 SQL\r
- 写脚本\r
\r
  本质没有区别。\r
\r
  区别只在于：\r
\r
  > 你是否清楚你要什么。\r
\r
---\r
\r
## 五、用 AI 写代码，需要达到什么程度？\r
\r
以我个人实践为例，最低要求是三点：\r
\r
### 1. 你必须理解要写的是什么\r
\r
- 是组件？\r
- 是工具函数？\r
- 是测试？\r
- 是中间层逻辑？\r
  如果连目标都模糊，AI 只能输出模板。\r
\r
---\r
\r
### 2. 你必须知道可以用什么实现\r
\r
例如：\r
\r
- 端到端测试 → Playwright\r
- 单元测试 → Vitest / Jest\r
- 状态管理 → Zustand / Redux\r
- 表格 → TanStack Table\r
  不知道工具能力边界，就无法构造问题。\r
\r
---\r
\r
### 3. 你必须判断该需求是否可实现\r
\r
例如：\r
\r
- 是否存在浏览器 API 限制？\r
- 是否受跨域限制？\r
- 是否受权限限制？\r
- 是否是产品逻辑问题而非技术问题？\r
  AI 不负责判断业务合理性。\r
\r
---\r
\r
## 六、总结：AI 并没有让人“变强”，而是放大了认知结构\r
\r
我当前的能力变化，不是：\r
\r
> 技术深度大幅提升。\r
\r
而是：\r
\r
- 更清楚工具能力边界\r
- 更清楚如何表达问题\r
- 更清楚如何拆解需求\r
\r
  因此可以在短时间内完成过去需要大量试错的工作。\r
\r
---\r
\r
## 一句话结论\r
\r
> AI 的价值，不在于“替你写代码”，\r
> 而在于“当你知道目标与路径时，它可以替你高速实现”。\r
\r
如果目标不清晰，AI 只会放大混乱。\r
\r
如果结构清晰，AI 会放大效率。\r
`,n=Object.assign({"../../blog/ai/what-writing.md":t}),r=e=>Array.isArray(e)?e.map(e=>String(e)).filter(Boolean):typeof e==`string`?e.split(`,`).map(e=>e.trim()).filter(Boolean):[],i=(e,t)=>typeof t==`string`&&t.trim()?t.trim():e.replace(/\\/g,`/`).replace(/^\/?blog\//,``).replace(/\.md$/i,``).replace(/\//g,`-`),a=t=>{let n=t.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]+/);return n?{data:e(n[1])||{},content:t.slice(n[0].length)}:{data:{},content:t}},o=(e,t)=>{let{data:n,content:o}=a(t);return{meta:{title:typeof n.title==`string`?n.title:`未命名文档`,slug:i(e,n.slug),summary:typeof n.summary==`string`?n.summary:void 0,created:typeof n.created==`string`?n.created:void 0,updated:typeof n.updated==`string`?n.updated:void 0,categories:r(n.categories),tags:r(n.tags),draft:typeof n.draft==`boolean`?n.draft:void 0},content:o,sourcePath:e}},s=Object.entries(n).map(([e,t])=>o(e,t)),c=e=>{let t=e.meta.updated||e.meta.created||`1970-01-01`;return Date.parse(t)||0},l=()=>s.filter(e=>!e.meta.draft).sort((e,t)=>c(t)-c(e)),u=e=>s.find(t=>t.meta.slug===e&&!t.meta.draft);export{u as n,l as t};