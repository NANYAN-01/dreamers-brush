const axios = require('axios');

async function testImageGeneration() {
  console.log('🧪 测试 AI 图片生成 API...\n');

  try {
    const response = await axios.post('http://localhost:3001/api/generate-image', {
      prompt: '一只穿着蓝色小背心的小熊在云朵上钓星星，柔和发光的水彩风格，经典儿童绘本插画',
      model: 'qwen-image-2.0-pro-2026-03-03',
      size: '1024*1536'
    });

    console.log('✅ API 调用成功！');
    console.log('\n📊 响应数据:');
    console.log(JSON.stringify(response.data, null, 2));

    // 提取图片 URL
    const imageUrl = response.data?.output?.choices?.[0]?.message?.content?.[0]?.image;
    if (imageUrl) {
      console.log('\n🖼️  生成的图片 URL:');
      console.log(imageUrl);
    } else {
      console.log('\n⚠️  响应格式可能不同，请检查完整响应');
    }

  } catch (error) {
    console.error('❌ 测试失败:');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('错误信息:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testImageGeneration();
