/**
 * Shimmer Effect Component
 * สร้างเอฟเฟกต์วงกลมโปร่งแสงแบบ "ดุ๊กดิ๊ก"
 */

export default function ShimmerEffect({ 
  size = "large", 
  color = "purple", 
  opacity = 0.3,
  animation = "float"
}) {
  const sizeClasses = {
    small: "w-24 h-24",
    medium: "w-32 h-32",
    large: "w-48 h-48",
    xlarge: "w-64 h-64",
    xxlarge: "w-80 h-80"
  };

  const colorClasses = {
    purple: "bg-purple-4",
    pink: "bg-pink-3",
    blue: "bg-purple-6",
    green: "bg-success",
    yellow: "bg-yellow-3"
  };

  const animationClasses = {
    float: "animate-pulse",
    rotate: "animate-spin",
    bounce: "animate-bounce",
    ping: "animate-ping"
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        ${animationClasses[animation]}
        rounded-full 
        absolute 
        blur-sm
        opacity-${Math.round(opacity * 10)}
      `}
      style={{ opacity }}
    />
  );
}
