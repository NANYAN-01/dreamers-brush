---

# AGENTS.md - Dreamer's Brush

## 项目简介
童梦画笔（Dreamer's Brush）是一个基于 AI 图像生成的儿童绘本创作工具，使用阿里云 DashScope API 实现智能图片生成。

## 技术栈
- **前端**: React 18 + TypeScript + Webpack 5 + TailwindCSS 3
- **后端**: Express 5 (纯 JavaScript，非 TypeScript)
- **数据库**: MySQL 8.0+
- **AI 服务**: 阿里云 DashScope (通义千问/万相)

## 目录结构
```
dreamers-brush/
├── server/              # Express 后端 (纯 JS)
│   ├── index.js        # 服务器入口
│   └── uploads/        # 上传文件存储目录
├── src/                 # React 前端源码 (TS)
│   ├── services/       # API 客户端
│   └── App.tsx         # 主应用组件
├── migrations/          # 数据库迁移脚本
├── scripts/            # 工具脚本
├── .env                # 后端环境变量
├── .env.local          # 前端环境变量
└── package.json
```

## 开发命令

### 环境要求
- Node.js >= 18.0.0
- MySQL >= 8.0

### 常用命令
```bash
# 安装依赖
npm install

# 启动后端 (端口 3001)
npm run server

# 启动前端开发服务器 (端口 3266)
npm run dev

# 构建生产版本
npm run build

# TypeScript 类型检查 (仅 src/)
npm run typecheck

# 初始化数据库
npm run db:init

# 清理构建文件
npm run clean
```

## 关键配置

### 环境变量
- `.env` - 后端环境变量 (DB, DashScope API Key, PORT)
- `.env.local` - 前端环境变量 (VITE_API_URL)

**注意**: 后端读取 `.env`，前端读取 `.env.local`。不要混淆。

### API 基地址
前端 API 基地址来自 `import.meta.env.VITE_API_URL` ( fallback 到 `http://localhost:3001` )，不是 `process.env`。

## 架构要点

### 前后端分离
- 前端: `http://localhost:3266`
- 后端: `http://localhost:3001`
- SPA 路由通过 Webpack Dev Server 的 `historyApiFallback` 处理

### 后端 (server/index.js)
- Express 5 纯 JavaScript，非 TypeScript
- MySQL 连接池使用 `mysql2/promise`
- 上传文件存储在 `server/uploads/`
- API 自动重试: 速率限制时最多重试 3 次，每次间隔 5 秒

### AI 生成
- 默认模型: `qwen-image-2.0-pro-2026-03-03`
- 备选模型: `wan2.7-image`
- 速率限制: 约每分钟 2 次请求
- 生成的图片 URL 有效期约 **24 小时**

### 数据库
- 使用 `migrations/init-mysql.sql` 初始化
- 字符集: `utf8mb4`
- 表: `images`, `users`, `generation_history`

## 开发注意事项
- `tsconfig.json` 仅包含 `src/` 目录，后端 `server/` 不在 TypeScript 编译范围内
- 构建输出目录为 `dist/`
- `.gitignore` 已排除 `.env`、`.env.local`、`dist/`、`uploads/` 等

---
