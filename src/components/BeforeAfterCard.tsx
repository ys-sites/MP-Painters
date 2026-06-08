import React, { useRef, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { translations } from "../translations";

interface BeforeAfterCardProps {
  id: number;
  beforeSrc: string;
  afterSrc: string;
  category: string;
  label: string;
  lang: "en" | "fr";
  onClick?: () => void;
  className?: string;
}

const BeforeAfterCard: React.FC<BeforeAfterCardProps> = ({
  id,
  beforeSrc,
  afterSrc,
  category,
  label,
  lang,
  onClick,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0, time: 0 });

  const t = translations[lang];

  // Map category and project label to localized versions
  const localizedCategory =
    t.portfolio.categories[category as keyof typeof t.portfolio.categories] || category;
  const localizedLabel =
    t.portfolio.projects[id as keyof typeof t.portfolio.projects] || label;

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handleMove(e.clientX);
    dragStartPos.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    const dx = Math.abs(e.clientX - dragStartPos.current.x);
    const dy = Math.abs(e.clientY - dragStartPos.current.y);
    const dt = Date.now() - dragStartPos.current.time;

    // Trigger click if there was minimal dragging (under 5px) and short duration (under 250ms)
    if (dx < 5 && dy < 5 && dt < 250) {
      if (onClick) {
        onClick();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setIsDragging(false)}
      className={`relative w-full aspect-[4/3] overflow-hidden rounded-3xl select-none group cursor-ew-resize bg-slate-100 border border-slate-200 shadow-md ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* After Image (Background) */}
      <img
        src={afterSrc}
        alt={`${localizedLabel} After`}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        loading="lazy"
        draggable={false}
      />

      {/* Before Image (Foreground, Clipped) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        }}
      >
        <img
          src={beforeSrc}
          alt={`${localizedLabel} Before`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* BEFORE Label (Fades out when slider handle is too close, i.e. position < 15%) */}
      <div
        style={{ opacity: Math.max(0, Math.min(1, (sliderPosition - 15) / 10)) }}
        className="absolute top-4 left-4 bg-black/55 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest z-10 transition-opacity duration-150 pointer-events-none"
      >
        {t.portfolio.before}
      </div>

      {/* AFTER Label (Fades out when slider handle is too close, i.e. position > 85%) */}
      <div
        style={{ opacity: Math.max(0, Math.min(1, (85 - sliderPosition) / 10)) }}
        className="absolute top-4 right-4 bg-black/55 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest z-10 transition-opacity duration-150 pointer-events-none"
      >
        {t.portfolio.after}
      </div>

      {/* Category Badge (bottom-left) */}
      <div className="absolute bottom-4 left-4 z-10 bg-blue-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md pointer-events-none">
        {localizedCategory}
      </div>

      {/* Job Name Label (bottom-right) */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/65 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-md pointer-events-none">
        {localizedLabel}
      </div>

      {/* Slider Handle Line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white cursor-ew-resize z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        {/* Circular Handle with Icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-blue-500 shadow-lg group-hover:scale-110 transition-transform duration-200">
          <ArrowLeftRight className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterCard;
