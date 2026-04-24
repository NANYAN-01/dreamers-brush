// 测试不同的 API 端点
const API_KEY = 'sk-cba653406c7b4ac6bce3853554d61403';

async function testEndpoint(url, body) {
  console.log(`\n🔍 测试: ${url}`);
  
  // 重试最多3次
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      console.log(`状态码: ${response.status}`);
      
      if (response.status === 429) {
        console.log('⚠️  速率限制，等待5秒后重试...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        continue;
      }
      
      console.log('响应:', JSON.stringify(data, null, 2));
      return response.ok;
    } catch (error) {
      console.log(`错误: ${error.message}`);
      return false;
    }
  }
  
  console.log('❌ 达到最大重试次数');
  return false;
}

async function main() {
  const prompt = '一只小熊在云朵上钓星星';
  
  // 测试通义千问图像生成
  await testEndpoint(
    'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
    {
      model: 'qwen-image-2.0-pro-2026-03-03',
      input: {
        messages: [
          {
            role: 'user',
            content: [{ text: prompt }]
          }
        ]
      },
      parameters: {
        size: '1024*1536'
      }
    }
  );
}

main();
