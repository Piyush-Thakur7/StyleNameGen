'use client';

import React, { useState, useEffect, useRef } from 'react';
import { INVISIBLE_CHARS } from '../lib/invisibleChars';

export default function InvisibleCharTool() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [word1, setWord1] = useState('DARK');
  const [word2, setWord2] = useState('SOUL');
  const [selectedCharId, setSelectedCharId] = useState('hangul-filler');
  const [isCombinedCopied, setIsCombinedCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleCopy = async (text: string, id: string, isCombined: boolean = false) => {
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

      if (isCombined) {
        setIsCombinedCopied(true);
        setTimeout(() => setIsCombinedCopied(false), 1500);
      } else {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
      }
      triggerToast('Copied to Clipboard! 📋');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to copy. Copy manually.');
    }
  };

  const selectedCharObj = INVISIBLE_CHARS.find(c => c.id === selectedCharId) || INVISIBLE_CHARS[0];
  const combinedResult = `${word1}${selectedCharObj.char}${word2}`;
  
  const combinedLength = Array.from(combinedResult).length;

  return (
    <div className="w-full space-y-10">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl transition-all duration-300 dark:bg-slate-100 dark:text-slate-950 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Explainer Section */}
      <div className="gaming-card rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 to-blue-500" />
        <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-4 flex items-center space-x-2">
          <span>❓ WHY DO MOBILE GAMES BLOCK STANDARD SPACES?</span>
        </h2>
        <div className="text-sm text-slate-500 dark:text-slate-400 space-y-3 leading-relaxed">
          <p>
            Standard keyboard spaces are automatically removed by games like <span className="font-bold text-orange-500">Free Fire</span> and <span className="font-bold text-amber-500">BGMI</span> to enforce character boundaries and prevent blank username exploits. 
          </p>
          <p>
            By using special <span className="font-bold text-violet-500 dark:text-violet-400">Unicode spacing codes</span>, you can bypass these spacebar filters. These characters represent blank glyphs that are recognized by games as alphabetical letters, resulting in an invisible spacing effect.
          </p>
        </div>
      </div>

      {/* Spacing Creator Widget */}
      <div className="gaming-card rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-500 to-fuchsia-500" />
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6 flex items-center space-x-1.5">
          <span>🛠️ INTERACTIVE INVISIBLE NICKNAME BUILDER</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Word 1 */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">First Segment</label>
                <input
                  type="text"
                  value={word1}
                  onChange={(e) => setWord1(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100"
                />
              </div>

              {/* Word 2 */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Second Segment</label>
                <input
                  type="text"
                  value={word2}
                  onChange={(e) => setWord2(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Spacer Selection */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Invisible Spacer Type</label>
              <select
                value={selectedCharId}
                onChange={(e) => setSelectedCharId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
              >
                {INVISIBLE_CHARS.map((char) => (
                  <option key={char.id} value={char.id}>
                    {char.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sandbox Combined Result Display */}
          <div className="rounded-2xl border border-violet-200 bg-violet-50/15 p-5 dark:border-slate-800 dark:bg-slate-950/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  Interactive Result Sandbox
                </span>
                <span className="text-[11px] font-bold text-slate-550 dark:text-slate-400">
                  Length: <span className="font-extrabold text-violet-500">{combinedLength}</span> characters
                </span>
              </div>
              
              <div 
                onClick={() => handleCopy(combinedResult, 'combined', true)}
                className="rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-4 text-center font-mono text-xl font-bold select-all text-slate-800 dark:text-slate-100 cursor-pointer hover:border-violet-400 dark:hover:border-violet-800 transition-all active:scale-[0.98]"
                title="Tap to copy combined result"
              >
                {combinedResult}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2.5 text-center font-semibold">
                *Copy and paste directly into the in-game profile nickname prompt.
              </p>
            </div>

            <button
              onClick={() => handleCopy(combinedResult, 'combined', true)}
              className={`w-full mt-4 rounded-xl py-3 text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                isCombinedCopied
                  ? 'bg-emerald-500 text-white shadow-emerald-500/10'
                  : 'bg-violet-600 text-white hover:bg-violet-750'
              }`}
            >
              {isCombinedCopied ? '✓ Copied Combined Result' : 'Copy Nickname Code'}
            </button>
          </div>
        </div>
      </div>

      {/* Curated List of Characters */}
      <div className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          📋 CURATED INVISIBLE CHARACTER DIRECTORY
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {INVISIBLE_CHARS.map((char) => {
            const isCopied = copiedId === char.id;
            return (
              <div 
                key={char.id}
                className="gaming-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:scale-[1.005] neon-hover-purple"
              >
                <div className="space-y-3 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                      {char.name}
                    </h3>
                    <span className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-650 dark:bg-slate-800 dark:text-slate-400">
                      {char.unicode}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-505 dark:text-slate-400 leading-relaxed">
                    {char.description}
                  </p>

                  {/* Compatibility notes table */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="block font-black text-orange-500 uppercase tracking-widest text-[9px] mb-0.5">Free Fire Compatibility</span>
                      <span className="text-slate-500 dark:text-slate-400 leading-normal">{char.ffCompatibility}</span>
                    </div>
                    <div>
                      <span className="block font-black text-amber-500 uppercase tracking-widest text-[9px] mb-0.5">BGMI Compatibility</span>
                      <span className="text-slate-500 dark:text-slate-400 leading-normal">{char.bgmiCompatibility}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 justify-center items-stretch md:w-44 flex-shrink-0">
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-2 text-center text-xs font-mono text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
                    Display: <span className="font-bold text-slate-800 dark:text-white bg-slate-200/50 dark:bg-slate-800 rounded px-1.5 py-0.5">{char.char}</span>
                  </div>

                  <button
                    onClick={() => handleCopy(char.char, char.id)}
                    className={`rounded-xl py-2.5 text-xs font-black uppercase tracking-wider transition-all shadow-sm cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-500 text-white shadow-emerald-500/10'
                        : 'bg-violet-600 text-white hover:bg-violet-750'
                    }`}
                  >
                    {isCopied ? '✓ Copied' : 'Copy Space Code'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
