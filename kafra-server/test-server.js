#!/usr/bin/env node

/**
 * Test script for Kafra Assistant Server
 * Usage: node test-server.js
 */

const testMessages = [
  "สวัสดีค่ะ Kafra!",
  "Kafra Corporation คืออะไร?",
  "ช่วยแนะนำการเก็บของในเกมหน่อยค่ะ",
  "อยากวาร์ปไป Prontera ค่ะ",
  "อาชีพไหนดีสำหรับมือใหม่?",
  "ขอบคุณค่ะ"
];

async function testServer() {
  const baseUrl = 'http://localhost:5174';
  
  console.log('🧪 Testing Kafra Assistant Server...\n');
  
  // Test health check
  try {
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
    return;
  }
  
  console.log('\n📝 Testing Chat Messages...\n');
  
  for (let i = 0; i < testMessages.length; i++) {
    const message = testMessages[i];
    console.log(`\n--- Test ${i + 1} ---`);
    console.log(`👤 User: ${message}`);
    
    try {
      const response = await fetch(`${baseUrl}/api/kafra-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: message
            }
          ]
        })
      });
      
      if (!response.ok) {
        console.log(`❌ Server Error: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`🤖 Kafra: ${data.reply}`);
      
      if (data.timestamp) {
        console.log(`⏰ Timestamp: ${data.timestamp}`);
      }
      
      if (data.model) {
        console.log(`🧠 Model: ${data.model}`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎉 Test completed!');
}

// Run the test
testServer().catch(console.error);
