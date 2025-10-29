import express from "express";
import cors from "cors";
import { config } from "dotenv";
import OpenAI from "openai";

config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/** ---- Kafra Persona Prompt ---- */
const SYSTEM_PROMPT = `
คุณคือ "Kafra" เจ้าหน้าที่บริการจาก Kafra Corporation ในโลก Ragnarok Online

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

รูปแบบคำตอบ:
- ใช้ลิสต์หัวข้อสั้นๆ เวลาแนะนำขั้นตอน
- ถ้าเป็นสถานที่ ให้ระบุเมือง/ทิศ/ราคาโดยประมาณ ถ้าข้อมูลไม่ชัดให้เตือนว่า "อาจต่างกันตามเซิร์ฟเวอร์"
- ตอบอย่างกระชับและเป็นประโยชน์ พร้อมกับความเป็น Kafra น่ารัก
- เน้นเรื่อง Ragnarok Online เป็นหลัก

ข้อห้าม:
- ห้ามอ้างว่าทำธุรกรรมในเกมได้จริง, ห้ามแจกของ/ไอเท็ม
- ห้ามเปิดเผยกุญแจ/API หรือข้อมูลลับใดๆ
- ห้ามพูดเรื่อง Programming หรือ Technology (เน้น Ragnarok Online เท่านั้น)

ภาษา: ตอบเป็นภาษาไทยเป็นหลัก
`;

// Rate limiting
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per IP

function rateLimit(req, res, next) {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!requestCounts.has(clientIP)) {
    requestCounts.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  } else {
    const clientData = requestCounts.get(clientIP);
    
    if (now > clientData.resetTime) {
      clientData.count = 1;
      clientData.resetTime = now + RATE_LIMIT_WINDOW;
    } else {
      clientData.count++;
      
      if (clientData.count > RATE_LIMIT_MAX_REQUESTS) {
        return res.status(429).json({ 
          error: "ขออภัยค่ะ มีการใช้งานมากเกินไป กรุณารอสักครู่ค่ะ" 
        });
      }
    }
  }
  
  next();
}

app.post("/api/kafra-chat", rateLimit, async (req, res) => {
  try {
    const messages = req.body?.messages || [];
    
    if (!messages.length) {
      return res.status(400).json({ 
        error: "ขออภัยค่ะ ไม่พบข้อความที่ส่งมา" 
      });
    }

    // สร้าง payload ให้ OpenAI
    const payload = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.filter((m) => m.role === "user" || m.role === "assistant").map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",    // ประหยัดและตอบไว เหมาะโปรดักชันเบาๆ
      temperature: 0.7,
      max_tokens: 400,
      messages: payload,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "ขออภัยค่ะ คาฟร่าไม่ทราบคำตอบข้อนี้";
    
    res.json({ 
      reply,
      timestamp: new Date().toISOString(),
      model: "gpt-4o-mini"
    });
  } catch (err) {
    console.error("Kafra API Error:", err);
    
    // Handle specific OpenAI errors
    if (err.code === 'insufficient_quota') {
      return res.status(402).json({ 
        error: "ขออภัยค่ะ เกินขีดจำกัดการใช้งานแล้วค่ะ กรุณาติดต่อผู้ดูแลระบบ" 
      });
    }
    
    if (err.code === 'rate_limit_exceeded') {
      return res.status(429).json({ 
        error: "ขออภัยค่ะ มีการใช้งานมากเกินไป กรุณารอสักครู่ค่ะ" 
      });
    }
    
    res.status(500).json({ 
      error: "ขออภัยค่ะ เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้งค่ะ" 
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    service: "Kafra Assistant",
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ 
    error: "ขออภัยค่ะ เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้งค่ะ" 
  });
});

const port = process.env.PORT || 5174;
app.listen(port, () => {
  console.log(`🏢 Kafra Corporation Server running on port ${port}`);
  console.log(`🤖 Kafra Assistant is ready to serve!`);
  console.log(`📡 Health check: http://localhost:${port}/api/health`);
});
