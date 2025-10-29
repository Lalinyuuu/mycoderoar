import { motion } from "framer-motion";
import { SIZES, SHADOWS, ANIMATIONS } from "@/constants/designConstants";

export default function LoadingPoring({
  fullscreen = false,
  text = "Loading Midgard...",
  imgSrc = "/images/loading/angdev-loading-2.png", 
}) {
  const Wrapper = ({ children }) =>
    fullscreen ? (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {children}
      </div>
    ) : (
      <div className="flex min-h-[60vh] items-center justify-center">{children}</div>
    );

  return (
    <Wrapper>
      <div className="flex flex-col items-center gap-4">
        {/* วงออร่า + มาสคอต */}
        <motion.div
          className="relative grid place-items-center"
          animate={{ scale: [1, 1.07, 1], rotate: [0, 6, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* magic aura blur - ขยายใหญ่ขึ้น */}
          <motion.div
            className="pointer-events-none absolute aspect-square w-52 rounded-full opacity-70 loading-aura"
            style={{
              filter: "blur(28px)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          {/* ring เรืองแสง - เพิ่ม 2 วง */}
          <motion.div 
            className="absolute h-40 w-40 rounded-full border-2 loading-ring-1"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute h-44 w-44 rounded-full border loading-ring-2"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          
          {/* มาสคอต - ใหญ่ขึ้นและเด้งน่ารักขึ้น */}
          <motion.img
            src={imgSrc}
            alt="Mycoderoar Mascot"
            width={128}
            height={128}
            className="relative z-10"
            style={{
              filter: `drop-shadow(${SHADOWS.glow})`
            }}
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 1.6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          
          {/* ดาวประกายรอบๆ */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full loading-star"
              style={{
                left: `calc(50% + ${Math.cos(angle * Math.PI / 180) * 80}px)`,
                top: `calc(50% + ${Math.sin(angle * Math.PI / 180) * 80}px)`,
              }}
              animate={{ 
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* ข้อความวิบวับ */}
        {text && (
          <motion.span
            className="select-none text-lg font-bold text-white drop-shadow-lg loading-text"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            {text}
          </motion.span>
        )}
      </div>
    </Wrapper>
  );
}