import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, Languages, Coins, Bell } from 'lucide-react';
import { AppLanguage } from '../types';

interface HeaderProps {
  coins: number;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  onOpenStore: () => void;
  onOpenCheckIn: () => void;
}

export default function Header({
  coins,
  language,
  setLanguage,
  onOpenStore,
  onOpenCheckIn
}: HeaderProps) {
  const [onlineCounter, setOnlineCounter] = useState(1452);

  // Slowly simulate a changing online counter to make it look alive!
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCounter(prev => {
        const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
        return Math.max(1200, prev + delta);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const t = {
    en: {
      online: "vibein' online",
      store: "Top Up",
      checkIn: "Daily",
    },
    sw: {
      online: "wapo mtandaoni",
      store: "Ongeza",
      checkIn: "Kila Siku",
    }
  };

  const handleLangToggle = () => {
    setLanguage(language === 'en' ? 'sw' : 'en');
  };

  return (
    <header className="sticky top-0 z-40 bg-yellow-400 border-b-4 border-black px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Engaging Brand Styling with comic pop style */}
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl font-black tracking-wider text-black font-sans uppercase drop-shadow-[2px_2px_0px_#ffffff]">
              Party Chatt
            </h1>
            <div className="bg-black text-[10px] text-yellow-400 font-extrabold px-1.5 py-0.5 rounded-full transform rotate-3 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 fill-yellow-400" />
              LITE
            </div>
          </div>
          
          {/* Pulse Status Indicator for Online Users */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-black"></span>
            </span>
            <span className="text-[11px] font-black text-black/85 tracking-tight uppercase font-mono">
              {onlineCounter.toLocaleString()} {t[language].online}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button 
            onClick={handleLangToggle}
            className="bg-black hover:bg-zinc-900 border-2 border-white text-white p-1.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] relative group"
            title="Switch Language / Badili Lugha"
          >
            <Languages className="w-4 h-4" />
            <span className="absolute -bottom-7 right-0 scale-0 group-hover:scale-100 transition-all bg-black text-[9px] text-yellow-400 font-bold px-1.5 py-0.5 rounded border border-yellow-400 whitespace-nowrap">
              {language === 'en' ? 'Swahili' : 'English'}
            </span>
          </button>

          {/* Daily reward check-in icon */}
          <button
            onClick={onOpenCheckIn}
            className="bg-purple-600 hover:bg-purple-700 border-2 border-black text-white px-2 py-1 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] text-xs font-black flex items-center gap-1 cursor-pointer"
          >
            🎁 <span className="hidden xs:inline">{t[language].checkIn}</span>
          </button>

          {/* Sparkly Coins Status Pill */}
          <button 
            onClick={onOpenStore}
            className="bg-black hover:bg-zinc-90 w-fit border-2 border-white text-yellow-400 pl-2 pr-2.5 py-1 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-1.5 cursor-pointer"
            title="Buy Coins"
          >
            <Coins className="w-4 h-4 text-yellow-300 animate-bounce" />
            <span className="text-xs font-black tracking-wide text-white font-mono">
              {coins}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
