# 童梦画笔 (Dreamer's Brush)

> AI 绘本插画生成器 - 让孩子的想象力变成美丽的图画

输入一个角色和一个动作，AI 会自动生成充满童趣的水彩风格插画。

## 功能特点

- 简单的两步输入：描述角色 + 描述动作
- AI 自动生成精美的绘本风格插画
- 支持多种 AI 模型（通义千问、万相）
- 自动保存生成历史到数据库
- 响应式设计，支持移动端访问

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Webpack 5 |
| 样式 | Tailwind CSS 3 |
| 后端 | Express 5 (Node.js) |
| 数据库 | MySQL 8.0+ |
| AI 服务 | 阿里云 DashScope API |

## 快速开始

### 前置要求

- Node.js >= 16.x
- MySQL >= 8.0
- 阿里云 DashScope API Key ([申请地址](https://dashscope.console.aliyun.com/))

### 一键启动

双击运行 `start.bat`（Windows），自动启动前后端服务并打开浏览器。

### 手动启动

```bash
# 1. 安装依赖
npm install

# 2. 初始化数据库（首次使用）
npm run db:init

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 填入 MySQL 密码和 DashScope API Key

# 4. 启动后端（端口 3001）
npm run server

# 5. 启动前端（端口 3266，新开终端）
npm run dev
```

访问 http://localhost:3266 即可使用。

## 项目结构

```
Dreamer's Brush/
├── client/                 # 前端应用
│   ├── src/
│   │   ├── App.tsx         # 主组件
│   │   ├── index.tsx       # 入口文件
│   │   ├── services/       # API 服务
│   │   ├── hooks/          # React Hooks
│   │   └── styles/         # 样式文件
│   ├── index.html
│   ├── webpack.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
├── server/                 # 后端 API
│   ├── index.js            # Express 入口
│   └── uploads/            # 上传文件存储
├── database/               # 数据库
│   ├── migrations/         # 迁移脚本
│   └── scripts/            # 初始化脚本
├── docs/                   # 项目文档
├── scripts/                # 工具脚本
├── archive/                # 归档代码
├── .env                    # 环境变量（不提交）
├── .env.example            # 环境变量模板
├── start.bat               # 一键启动脚本
└── package.json
```

## 开发命令

```bash
# 前端开发
npm run dev           # 启动开发服务器（热更新）
npm run build         # 构建生产版本
npm run typecheck     # TypeScript 类型检查

# 后端开发
npm run server        # 启动服务器
npm run server:dev    # 启动服务器（nodemon 热重载）

# 数据库
npm run db:init       # 交互式初始化数据库
```

## API 接口

### 生成图片

```http
POST /api/generate-image
Content-Type: application/json

{
  "prompt": "一只小熊在云朵上钓星星",
  "model": "qwen-image-2.0-pro-2026-03-03",
  "size": "1024*1536"
}
```

### 上传图片

```http
POST /api/upload
Content-Type: multipart/form-data

image: <file>
```

### 获取图片列表

```http
GET /api/images
```

### 健康检查

```http
GET /api/health
```

## 环境变量

| 变量 | 说明 | 必填 |
|------|------|------|
| `DB_HOST` | MySQL 主机地址 | 是 |
| `DB_PORT` | MySQL 端口 | 是 |
| `DB_USER` | MySQL 用户名 | 是 |
| `DB_PASSWORD` | MySQL 密码 | 是 |
| `DB_NAME` | 数据库名称 | 是 |
| `DASHSCOPE_API_KEY` | 阿里云 API Key | 是 |
| `DASHSCOPE_DEFAULT_MODEL` | 默认 AI 模型 | 否 |
| `PORT` | 后端服务端口 | 否 |

## 支持的 AI 模型

| 模型 | 说明 |
|------|------|
| `qwen-image-2.0-pro-2026-03-03` | 通义千问图像 2.0 Pro（默认，高质量） |
| `wan2.7-image` | 万相 2.7（艺术风格更强） |

## 常见问题

### 前端显示 "Failed to fetch"

后端服务器未启动。确保运行了 `npm run server`。

### 页面布局混乱

Tailwind CSS 未正确加载。清除缓存后重新运行：
```bash
rm -rf node_modules/.cache
npm run dev
```

### 数据库连接失败

1. 确认 MySQL 服务已启动
2. 检查 `.env` 中的数据库配置
3. 确认数据库已创建（运行 `npm run db:init`）

### AI 生成失败 (429)

DashScope API 速率限制。系统会自动重试，请稍后再试。

## 注意事项

- 生成的图片 URL 有时效性（约 24 小时），重要图片请及时下载保存
- API Key 请妥善保管，不要提交到版本控制系统
- `.env` 文件已添加到 `.gitignore`

## 许可证

MIT
