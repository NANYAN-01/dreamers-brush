# ✅ AI 图像生成 API 集成成功！

## 🎉 问题解决

之前遇到的 `400 InvalidParameter - url error` 错误已经修复！

### 问题原因
在请求头中添加了 `X-DashScope-Async: enable`，导致阿里云 API 返回 URL 错误。

### 解决方案
移除异步头，使用同步模式调用 API。

---

## 📊 当前状态

### ✅ 已完成

1. **阿里云 DashScope API 集成**
   - ✅ 支持 `qwen-image-2.0-pro-2026-03-03` (通义千问)
   - ✅ 支持 `wan2.7-image` (万相 2.7)
   - ✅ API Key 已配置并验证有效

2. **后端服务器**
   - ✅ Express 服务器运行在 http://localhost:3001
   - ✅ POST `/api/generate-image` 端点正常工作
   - ✅ 自动重试机制（速率限制时最多重试 3 次）
   - ✅ 完整的错误处理和日志记录
   - ✅ 生成历史自动保存到 MySQL

3. **前端应用**
   - ✅ React 应用运行在 http://localhost:3266
   - ✅ API 客户端已配置
   - ✅ 可以正常调用后端 API

4. **数据库**
   - ✅ MySQL dreamers_brush 数据库已创建
   - ✅ 3 个表：images, users, generation_history
   - ✅ 连接池配置完成

---

## 🚀 如何使用

### 方法 1：通过前端界面

1. 打开浏览器访问：http://localhost:3266
2. 输入提示词（例如："一只可爱的小猫在花园里玩耍"）
3. 选择模型和尺寸
4. 点击生成按钮
5. 等待 10-30 秒，图片将显示在界面上

### 方法 2：通过 API 调用

```bash
curl -X POST http://localhost:3001/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "一只可爱的小猫在花园里玩耍",
    "model": "qwen-image-2.0-pro-2026-03-03",
    "size": "1024*1024"
  }'
```

### 方法 3：使用测试脚本

```bash
node scripts/test-backend.js
```

---

## 📝 支持的模型

### 1. qwen-image-2.0-pro-2026-03-03 (默认)
- 通义千问图像 2.0 Pro
- 高质量图像生成
- 适合写实风格、细节丰富的场景

### 2. wan2.7-image
- 万相 2.7
- 艺术风格更强
- 适合创意插画、艺术创作

---

## 📏 支持的图片尺寸

- `1024*1024` - 正方形（推荐）
- `1024*1536` - 竖版（默认）
- `1536*1024` - 横版
- `768*1024` - 小竖版
- 其他符合 API 要求的自定义尺寸

---

## 🔧 技术架构

```
前端 (React) 
  ↓ HTTP Request
后端 (Express + Node.js)
  ↓ Fetch API
阿里云 DashScope API
  ↓ Image Generation
返回图片 URL (OSS)
  ↓
保存到 MySQL 数据库
  ↓
返回给前端
```

---

## ⚠️ 注意事项

### 1. 速率限制
- API 有请求频率限制（每分钟 2 次）
- 系统会自动重试（最多 3 次，每次间隔 5 秒）
- 生产环境建议添加请求队列

### 2. 图片有效期
- 生成的图片 URL 有效期约 **24 小时**
- 建议及时下载保存重要图片
- 可以使用以下代码下载：

```javascript
const response = await fetch(imageUrl);
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'generated-image.png';
a.click();
```

### 3. API Key 安全
- ✅ `.env` 文件已添加到 `.gitignore`
- ✅ 不会泄露到版本控制系统
- ⚠️ 不要将 API Key 硬编码到代码中

### 4. 成本控制
- 每次生成会消耗 API 配额
- 建议在开发时使用测试账号
- 监控 API 使用量

---

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

### 问题 4: 500 Internal Server Error
**原因**: 服务器内部错误  
**解决**: 
- 查看后端控制台日志
- 检查网络连接
- 确认阿里云服务状态

---

## 📈 性能优化建议

### 1. 图片缓存
相同 prompt 的结果可以缓存，避免重复调用：

```javascript
const cache = new Map();

async function generateWithCache(prompt, model, size) {
  const key = `${prompt}_${model}_${size}`;
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const result = await api.generateImage(prompt, model, size);
  cache.set(key, result);
  return result;
}
```

### 2. 异步任务队列
对于批量生成，使用队列管理：

```javascript
const queue = [];
let processing = false;

async function addToQueue(prompt, model, size) {
  return new Promise((resolve, reject) => {
    queue.push({ prompt, model, size, resolve, reject });
    processQueue();
  });
}

async function processQueue() {
  if (processing || queue.length === 0) return;
  processing = true;
  
  const task = queue.shift();
  try {
    const result = await api.generateImage(task.prompt, task.model, task.size);
    task.resolve(result);
  } catch (error) {
    task.reject(error);
  }
  
  processing = false;
  setTimeout(processQueue, 30000); // 等待 30 秒
}
```

### 3. 图片本地存储
下载图片到本地，避免 OSS URL 过期：

```javascript
async function downloadAndSave(imageUrl, filename) {
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(`./uploads/${filename}`, Buffer.from(buffer));
  return `/uploads/${filename}`;
}
```

---

## 🎯 下一步计划

1. **图片下载功能** - 一键下载生成的图片
2. **历史记录查询** - 查看之前的生成记录
3. **批量生成** - 支持一次生成多张图片
4. **图片编辑** - 基于已有图片进行修改
5. **风格模板** - 预设多种艺术风格

---

## 📞 技术支持

如有问题，请检查：
1. 后端服务器是否正常运行
2. MySQL 数据库是否连接成功
3. API Key 是否有效
4. 网络连接是否正常

查看日志：
- 后端日志：终端输出
- 前端日志：浏览器控制台 (F12)

---

🎨 **现在可以开始使用 AI 图像生成功能了！**
