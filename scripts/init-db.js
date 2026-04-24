const mysql = require('mysql2/promise');

async function initDatabase() {
  console.log('🔧 正在连接 MySQL 数据库...');
  
  try {
    // 先连接到 MySQL（不指定数据库）
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'ebara8540',
      port: 3306
    });

    console.log('✅ MySQL 连接成功');

    // 创建数据库
    console.log('📦 正在创建数据库 dreamers_brush...');
    await connection.query('CREATE DATABASE IF NOT EXISTS dreamers_brush CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    console.log('✅ 数据库创建成功');

    // 切换到新数据库
    await connection.query('USE dreamers_brush;');

    // 创建 images 表
    console.log('🖼️  正在创建 images 表...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS images (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_size INT NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        storage_path VARCHAR(500) NOT NULL,
        public_url VARCHAR(500) NOT NULL,
        width INT,
        height INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_created_at (created_at),
        INDEX idx_filename (filename)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ images 表创建成功');

    // 创建 users 表
    console.log('👤 正在创建 users 表...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        avatar_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ users 表创建成功');

    // 创建 generation_history 表
    console.log('📝 正在创建 generation_history 表...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS generation_history (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36),
        character_desc TEXT NOT NULL,
        action_desc TEXT NOT NULL,
        prompt TEXT NOT NULL,
        image_id VARCHAR(36),
        model VARCHAR(50) DEFAULT 'qwen-image-2.0',
        size VARCHAR(20) DEFAULT '1024*1536',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ generation_history 表创建成功');

    // 插入示例数据（可选）
    console.log('\n🎉 数据库初始化完成！');
    console.log('\n📊 数据库信息：');
    console.log('   - 数据库名: dreamers_brush');
    console.log('   - 表数量: 3 (images, users, generation_history)');
    console.log('   - 字符集: utf8mb4');

    await connection.end();
    console.log('\n✅ 数据库连接已关闭');

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    process.exit(1);
  }
}

initDatabase();
