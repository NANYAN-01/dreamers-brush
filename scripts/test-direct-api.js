// 直接测试阿里云 API
const API_KEY = 'sk-cba653406c7b4ac6bce3853554d61403';

async function testDirectAPI() {
  console.log('🧪 直接测试阿里云 API...\n');

  const apiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';
  
  const body = {
    model: 'qwen-image-2.0-pro-2026-03-03',
    input: {
      messages: [
        {
          role: 'user',
          content: [
            {
              text: '一只可爱的小猫在花园里玩耍'
            }
          ]
        }
      ]
    },
    parameters: {
      size: '1024*1024'
    }
  };

  console.log('请求 URL:', apiUrl);
  console.log('请求体:', JSON.stringify(body, null, 2));
  console.log('\n发送请求...\n');

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(body)
    });

    console.log('状态码:', response.status);
    console.log('响应头:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('\n响应数据:', JSON.stringify(data, null, 2));

    if (response.ok) {
      const imageUrl = data?.output?.choices?.[0]?.message?.content?.[0]?.image;
      if (imageUrl) {
        console.log('\n✅ 图片 URL:', imageUrl);
      }
    } else {
      console.log('\n❌ 请求失败');
    }

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

testDirectAPI();
