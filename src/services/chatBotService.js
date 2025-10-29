/**
 * ChatBot Service
 * Handles AI responses and conversation logic
 */

import { geminiService } from './geminiService';

export class ChatBotService {
  constructor() {
    this.lastRequestTime = 0;
    this.minRequestInterval = 10000; // 10 seconds minimum between requests (increased from 5)
    this.isRequestInProgress = false; // Prevent multiple simultaneous requests
    this.consecutiveErrors = 0; // Track consecutive errors
    this.maxConsecutiveErrors = 3; // Disable OpenAI after 3 consecutive errors
    this.responses = {
      greetings: [
        "Welcome to Kafra Corporation service! 😊 ยินดีต้อนรับสู่ MyCodeRoar! Kafra พร้อมให้บริการเรื่อง Ragnarok Online แล้วค่ะ! 🎮",
        "สวัสดี! ยินดีต้อนรับค่ะ! มีอะไรให้ Kafra ช่วยวาร์ป เก็บของ หรือเรื่องเกมไหมคะ? 👋",
        "Hello! สบายดีไหมคะ? Kafra จาก Kafra Corporation ชอบช่วยแนะนำเรื่อง Ragnarok Online ค่ะ! 😄",
        "สวัสดีจ้า! Kafra พร้อมให้บริการวาร์ป เก็บของ และเรื่องเกมแล้วค่ะ! 💕"
      ],
      help: [
        "Kafra Corporation สามารถช่วยคุณได้หลายอย่างค่ะ:\n• คำแนะนำเรื่อง Ragnarok Online\n• การสร้างตัวละครและเลือกอาชีพ\n• การฝึกเลเวลและทำ quest\n• เทคนิคการเล่นต่างๆ\n• การหาเงินและของในเกม\n• การวาร์ปไปยังเมืองต่างๆ\n• การเก็บของและจัดการ inventory",
        "มีอะไรให้ช่วยเหลือเรื่องเกมไหมคะ? Kafra พร้อมให้บริการวาร์ป เก็บของ และแนะนำเสมอค่ะ! 🎮",
        "ลองถาม Kafra ได้เลยค่ะ! จะช่วยหาคำตอบเรื่อง Ragnarok Online และบริการของ Kafra Corporation ให้คุณนะคะ 😊"
      ],
      articles: [
        "เรามีบทความที่น่าสนใจมากมายค่ะ! 📚\n• บทความเกี่ยวกับ Programming\n• Tips และ Tricks ต่างๆ\n• Tutorial แบบ Step-by-step\n• ข่าวสารเทคโนโลยีล่าสุด\n\nลองดูในหน้า Home หรือ Browse Posts นะคะ!",
        "บทความของเรามีหลากหลายหัวข้อค่ะ! 🔥\n• Web Development\n• Mobile Development\n• AI & Machine Learning\n• DevOps & Cloud\n\nเลือกอ่านตามความสนใจได้เลยค่ะ!",
        "มีบทความใหม่ๆ ออกมาเรื่อยๆ ค่ะ! ✨\nลองดูในส่วน Latest Posts หรือ Popular Posts นะคะ!"
      ],
      ragnarok: [
        "Ragnarok Online เป็นเกม MMORPG ที่สนุกมากค่ะ! 🎮\n• มีอาชีพให้เลือกมากมาย\n• ระบบการฝึกเลเวลที่หลากหลาย\n• การทำ quest และหาเพื่อน\n• การหาเงินและของในเกม\n\nKafra ชอบช่วยเหลือเรื่องเกมนี้มากค่ะ!",
        "Ragnarok Online มีอะไรให้ทำเยอะมากค่ะ! 🔥\n• สร้างตัวละครใหม่\n• ฝึกเลเวลใน map ต่างๆ\n• ทำ quest และหาเพื่อน\n• หาเงินและของในเกม\n\nลองเล่นดูนะคะ!",
        "Ragnarok Online เป็นเกมที่เล่นได้นานมากค่ะ! ✨\n• มีอาชีพให้เลือกเยอะ\n• ระบบการเล่นที่หลากหลาย\n• การหาเพื่อนและ guild\n• การหาเงินและของในเกม\n\nKafra ชอบช่วยเหลือเรื่องเกมนี้ค่ะ!"
      ],
      jobs: [
        "อาชีพใน Ragnarok Online มีเยอะมากค่ะ! 🎭\n• Novice → Swordsman, Mage, Archer, Acolyte, Merchant, Thief\n• แต่ละอาชีพมีจุดเด่นต่างกัน\n• เลือกตามสไตล์การเล่นที่ชอบ\n\nKafra ชอบช่วยแนะนำอาชีพค่ะ!",
        "อาชีพใน Ragnarok Online น่าสนใจมากค่ะ! ⚔️\n• Swordsman: แข็งแกร่ง ต่อสู้ระยะใกล้\n• Mage: ใช้เวทมนตร์ ต่อสู้ระยะไกล\n• Archer: ยิงธนู ต่อสู้ระยะไกล\n• Acolyte: รักษาและช่วยเหลือ\n• Merchant: ค้าขายและหาเงิน\n• Thief: เร็วและหลบหลีก\n\nเลือกอาชีพที่ชอบได้เลยค่ะ!",
        "อาชีพใน Ragnarok Online มีให้เลือกเยอะค่ะ! 🎪\n• แต่ละอาชีพมีจุดเด่นต่างกัน\n• เลือกตามสไตล์การเล่นที่ชอบ\n• สามารถเปลี่ยนอาชีพได้เมื่อเลเวลสูง\n\nKafra ชอบช่วยแนะนำอาชีพค่ะ!"
      ],
      leveling: [
        "การฝึกเลเวลใน Ragnarok Online สนุกมากค่ะ! 📈\n• เลือก map ที่เหมาะกับเลเวล\n• หาเพื่อนไปฝึกเลเวลด้วยกัน\n• ทำ quest เพื่อรับ EXP เพิ่ม\n• ใช้ของช่วยเพิ่ม EXP\n\nKafra ชอบช่วยแนะนำเรื่องการฝึกเลเวลค่ะ!",
        "การฝึกเลเวลใน Ragnarok Online มีเทคนิคเยอะค่ะ! 🎯\n• เลือก map ที่เหมาะกับเลเวล\n• หาเพื่อนไปฝึกเลเวลด้วยกัน\n• ทำ quest เพื่อรับ EXP เพิ่ม\n• ใช้ของช่วยเพิ่ม EXP\n\nลองดูนะคะ!",
        "การฝึกเลเวลใน Ragnarok Online สนุกมากค่ะ! 🚀\n• เลือก map ที่เหมาะกับเลเวล\n• หาเพื่อนไปฝึกเลเวลด้วยกัน\n• ทำ quest เพื่อรับ EXP เพิ่ม\n• ใช้ของช่วยเพิ่ม EXP\n\nKafra ชอบช่วยแนะนำเรื่องการฝึกเลเวลค่ะ!"
      ],
      money: [
        "การหาเงินใน Ragnarok Online มีหลายวิธีค่ะ! 💰\n• ขายของที่หาได้\n• ทำ quest เพื่อรับเงิน\n• ค้าขายกับผู้เล่นคนอื่น\n• หาเพื่อนไปหาเงินด้วยกัน\n\nKafra ชอบช่วยแนะนำเรื่องการหาเงินค่ะ!",
        "การหาเงินใน Ragnarok Online สนุกมากค่ะ! 💎\n• ขายของที่หาได้\n• ทำ quest เพื่อรับเงิน\n• ค้าขายกับผู้เล่นคนอื่น\n• หาเพื่อนไปหาเงินด้วยกัน\n\nลองดูนะคะ!",
        "การหาเงินใน Ragnarok Online มีหลายวิธีค่ะ! 💸\n• ขายของที่หาได้\n• ทำ quest เพื่อรับเงิน\n• ค้าขายกับผู้เล่นคนอื่น\n• หาเพื่อนไปหาเงินด้วยกัน\n\nKafra ชอบช่วยแนะนำเรื่องการหาเงินค่ะ!"
      ],
      kafra: [
        "Kafra Corporation เป็นบริษัทให้บริการใน Ragnarok Online ค่ะ! 🏢\n• เก็บของ (Storage Service)\n• วาร์ป (Teleport Service)\n• บันทึกจุดเซฟ (Save Point)\n• ขายของเล็กๆ เช่น Butterfly Wing, Fly Wing\n\nThank you for using Kafra services! 💫",
        "Kafra Corporation ให้บริการทั่ว Rune-Midgarts Kingdom ค่ะ! 🌟\n• เก็บของ (Storage Service)\n• วาร์ป (Teleport Service)\n• บันทึกจุดเซฟ (Save Point)\n• ขายของเล็กๆ เช่น Butterfly Wing, Fly Wing\n\nWelcome to Kafra Corporation service! ✨",
        "Kafra Corporation เป็นสัญลักษณ์ของเกม Ragnarok Online ค่ะ! 🎪\n• เก็บของ (Storage Service)\n• วาร์ป (Teleport Service)\n• บันทึกจุดเซฟ (Save Point)\n• ขายของเล็กๆ เช่น Butterfly Wing, Fly Wing\n\nKafra พร้อมให้บริการค่ะ! 💕"
      ],
      storage: [
        "การเก็บของใน Ragnarok Online สะดวกมากค่ะ! 🎒\n• เก็บของไว้ในคลังกลางของตัวเอง\n• เข้าถึงได้จากทุกเมืองที่มี Kafra\n• จัดการ inventory ได้ง่าย\n• เก็บของมีค่าไว้ปลอดภัย\n\nKafra ชอบช่วยจัดการของให้ค่ะ!",
        "Storage Service ของ Kafra Corporation ดีมากค่ะ! 📦\n• เก็บของไว้ในคลังกลางของตัวเอง\n• เข้าถึงได้จากทุกเมืองที่มี Kafra\n• จัดการ inventory ได้ง่าย\n• เก็บของมีค่าไว้ปลอดภัย\n\nลองใช้ดูนะคะ!",
        "การเก็บของเป็นบริการหลักของ Kafra ค่ะ! 🗄️\n• เก็บของไว้ในคลังกลางของตัวเอง\n• เข้าถึงได้จากทุกเมืองที่มี Kafra\n• จัดการ inventory ได้ง่าย\n• เก็บของมีค่าไว้ปลอดภัย\n\nKafra ชอบช่วยจัดการของให้ค่ะ!"
      ],
      warp: [
        "Teleport Service ของ Kafra Corporation สะดวกมากค่ะ! 🚀\n• วาร์ปไปยังเมืองต่างๆ ได้\n• Prontera, Morroc, Payon, Geffen\n• Izlude, Alberta, Comodo\n• และเมืองอื่นๆ อีกมากมาย\n\nอยากไปเมืองไหนบอก Kafra ได้เลยค่ะ!",
        "การวาร์ปใน Ragnarok Online สะดวกมากค่ะ! ✨\n• วาร์ปไปยังเมืองต่างๆ ได้\n• ประหยัดเวลาในการเดินทาง\n• หาเพื่อนและทำ quest ได้ง่าย\n• ไปยัง map ที่ต้องการได้เร็ว\n\nKafra ชอบช่วยวาร์ปค่ะ!",
        "วาร์ปเป็นบริการหลักของ Kafra Corporation ค่ะ! 💫\n• วาร์ปไปยังเมืองต่างๆ ได้\n• Prontera, Morroc, Payon, Geffen\n• Izlude, Alberta, Comodo\n• และเมืองอื่นๆ อีกมากมาย\n\nอยากไปเมืองไหนบอก Kafra ได้เลยค่ะ!"
      ],
      contact: [
        "คุณสามารถติดต่อเราได้หลายช่องทางค่ะ:\n• Email: contact@mycoderoar.com\n• Social Media: Facebook, Twitter, LinkedIn\n• GitHub: github.com/mycoderoar\n• หรือใช้ฟอร์ม Contact ในเว็บไซต์ค่ะ",
        "ติดต่อเราได้ง่ายๆ ค่ะ! 📞\n• Email: hello@mycoderoar.com\n• Line: @mycoderoar\n• Facebook: MyCodeRoar Official",
        "มีคำถามหรือข้อเสนอแนะไหมคะ? 📧\nส่งมาได้ที่ contact@mycoderoar.com ค่ะ!"
      ],
      thanks: [
        "ยินดีค่ะ! 😊 มีอะไรให้ช่วยเหลือเรื่องเกมอีกไหมคะ?",
        "ไม่เป็นไรค่ะ! ยินดีช่วยเสมอค่ะ! 🤝",
        "ขอบคุณที่ใช้บริการค่ะ! 💙",
        "ยินดีมากค่ะ! Kafra ชอบช่วยเหลือเรื่อง Ragnarok Online ค่ะ! 💕"
      ],
      goodbye: [
        "ลาก่อนค่ะ! 👋 ขอให้มีความสุขกับการเล่น Ragnarok Online นะคะ!",
        "ลาก่อนค่ะ! 😊 ขอให้สนุกกับการเล่นเกมนะคะ!",
        "ลาก่อน! ขอให้โชคดีค่ะ! 🍀",
        "เจอกันใหม่นะคะ! Kafra จะรออยู่ค่ะ! 💕"
      ],
      default: [
        "ขออภัยค่ะ Kafra ไม่เข้าใจคำถามนี้ค่ะ 😅\nลองถามเรื่อง Ragnarok Online ได้ไหมคะ?",
        "ขออภัยค่ะ Kafra ไม่เข้าใจคำถามนี้ค่ะ 🤔\nลองถามเรื่องเกมได้ไหมคะ?",
        "ขออภัยค่ะ Kafra ไม่เข้าใจคำถามนี้ค่ะ 😊\nลองถามเรื่อง Ragnarok Online ได้ไหมคะ?",
        "ขออภัยค่ะ Kafra ไม่เข้าใจคำถามนี้ค่ะ 💭\nลองถามเรื่องเกมได้ไหมคะ?"
      ]
    };
  }

