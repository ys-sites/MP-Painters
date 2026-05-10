import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  title: string;
  label: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
  title,
  label,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  // Dynamically calculate container height based on image aspect ratio
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const aspectRatio = img.height / img.width;
        setContainerHeight(width * aspectRatio);
      }
    };
    img.src = beforeImage;
  }, [beforeImage]);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newPosition = ((clientX - rect.left) / rect.width) * 100;

    if (newPosition >= 0 && newPosition <= 100) {
      setSliderPosition(newPosition);
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchStart = () => setIsDragging(true);
  const handleTouchEnd = () => setIsDragging(false);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      ref={containerRef}
      className="w-full rounded-[2rem] overflow-hidden shadow-lg border border-slate-200 group relative cursor-col-resize will-change-transform bg-slate-100"
      style={{ height: containerHeight || 'auto' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsDragging(false)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      {/* Before Image (Full) */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={beforeImage}
          alt={beforeLabel}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain"
          draggable="false"
        />
      </div>

      {/* After Image (Clipped by slider position) */}
      <div
        className="absolute inset-0 h-full overflow-hidden"
        style={{ 
          width: `${sliderPosition}%`,
          transition: isDragging ? 'none' : 'width 0.1s ease-out'
        }}
      >
        <img
          src={afterImage}
          alt={afterLabel}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain"
          draggable="false"
          style={{
            width: containerRef.current ? `${(containerRef.current.clientWidth * 100) / sliderPosition}%` : '100%',
          }}
        />
      </div>

      {/* Slider Handle Line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-blue-500 cursor-col-resize"
        style={{ 
          left: `${sliderPosition}%`, 
          transform: 'translateX(-50%)',
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)',
          transition: isDragging ? 'none' : 'all 0.1s ease-out'
        }}
      >
        {/* Handle Icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full shadow-2xl p-3 opacity-100 hover:scale-110 transition-transform duration-300 backdrop-blur-sm border-2 border-white">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h5M13 19h5a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-5" />
          </svg>
        </div>
      </div>

      {/* Before Label */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full z-10 shadow-lg">
        <p className="text-white font-black text-sm uppercase tracking-widest">{beforeLabel}</p>
      </div>

      {/* After Label */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full z-10 shadow-lg">
        <p className="text-white font-black text-sm uppercase tracking-widest">{afterLabel}</p>
      </div>

      {/* Hover Text */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 pointer-events-none z-20">
        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <span className="text-blue-400 font-black tracking-[0.2em] uppercase text-[10px] mb-2 block">{label}</span>
          <h3 className="text-white font-black tracking-tight text-xl">{title}</h3>
        </div>
      </div>
    </motion.div>
  );
};

export default BeforeAfterSlider;
