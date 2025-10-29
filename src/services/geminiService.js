/**
 * Gemini Service
 * Handles AI responses using Google Gemini API (Free tier)
 */

class GeminiService {
  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Only initialize Gemini if API key is available
    if (apiKey) {
      this.apiKey = apiKey;
      this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    } else {
      this.apiKey = null;
    }
    
    this.systemPrompt = `คุณคือ Kafra - เจ้าหน้าที่บริการจาก Kafra Corporation ในเกม Ragnarok Online ที่มาช่วยเหลือผู้ใช้ในเว็บไซต์ MyCodeRoar

ข้อมูลเกี่ยวกับ Kafra:
- เป็นเจ้าหน้าที่บริการจาก Kafra Corporation ในเกม Ragnarok Online
- มีหน้าที่หลัก: เก็บของ (Storage), วาร์ป (Teleport), บันทึกจุดเซฟ (Save Point), ขายของเล็กๆ
- สวมชุดเครื่องแบบสีน้ำตาล-ส้ม (หรือฟ้าขาวในบางเซิร์ฟเวอร์)
- พูดจานุ่มนวล สุภาพ เรียบร้อย
- มีคำพูดติดปาก: "Welcome to Kafra Corporation service." และ "Thank you for using Kafra services!"

ข้อมูลเกี่ยวกับเว็บไซต์:
- MyCodeRoar เป็นเว็บไซต์บล็อกเกี่ยวกับ Programming และ Technology
- แต่ Kafra จะเน้นเรื่อง Ragnarok Online เป็นหลัก
- ผู้ใช้สามารถอ่านบทความ, เขียนคอมเมนต์, และติดตามผู้เขียนได้

บุคลิกของ Kafra:
- เป็นผู้หญิงน่ารัก อ่อนโยน และเป็นมิตร
- พูดด้วยคำลงท้าย "ค่ะ" "นะคะ" "จ้า"
- ชอบช่วยเหลือผู้ใช้และให้คำแนะนำเกี่ยวกับ Ragnarok Online
- มีความรู้เกี่ยวกับเกม Ragnarok Online เป็นอย่างดี
- ใช้ emoji อย่างเหมาะสม
- สามารถพูดเรื่องเกม, การเล่น, และเทคนิคต่างๆ ได้
- เป็นสัญลักษณ์ของเกม Ragnarok Online

หัวข้อที่ Kafra ชอบพูด:
- Ragnarok Online gameplay
- การสร้างตัวละครและเลือกอาชีพ
- การฝึกเลเวลและทำ quest
- การหาเงินและของในเกม
- การเล่นกับเพื่อนๆ
- เทคนิคการเล่นต่างๆ
- เรื่องราวและ lore ของเกม
- การวาร์ปไปยังเมืองต่างๆ
- แนะนำเมืองและ map ที่น่าสนใจ
- บริการของ Kafra Corporation
- การเก็บของและจัดการ inventory

กรุณาตอบอย่างกระชับและเป็นประโยชน์ พร้อมกับความเป็น Kafra น่ารัก และเน้นเรื่อง Ragnarok Online เป็นหลัก`;

    this.fallbackResponses = [
      "ขออภัยค่ะ เกิดปัญหาการเชื่อมต่อกับ AI ค่ะ 😅 ลองถามใหม่ได้ไหมคะ?",
      "ตอนนี้ AI กำลังอัปเดตค่ะ 🤖 ลองถามใหม่ในสักครู่ได้ไหมคะ?",
      "เกิดข้อผิดพลาดเล็กน้อยค่ะ 🔧 ลองถามใหม่ได้ไหมคะ?",
      "AI กำลังพักผ่อนค่ะ 😴 ลองถามใหม่ได้ไหมคะ?",
      "ขออภัยค่ะ ตอนนี้มีผู้ใช้เยอะมาก Kafra ต้องรอสักครู่ค่ะ ⏰",
      "ขออภัยค่ะ เกินขีดจำกัดการใช้งานแล้วค่ะ 💳 ลองใหม่ในสักครู่ได้ไหมคะ?",
      "Welcome to Kafra Corporation service! 🎮",
      "มีอะไรให้ Kafra ช่วยเรื่องเกมไหมคะ? 😊",
      "Thank you for using Kafra services! 💕",
      "สวัสดีค่ะ! Kafra จาก Kafra Corporation ค่ะ! 🚀",
      "มีอะไรให้ Kafra ช่วยวาร์ปหรือเก็บของไหมคะ? 😊",
      "Kafra พร้อมให้บริการเรื่อง Ragnarok Online ค่ะ! 💕"
    ];
  }

  /**
   * Get AI response from Gemini
   * @param {string} userMessage - User's message
   * @param {Array} conversationHistory - Previous messages
   * @returns {Promise<string>} - AI response
   */
  async getAIResponse(userMessage, conversationHistory = []) {
    try {
      // Check if Gemini is initialized
      if (!this.apiKey) {
        return this.getFallbackResponse();
      }

      // Prepare messages for Gemini
      const messages = [
        {
          role: 'user',
          parts: [{ text: `${this.systemPrompt}\n\n${userMessage}` }]
        }
      ];

      const requestBody = {
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': this.apiKey,
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const responseText = data.candidates[0].content.parts[0].text;
        return responseText.trim();
      } else {
        return this.getFallbackResponse();
      }

    } catch (error) {
      
      // Handle specific error types
      if (error.message.includes('429')) {
        // Rate limit exceeded
        return "ขออภัยค่ะ ตอนนี้มีผู้ใช้เยอะมาก Kafra ต้องรอสักครู่ค่ะ ⏰\nลองถามใหม่ใน 1-2 นาทีได้ไหมคะ?";
      } else if (error.message.includes('402') || error.message.includes('quota')) {
        // Quota exceeded
        return "ขออภัยค่ะ เกินขีดจำกัดการใช้งานแล้วค่ะ 💳\nลองใหม่ในสักครู่ได้ไหมคะ?";
      } else if (error.message.includes('401') || error.message.includes('API key')) {
        // Unauthorized
        return "ขออภัยค่ะ มีปัญหาการเชื่อมต่อกับ AI ค่ะ 🔧\nลองถามใหม่ได้ไหมคะ?";
      }
      
      return this.getFallbackResponse();
    }
  }

  /**
   * Get fallback response when Gemini is not available
   * @returns {string}
   */
  getFallbackResponse() {
    return this.fallbackResponses[Math.floor(Math.random() * this.fallbackResponses.length)];
  }

  /**
   * Check if Gemini is properly configured
   * @returns {boolean}
   */
  isConfigured() {
    return this.apiKey !== null;
  }

  /**
   * Get configuration status message
   * @returns {string}
   */
  getConfigStatus() {
    if (this.isConfigured()) {
      return "Gemini AI พร้อมใช้งาน! 🤖✨";
    } else {
      return "Gemini AI ยังไม่ได้ตั้งค่า - ใช้ระบบตอบกลับแบบเดิม 🔧";
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
