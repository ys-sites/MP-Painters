import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, CheckCircle, Phone, Mail, MapPin, 
  Paintbrush, Home, SprayCan, Hammer, 
  ChevronLeft, ChevronRight, Menu, X, Star, Quote, ShieldCheck
} from "lucide-react";
import { translations } from "./translations";
import ShinyText from "./components/ShinyText";
import BeforeAfterCard from "./components/BeforeAfterCard";

const CATEGORIES = ["All", "Exterior", "Interior", "Cabinet"] as const;

const ALL_PROJECTS = [
  { id: 1, src: "/media/jobs/1.jpg", category: "Interior", label: "Bathroom Painting" },
  { id: 2, src: "/media/jobs/2.jpg", category: "Interior", label: "Drywall Repair & Painting" },
  { id: 3, src: "/media/jobs/3.jpg", category: "Exterior", label: "Balustrade & Entrance Painting" },
  { id: 4, src: "/media/jobs/4.jpg", category: "Exterior", label: "Concrete Porch Stairs" },
  { id: 5, src: "/media/jobs/5.jpg", category: "Cabinet",  label: "Cabinet Doors Spraying" },
  { id: 6, src: "/media/jobs/6.jpg", category: "Cabinet",  label: "Cabinet Refinishing" },
  { id: 7, src: "/media/jobs/7.jpg", category: "Cabinet",  label: "Kitchen Cabinets Respray" },
  { id: 8, src: "/media/jobs/8.jpg", category: "Exterior", label: "Front Door Refinishing" },
  { id: 9, src: "/media/jobs/9.jpg", category: "Exterior", label: "Exterior Siding Painting" },
  { id: 10, src: "/media/jobs/10.png", category: "Cabinet", label: "Kitchen Prep & Drywall" },
  { id: 11, src: "/media/jobs/11.png", category: "Cabinet", label: "Cabinet Spray Prep" },
  { id: 12, src: "/media/jobs/12.png", category: "Cabinet", label: "Two-Tone Cabinet Spraying" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  })
};

