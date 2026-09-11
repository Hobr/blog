# Hobr's Blog

> Hobr的终端风个人门户

## 目录结构

```text
.
├── posts/                 # Markdown 博文及其图片资源
│   └── <slug>/
│       ├── index.md
│       └── image.png
├── public/                # 其他静态资源
├── src/
│   ├── components/        # 终端窗口、文章列表、标签、分页等组件
│   ├── data/
│   │   ├── themes.ts       # 硬编码主题配置
│   │   ├── profile.ts      # 首页个人信息
│   │   └── sites.ts        # 首页站点命令列表
│   ├── layouts/
│   │   └── Layout.astro    # 全站布局
│   ├── lib/
│   │   ├── post-data.ts    # 文章日期/标签/前后篇等纯逻辑
│   │   └── posts.ts        # Astro content collection 查询层
│   ├── pages/
│   │   ├── index.astro     # 首页
│   │   ├── archive.astro   # 归档页
│   │   ├── blog/           # 博客列表和文章页
│   │   └── tags/           # 标签页
│   ├── styles/
│   │   └── global.css      # 全站终端风设计系统
│   └── content.config.ts   # 内容集合配置
└── tests/
    ├── i18n.test.ts        # 多语言路由和文案测试
    └── post-data.test.ts   # 文章数据处理测试
```

## 本地开发

```bash
# 安装依赖:
pnpm install

# 启动开发服务器:
pnpm dev

# 运行测试
pnpm test

# 检查 TypeScript 类型
pnpm typecheck

# 检查格式和 lint
pnpm lint

# 自动格式化
pnpm format

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 内容维护

### 1. 修改首页信息

编辑:

- `src/data/profile.ts`
- `src/data/sites.ts`

其中:

- `profile.ts` 控制首页简介
- `sites.ts` 控制首页站点命令列表
- `profile.ts` 中的邮箱会在构建时生成 Gravatar 头像地址

这个项目当前不再依赖 Svelte 组件, 首页站点列表也使用 Astro 组件渲染。

### 2. 新增 Markdown 博文

在 `posts/<slug>/index.md` 下新建一个 Markdown 文件, 例如:

```md
---
title: "My New Post"
slug: "my-new-post"
date: "2026-04-07"
tags:
    - markdown
    - astro
---

# My New Post

这里开始写正文
```

当前文章的必填 frontmatter 字段:

- `title`
- `slug`
- `date`
- `tags`

构建时会基于这些字段自动生成:

- `/blog`
- `/blog/<slug>`
- `/tags/<tag>`
- `/archive`
- 上一篇 / 下一篇导航

### 3. Markdown 图片资源约定

Markdown 博文的图片和文章放在同一个目录下, 例如:

```text
posts/hello-terminal/index.md
posts/hello-terminal/cover.png
posts/hello-terminal/diagram.png
```

在 Markdown 中使用相对路径引用:

```md
![封面](./cover.png)
```

约定:

- 一个 slug 对应一个文章目录, 方便迁移和清理
- 图片文件名保持英文小写加连字符
- 文章图片不要散落在根级 `public/`

### 4. 调整主题

深色和浅色主题直接写在 `src/data/themes.ts` 中。新增或修改主题时编辑该文件内的主题数组即可。

## 路由说明

- `/`: 个人门户首页
- `/blog`: 博客列表页
- `/blog/<slug>`: 文章详情页
- `/tags/<tag>`: 标签聚合页
- `/archive`: 按月份归档

## 构建与部署

构建静态文件:

```bash
pnpm build
```

构建完成后, 产物位于:

```text
dist/
```
