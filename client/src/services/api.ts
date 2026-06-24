// API 客户端配置
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

export interface GenerateImageResponse {
  output?: {
    choices?: Array<{
      message?: {
        content?: Array<{
          image?: string;
        }>;
      };
    }>;
  };
}

export interface UploadImageResponse {
  id: number;
  filename: string;
  public_url: string;
}

export interface ImageRecord {
  id: string;
  filename: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  public_url: string;
  width?: number;
  height?: number;
  created_at: string;
}

export const api = {
  // 生成图片（model 不传则使用后端 .env 配置）
  async generateImage(prompt: string, model?: string, size = '1024*1536'): Promise<GenerateImageResponse> {
    const body: Record<string, string> = { prompt, size };
    if (model) {
      body.model = model;
    }

    const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  },

  // 上传图片
  async uploadImage(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  },

  // 获取图片列表
  async getImages(): Promise<ImageRecord[]> {
    const response = await fetch(`${API_BASE_URL}/api/images`);

    if (!response.ok) {
      throw new Error('获取图片列表失败');
    }

    return response.json();
  },

  // 健康检查
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.json();
  }
};
