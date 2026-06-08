import React from "react";
import { translations } from "../translations";

interface BeforeAfterCardProps {
  id: number;
  src: string;
  category: string;
  label: string;
  lang: "en" | "fr";
  onClick?: () => void;
  className?: string;
}

const BeforeAfterCard: React.FC<BeforeAfterCardProps> = ({
  id,
  src,
  category,
  label,
  lang,
  onClick,
  className = "",
}) => {
  const t = translations[lang];

  // Map category and project label to localized versions
  const localizedCategory =
    t.portfolio.categories[category as keyof typeof t.portfolio.categories] || category;
  const localizedLabel =
    t.portfolio.projects[id as keyof typeof t.portfolio.projects] || label;

  return (
    <div
      onClick={onClick}
      className={`relative w-full aspect-[16/9] overflow-hidden rounded-3xl select-none group cursor-pointer bg-slate-100 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {/* Project Image */}
      <img
        src={src}
        alt={localizedLabel}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
        loading="lazy"
        decoding="async"
        draggable={false}
      />

      {/* Dark overlay for premium contrast and badge readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-70 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none" />

      {/* Category Badge (bottom-left) */}
      <div className="absolute bottom-4 left-4 z-10 bg-blue-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md pointer-events-none transition-all duration-300 group-hover:bg-blue-600">
        {localizedCategory}
      </div>

      {/* Job Name Label (bottom-right) */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/65 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-md pointer-events-none transition-all duration-300 group-hover:bg-black/75">
        {localizedLabel}
      </div>
    </div>
  );
};

export default BeforeAfterCard;
