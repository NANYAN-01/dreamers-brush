# Dreamer's Brush 项目设置指南

##  项目概述

童梦画笔是一个 AI 图片生成应用，使用本地 MySQL 数据库和 Node.js 后端。

## 📋 环境要求

- Node.js >= 16.x
- MySQL >= 5.7 或 >= 8.0
- npm 或 pnpm

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 初始化数据库

运行交互式数据库初始化脚本：

```bash
npm run db:init
```

按照提示输入 MySQL 连接信息：
- 主机地址：localhost
- 端口：3306
- 用户名：root
- 密码：Ebara8540（你的密码）

### 3. 配置环境变量

**后端配置** (`.env`):
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Ebara8540
DB_NAME=dreamers_brush
PORT=3001
```

**前端配置** (`.env.local`):
```env
VITE_API_URL=http://localhost:3001
```

### 4. 启动服务

**启动后端服务器：**
```bash
npm run server
```

后端服务将运行在：http://localhost:3001

**启动前端开发服务器：**
```bash
npm run dev
```

前端应用将运行在：http://localhost:3266

## 📁 项目结构

```
Dreamer's Brush/
├── server/              # 后端服务器
│   └── index.js        # Express 服务器入口
├── src/                 # 前端源代码
│   ├── components/     # React 组件
│   ├── services/       # API 服务
│   │   ├── api.ts      # API 客户端
│   │   └── imageGen.ts # 图片生成服务
│   ├── hooks/          # React Hooks
│   ├── styles/         # 样式文件
│   ├── App.tsx         # 主应用组件
│   └── index.tsx       # 入口文件
├── scripts/             # 工具脚本
│   └── init-db-interactive.js  # 数据库初始化
├── migrations/          # 数据库迁移文件
├── uploads/             # 上传文件存储
├── .env                 # 后端环境变量
├── .env.local           # 前端环境变量
└── package.json         # 项目配置
```

## 🗄️ 数据库结构

### images 表
存储生成的图片元数据：
- id: UUID 主键
- filename: 文件名
- original_name: 原始文件名
- file_size: 文件大小
- mime_type: MIME 类型
- storage_path: 存储路径
- public_url: 公开访问 URL
- width/height: 图片尺寸
- created_at: 创建时间

### users 表
用户信息（可选）：
- id: UUID 主键
- email: 邮箱（唯一）
- name: 用户名
- avatar_url: 头像 URL

### generation_history 表
图片生成历史记录：
- id: UUID 主键
- user_id: 用户 ID（外键）
- character_desc: 角色描述
- action_desc: 动作描述
- prompt: 完整提示词
- image_id: 图片 ID（外键）
- model: AI 模型
- size: 图片尺寸
- created_at: 创建时间

## 🔌 API 接口

### POST /api/generate-image
生成 AI 图片

请求体：
```json
{
  "prompt": "一只小熊在云朵上钓星星",
  "model": "qwen-image-2.0",
  "size": "1024*1536"
}
```

### POST /api/upload
上传图片

请求：multipart/form-data
- image: 图片文件

### GET /api/images
获取图片列表

### GET /api/health
健康检查

## 🎨 AI 图片生成集成

当前使用的是模拟数据，需要集成真实的 AI 图片生成 API：

1. **通义千问** (Qwen)
2. **万相 2.7** (Wanxiang)
3. **Stable Diffusion**

在 `server/index.js` 的 `/api/generate-image` 路由中替换模拟响应为真实的 API 调用。

## 🛠️ 开发命令

```bash
# 前端
npm run dev           # 启动前端开发服务器
npm run build         # 构建前端生产版本
npm run typecheck     # TypeScript 类型检查

# 后端
npm run server        # 启动后端服务器
npm run server:dev    # 启动后端（带热重载）

# 数据库
npm run db:init       # 初始化数据库
```

## ⚠️ 重要说明

1. **已弃用 Supabase**：项目已完全迁移到本地 MySQL 数据库
2. **AI 集成待完成**：需要配置真实的 AI 图片生成 API
3. **文件存储**：上传的图片保存在 `server/uploads` 目录
4. **端口配置**：
   - 前端：3266 (webpack dev server)
   - 后端：3001 (Express server)

## 🔧 故障排除

### MySQL 连接失败
1. 检查 MySQL 服务是否启动
2. 验证用户名和密码
3. 确认端口号正确

### 前端无法连接后端
1. 确保后端服务器已启动
2. 检查 `.env.local` 中的 `VITE_API_URL`
3. 检查 CORS 配置

### 图片生成失败
1. 查看后端控制台日志
2. 检查 AI API 配置
3. 验证网络连接

## 📝 下一步

1. ✅ 项目结构迁移完成
2. ✅ 数据库初始化脚本完成
3. ✅ 后端 API 服务器完成
4. ⏳ 集成真实 AI 图片生成 API
5. ⏳ 实现用户认证系统
6. ⏳ 添加图片管理功能
7. ⏳ 优化 UI/UX 设计
