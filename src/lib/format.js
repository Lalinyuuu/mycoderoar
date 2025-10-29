// src/lib/format.js

/**
 * แปลงค่าใด ๆ มาเป็น Date ที่ใช้งานได้ (หรือคืน null ถ้าไม่ valid)
 * รองรับ: Date | number(timestamp) | string(ISO/yyy-mm-dd/ทั่วไป)
 */
export function toDate(value) {
  if (!value && value !== 0) return null;

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  if (typeof value === "string") {
    // handle 'YYYY-MM-DD' ให้เป็น UTC ไม่โดน time zone พาเพี้ยน
    const ymd = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (ymd) {
      const d = new Date(Date.UTC(+ymd[1], +ymd[2] - 1, +ymd[3]));
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

/**
 * format วันที่แบบยืดหยุ่น
 */
export function formatDate(value, locale = "en-GB", opts = {}) {
  const d = toDate(value);
  if (!d) return "";
  try {
    const df = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      ...opts,
    });
    return df.format(d);
  } catch {
    // fallback minimal
    return d.toISOString().slice(0, 10);
  }
}

/**
 * รูปแบบยาว: 03 October 2025 (ค่าเริ่มต้น en-GB)
 * ปลอดภัย: ถ้าแปลงไม่ได้ คืน "" (ไม่โชว์ Invalid Date)
 */
export function formatLongDate(value, locale = "en-GB") {
  return formatDate(value, locale, { day: "2-digit", month: "long", year: "numeric" });
}

/**
 * แปลงเป็น ISO string (ใช้กับ <time dateTime="...">)
 */
export function toISO(value) {
  const d = toDate(value);
  return d ? d.toISOString() : undefined;
}

/**
 * เลือก URL รูปจาก object โพสต์ที่อาจใช้คีย์ต่าง ๆ กัน
 */
export function getPostImage(post) {
  return (
    post?.image ||
    post?.cover ||
    post?.thumbnail ||
    (Array.isArray(post?.images) ? post.images[0] : null) ||
    null
  );
}

/**
 * บังคับ URL ให้เป็น https ป้องกัน mixed content
 */
export function ensureHttps(url) {
  if (!url) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("http://")) return url.replace("http://", "https://");
  return url;
}

/**
 * ตัดข้อความแบบปลอดภัยกับอีโมจิและภาษาไทย
 * - ใช้ Intl.Segmenter (ถ้ามี) เพื่อนับ grapheme/word
 * - preserveWords: พยายามตัดที่ขอบคำ
 * - suffix: ข้อความต่อท้าย เช่น "…" หรือ "..."
 */
export function truncate(str = "", maxLen = 140, { suffix = "…", preserveWords = true } = {}) {
  if (!str) return "";
  // สร้างอาเรย์ของ grapheme (ตัวอักษรตามการมองเห็น) เพื่อกันอีโมจิขาด
  const graphemes = typeof Intl !== "undefined" && Intl.Segmenter
    ? Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(str), s => s.segment)
    : Array.from(str); // fallback ที่รองรับ surrogate pairs ได้ระดับหนึ่ง

  if (graphemes.length <= maxLen) return str;

  let cut = graphemes.slice(0, Math.max(1, maxLen - suffix.length)).join("");

  if (preserveWords) {
    // ถ้ามี Segmenter แบบ word ลองถอยไปตัดที่ขอบคำ
    try {
      if (typeof Intl !== "undefined" && Intl.Segmenter) {
        const seg = new Intl.Segmenter(undefined, { granularity: "word" }).segment(cut);
        let lastBreak = 0;
        let idx = 0;
        for (const s of seg) {
          idx += s.segment.length;
          if (s.isWordLike) lastBreak = idx;
        }
        if (lastBreak > 0) cut = cut.slice(0, lastBreak);
      } else {
        // fallback: หา space/backtrack แบบหยาบ ๆ
        const i = cut.lastIndexOf(" ");
        if (i > 0) cut = cut.slice(0, i);
      }
    } catch {
      // ignore and keep current cut
    }
  }

  return cut + suffix;
}