'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FONT_STYLES, 
  DECORATION_PRESETS, 
  TEXT_ART_LIBRARY, 
  convertText, 
  DecorationPreset 
} from '../lib/styleMaps';

interface GeneratorProps {
  gameLimit?: number; // Character limit for the game (optional)
  gameName?: string;  // Name of the game (optional)
  theme?: 'purple' | 'orange' | 'gold'; // Page specific theme colors
}

export default function Generator({ gameLimit, gameName, theme = 'purple' }: GeneratorProps) {
  const [inputText, setInputText] = useState('StyleName');
  const [selectedPreset, setSelectedPreset] = useState<DecorationPreset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeArtCategory, setActiveArtCategory] = useState('Cool');
  const [copiedArtIndex, setCopiedArtIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear toast on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const triggerToast = (message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleCopy = async (text: string, id: string, isArt: boolean = false, artIndex?: number) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      if (isArt && artIndex !== undefined) {
        setCopiedArtIndex(artIndex);
        setTimeout(() => setCopiedArtIndex(null), 1500);
      } else {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
      }
      
      triggerToast('Copied to Clipboard! 📋');
    } catch (err) {
      console.error('Failed to copy: ', err);
      triggerToast('Failed to copy. Please select and copy manually.');
    }
  };

  const handleShareWhatsApp = (text: string) => {
    const shareText = encodeURIComponent(`Check out my cool game nickname: ${text}\nGenerate yours at stylename.resence.in!`);
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(inputText)}`;
    handleCopy(url, 'share-link');
    triggerToast('Share link copied to clipboard! 🔗');
  };

  // Check query parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const nameParam = params.get('name');
      if (nameParam) {
        setInputText(nameParam);
      }
    }
  }, []);

  const charLength = Array.from(inputText).length;
  const isOverLimit = gameLimit ? charLength > gameLimit : false;

  // Circular progress calculations
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = gameLimit ? Math.min((charLength / gameLimit) * 100, 100) : 0;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const categories = ['Cool', 'Fire', 'Royal', 'Skull', 'Pro', 'Love'];

  // Theme styling helpers
  const getThemeInputStyles = () => {
    switch (theme) {
      case 'orange':
        return 'focus:border-orange-500 focus:ring-orange-200 dark:focus:border-orange-500 dark:focus:ring-orange-950/40';
      case 'gold':
        return 'focus:border-amber-500 focus:ring-amber-200 dark:focus:border-amber-500 dark:focus:ring-amber-950/40';
      default:
        return 'focus:border-violet-500 focus:ring-violet-200 dark:focus:border-violet-500 dark:focus:ring-violet-950/40';
    }
  };

  const getThemeTextGlow = () => {
    switch (theme) {
      case 'orange': return 'from-orange-500 via-rose-500 to-red-500';
      case 'gold': return 'from-amber-500 via-yellow-500 to-orange-400';
      default: return 'from-violet-500 via-fuchsia-500 to-pink-500';
    }
  };

  const getThemeCardHover = () => {
    switch (theme) {
      case 'orange': return 'neon-hover-orange';
      case 'gold': return 'neon-hover-gold';
      default: return 'neon-hover-purple';
    }
  };

  const getThemeButton = () => {
    switch (theme) {
      case 'orange': return 'bg-orange-600 hover:bg-orange-700';
      case 'gold': return 'bg-amber-500 hover:bg-amber-600';
      default: return 'bg-violet-600 hover:bg-violet-700';
    }
  };

  const getThemeBadge = (active: boolean) => {
    if (active) {
      switch (theme) {
        case 'orange': return 'bg-orange-600 text-white';
        case 'gold': return 'bg-amber-500 text-white';
        default: return 'bg-violet-600 text-white';
      }
    }
    return 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800';
  };

  return (
    <div className="w-full space-y-10">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl transition-all duration-300 dark:bg-slate-100 dark:text-slate-950 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Input Control Panel */}
      <div className="gaming-card rounded-3xl p-6 relative overflow-hidden">
        {/* Glow accent bar at the top */}
        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getThemeTextGlow()}`} />

        <div className="flex flex-col space-y-4">
          <label 
            htmlFor="nickname-input" 
            className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center space-x-1"
          >
            <span>🎮 NICKNAME INPUT PANEL</span>
          </label>
          
          <div className="relative flex items-center">
            <input
              id="nickname-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text..."
              className={`w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-5 py-4 text-xl font-black text-slate-800 placeholder-slate-400 outline-none transition-all dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder-slate-500 ${getThemeInputStyles()}`}
              maxLength={40}
            />
            {inputText && (
              <button
                onClick={() => setInputText('')}
                className="absolute right-4 rounded-full p-2 text-slate-400 hover:bg-slate-200 dark:text-slate-500 dark:hover:bg-slate-800 transition-colors"
                title="Clear input"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Interactive Status & Circular Counter */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
              {gameName ? `${gameName} Optimization Mode` : 'Universal Gaming Fonts'}
            </span>
            
            <div className="flex items-center space-x-3">
              {/* Circular Progress Ring */}
              {gameLimit ? (
                <div className="relative flex items-center justify-center w-11 h-11">
                  <svg className="w-11 h-11 circular-progress">
                    <circle
                      cx="22"
                      cy="22"
                      r={radius}
                      className="stroke-slate-200 dark:stroke-slate-800"
                      strokeWidth="3.5"
                      fill="transparent"
                    />
                    <circle
                      cx="22"
                      cy="22"
                      r={radius}
                      className={`transition-all duration-300 ${
                        isOverLimit 
                          ? 'stroke-rose-500' 
                          : theme === 'orange' 
                          ? 'stroke-orange-500' 
                          : theme === 'gold' 
                          ? 'stroke-amber-500' 
                          : 'stroke-violet-500'
                      }`}
                      strokeWidth="3.5"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <span className={`absolute text-xs font-black ${
                    isOverLimit ? 'text-rose-500 font-black animate-pulse scale-110' : 'text-slate-700 dark:text-slate-350'
                  }`}>
                    {charLength}
                  </span>
                </div>
              ) : (
                <div className="rounded-lg bg-slate-100 dark:bg-slate-900 px-3 py-1.5 font-bold text-slate-500 dark:text-slate-400">
                  Length: {charLength}
                </div>
              )}
              
              {gameLimit && (
                <div className="flex flex-col items-end leading-none">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Limit</span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-350">{gameLimit} Chars</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Symbol Wrappers Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            🛡️ 1. SELECT NICKNAME WRAPPER BANNER
          </h3>
          {selectedPreset && (
            <button
              onClick={() => setSelectedPreset(null)}
              className="text-xs font-bold text-rose-500 hover:underline"
            >
              Clear Banner
            </button>
          )}
        </div>

        {/* Scrollable preset badges */}
        <div className="flex w-full space-x-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          <button
            onClick={() => setSelectedPreset(null)}
            className={`flex-shrink-0 rounded-2xl px-5 py-3 text-xs font-bold border transition-all ${
              selectedPreset === null
                ? 'border-violet-500 bg-violet-50/50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-800'
            }`}
          >
            Plain (No Banner)
          </button>
          
          {DECORATION_PRESETS.map((preset) => {
            const isSelected = selectedPreset?.name === preset.name;
            const preview = `${preset.left}Name${preset.right}`;
            return (
              <button
                key={preset.name}
                onClick={() => setSelectedPreset(preset)}
                className={`flex-shrink-0 rounded-2xl px-5 py-3 text-xs font-bold border transition-all ${
                  isSelected
                    ? 'border-violet-500 bg-violet-50/50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400 shadow-md shadow-violet-500/5'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-350 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-800'
                }`}
              >
                <span className="block font-bold mb-0.5 text-slate-400 dark:text-slate-500 text-[9px] uppercase text-left">{preset.name}</span>
                <span className="text-sm font-black tracking-wide">{preview}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Styled Font Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          ⚔️ 2. GENERATED STYLISH NICKNAMES
        </h3>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FONT_STYLES.map((style) => {
            const coreText = convertText(inputText, style);
            const finalWord = selectedPreset 
              ? `${selectedPreset.left}${coreText}${selectedPreset.right}` 
              : coreText;
            
            const isCopied = copiedId === style.id;

            return (
              <div 
                key={style.id}
                className={`gaming-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:scale-[1.01] ${getThemeCardHover()}`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-black text-slate-500 dark:text-slate-455 uppercase tracking-wider">
                      {style.name}
                    </span>
                    {style.compatibility === 'all' ? (
                      <span className="inline-flex items-center rounded bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-emerald-500">
                        ✓ FF & BGMI
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded bg-amber-500/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-amber-500">
                        ⚠️ Lobby Test
                      </span>
                    )}
                  </div>
                  
                  {/* Share button links */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleShareWhatsApp(finalWord)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-green-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-green-400 transition-colors cursor-pointer"
                      title="Share via WhatsApp"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.729-1.465L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.536 0 10.038-4.502 10.04-10.04.002-2.684-1.038-5.207-2.93-7.101C16.489 1.571 13.974.53 11.29.529c-5.54 0-10.04 4.504-10.04 10.042-.002 1.848.497 3.654 1.445 5.233l-.997 3.642 3.734-.979zm11.752-7.114c-.3-.15-1.77-.874-2.046-.975-.276-.102-.477-.152-.676.15-.199.3-.772.975-.947 1.176-.174.2-.35.226-.65.075-1.204-.6-2.016-1.03-2.825-2.422-.213-.364-.213-.591-.076-.807.137-.215.3-.364.45-.546.15-.182.2-.312.3-.52.1-.208.05-.39-.025-.541-.075-.15-.676-1.63-.926-2.233-.244-.588-.493-.508-.676-.517-.175-.008-.375-.01-.576-.01s-.527.075-.802.375c-.276.3-1.052 1.026-1.052 2.5s1.077 2.902 1.227 3.1c.15.2 2.119 3.235 5.132 4.537 2.109.913 2.914 1.006 3.937.854.67-.1 2.046-.836 2.333-1.646.286-.81.286-1.503.2-1.653-.087-.15-.312-.25-.612-.4z" />
                      </svg>
                    </button>
                    <button
                      onClick={handleShareLink}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      title="Copy sharing link"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.636-2.318m0 0a3 3 0 10-2.222-3.817m2.222 3.817a3 3 0 12-2.222 3.817m0 0l-4.636 2.318m0 0a3 3 0 102.222 3.817m-2.222-3.817a3 3 0 112.222-3.817" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Nickname Preview Area (Full width, scrollable) */}
                <div className="my-4.5 flex-grow">
                  <div className="overflow-x-auto select-all py-1 font-mono text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 scrollbar-none whitespace-nowrap w-full">
                    {finalWord || <span className="text-slate-350 dark:text-slate-800 italic text-sm">Empty</span>}
                  </div>
                </div>

                {/* Full Width Mobile Copy Button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleCopy(finalWord, style.id)}
                    className={`w-full rounded-xl py-3 text-xs font-black uppercase tracking-wider transition-all shadow-sm focus:outline-none cursor-pointer active:scale-97 ${
                      isCopied
                        ? 'bg-emerald-500 text-white shadow-emerald-500/10'
                        : `text-white ${getThemeButton()} active:scale-95 shadow-md shadow-black/5`
                    }`}
                  >
                    {isCopied ? '✓ Copied to Clipboard' : 'Copy Nickname Code'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative Text Art Section */}
      <div className="gaming-card rounded-3xl p-6 relative overflow-hidden">
        {/* Abstract border decor */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${getThemeTextGlow()} opacity-50`} />

        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center space-x-1.5">
                <span>✨ DECORATIVE TEXT ART LIBRARY</span>
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Pre-configured symbol templates and banners. Just click to copy with your nickname inserted.
              </p>
            </div>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveArtCategory(category)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${getThemeBadge(activeArtCategory === category)}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Art list grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {TEXT_ART_LIBRARY
              .filter((art) => art.category === activeArtCategory)
              .map((item, index) => {
                const combinedArt = item.art.replace('[NAME]', inputText || 'Name');
                const isArtCopied = copiedArtIndex === index;

                return (
                  <div
                    key={index}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50 p-4 transition-all hover:border-slate-350 dark:hover:border-slate-800"
                  >
                    <div className="font-mono text-sm font-semibold select-all text-slate-700 dark:text-slate-300 py-3 text-center overflow-x-auto scrollbar-none whitespace-nowrap">
                      {combinedArt}
                    </div>
                    
                    <button
                      onClick={() => handleCopy(combinedArt, `art-${index}`, true, index)}
                      className={`w-full rounded-xl py-2.5 text-xs font-black transition-all cursor-pointer ${
                        isArtCopied
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-750'
                      }`}
                    >
                      {isArtCopied ? '✓ Copied' : 'Copy Art'}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