const FadeInText = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
  const words = text.split(" ");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        visible: { transition: { staggerChildren: 0.08, delayChildren: delay } },
        hidden: {},
      }}
      className={`${className} will-change-transform`}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const Logo = ({ isDark, lang, size = 'normal' }: { isDark?: boolean; lang?: 'en' | 'fr'; size?: 'normal' | 'large' }) => (
  <div className={`flex items-center gap-3 md:gap-5 font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-slate-900'} whitespace-nowrap ${size === 'large' ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
    <img 
      src="/media/mp.png" 
      alt="Manny Painter Logo" 
      className={`${size === 'large' ? 'h-20 md:h-28' : 'h-10 md:h-12'} w-auto object-contain drop-shadow-sm`} 
    />
    <span>Manny Painter</span>
  </div>
);

export default function App() {
  const [lang, setLang] = useState<'en' | 'fr'>('fr');
  const t = translations[lang];
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCtaOpen, setIsCtaOpen] = useState(false);

  // Router, filter, and lightbox states
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lightboxProject, setLightboxProject] = useState<typeof ALL_PROJECTS[0] | null>(null);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setCurrentPath(to);
    window.scrollTo(0, 0);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    if (currentPath !== "/") {
      window.history.pushState({}, "", "/");
      setCurrentPath("/");
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsCtaOpen(true);
      setTimeout(() => setIsCtaOpen(false), 4000); // Keep open for 4 seconds
    }, 10000); // Repeat every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (currentPath === "/portfolio") {
      document.title = lang === 'fr'
        ? 'Réalisations & Portfolio | Manny Painter'
        : 'Portfolio & Recent Projects | Manny Painter';
    } else {
      document.title = lang === 'fr'
        ? 'Manny Painter | Peintre Montréal, Pierrefonds & Laval | Soumission Gratuite'
        : 'Manny Painter | Painter Montreal, Pierrefonds & Laval | Free Estimate';
    }
  }, [lang, currentPath]);;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Navigation */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform ${isScrolled ? 'bg-white/70 backdrop-blur-2xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-2.5 md:py-3' : 'bg-transparent py-5 md:py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-10 font-bold">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="hover:opacity-80 transition-opacity active:scale-95 duration-200">
            <Logo lang={lang} />
          </a>
          
          <div className="hidden md:flex items-center md:gap-3 lg:gap-6 text-[10px] lg:text-xs tracking-wider uppercase whitespace-nowrap">
            {['about', 'services', 'portfolio', 'reviews'].map((item) => (
              <a 
                key={item}
                href={`#${item}`} 
                onClick={(e) => handleNavClick(e, item)}
                className="text-slate-600 hover:text-blue-600 transition-all relative group py-2"
              >
                {t.nav[item as keyof typeof t.nav]}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center md:gap-2 lg:gap-3 flex-shrink-0">
            <div className="flex bg-slate-200/50 rounded-md p-1 backdrop-blur-sm whitespace-nowrap">
              <button onClick={() => setLang('en')} className={`px-2 py-1 text-xs font-bold rounded ${lang === 'en' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>EN</button>
              <button onClick={() => setLang('fr')} className={`px-2 py-1 text-xs font-bold rounded ${lang === 'fr' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>FR</button>
            </div>
            <a href="#contact" onClick={(e) => handleNavClick(e, "contact")} className="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors text-[10px] lg:text-xs tracking-wider uppercase shadow-md shadow-blue-600/20 whitespace-nowrap">
              {t.nav.getQuote}
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-3">
            <button 
              onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
              className="flex items-center justify-center min-w-[40px] px-2.5 py-1.5 rounded-xl bg-blue-600 text-white font-black text-xs tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
            >
              {lang === 'en' ? 'FR' : 'EN'}
            </button>
            <button className="p-1 text-slate-600" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 md:hidden flex justify-end"
          >
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <a href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate("/"); }} className="hover:opacity-80 transition-opacity active:scale-95 duration-200">
                  <Logo lang={lang} />
                </a>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex flex-col gap-6 text-lg font-bold text-slate-800 uppercase tracking-wide">
                {['about', 'services', 'portfolio', 'reviews'].map((item) => (
                  <a 
                    key={item} 
                    href={`#${item}`} 
                    onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, item); }}
                  >
                    {t.nav[item as keyof typeof t.nav]}
                  </a>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 flex gap-2">
                <button onClick={() => { setLang('en'); setMobileMenuOpen(false); }} className={`flex-1 py-3 rounded-lg font-bold tracking-wide ${lang === 'en' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-slate-50 text-slate-600'}`}>ENGLISH</button>
                <button onClick={() => { setLang('fr'); setMobileMenuOpen(false); }} className={`flex-1 py-3 rounded-lg font-bold tracking-wide ${lang === 'fr' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-slate-50 text-slate-600'}`}>FRANÇAIS</button>
              </div>

              <a href="#contact" onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, "contact"); }} className="mt-auto bg-blue-600 text-white text-center py-4 rounded-xl font-bold uppercase tracking-wider">
                {t.nav.getQuote}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {currentPath === "/portfolio" ? (
        /* Portfolio Subpage */
        <main className="pt-32 pb-24 px-6 min-h-[70vh] bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-300/20 to-blue-500/5 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-slate-200/40 to-blue-200/10 rounded-full blur-3xl opacity-60 translate-y-1/4 -translate-x-1/4 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header / Intro */}
            <div className="text-center mb-16">
              <ShinyText 
                text={t.nav.portfolio} 
                className="text-xs font-black uppercase tracking-[0.2em] mb-4 block" 
                color="#2563eb" 
                shineColor="#93c5fd" 
              />
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                {t.transformation.title}
              </h1>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
                {t.transformation.subtitle}
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {CATEGORIES.map((cat) => {
                const label = t.portfolio.categories[cat] || cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-200 border cursor-pointer active:scale-95 ${
                      activeCategory === cat
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/25 animate-none"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Grid of Cards with AnimatePresence */}
            {(() => {
              const filteredProjects = activeCategory === "All"
                ? ALL_PROJECTS
                : ALL_PROJECTS.filter(p => p.category === activeCategory);

              if (filteredProjects.length === 0) {
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="text-center py-20 bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 max-w-md mx-auto shadow-sm"
                  >
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <Paintbrush size={32} />
                    </div>
                    <p className="text-slate-600 font-bold uppercase tracking-wider text-xs">{t.portfolio.emptyState}</p>
                  </motion.div>
                );
              }

              return (
                <motion.div 
                  layout 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                      <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <BeforeAfterCard
                          id={project.id}
                          src={project.src}
                          category={project.category}
                          label={project.label}
                          lang={lang}
                          onClick={() => setLightboxProject(project)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              );
            })()}
          </div>
        </main>
      ) : (
        /* Homepage Content */
        <>
          {/* Hero Section (Split Layout) */}
          <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-300/30 to-blue-500/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none will-change-transform"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-slate-200/50 to-blue-200/20 rounded-full blur-3xl opacity-60 translate-y-1/4 -translate-x-1/4 pointer-events-none will-change-transform"></div>
            
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
              <div className="lg:w-1/2 relative text-center lg:text-left">
                <motion.div 
                  initial={{ opacity: 0, y: isMobile ? 30 : 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block px-4 py-1.5 bg-blue-100/50 text-blue-700 font-bold text-xs uppercase tracking-widest rounded-full mb-6 border border-blue-200 backdrop-blur-sm will-change-transform"
                >
                  {t.hero.badge}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: isMobile ? 40 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="will-change-transform"
                >
                  <h1>
                    <ShinyText
                      text={t.hero.title}
                      disabled={false}
                      speed={3}
                      className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 block"
                      color="#0f172a"
                      shineColor="#2563eb"
                    />
                  </h1>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: isMobile ? 30 : 0 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
                  className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium will-change-transform"
                >
                  {t.hero.subtitle}
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: isMobile ? 40 : 0 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
                  className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start will-change-transform"
                >
                  <a href="#contact" onClick={(e) => handleNavClick(e, "contact")} className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-xl shadow-blue-600/20 text-center flex items-center justify-center gap-2">
                    {t.hero.cta} <ArrowRight size={18} />
                  </a>
                  <a href="tel:5144637097" className="w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-800 font-bold rounded-xl hover:bg-white transition-colors border-2 border-slate-200 text-center flex items-center justify-center gap-2 flex-shrink-0">
                    <Phone size={18} className="text-blue-600" /> 514 463 7097
                  </a>
                </motion.div>
              </div>
              
              <div className="lg:w-1/2 relative w-full max-w-lg mx-auto lg:max-w-none">
                <motion.div 
                  initial={{ opacity: 0, y: 60, scale: 0.9, rotateY: 5 }} 
                  animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }} 
                  transition={{ 
                    delay: 0.2, 
                    duration: 1.2, 
                    ease: [0.16, 1, 0.3, 1] 
                  }} 
                  className="relative z-10 w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(37,99,235,0.25)] flex-shrink-0"
                >
                  <img src="/media/hero.jpg" alt={lang === 'en' ? 'Professional painter Manny Painter serving Montreal, Pierrefonds and Laval' : 'Manny Painter – peintre professionnel à Montréal, Pierrefonds et Laval'} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 to-transparent"></div>
                  
                  <motion.div 
                     initial={{ opacity: 0, y: 30, scale: 0.8 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     transition={{ delay: 0.6, type: "spring", damping: 15 }}
                     className="absolute right-4 bottom-4 md:right-8 md:bottom-8 bg-white/90 backdrop-blur-md p-4 md:p-5 rounded-[1.5rem] shadow-2xl border border-white/50 z-20 max-w-[200px]"
                  >
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
                            <span className="font-black text-xl">15+</span>
                         </div>
                         <div>
                           <div className="font-black text-slate-800 text-sm leading-tight tracking-tight uppercase">
                             {lang === 'fr' ? 'Années' : 'Years'}
                           </div>
                           <div className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">
                             {lang === 'fr' ? "D'expérience" : "Of Experience"}
                           </div>
                         </div>
                      </div>
                  </motion.div>
                </motion.div>
                
                {/* Decals */}
                <motion.div 
                   animate={{ 
                     y: [0, -15, 0],
                     rotate: [0, 2, 0]
                   }}
                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute -bottom-6 -left-6 w-3/4 h-3/4 bg-blue-100/50 rounded-[2rem] -z-10 blur-sm"
                ></motion.div>
              </div>
            </div>
          </section>

          {/* About Section - Storytelling */}
          <section id="about" className="py-24 bg-white px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <ShinyText 
                    text={t.nav.about} 
                    className="text-xs font-black uppercase tracking-[0.2em] mb-4 block" 
                    color="#2563eb" 
                    shineColor="#93c5fd" 
                  />
                </div>

              <div className="flex flex-col lg:flex-row gap-16 items-center">
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95, x: -30 }} 
                   whileInView={{ opacity: 1, scale: 1, x: 0 }} 
                   transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                   viewport={{ once: true, margin: "-100px" }} 
                   className="relative lg:w-1/2 min-h-[400px] md:min-h-[500px]"
                >
                  <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] translate-x-4 translate-y-4 opacity-5 blur-2xl"></div>
                  <img loading="lazy" decoding="async" src="/media/about.jpg" alt={lang === 'en' ? 'Manny Painter residential painting work in Montreal, Pierrefonds and Laval' : 'Travaux de peinture résidentielle de Manny Painter à Montréal, Pierrefonds et Laval'} className="relative z-10 w-full h-full object-cover rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-2xl transition-all duration-700" />
                  
                  {/* Highlight card popup */}
                  <motion.div 
                     initial={{ opacity: 0, y: 30, scale: 0.8 }}
                     whileInView={{ opacity: 1, y: 0, scale: 1 }}
                     transition={{ delay: 0.6, type: "spring", damping: 15 }}
                     viewport={{ once: true }}
                     className="absolute -right-2 -bottom-6 md:-right-8 md:-bottom-8 bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/50 z-20 max-w-[220px]"
                  >
                      <div className="flex items-center gap-4 mb-3">
                         <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                            <CheckCircle size={24} />
                         </div>
                         <div className="font-black text-3xl text-slate-900 tracking-tighter">100%</div>
                      </div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] leading-relaxed opacity-80">Customer<br/>Satisfaction</p>
                  </motion.div>
                </motion.div>
                
                <div className="lg:w-1/2">
                  <h2>
                    <ShinyText
                      text={lang === 'fr' ? 'Spécialiste' : 'Specialist'}
                      className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight block"
                      color="#0f172a"
                      shineColor="#2563eb"
                    />
                  </h2>
                  <motion.p 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.3, duration: 0.6 }}
                     className="text-slate-600 text-lg leading-relaxed mb-10 pb-6 border-b border-slate-100"
                  >
                    {t.about.desc}
                  </motion.p>
                  
                  <motion.div 
                     initial="hidden"
                     whileInView="visible"
                     viewport={{ once: true }}
                     variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } }, hidden: {} }}
                     className="grid sm:grid-cols-2 gap-6"
                  >
                    {t.about.points.map((point: string, idx: number) => (
                      <motion.div 
                         key={idx} 
                         variants={{ 
                           hidden: { opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? 30 : 0 }, 
                           visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } 
                         }}
                         className="flex items-start gap-4 group will-change-transform"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-colors rounded-xl flex items-center justify-center text-blue-600 mt-1">
                           <CheckCircle size={18} />
                        </div>
                        <span className="text-slate-700 font-medium leading-relaxed">{point}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section id="services" className="py-32 bg-slate-900 text-white px-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700 via-transparent to-transparent"></div>
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-20">
                <ShinyText 
                  text={t.nav.services} 
                  className="text-xs font-black uppercase tracking-[0.2em] mb-4 block" 
                  color="#3b82f6" 
                  shineColor="#93c5fd" 
                />
                <h2 className="flex justify-center items-center gap-4 flex-wrap">
                  <ShinyText
                    text={lang === 'fr' ? 'Spécialité' : 'Speciality'}
                    className="text-4xl md:text-5xl font-extrabold tracking-tight"
                    color="#60a5fa"
                    shineColor="#ffffff"
                  />
                  <span className="text-4xl md:text-5xl font-extrabold text-blue-500/50">/</span>
                  <ShinyText
                    text={t.services.title}
                    className="text-4xl md:text-5xl font-extrabold tracking-tight"
                    color="#ffffff"
                    shineColor="#60a5fa"
                  />
                </h2>
                <motion.p initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-slate-400 max-w-2xl mx-auto text-xl mt-6">{t.services.subtitle}</motion.p>
              </div>

              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{ 
                  visible: { transition: { staggerChildren: 0.15 } }, 
                  hidden: {} 
                }}
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {t.services.items.map((service: any, idx: number) => {
                  const icons = [<SprayCan size={32} />, <Home size={32} />, <Paintbrush size={32} />, <Hammer size={32} />];
                  return (
                    <motion.div 
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, y: isMobile ? 50 : 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                      }}
                      className="bg-slate-800/80 backdrop-blur-sm border border-white/5 p-8 rounded-[2rem] hover:bg-slate-800 transition-all group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(37,99,235,0.15)] overflow-hidden relative will-change-transform"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -translate-y-12 translate-x-12 group-hover:bg-blue-500/20 transition-all"></div>
                      <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                        {icons[idx]}
                      </div>
                      <h3 className="text-xl font-black mb-4 tracking-tight group-hover:text-blue-400 transition-colors">{service.title}</h3>
                      <p className="text-slate-400 leading-relaxed text-sm font-medium">{service.desc}</p>
                    </motion.div>
                  );
                })}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20 flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-[2.5rem] p-10 md:p-14 shadow-[0_30px_60px_-10px_rgba(37,99,235,0.3)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
                <h3 className="text-2xl md:text-3xl font-black mb-6 md:mb-0 max-w-lg text-center md:text-left text-white tracking-tight relative z-10">{t.services.cta.title}</h3>
                <a href="#contact" onClick={(e) => handleNavClick(e, "contact")} className="px-10 py-5 bg-white text-blue-700 font-black rounded-2xl hover:bg-slate-50 transition-all w-full md:w-auto text-center shadow-xl uppercase tracking-[0.2em] relative z-10 hover:-translate-y-1 active:translate-y-0 text-sm">
                  {t.services.cta.button}
                </a>
              </motion.div>
            </div>
          </section>

          {/* Service Areas */}
          <section id="service-areas" className="py-20 bg-white px-6">
            <div className="max-w-7xl mx-auto text-center">
              <ShinyText
                text={lang === 'fr' ? 'Zones Desservies' : 'Service Areas'}
                className="text-xs font-black uppercase tracking-[0.2em] mb-4 block"
                color="#2563eb"
                shineColor="#93c5fd"
              />
              <h2>
                <ShinyText
                  text={t.serviceAreas.title}
                  className="text-3xl md:text-4xl font-extrabold mb-4 block"
                  color="#0f172a"
                  shineColor="#2563eb"
                />
              </h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-slate-600 max-w-2xl mx-auto mb-12 text-lg"
              >
                {t.serviceAreas.subtitle}
              </motion.p>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: {} }}
                className="flex flex-wrap justify-center gap-3"
              >
                {t.serviceAreas.areas.map((area: string) => (
                  <motion.div
                    key={area}
                    variants={{
                      hidden: { opacity: 0, scale: 0.9, y: 10 },
                      visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } }
                    }}
                    className="flex items-center gap-2 bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 text-blue-700 font-bold px-5 py-3 rounded-xl text-sm transition-all cursor-default"
                  >
                    <MapPin size={14} className="text-blue-500 shrink-0" />
                    <span>{area}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Homepage Section (TransformationSection) */}
          <section id="portfolio" className="py-32 bg-slate-50 px-6">
            <div className="max-w-7xl mx-auto text-center">
              <div className="text-center mb-16">
                <ShinyText 
                  text={t.nav.portfolio} 
                  className="text-xs font-black uppercase tracking-[0.2em] mb-4 block" 
                  color="#2563eb" 
                  shineColor="#93c5fd" 
                />
                <h2>
                  <ShinyText
                    text={t.transformation.title}
                    className="text-4xl md:text-5xl font-extrabold mb-4 block"
                    color="#0f172a"
                    shineColor="#2563eb"
                  />
                </h2>
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-slate-600 text-lg max-w-2xl mx-auto">
                  {t.transformation.subtitle}
                </motion.p>
              </div>

              {/* 3 Featured Jobs in a 3-column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                {ALL_PROJECTS.slice(0, 3).map((project, idx) => (
                  <motion.div
                    key={project.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={idx}
                    variants={cardVariants}
                  >
                    <BeforeAfterCard
                      id={project.id}
                      src={project.src}
                      category={project.category}
                      label={project.label}
                      lang={lang}
                      onClick={() => setLightboxProject(project)}
                    />
                  </motion.div>
                ))}
              </div>

              {/* View All Projects Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={() => navigate("/portfolio")}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 duration-200 mt-12 cursor-pointer"
                >
                  {t.portfolio.viewAll} <ArrowRight size={18} />
                </button>
              </motion.div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="reviews" className="py-24 bg-slate-50 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <div className="flex flex-col items-center justify-center">
                  <ShinyText 
                    text={lang === 'fr' ? 'Témoignage' : 'Testimonial'} 
                    className="text-xs font-black uppercase tracking-[0.2em] block" 
                    color="#2563eb" 
                    shineColor="#93c5fd" 
                  />
                  <br />
                  <br />
                  <h2>
                    <ShinyText
                      text={t.testimonials.title}
                      className="text-4xl md:text-6xl font-black tracking-tighter block"
                      color="#0f172a"
                      shineColor="#2563eb"
                    />
                  </h2>
                </div>

                <motion.p 
                  initial={{ opacity: 0, y: 10 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: 0.3 }} 
                  className="text-slate-500 max-w-2xl mx-auto text-xl font-medium mt-8"
                >
                  {t.testimonials.subtitle}
                </motion.p>
              </div>

              <div 
                 className="relative h-[600px] md:h-[800px] overflow-hidden" 
                 style={{ 
                   WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)', 
                   maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' 
                 }}
              >
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
                   {[
                     { speed: 'animate-marquee-vertical', offset: 0 },
                     { speed: 'animate-marquee-vertical-slow', offset: 1 },
                     { speed: 'animate-marquee-vertical-fast', offset: 2 }
                   ].map((col, cIdx) => {
                     const colReviews = [
                       ...t.testimonials.items.slice(col.offset), 
                       ...t.testimonials.items.slice(0, col.offset)
                     ];
                     const repeatedReviews = [...colReviews, ...colReviews];
                     
                     return (
                       <div key={cIdx} className={`h-max ${cIdx === 1 ? 'hidden md:block' : ''} ${cIdx === 2 ? 'hidden lg:block' : ''}`}>
                         <div
                           className={`flex flex-col gap-6 marquee-track will-change-transform ${col.speed}`}
                         >
                           {repeatedReviews.map((review: any, idx: number) => (
                               <div 
                                 key={idx}
                                 className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-[2.5rem] relative border border-slate-200/50 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group"
                               >
                                 <div className="absolute top-8 right-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-500">
                                   <Quote size={60} className="text-blue-600" />
                                 </div>
                                 <div className="flex gap-1 mb-8 text-yellow-400">
                                   {[1,2,3,4,5].map(star => <Star key={star} size={18} fill="currentColor" />)}
                                 </div>
                                 <p className="text-slate-700 mb-8 font-semibold text-lg relative z-10 leading-relaxed min-h-[100px] tracking-tight italic">"{review.text}"</p>
                                 <div className="flex items-center gap-4 pt-8 border-t border-slate-100/50">
                                   <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center text-blue-700 font-black text-xl shadow-inner group-hover:scale-105 transition-transform duration-500 capitalize">
                                     {review.name.charAt(0)}
                                   </div>
                                   <div>
                                     <p className="font-black text-slate-900 tracking-tight">{review.name}</p>
                                     <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] opacity-70">{review.role}</p>
                                   </div>
                                 </div>
                               </div>
                           ))}
                         </div>
                       </div>
                     )
                   })}
                 </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="bg-slate-50 border-y border-slate-200 relative overflow-hidden group/main py-24 lg:py-32">
            {/* Background Images with Fade */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-10">
              <div className="grid grid-cols-4 md:grid-cols-6 grid-rows-3 md:grid-rows-4 h-full transform scale-110">
                {Array.from({ length: 24 }).map((_, i) => {
                  const images = ["/media/work 5.png", "/media/work2.png", "/media/work3.png"];
                  const img = images[i % 3];
                  return (
                    <div key={i} className="relative group/item">
                      <img loading="lazy" decoding="async" src={img} alt="" className="w-full h-full object-cover transition-opacity duration-500 opacity-20 group-hover/main:opacity-10 will-change-[opacity]" />
                      <img loading="lazy" decoding="async" src={img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 will-change-[opacity]" />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="max-w-3xl mx-auto relative z-10 px-6">
              <div className="text-center mb-10">
                <h2>
                  <ShinyText
                    text={t.contact.title}
                    className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight block"
                    color="#0f172a"
                    shineColor="#2563eb"
                  />
                </h2>
                <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-slate-600 text-lg">{t.contact.subtitle}</motion.p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-white/50 relative overflow-hidden group/form">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-50 group-hover/form:scale-110 transition-transform duration-1000"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-slate-500/10 rounded-full blur-3xl opacity-50 group-hover/form:scale-110 transition-transform duration-1000"></div>
                <ContactForm t={t} />
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-6 border-t border-slate-900 relative z-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Logo Row */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            className="mb-16 opacity-90 hover:opacity-100 transition-all inline-block hover:opacity-80 active:scale-95 cursor-pointer"
          >
            <Logo isDark={true} lang={lang} size="large" />
          </a>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            {/* Description Info */}
            <div className="flex flex-col items-start gap-6">
              <p className="text-sm md:text-base leading-relaxed max-w-sm">{t.footer.desc}</p>
            </div>

            {/* Contact Details */}
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Contact</h4>
              <div className="space-y-4 text-sm font-medium">
                <p className="flex items-center gap-3"><Phone size={16} className="text-blue-500" /> {t.contact.info.phone}</p>
                <p className="flex items-center gap-3"><Mail size={16} className="text-blue-500" /> {t.contact.info.email}</p>
                <p className="flex items-center gap-3"><MapPin size={16} className="text-blue-500" /> {t.location?.serving || t.contact.info.location}</p>
              </div>
            </div>

            {/* Hours */}
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">{t.location?.title || "Hours"}</h4>
              <div className="space-y-3 text-sm font-medium">
                <div className="flex justify-between max-w-[220px]">
                  <span className="text-slate-500">{t.location?.days?.mon || "Mon"} - {t.location?.days?.fri || "Fri"}</span>
                  <span className="text-slate-300">{t.location?.hours?.weekdays || "8:00 AM - 6:00 PM"}</span>
                </div>
                <div className="flex justify-between max-w-[220px]">
                  <span className="text-slate-500">{t.location?.days?.sat || "Sat"}</span>
                  <span className="text-slate-300">{t.location?.hours?.saturday || "8:00 AM - 3:00 PM"}</span>
                </div>
                <div className="flex justify-between max-w-[220px]">
                  <span className="text-slate-500">{t.location?.days?.sun || "Sun"}</span>
                  <span className="text-slate-500">{t.location?.hours?.closed || "Closed"}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 text-sm flex flex-col md:flex-row items-center justify-between gap-4 relative">
          <p className="text-slate-500 text-xs md:text-sm text-center md:text-left order-2 md:order-1">
            {t.footer.rights}
          </p>
          <div className="flex justify-center items-center order-1 md:order-2 md:absolute md:left-1/2 md:-translate-x-1/2">
            <a 
              href="https://www.ysdev.ca" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ys-signature-btn"
            >
              <img 
                src="/YS.png" 
                alt="YS Logo" 
                className="ys-sig-logo" 
              />
              <span className="ys-sig-text">
                Made by <strong className="ys-sig-highlight">YS Marketing Solutions</strong> <span className="ys-sig-divider">|</span> Marketing Agency
              </span>
            </a>
          </div>
        </div>
      </footer>
      
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          >
            <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-white hover:text-red-400 p-2 transition-colors">
              <X size={36} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              src={selectedImage} 
              alt="Project" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Before/After Lightbox Modal */}
      <AnimatePresence>
        {lightboxProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxProject(null)}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-pointer"
          >
            <button
              onClick={() => setLightboxProject(null)}
              className="absolute top-6 right-6 text-white hover:text-red-400 p-2.5 transition-colors cursor-pointer bg-white/10 hover:bg-white/20 rounded-full z-[110]"
            >
              <X size={28} />
            </button>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-4xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <BeforeAfterCard
                id={lightboxProject.id}
                src={lightboxProject.src}
                category={lightboxProject.category}
                label={lightboxProject.label}
                lang={lang}
                className="w-full shadow-2xl"
                isLightbox={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating CTA */}
      <AnimatePresence>
        {isScrolled && (
          <motion.a 
            href="#contact"
            onClick={(e) => handleNavClick(e, "contact")}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <motion.div 
              animate={{ 
                width: (isCtaOpen || !isMobile) ? 'auto' : '56px',
                borderRadius: (isCtaOpen || !isMobile) ? '1rem' : '1.25rem'
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-blue-600 text-white h-14 shadow-2xl shadow-blue-600/40 flex items-center gap-3 group border border-blue-500/50 overflow-hidden px-4"
            >
              <div className="relative shrink-0">
                <Paintbrush size={24} className="group-hover:rotate-12 transition-transform" />
                <motion.span 
                   animate={{ scale: [1, 1.5, 1] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-400 border-2 border-blue-600 rounded-full"
                ></motion.span>
              </div>
              
              <AnimatePresence mode="wait">
                {(isCtaOpen || !isMobile) && (
                  <motion.span 
                    key="cta-text"
                    initial={{ opacity: 0, width: 0, x: -10 }}
                    animate={{ opacity: 1, width: 'auto', x: 0 }}
                    exit={{ opacity: 0, width: 0, x: -10 }}
                    className="leading-none whitespace-nowrap tracking-wide uppercase text-xs font-black"
                  >
                    {t.nav.getQuote}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.a>
        )}
      </AnimatePresence>
      
    </div>
  );
}

// Extracted form logic to keep App clean
function ContactForm({ t }: { t: any }) {
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', city: '', service: '', details: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('https://hook.us2.make.com/qu71fl6al0vj91l5522j8rkhp8bar4rm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ fullName: '', phone: '', email: '', city: '', service: '', details: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-16 h-full flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} />
        </div>
        <h3 className="text-3xl font-bold text-slate-900 mb-4">{t.contact.form.success.title}</h3>
        <p className="text-slate-600 mb-8 text-lg">{t.contact.form.success.desc}</p>
        <button onClick={() => setStatus('idle')} className="text-blue-600 font-bold hover:text-blue-700 tracking-wide uppercase">
          {t.contact.form.success.button}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8 relative z-10">
      <div className="grid md:grid-cols-2 gap-4 md:gap-8">
        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">{t.contact.form.name}</label>
          <input required type="text" placeholder="Jean Francois" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all outline-none font-bold placeholder:text-slate-300 shadow-sm" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">{t.contact.form.phone}</label>
          <input required type="tel" placeholder="(514) 622-1599" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all outline-none font-bold placeholder:text-slate-300 shadow-sm" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 md:gap-8">
        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">{t.contact.form.email}</label>
          <input required type="email" placeholder="jean@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all outline-none font-bold placeholder:text-slate-300 shadow-sm" />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">{t.contact.form.city || "City *"}</label>
          <input required type="text" placeholder="Montreal" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all outline-none font-bold placeholder:text-slate-300 shadow-sm" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">{t.contact.form.serviceLabel}</label>
        <select required value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all outline-none cursor-pointer font-bold appearance-none shadow-sm">
          <option value="" disabled>{t.contact.form.servicePlaceholder}</option>
          {t.contact.services.map((s: string, i: number) => <option key={i} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">{t.contact.form.details}</label>
        <textarea rows={4} placeholder={t.contact.form.detailsPlaceholder || "Rough square footage, timeline..."} value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all outline-none resize-none font-bold placeholder:text-slate-300 shadow-sm" />
      </div>
      {status === 'error' && <p className="text-red-500 text-xs font-black uppercase tracking-widest text-center">{t.contact.form.error}</p>}
      <button disabled={status === 'loading'} className="w-full bg-blue-600 text-white font-black uppercase tracking-[0.2em] py-5 rounded-[1.25rem] hover:bg-blue-700 transition-all flex items-center justify-center gap-3 mt-6 shadow-[0_20px_40px_rgba(37,99,235,0.25)] disabled:opacity-70 group/btn transform hover:-translate-y-1 active:translate-y-0 text-sm">
        {status === 'loading' ? t.contact.form.sending : t.contact.form.submit} 
        <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
      <div className="flex items-center justify-center gap-2 mt-8 text-xs text-slate-400 font-bold uppercase tracking-wider">
        <ShieldCheck size={16} className="text-blue-500" />
        <span>{t.contact.form.secure}</span>
      </div>
    </form>
  );
}
