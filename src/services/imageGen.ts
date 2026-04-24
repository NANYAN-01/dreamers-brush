import { api } from './api';

const STYLE_PROMPT = '，柔和发光的水彩风格，经典儿童绘本插画，充满童趣和想象力，温暖的色调，梦幻氛围，吉卜力工作室质感，细节丰富';

export function buildPrompt(character: string, action: string): string {
  return `${character}正在${action}${STYLE_PROMPT}`;
}

export async function generateImage(
  prompt: string,
  model: 'qwen-image-2.0' | 'wan2.7-image' = 'qwen-image-2.0',
  size?: string
) {
  return api.generateImage(prompt, model, size);
}

export function extractImageUrl(response: any): string | null {
  return response?.output?.choices?.[0]?.message?.content?.[0]?.image ?? null;
}
