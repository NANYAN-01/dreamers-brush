// 本地数据库客户端配置
// 已弃用 Supabase，使用本地 MySQL 数据库

export const dbConfig = {
  host: (import.meta as any).env?.VITE_DB_HOST || 'localhost',
  port: parseInt((import.meta as any).env?.VITE_DB_PORT) || 3306,
  user: (import.meta as any).env?.VITE_DB_USER || 'root',
  password: (import.meta as any).env?.VITE_DB_PASSWORD || '',
  database: (import.meta as any).env?.VITE_DB_NAME || 'dreamers_brush'
};

// API 基础 URL
export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';
