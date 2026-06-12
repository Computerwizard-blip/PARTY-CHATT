import React, { useState } from 'react';
import { Sparkles, Check, Gift } from 'lucide-react';
import { AppLanguage } from '../types';

interface DailyCheckInProps {
  language: AppLanguage;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  checkedInDays: number[];
  setCheckedInDays: React.Dispatch<React.SetStateAction<number[]>>;
  onClose: () => void;
}

export default function DailyCheckIn({
  language,
  setCoins,
  checkedInDays,
  setCheckedInDays,
  onClose
}: DailyCheckInProps) {
  const [justCheckedInIndex, setJustCheckedInIndex] = useState<number | null>(null);

  const t = {
    en: {
      title: "Daily Check-in",
      sub: "Check-in for 3 and 7 consecutive days to get massive bonus rewards!",
      btn: "Sign In",
      btnClaimed: "Claimed Today",
      day: "Day",
      rewardAlert: "Checked in successfully! Claimed +{coins} free coins! 🎁💰"
    },
    sw: {
      title: "Kuingia Kila Siku",
      sub: "Ingia kwa siku 3 na 7 mfululizo ili kupata tuzo kubwa za ziada!",
      btn: "Ingia Sasa",
      btnClaimed: "Umedai Leo",
      day: "Siku ya",
      rewardAlert: "Umeingia kwa mafanikio! Umedai sarafu za bure +{coins}! 🎁💰"
    }
  }[language];

  // Coins awarded for each of the 7 days (matching the screen: 5, 8, 10, 7, 7, 10, 15)
  const rewards = [5, 8, 10, 7, 7, 10, 15];

  // Assume today is Day index (from 1 to 7). Let's say Day 1 is the default start
  const currentDayIndex = 1; // can check-in on first day not claimed yet

  const handleSignIn = () => {
    // Find first day that isn't checked in
    const nextUnclaimedDay = [1, 2, 3, 4, 5, 6, 7].find(d => !checkedInDays.includes(d));
    if (!nextUnclaimedDay) {
      alert("You have already checked in for all 7 days!");
      return;
    }

    const coinReward = rewards[nextUnclaimedDay - 1];
    
    // Add day to claimed list
    setCheckedInDays(prev => [...prev, nextUnclaimedDay]);
    setCoins(prev => prev + coinReward);
    setJustCheckedInIndex(nextUnclaimedDay);

    // Cute delay modal feedback
    setTimeout(() => {
      alert(t.rewardAlert.replace('{coins}', coinReward.toString()));
      setJustCheckedInIndex(null);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-5 z-50 animate-fade-in">
      <div className="bg-zinc-900 border-4 border-black p-6 rounded-[32px] max-w-sm w-full text-center shadow-[8px_8px_0px_0px_#facc15] relative flex flex-col items-center">
        
        {/* Cute Close Top Corner button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white font-black text-xl bg-black border border-zinc-805 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
        >
          ×
        </button>

        {/* Calendar visual icon */}
        <div className="w-14 h-14 bg-yellow-400 rounded-2xl border-3 border-black flex items-center justify-center shadow-[3px_3px_0_0_rgba(0,0,0,1)] text-2xl font-black text-black transform -rotate-6 animate-pulse mt-2 mb-3">
          📅
        </div>

        <h3 className="text-2xl font-black text-white leading-none tracking-tight">
          🔥 {t.title}
        </h3>
        
        <p className="text-zinc-400 text-[11px] font-semibold leading-relaxed mt-2 mb-6 px-2">
          {t.sub}
        </p>

        {/* 7 Days reward layout (matching Soyo screen check-in matrix) */}
        <div className="grid grid-cols-4 gap-2 w-full mb-6">
          {[1, 2, 3, 4, 5, 6, 7].map(d => {
            const isClaimed = checkedInDays.includes(d);
            const isJustClaimed = justCheckedInIndex === d;
            const value = rewards[d - 1];

            return (
              <div
                key={d}
                className={`border-2 p-2 rounded-2xl flex flex-col items-center justify-center transition-all select-none relative ${
                  isClaimed 
                    ? 'bg-yellow-405/20 border-yellow-400 text-yellow-400 shadow-[inset_0_0_8px_rgba(250,204,21,0.15)]' 
                    : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                } ${d === 7 ? 'col-span-2 bg-gradient-to-r from-purple-900/40 to-yellow-500/10' : ''}`}
              >
                <span className="text-[10px] font-black uppercase text-zinc-400">
                  {t.day} {d}
                </span>

                {/* Coin item visual */}
                <span className="text-base my-1">💛</span>

                <span className="text-xs font-black">
                  +{value}
                </span>

                {/* Checked overlays */}
                {isClaimed && (
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                    <Check className="w-5 h-5 text-yellow-400 stroke-[4]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Trigger confirmation */}
        <button
          onClick={handleSignIn}
          className="w-full bg-yellow-400 hover:bg-yellow-305 text-black font-black py-4 px-6 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgb(0,0,0)] transition-all cursor-pointer text-sm uppercase"
        >
          🎁 {checkedInDays.length >= 7 ? t.btnClaimed : t.btn}
        </button>

        <span className="text-[10px] text-zinc-500 font-bold block mt-3">
          Daily limits reset every midnight UTC
        </span>

      </div>
    </div>
  );
}
