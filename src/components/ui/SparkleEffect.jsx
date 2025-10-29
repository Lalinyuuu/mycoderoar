/**
 * Sparkle Effect Component
 * สร้างเอฟเฟกต์ประกายดาวแบบ "ดุ๊กดิ๊ก"
 */

export default function SparkleEffect({ 
  size = "medium", 
  color = "purple", 
  position = "top-right",
  animation = "sparkle"
}) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6", 
    large: "w-8 h-8",
    xlarge: "w-12 h-12",
    xxlarge: "w-16 h-16"
  };

  const colorClasses = {
    purple: "text-purple-6",
    pink: "pink-4",
    blue: "purple-6",
    green: "success",
    yellow: "yellow-4"
  };

  const positionClasses = {
    "top-left": "absolute top-2 left-2",
    "top-right": "absolute top-2 right-2",
    "bottom-left": "absolute bottom-2 left-2",
    "bottom-right": "absolute bottom-2 right-2",
    "center": "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    // Place the sparkle further below the container to avoid overlapping text
    "below-left": "absolute -bottom-14 left-6"
  };

  const animationClasses = {
    sparkle: "animate-sparkle",
    shimmer: "animate-shimmer",
    rotate: "animate-spin",
    float: "animate-float"
  };

  return (
    <div className={`${positionClasses[position]} ${animationClasses[animation]}`}>
      <svg 
        className={`${sizeClasses[size]} ${colorClasses[color]} opacity-80`}
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </div>
  );
}
