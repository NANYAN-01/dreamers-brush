# 🎨 童梦画笔 (Dreamer's Brush)

一个基于 AI 图像生成的儿童绘本创作工具，使用阿里云 DashScope API 实现智能图片生成。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## ✨ 功能特性

- 🤖 **AI 图像生成** - 集成阿里云通义千问/万相，支持高质量图像生成
- 🎭 **多模型支持** - 支持 qwen-image-2.0-pro 和 wan2.7-image 两种模型
- 📏 **灵活尺寸** - 支持多种图片尺寸（正方形、竖版、横版）
- 💾 **本地数据库** - 使用 MySQL 存储生成历史和图片元数据
- 🌐 **RESTful API** - 完整的前后端分离架构
- 🎨 **精美界面** - 基于 React + TailwindCSS 的现代化 UI
- ⚡ **自动重试** - 智能处理 API 速率限制，自动重试机制

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- MySQL >= 8.0
- npm 或 pnpm

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd dreamers-brush
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**

复制 `.env` 文件并修改配置：
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
# MySQL 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=dreamers_brush

# 阿里云 DashScope API 配置
DASHSCOPE_API_KEY=your_api_key_here
DASHSCOPE_DEFAULT_MODEL=qwen-image-2.0-pro-2026-03-03

# 服务器端口
PORT=3001
```

4. **初始化数据库**
```bash
npm run db:init
```

5. **启动服务**

方式一：使用快速启动脚本（推荐）
```bash
# Windows
start.bat

# macOS/Linux
chmod +x start.sh
./start.sh
```

方式二：手动启动
```bash
# 启动后端服务器
npm run server

# 启动前端开发服务器（新终端）
npm run dev
```

6. **访问应用**
- 前端应用：http://localhost:3266
- 后端 API：http://localhost:3001
- API 健康检查：http://localhost:3001/api/health

## 📖 使用说明

### 生成图片

1. 在输入框中输入图片描述（prompt）
   - 示例："一只穿着蓝色小背心的小熊在云朵上钓星星，柔和发光的水彩风格"
   
2. 选择模型（可选）
   - `qwen-image-2.0-pro-2026-03-03` - 通义千问图像 2.0 Pro（默认）
   - `wan2.7-image` - 万相 2.7

3. 选择图片尺寸（可选）
   - `1024*1024` - 正方形
   - `1024*1536` - 竖版（默认）
   - `1536*1024` - 横版

4. 点击"生成"按钮，等待 10-30 秒

5. 生成的图片将显示在界面上，可以右键保存

### API 调用示例

```bash
curl -X POST http://localhost:3001/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "一只可爱的小猫在花园里玩耍",
    "model": "qwen-image-2.0-pro-2026-03-03",
    "size": "1024*1024"
  }'
