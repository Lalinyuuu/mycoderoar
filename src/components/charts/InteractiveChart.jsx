/**
 * Interactive Chart Component
 * Provides interactive visualizations for statistics data
 */

import { useEffect, useRef, useState } from 'react';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

const InteractiveChart = ({ 
  type = 'bar', 
  data = [], 
  title = 'Chart', 
  height = 300,
  colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
}) => {
  const canvasRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = height + 'px';
    
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, height);

    // Animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);

    // Draw chart based on type
    switch (type) {
      case 'bar':
        drawBarChart(ctx, rect.width, height, data, colors, hoveredIndex);
        break;
      case 'line':
        drawLineChart(ctx, rect.width, height, data, colors, hoveredIndex);
        break;
      case 'pie':
        drawPieChart(ctx, rect.width, height, data, colors, hoveredIndex);
        break;
      case 'doughnut':
        drawDoughnutChart(ctx, rect.width, height, data, colors, hoveredIndex);
        break;
      default:
        drawBarChart(ctx, rect.width, height, data, colors, hoveredIndex);
    }
  }, [type, data, colors, height, hoveredIndex]);

  const drawBarChart = (ctx, width, height, data, colors, hoveredIndex) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;
    const maxValue = Math.max(...data.map(d => d.value));

    // Draw bars
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * chartHeight;
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
      const y = height - padding - barHeight;

      // Bar color
      const color = hoveredIndex === index ? colors[index % colors.length] + 'CC' : colors[index % colors.length];
      
      // Draw bar
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw value on top
      ctx.fillStyle = '#495057'; // gray-9
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5);

      // Draw label
      ctx.fillStyle = '#868e96'; // gray-8
      ctx.font = '10px Inter';
      ctx.fillText(item.label, x + barWidth / 2, height - padding + 15);
    });

    // Draw axes
    ctx.strokeStyle = '#e9ecef'; // gray-4
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
  };

  const drawLineChart = (ctx, width, height, data, colors, hoveredIndex) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const valueRange = maxValue - minValue;

    // Draw line
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((item, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = height - padding - ((item.value - minValue) / valueRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points
    data.forEach((item, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = height - padding - ((item.value - minValue) / valueRange) * chartHeight;

      ctx.fillStyle = hoveredIndex === index ? colors[0] + 'CC' : colors[0];
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();

      // Draw value
      ctx.fillStyle = '#495057'; // gray-9
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(item.value.toString(), x, y - 10);

      // Draw label
      ctx.fillStyle = '#868e96'; // gray-8
      ctx.font = '10px Inter';
      ctx.fillText(item.label, x, height - padding + 15);
    });

    // Draw axes
    ctx.strokeStyle = '#e9ecef'; // gray-4
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
  };

  const drawPieChart = (ctx, width, height, data, colors, hoveredIndex) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    const total = data.reduce((sum, item) => sum + item.value, 0);

    let currentAngle = -Math.PI / 2;

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const color = hoveredIndex === index ? colors[index % colors.length] + 'CC' : colors[index % colors.length];

      // Draw slice
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
      const labelY = centerY + Math.sin(labelAngle) * (radius + 20);

      ctx.fillStyle = '#495057'; // gray-9
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, labelX, labelY);

      // Draw percentage
      ctx.fillStyle = '#868e96'; // gray-8
      ctx.font = '10px Inter';
      ctx.fillText(`${((item.value / total) * 100).toFixed(1)}%`, labelX, labelY + 15);

      currentAngle += sliceAngle;
    });
  };

  const drawDoughnutChart = (ctx, width, height, data, colors, hoveredIndex) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) / 2 - 40;
    const innerRadius = outerRadius * 0.6;
    const total = data.reduce((sum, item) => sum + item.value, 0);

    let currentAngle = -Math.PI / 2;

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const color = hoveredIndex === index ? colors[index % colors.length] + 'CC' : colors[index % colors.length];

      // Draw outer slice
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fill();

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (outerRadius + 20);
      const labelY = centerY + Math.sin(labelAngle) * (outerRadius + 20);

      ctx.fillStyle = '#495057'; // gray-9
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, labelX, labelY);

      // Draw percentage
      ctx.fillStyle = '#868e96'; // gray-8
      ctx.font = '10px Inter';
      ctx.fillText(`${((item.value / total) * 100).toFixed(1)}%`, labelX, labelY + 15);

      currentAngle += sliceAngle;
    });
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate which item is hovered based on chart type
    let hovered = -1;
    
    if (type === 'bar' || type === 'line') {
      const padding = 40;
      const chartWidth = rect.width - padding * 2;
      const barWidth = chartWidth / data.length * 0.8;
      const barSpacing = chartWidth / data.length * 0.2;
      
      data.forEach((item, index) => {
        const itemX = padding + index * (barWidth + barSpacing) + barSpacing / 2;
        if (x >= itemX && x <= itemX + barWidth) {
          hovered = index;
        }
      });
    } else if (type === 'pie' || type === 'doughnut') {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(rect.width, rect.height) / 2 - 40;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      
      if (distance <= radius) {
        const angle = Math.atan2(y - centerY, x - centerX) + Math.PI / 2;
        const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
        
        let currentAngle = 0;
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        data.forEach((item, index) => {
          const sliceAngle = (item.value / total) * 2 * Math.PI;
          if (normalizedAngle >= currentAngle && normalizedAngle <= currentAngle + sliceAngle) {
            hovered = index;
          }
          currentAngle += sliceAngle;
        });
      }
    }

    setHoveredIndex(hovered);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(-1);
  };

  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1">
        <h3 className="text-lg font-bold text-dark-1 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-5">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-2" />
            <p>No data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-1">
      <h3 className="text-lg font-bold text-dark-1 mb-4">{title}</h3>
      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full cursor-pointer"
          style={{ height: `${height}px` }}
        />
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-purple-6">
              <Activity className="w-8 h-8" />
            </div>
          </div>
        )}
      </div>
      {hoveredIndex >= 0 && (
        <div className="mt-4 p-3 bg-gray-1 rounded-lg">
          <p className="text-sm text-gray-7">
            <span className="font-semibold">{data[hoveredIndex]?.label}:</span> {data[hoveredIndex]?.value}
          </p>
        </div>
      )}
    </div>
  );
};

export default InteractiveChart;
