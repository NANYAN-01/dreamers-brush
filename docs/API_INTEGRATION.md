# AI 图像生成 API 集成完成 ✅

## 已集成的服务

**阿里云 DashScope - 通义千问/万相**

### 支持的模型

1. **qwen-image-2.0-pro-2026-03-03** (通义千问图像 2.0 Pro)
   - 默认模型
   - 高质量图像生成
   - 支持中文提示词

2. **wan2.7-image** (万相 2.7)
   - 艺术风格更强
   - 适合创意插画

### API 配置

已在 `.env` 文件中配置：

```env
DASHSCOPE_API_KEY=sk-cba653406c7b4ac6bce3853554d61403
DASHSCOPE_DEFAULT_MODEL=qwen-image-2.0-pro-2026-03-03
```

### 功能特性

✅ **自动重试机制**
- 遇到速率限制（429）时自动重试最多 3 次
- 每次重试间隔 5 秒

✅ **错误处理**
- 详细的错误信息返回
- 支持多种错误场景

✅ **数据库记录**
- 所有生成历史自动保存到 MySQL
- 包含 prompt、模型、尺寸等信息

### 测试验证

已成功测试并生成图片：

```bash
node scripts/test-endpoints.js
```

生成的示例图片：
```
https://dashscope-7c2c.oss-accelerate.aliyuncs.com/7d/b8/20260424/c91e3fa4/c9a20313-9004-4fbc-a660-8b74b724a863.png
```

### 使用方法

#### 1. 启动后端服务器

```bash
npm run server
```

#### 2. 调用 API

```javascript
// 使用前端 API 客户端
import { api } from './services/api';

const result = await api.generateImage(
  '一只穿着蓝色小背心的小熊在云朵上钓星星',
  'qwen-image-2.0-pro-2026-03-03',
  '1024*1536'
);

// 获取图片 URL
const imageUrl = result.output?.choices?.[0]?.message?.content?.[0]?.image;
console.log('图片 URL:', imageUrl);
```

#### 3. 切换模型

```javascript
// 使用万相 2.7
const result = await api.generateImage(
  '梦幻森林中的精灵',
  'wan2.7-image',
  '1024*1024'
);
```

### 支持的图片尺寸

- `1024*1024` - 正方形
- `1024*1536` - 竖版（默认）
- `1536*1024` - 横版
- `768*1024` - 小竖版
- 其他自定义尺寸（需符合 API 要求）

### 注意事项

⚠️ **速率限制**
- API 有请求频率限制
- 系统会自动重试，但建议控制请求频率
- 生产环境建议添加请求队列

⚠️ **API Key 安全**
- 不要将 API Key 提交到版本控制系统
- `.env` 文件已添加到 `.gitignore`
- 生产环境使用环境变量管理

⚠️ **图片有效期**
- 生成的图片 URL 有时效性（通常 24 小时）
- 建议及时下载保存重要图片

### 故障排除

**问题 1: 429 速率限制**
- 系统会自动重试
- 如果频繁出现，降低请求频率

**问题 2: 400 InvalidParameter**
- 检查模型名称是否正确
- 检查图片尺寸格式（宽*高）
- 检查 prompt 是否为空

**问题 3: 401 Unauthorized**
- 检查 API Key 是否正确
- 检查 `.env` 文件是否加载

**问题 4: 500 Internal Server Error**
- 查看后端控制台日志
- 检查网络连接
- 确认阿里云服务状态

### 下一步优化建议

1. **图片存储优化**
   - 当前图片存储在阿里云 OSS（临时）
   - 可以下载到本地或自己的对象存储

2. **异步任务队列**
   - 对于批量生成，使用队列管理
   - 避免并发请求过多

3. **缓存机制**
   - 相同 prompt 的结果可以缓存
   - 减少重复调用

4. **监控和统计**
   - 记录 API 调用次数
   - 监控成功率和响应时间

---

🎉 **AI 图像生成功能已完全集成！现在可以开始使用了！**
