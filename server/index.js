const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 确保上传目录存在
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer 配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// MySQL 连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'dreamers_brush',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// AI 图片生成 API
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, model = process.env.DASHSCOPE_DEFAULT_MODEL || 'qwen-image-2.0-pro-2026-03-03', size = '1024*1536' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: '缺少 prompt 参数' });
    }

    console.log('🎨 收到图片生成请求:', { prompt, model, size });

    // 解析尺寸
    const [width, height] = size.split('*').map(Number);

    // 调用阿里云 DashScope API
    const apiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';
    
    const requestBody = {
      model: model,
      input: {
        messages: [
          {
            role: 'user',
            content: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      parameters: {
        size: `${width}*${height}`
      }
    };
    
    console.log('📤 发送请求到阿里云:', {
      url: apiUrl,
      body: JSON.stringify(requestBody, null, 2)
    });
    
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          // 如果是速率限制，等待后重试
          if (response.status === 429 && attempt < 3) {
            console.log(`⚠️  速率限制，等待5秒后重试 (${attempt}/3)...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            continue;
          }
          
          throw new Error(`API 请求失败: ${response.status} ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('✅ AI 生成成功');

        // 保存到数据库
        const connection = await pool.getConnection();
        try {
          await connection.query(
            'INSERT INTO generation_history (character_desc, action_desc, prompt, model, size) VALUES (?, ?, ?, ?, ?)',
            ['未知角色', '未知动作', prompt, model, size]
          );
        } finally {
          connection.release();
        }

        // 返回响应
        return res.json(data);
      } catch (error) {
        lastError = error;
        if (attempt === 3) {
          throw error;
        }
      }
    }
    
    throw lastError || new Error('图片生成失败');
  } catch (error) {
    console.error('❌ 图片生成失败:', error);
    res.status(500).json({ 
      error: error.message || '图片生成失败',
      details: null
    });
  }
});

// 上传图片 API
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' });
    }

    const { filename, originalname, size, mimetype } = req.file;
    const publicUrl = `http://localhost:${PORT}/uploads/${filename}`;

    // 保存到数据库
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO images (filename, original_name, file_size, mime_type, storage_path, public_url) VALUES (?, ?, ?, ?, ?, ?)',
        [filename, originalname, size, mimetype, `/uploads/${filename}`, publicUrl]
      );

      res.json({
        id: result.insertId,
        filename,
        public_url: publicUrl
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ 上传失败:', error);
    res.status(500).json({ error: '上传失败' });
  }
});

// 获取图片列表 API
app.get('/api/images', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM images ORDER BY created_at DESC LIMIT 50'
      );
      res.json(rows);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ 获取图片列表失败:', error);
    res.status(500).json({ error: '获取图片列表失败' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🚀 服务器已启动: http://localhost:${PORT}`);
  console.log(`📊 API 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`🎨 图片生成 API: POST http://localhost:${PORT}/api/generate-image`);
  console.log(`📤 图片上传 API: POST http://localhost:${PORT}/api/upload`);
});
