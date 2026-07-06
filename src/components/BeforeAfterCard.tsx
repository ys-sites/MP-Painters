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
  isLightbox?: boolean;
}

const BeforeAfterCard: React.FC<BeforeAfterCardProps> = ({
  id,
  src,
  category,
  label,
  lang,
  onClick,
  className = "",
  isLightbox = false,
}) => {
  const t = translations[lang];

  // Map category to localized versions
  const localizedCategory =
    t.portfolio.categories[category as keyof typeof t.portfolio.categories] || category;

  return (
    <div className="flex flex-col gap-2.5 group w-full">
      {/* Category Title Above the Image */}
      <h3
        className={`font-black text-xs md:text-sm tracking-widest uppercase px-1 transition-colors duration-300 ${
          isLightbox 
            ? "text-slate-100" 
            : "text-slate-700 group-hover:text-blue-600"
        }`}
      >
        {localizedCategory}
      </h3>

      {/* Image Container */}
      <div
        onClick={onClick}
        className={`relative w-full aspect-[16/9] overflow-hidden rounded-3xl select-none cursor-pointer bg-slate-100 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 ${className}`}
      >
        {/* Project Image */}
        <img
          src={src}
          alt={localizedCategory}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
          loading="lazy"
          decoding="async"
          draggable={false}
        />

        {/* Subtle dark gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
};

export default BeforeAfterCard;
