// 测试后端 API
const axios = require('axios');

async function testBackendAPI() {
  console.log('🧪 测试后端 API...\n');

  try {
    const response = await axios.post('http://localhost:3001/api/generate-image', {
      prompt: '一只可爱的小猫在花园里玩耍',
      model: 'qwen-image-2.0-pro-2026-03-03',
      size: '1024*1024'
    });

    console.log('✅ API 调用成功！');
    console.log('\n📊 响应数据:');
    console.log(JSON.stringify(response.data, null, 2));

    // 提取图片 URL
    const imageUrl = response.data?.output?.choices?.[0]?.message?.content?.[0]?.image;
    if (imageUrl) {
      console.log('\n🖼️  生成的图片 URL:');
      console.log(imageUrl);
    }

  } catch (error) {
    console.error('❌ 测试失败:');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('错误信息:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

testBackendAPI();
