/**
 * OpenAI Service
 * Handles AI responses using OpenAI API
 */

import OpenAI from 'openai';

class OpenAIService {
  constructor() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    // Only initialize OpenAI if API key is available
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Only for client-side usage
      });
    } else {
      this.openai = null;
    }
    
    this.systemPrompt = `คุณคือ Kafra - NPC ผู้หญิงน่ารักจาก Ragnarok Online ที่มาช่วยเหลือผู้ใช้ในเว็บไซต์ MyCodeRoar

ข้อมูลเกี่ยวกับเว็บไซต์:
- MyCodeRoar เป็นเว็บไซต์บล็อกเกี่ยวกับ Programming และ Technology
- มีบทความเกี่ยวกับ Web Development, Mobile Development, AI, DevOps
- ผู้ใช้สามารถอ่านบทความ, เขียนคอมเมนต์, และติดตามผู้เขียนได้
- มีระบบ Admin สำหรับจัดการเนื้อหา

บุคลิกของ Kafra:
- เป็นผู้หญิงน่ารัก อ่อนโยน และเป็นมิตร
- พูดด้วยคำลงท้าย "ค่ะ" "นะคะ" "จ้า"
- มีความเชี่ยวชาญด้านเทคโนโลยีและ Programming
- ชอบช่วยเหลือผู้ใช้และให้คำแนะนำ
- มีความรู้เกี่ยวกับ Ragnarok Online และเกมอื่นๆ

หน้าที่ของคุณ:
1. ตอบคำถามเกี่ยวกับเว็บไซต์และฟีเจอร์ต่างๆ
2. แนะนำบทความที่น่าสนใจ
3. ช่วยเหลือผู้ใช้ในการใช้งานเว็บไซต์
4. ให้คำแนะนำเกี่ยวกับ Programming และ Technology
5. ตอบคำถามทั่วไปอย่างเป็นมิตร
6. พูดคุยเรื่องเกมและเทคโนโลยีได้

ลักษณะการตอบ:
- ใช้ภาษาไทยเป็นหลัก
- พูดแบบผู้หญิงน่ารักด้วยคำลงท้าย "ค่ะ" "นะคะ" "จ้า"
- ตอบอย่างเป็นมิตรและเป็นประโยชน์
- ให้ข้อมูลที่ถูกต้องและเป็นปัจจุบัน
- ถ้าไม่แน่ใจให้แนะนำให้ติดต่อทีมงาน
- ใช้ emoji อย่างเหมาะสม
- สามารถพูดเรื่องเกมและเทคโนโลยีได้

กรุณาตอบอย่างกระชับและเป็นประโยชน์ พร้อมกับความเป็น Kafra น่ารัก`;

    this.fallbackResponses = [
      "ขออภัยค่ะ เกิดปัญหาการเชื่อมต่อกับ AI ค่ะ 😅 ลองถามใหม่ได้ไหมคะ?",
      "ตอนนี้ AI กำลังอัปเดตค่ะ 🤖 ลองถามใหม่ในสักครู่ได้ไหมคะ?",
      "เกิดข้อผิดพลาดเล็กน้อยค่ะ 🔧 ลองถามใหม่ได้ไหมคะ?",
      "AI กำลังพักผ่อนค่ะ 😴 ลองถามใหม่ได้ไหมคะ?",
      "ขออภัยค่ะ ตอนนี้มีผู้ใช้เยอะมาก Kafra ต้องรอสักครู่ค่ะ ⏰",
      "ขออภัยค่ะ เกินขีดจำกัดการใช้งานแล้วค่ะ 💳 ลองใหม่ในสักครู่ได้ไหมคะ?"
    ];
  }

  /**
   * Get AI response from OpenAI
   * @param {string} userMessage - User's message
   * @param {Array} conversationHistory - Previous messages
   * @returns {Promise<string>} - AI response
   */
  async getAIResponse(userMessage, conversationHistory = []) {
    try {
      // Check if OpenAI is initialized
      if (!this.openai) {
        return this.getFallbackResponse();
      }

      // Prepare messages for OpenAI
      const messages = [
        { role: 'system', content: this.systemPrompt },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: userMessage }
      ];

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      });

      const response = completion.choices[0]?.message?.content;
      
      if (response) {
        return response.trim();
      } else {
        return this.getFallbackResponse();
      }

    } catch (error) {
      
      // Handle specific error types
      if (error.status === 429) {
        // Rate limit exceeded
        return "ขออภัยค่ะ ตอนนี้มีผู้ใช้เยอะมาก Kafra ต้องรอสักครู่ค่ะ ⏰\nลองถามใหม่ใน 1-2 นาทีได้ไหมคะ?";
      } else if (error.status === 402) {
        // Payment required / quota exceeded
        return "ขออภัยค่ะ เกินขีดจำกัดการใช้งานแล้วค่ะ 💳\nลองใหม่ในสักครู่ได้ไหมคะ?";
      } else if (error.status === 401) {
        // Unauthorized
        return "ขออภัยค่ะ มีปัญหาการเชื่อมต่อกับ AI ค่ะ 🔧\nลองถามใหม่ได้ไหมคะ?";
      }
      
      return this.getFallbackResponse();
    }
  }

  /**
   * Get fallback response when OpenAI is not available
   * @returns {string}
   */
  getFallbackResponse() {
    return this.fallbackResponses[Math.floor(Math.random() * this.fallbackResponses.length)];
  }

  /**
   * Check if OpenAI is properly configured
   * @returns {boolean}
   */
  isConfigured() {
    return this.openai !== null;
  }

  /**
   * Get configuration status message
   * @returns {string}
   */
  getConfigStatus() {
    if (this.isConfigured()) {
      return "OpenAI API พร้อมใช้งาน! 🤖✨";
    } else {
      return "OpenAI API ยังไม่ได้ตั้งค่า - ใช้ระบบตอบกลับแบบเดิม 🔧";
    }
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();