  /**
   * Get response from backend server
   * @param {string} message - User message
   * @returns {Promise<string>}
   */
  async getServerResponse(message) {
    try {
      const response = await fetch('http://localhost:5174/api/kafra-chat', {
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
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      return data.reply || 'ขออภัยค่ะ เกิดข้อผิดพลาดในการตอบกลับค่ะ';
    } catch (error) {
      return null; // Return null to fallback to rule-based responses
    }
  }

  /**
   * Get bot response based on user input
   * @param {string} userInput - User's message
   * @param {Array} conversationHistory - Previous messages
   * @returns {Promise<string>} - Bot's response
   */
  async getResponse(userInput, conversationHistory = []) {
    try {
      // Prevent multiple simultaneous requests
      if (this.isRequestInProgress) {
        return this.getFallbackResponse(userInput);
      }

      // Rate limiting check
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < this.minRequestInterval) {
        const waitTime = this.minRequestInterval - timeSinceLastRequest;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      this.isRequestInProgress = true;
      this.lastRequestTime = Date.now();
      
      // Try backend server first
      const serverResponse = await this.getServerResponse(userInput);
      if (serverResponse) {
        this.consecutiveErrors = 0; // Reset error count on success
        return serverResponse;
      }
      
      // Try Gemini if backend server fails and not too many consecutive errors
      if (geminiService.isConfigured() && this.consecutiveErrors < this.maxConsecutiveErrors) {
        const aiResponse = await geminiService.getAIResponse(userInput, conversationHistory);
        if (aiResponse) {
          this.consecutiveErrors = 0; // Reset error count on success
          return aiResponse;
        }
      }
    } catch (error) {
      this.consecutiveErrors++; // Increment error count
      
      // If too many consecutive errors, disable AI temporarily
      if (this.consecutiveErrors >= this.maxConsecutiveErrors) {
        // Too many consecutive errors, disabling AI temporarily
      }
    } finally {
      this.isRequestInProgress = false;
    }

    // Fallback to rule-based responses
    const fallbackResponse = this.getFallbackResponse(userInput);
    
    // Add context about fallback mode if AI is disabled
    if (this.consecutiveErrors >= this.maxConsecutiveErrors) {
      return `${fallbackResponse}\n\n(ใช้โหมดตอบกลับอัตโนมัติเนื่องจากเกิดข้อผิดพลาดในการเชื่อมต่อ AI)`;
    }
    
    return fallbackResponse;
  }

  /**
   * Reset consecutive error count
   */
  resetErrorCount() {
    this.consecutiveErrors = 0;
  }

  /**
   * Get current error status
   */
  getErrorStatus() {
    return {
      consecutiveErrors: this.consecutiveErrors,
      maxConsecutiveErrors: this.maxConsecutiveErrors,
      isOpenAIDisabled: this.consecutiveErrors >= this.maxConsecutiveErrors
    };
  }

  /**
   * Get fallback response using rule-based logic
   * @param {string} userInput - User's message
   * @returns {string} - Fallback response
   */
  getFallbackResponse(userInput) {
    const input = userInput.toLowerCase().trim();
    
    // Greetings
    if (this.matchesPattern(input, ['สวัสดี', 'hello', 'hi', 'hey', 'หวัดดี', 'ดีครับ', 'ดีค่ะ'])) {
      return this.getRandomResponse('greetings');
    }
    
    // Help requests
    if (this.matchesPattern(input, ['ช่วย', 'help', 'ช่วยเหลือ', 'ช่วยหน่อย', 'ไม่รู้', 'งง', 'confused'])) {
      return this.getRandomResponse('help');
    }
    
    // Articles/Posts
    if (this.matchesPattern(input, ['บทความ', 'article', 'post', 'เขียน', 'content', 'เนื้อหา', 'blog'])) {
      return this.getRandomResponse('articles');
    }
    
    // Contact
    if (this.matchesPattern(input, ['ติดต่อ', 'contact', 'โทร', 'email', 'อีเมล', 'ช่องทาง', 'ติดต่อได้'])) {
      return this.getRandomResponse('contact');
    }
    
    // Thanks
    if (this.matchesPattern(input, ['ขอบคุณ', 'thank', 'thanks', 'ขอบใจ', 'ดีใจ', 'ดีมาก'])) {
      return this.getRandomResponse('thanks');
    }
    
    // Goodbye
    if (this.matchesPattern(input, ['ลาก่อน', 'bye', 'bye bye', 'บาย', 'เจอกัน', 'ไปแล้ว'])) {
      return this.getRandomResponse('goodbye');
    }
    
    // Programming related
    if (this.matchesPattern(input, ['programming', 'code', 'โค้ด', 'เขียนโปรแกรม', 'developer', 'dev', 'coding'])) {
      return "เยี่ยมมากค่ะ! 💻 เรามีบทความเกี่ยวกับ Programming มากมาย:\n• JavaScript & React\n• Python & Django\n• Node.js & Express\n• Mobile Development\n• AI & Machine Learning\n\nลองดูในส่วนบทความของเรานะคะ!";
    }
    
    // Technology
    if (this.matchesPattern(input, ['technology', 'tech', 'เทคโนโลยี', 'เทค', 'innovation', 'นวัตกรรม'])) {
      return "เทคโนโลยีเป็นเรื่องที่น่าสนใจมากค่ะ! 🚀\n• AI & Machine Learning\n• Cloud Computing\n• Blockchain\n• IoT & Smart Devices\n• Cybersecurity\n\nเรามีบทความอัปเดตเทคโนโลยีล่าสุดค่ะ!";
    }
    
    // Ragnarok Online related
    if (this.matchesPattern(input, ['ragnarok', 'ro', 'kafra', 'เกม', 'game', 'ออนไลน์'])) {
      return this.getRandomResponse('ragnarok');
    }
    
    // Jobs/Classes
    if (this.matchesPattern(input, ['อาชีพ', 'job', 'class', 'swordsman', 'mage', 'archer', 'acolyte', 'merchant', 'thief'])) {
      return this.getRandomResponse('jobs');
    }
    
    // Leveling
    if (this.matchesPattern(input, ['เลเวล', 'level', 'ฝึก', 'exp', 'experience', 'leveling'])) {
      return this.getRandomResponse('leveling');
    }
    
    // Money/Zeny
    if (this.matchesPattern(input, ['เงิน', 'money', 'zeny', 'หาเงิน', 'ขาย', 'ค้าขาย'])) {
      return this.getRandomResponse('money');
    }
    
    // Kafra Corporation
    if (this.matchesPattern(input, ['kafra', 'corporation', 'บริษัท', 'company', 'บริการ', 'service'])) {
      return this.getRandomResponse('kafra');
    }
    
    // Storage
    if (this.matchesPattern(input, ['เก็บของ', 'storage', 'คลัง', 'inventory', 'ของ', 'items'])) {
      return this.getRandomResponse('storage');
    }
    
    // Warp/Teleport
    if (this.matchesPattern(input, ['วาร์ป', 'warp', 'teleport', 'เดินทาง', 'เมือง', 'city'])) {
      return this.getRandomResponse('warp');
    }
    
    // Default response
    return this.getRandomResponse('default');
  }

  /**
   * Check if input matches any pattern
   * @param {string} input - User input
   * @param {string[]} patterns - Patterns to match
   * @returns {boolean}
   */
  matchesPattern(input, patterns) {
    return patterns.some(pattern => input.includes(pattern));
  }

  /**
   * Get random response from category
   * @param {string} category - Response category
   * @returns {string}
   */
  getRandomResponse(category) {
    const responses = this.responses[category] || this.responses.default;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Simulate typing delay
   * @param {Function} callback - Callback function
   * @param {number} minDelay - Minimum delay in ms
   * @param {number} maxDelay - Maximum delay in ms
   */
  simulateTyping(callback, minDelay = 1000, maxDelay = 2000) {
    const delay = minDelay + Math.random() * (maxDelay - minDelay);
    setTimeout(callback, delay);
  }
}

// Export singleton instance
export const chatBotService = new ChatBotService();