```

## 🏗️ 技术栈

### 前端
- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Webpack 5** - 模块打包
- **TailwindCSS 3** - 样式框架
- **Framer Motion** - 动画库
- **Lucide React** - 图标库

### 后端
- **Node.js** - 运行时环境
- **Express 5** - Web 框架
- **MySQL 2** - 数据库驱动
- **Multer** - 文件上传
- **CORS** - 跨域支持
- **dotenv** - 环境变量

### 数据库
- **MySQL 8.0+** - 关系型数据库
- InnoDB 引擎
- UTF-8MB4 字符集

### AI 服务
- **阿里云 DashScope** - 图像生成 API
  - 通义千问图像 2.0 Pro
  - 万相 2.7

## 📁 项目结构

```
dreamers-brush/
├── server/                 # 后端服务器
│   └── index.js           # Express 服务器入口
├── src/                   # 前端源代码
│   ├── components/        # React 组件
│   ├── services/          # API 服务
│   │   ├── api.ts         # API 客户端
│   │   └── imageGen.ts    # 图像生成服务
│   ├── styles/            # 样式文件
│   ├── App.tsx            # 主应用组件
│   └── index.tsx          # 应用入口
├── migrations/            # 数据库迁移
│   └── init-mysql.sql     # MySQL 初始化脚本
├── scripts/               # 脚本文件
│   ├── init-db.js         # 数据库初始化脚本
│   ├── init-db-interactive.js  # 交互式初始化
│   └── test-*.js          # 测试脚本
├── uploads/               # 上传文件目录
├── .env                   # 环境变量配置
├── .env.local             # 前端环境变量
├── package.json           # 项目依赖
├── webpack.config.js      # Webpack 配置
├── tsconfig.json          # TypeScript 配置
├── tailwind.config.js     # TailwindCSS 配置
├── start.bat              # Windows 启动脚本
└── README.md              # 项目文档
```

## 🗄️ 数据库设计

### images 表
存储图片元数据

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PRIMARY KEY | 图片 ID |
| filename | VARCHAR(255) | 文件名 |
| file_size | BIGINT | 文件大小（字节） |
| mime_type | VARCHAR(100) | MIME 类型 |
| storage_path | VARCHAR(500) | 存储路径 |
| public_url | VARCHAR(500) | 公开访问 URL |
| width | INT | 宽度（像素） |
| height | INT | 高度（像素） |
| created_at | TIMESTAMP | 创建时间 |

### users 表
用户信息

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PRIMARY KEY | 用户 ID |
| email | VARCHAR(255) | 邮箱 |
| name | VARCHAR(100) | 姓名 |
| avatar_url | VARCHAR(500) | 头像 URL |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### generation_history 表
生成历史记录

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PRIMARY KEY | 记录 ID |
| user_id | INT | 用户 ID（外键） |
| character_desc | TEXT | 角色描述 |
| action_desc | TEXT | 动作描述 |
| prompt | TEXT | 提示词 |
| image_id | INT | 图片 ID（外键） |
| model | VARCHAR(100) | 使用的模型 |
| size | VARCHAR(20) | 图片尺寸 |
| created_at | TIMESTAMP | 创建时间 |

## 🔌 API 接口

### 图片生成
```
POST /api/generate-image
```

**请求体：**
```json
{
  "prompt": "图片描述",
  "model": "qwen-image-2.0-pro-2026-03-03",
  "size": "1024*1536"
}
```

**响应：**
```json
{
  "output": {
    "choices": [{
      "message": {
        "content": [{
          "image": "https://..."
        }]
      }
    }]
  },
  "usage": {
    "width": 1024,
    "height": 1536,
    "image_count": 1
  }
}
```

### 图片上传
```
POST /api/upload
Content-Type: multipart/form-data
```

### 获取图片列表
```
GET /api/images
```

### 健康检查
```
GET /api/health
```

## 🛠️ 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev          # 前端
npm run server       # 后端

# 构建生产版本
npm run build

# 类型检查
npm run typecheck

# 数据库初始化
npm run db:init

# 清理构建文件
npm run clean
```

## ⚠️ 注意事项

### 速率限制
- API 有请求频率限制（每分钟 2 次）
- 系统会自动重试（最多 3 次，每次间隔 5 秒）
- 生产环境建议添加请求队列

### 图片有效期
- 生成的图片 URL 有效期约 **24 小时**
- 建议及时下载保存重要图片
- 可以实现本地存储功能

### API Key 安全
- ✅ `.env` 文件已添加到 `.gitignore`
- ⚠️ 不要将 API Key 硬编码到代码中
- ⚠️ 不要将 `.env` 文件提交到版本控制系统

### 成本控制
- 每次生成会消耗 API 配额
- 建议在开发时使用测试账号
- 监控 API 使用量

## 🐛 故障排除

### 问题 1: 429 Too Many Requests
**原因**: 超过速率限制  
**解决**: 等待 60 秒后重试，系统会自动处理

### 问题 2: 400 InvalidParameter
**原因**: 参数格式错误  
**解决**: 
- 检查模型名称是否正确
- 检查尺寸格式（宽*高）
- 确保 prompt 不为空

### 问题 3: 401 Unauthorized
**原因**: API Key 无效  
**解决**: 
- 检查 `.env` 文件中的 `DASHSCOPE_API_KEY`
- 确认 API Key 未过期
- 重启后端服务器

### 问题 4: MySQL 连接失败
**原因**: 数据库配置错误  
**解决**: 
- 检查 `.env` 中的数据库配置
- 确认 MySQL 服务正在运行
- 验证用户名和密码

### 问题 5: 端口被占用
**原因**: 端口 3001 或 3266 已被占用  
**解决**: 
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3001
kill -9 <PID>
```

## 📝 更新日志

### v1.0.0 (2026-04-24)
- ✨ 初始版本发布
- 🤖 集成阿里云 DashScope API
- 💾 MySQL 数据库支持
- 🎨 React + TypeScript 前端
- 🚀 Express 后端服务器
- 📱 响应式设计

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 作者

- Your Name - Initial work

## 🙏 致谢

- [阿里云 DashScope](https://dashscope.aliyun.com/) - AI 图像生成 API
- [React](https://reactjs.org/) - UI 框架
- [Express](https://expressjs.com/) - Web 框架
- [TailwindCSS](https://tailwindcss.com/) - CSS 框架

## 📞 联系方式

如有问题或建议，请提交 Issue 或联系作者。

---

⭐ 如果这个项目对您有帮助，请给个 Star！
