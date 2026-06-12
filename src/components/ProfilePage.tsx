import React, { useState } from 'react';
import { User, Wallet, Sparkles, Languages, RefreshCw, HelpCircle, ShieldAlert, LogOut, ArrowRight, Check, Coins } from 'lucide-react';
import { AppLanguage, CoinPackage } from '../types';
import { coinPackages } from '../data';

interface ProfilePageProps {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  onSignOut: () => void;
  showStoreTabInitially?: boolean;
}

export default function ProfilePage({
  language,
  setLanguage,
  coins,
  setCoins,
  onSignOut,
  showStoreTabInitially = false
}: ProfilePageProps) {
  const [activeSubView, setActiveSubView] = useState<'main' | 'store'>(showStoreTabInitially ? 'store' : 'main');
  const [purchasedPackage, setPurchasedPackage] = useState<string | null>(null);

  const t = {
    en: {
      profile: "Personal Center",
      username: "Francis Ndungu",
      accId: "ID: 388037431",
      vipBadge: "VIP/SVIP Club",
      friends: "Friends",
      following: "Following",
      followers: "Followers",
      visitors: "Visitors",
      balance: "Wallet Balance",
      store: "Coins Store",
      options: "Settings & Options",
      buyBtn: "Buy Package",
      clearCache: "Clear Application Cache",
      cleared: "Cache successfully cleared! 🚀🧹",
      signOutPrompt: "Sign Out",
      about: "About Party Chatt Lite",
      helpSupport: "Customer Support & Feedback",
      languageName: "Language",
      checkoutTitle: "Virtual Billing Checkout",
      checkoutBody: "You are purchasing {coins} + {bonus} Coins for Ksh {price}. Since this is a dev version, the checkout is virtual and free of cost!",
      confirmPurchase: "Confirm Virtual Top-up",
      purchaseSuccess: "Successfully purchased {amount} Coins! 🥳📲",
      backToMenu: "Back to Settings"
    },
    sw: {
      profile: "Mimi",
      username: "Francis Ndungu",
      accId: "Kitambulisho: 388037431",
      vipBadge: "VIP/SVIP Klabu",
      friends: "Rafiki",
      following: "Inayofuata",
      followers: "Wafuasi",
      visitors: "Wageni",
      balance: "Salio la Pochi",
      store: "Duka la Sarafu",
      options: "Mipangilio",
      buyBtn: "Nunua",
      clearCache: "Futa Cache ya Programu",
      cleared: "Cache imefutwa kwa mafanikio! 🚀🧹",
      signOutPrompt: "Ondoka",
      about: "Kuhusu Party Chatt Lite",
      helpSupport: "Msaada na Maoni",
      languageName: "Lugha",
      checkoutTitle: "Malipo ya Kweli ya Kielektroniki",
      checkoutBody: "Unanunua Sarafu {coins} + {bonus} kwa Ksh {price}. Kwa kuwa hili ni toleo la maendeleo, malipo ni ya kweli na ya bure kabisa!",
      confirmPurchase: "Thibitisha Kujaza",
      purchaseSuccess: "Umefanikiwa kununua Sarafu {amount}! 🥳📲",
      backToMenu: "Rudi kwenye Menyu"
    }
  }[language];

  const handleClearCache = () => {
    alert(t.cleared);
  };

  const handleBuyPackage = (pkg: CoinPackage) => {
    setPurchasedPackage(pkg.id);
    setTimeout(() => {
      setCoins(p => p + pkg.coins + pkg.bonus);
      setPurchasedPackage(null);
      alert(t.purchaseSuccess.replace('{amount}', (pkg.coins + pkg.bonus).toString()));
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 p-4 pb-20 overflow-y-auto">
      
      {/* 1. STORE SUB-VIEW (Buy Coins) */}
      {activeSubView === 'store' ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <h2 className="text-xl font-black text-yellow-400 italic uppercase">
              💰 {t.store}
            </h2>
            <button
              onClick={() => setActiveSubView('main')}
              className="bg-zinc-904 hover:bg-zinc-800 text-zinc-300 font-bold border border-zinc-700 text-xs px-3 py-1.5 rounded-xl cursor-pointer"
            >
              {t.backToMenu}
            </button>
          </div>

          {/* Premium Wallet Display */}
          <div className="bg-yellow-400 border-3 border-black p-5 rounded-3xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between mt-2 select-none">
            <div className="flex items-center gap-3">
              <div className="bg-black text-yellow-400 p-2 rounded-full border border-white">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-black/75 font-black uppercase tracking-widest">{t.balance}</span>
                <span className="text-2xl font-black text-black leading-none">{coins} Coins</span>
              </div>
            </div>
            <Sparkles className="w-7 h-7 text-black animate-pulse" />
          </div>

          <p className="text-zinc-500 text-[11px] font-black uppercase tracking-wider text-center my-2">
            SELECT A VIRTUAL CREDIT COIN PACKAGE
          </p>

          {/* Packages grid */}
          <div className="grid grid-cols-1 gap-4">
            {coinPackages.map(pkg => (
              <div
                key={pkg.id}
                className="bg-zinc-900 border-3 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between relative hover:border-yellow-400 transition-all"
              >
                {pkg.badge && (
                  <span className="absolute -top-2 px-2.5 py-0.5 bg-purple-600 border border-black text-[9px] font-black text-white rounded-full uppercase tracking-wider transform -rotate-1">
                    {pkg.badge}
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <div className="bg-black/35 p-2 rounded-xl text-yellow-400 border border-zinc-800">
                    <Coins className="w-6 h-6 animate-bounce" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-white text-base leading-tight">
                      {pkg.coins} Coins
                    </span>
                    <span className="text-yellow-400 font-black text-[10px] uppercase tracking-wider block mt-0.5">
                      + {pkg.bonus} BONUS FREE
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleBuyPackage(pkg)}
                  disabled={purchasedPackage === pkg.id}
                  className="bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-700 disabled:text-zinc-500 border-2 border-black text-black font-black text-xs px-4 py-2 rounded-xl shadow-[2px_2px_0_0_rgb(0,0,0)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-all"
                >
                  {purchasedPackage === pkg.id ? 'Topup...' : `Ksh ${pkg.priceKsh}.00`}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl text-center text-xs text-zinc-500 font-semibold mt-4">
            🔒 Checkout process is virtual. No real-world funds will be charged. Enjoy free testing coin credit.
          </div>
        </div>
      ) : (
        
        // 2. MAIN ACCOUNT SECTIONS (Francis Ndungu as shown in video!)
        <div className="flex flex-col gap-5">
          
          <div className="border-b border-zinc-900 pb-3">
            <h2 className="text-xl font-black text-white italic tracking-wide uppercase">
              👤 {t.profile}
            </h2>
          </div>

          {/* Header element with User details */}
          <div className="bg-zinc-900 border-3 border-black p-4 rounded-3xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              
              {/* Fake user avatar */}
              <div className="w-14 h-14 bg-yellow-400 border-3 border-black rounded-full flex items-center justify-center text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative select-none">
                <User className="w-8 h-8 font-black" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-600 border border-black text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  VIP
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-base font-black text-white tracking-tight">{t.username}</span>
                <span className="text-[10px] text-zinc-500 font-bold font-mono tracking-wider mt-0.5">
                  {t.accId}
                </span>
                
                {/* Level / Badges line */}
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  <span className="bg-yellow-400 text-black text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase border border-black whitespace-nowrap">
                    Lv. 4 VIP
                  </span>
                  <span className="bg-zinc-850 text-purple-400 text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase border border-zinc-800 whitespace-nowrap">
                    Influencer
                  </span>
                </div>
              </div>
            </div>

            {/* Sparkly action button pointing to VIP store */}
            <div className="bg-amber-400/10 border border-amber-300 text-yellow-400 text-[10px] px-2 py-1 rounded-xl font-black flex items-center gap-1 select-none">
              <span>✨ SVIP</span>
            </div>
          </div>

          {/* Statistics grid matching Soyo Lite (Francis layout: 0 Friends, 0 Following, 0 Followers, 1 Visitors) */}
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { label: t.friends, val: 0, color: 'text-zinc-400' },
              { label: t.following, val: 0, color: 'text-zinc-400' },
              { label: t.followers, val: 0, color: 'text-zinc-400' },
              { label: t.visitors, val: 1, color: 'text-yellow-400 animate-pulse' }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-zinc-900 border-2 border-black p-2.5 rounded-2xl text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center select-none"
              >
                <span className={`text-base font-black ${stat.color}`}>{stat.val}</span>
                <span className="text-[9px] text-zinc-500 font-black uppercase mt-0.5 truncate leading-none">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Wallet overview strip */}
          <div 
            onClick={() => setActiveSubView('store')}
            className="bg-purple-600 hover:bg-purple-700 border-3 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between cursor-pointer transition-all select-none group"
          >
            <div className="flex items-center gap-2.5">
              <Coins className="w-5 h-5 text-yellow-400 animate-bounce" />
              <div className="flex flex-col">
                <span className="text-white font-black text-sm tracking-wide">{t.balance}</span>
                <span className="text-yellow-300 font-extrabold text-xs">{coins} Coins Available</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-zinc-300 bg-black/35 px-2 py-0.5 rounded-full font-bold group-hover:scale-105 transition-all">
                {t.store}
              </span>
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Core settings links list */}
          <div className="flex flex-col gap-2.5 mt-2">
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest pl-1">
              {t.options}
            </span>

            {/* Language Selection switch */}
            <div 
              onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
              className="bg-zinc-900 hover:bg-zinc-850 border-2 border-black p-3.5 rounded-2xl flex items-center justify-between cursor-pointer shadow-[2px_2px_0_0_rgb(0,0,0)] active:translate-x-[1px] active:translate-y-[1px] transition-all"
            >
              <div className="flex items-center gap-3">
                <Languages className="w-4.5 h-4.5 text-zinc-400" />
                <span className="text-xs font-black text-white">{t.languageName}</span>
              </div>
              <span className="text-xs font-black text-yellow-400 uppercase tracking-widest bg-black px-2 py-0.5 rounded border border-zinc-800">
                {language === 'en' ? 'English' : 'Swahili'}
              </span>
            </div>

            {/* Clear cache */}
            <div 
              onClick={handleClearCache}
              className="bg-zinc-900 hover:bg-zinc-850 border-2 border-black p-3.5 rounded-2xl flex items-center justify-between cursor-pointer shadow-[2px_2px_0_0_rgb(0,0,0)] active:translate-x-[1px] active:translate-y-[1px] transition-all"
            >
              <div className="flex items-center gap-3">
                <RefreshCw className="w-4.5 h-4.5 text-zinc-400 animate-spin-slow" />
                <span className="text-xs font-black text-white">{t.clearCache}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-500" />
            </div>

            {/* Help and Support */}
            <div 
              onClick={() => alert("Customer service live is simulated. Submit a feedback draft in our community feeds!")}
              className="bg-zinc-900 hover:bg-zinc-850 border-2 border-black p-3.5 rounded-2xl flex items-center justify-between cursor-pointer shadow-[2px_2px_0_0_rgb(0,0,0)] active:translate-x-[1px] active:translate-y-[1px] transition-all"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4.5 h-4.5 text-zinc-400" />
                <span className="text-xs font-black text-white">{t.helpSupport}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-500" />
            </div>

            {/* About Party Chatt info summary */}
            <div 
              onClick={() => alert("Party Chatt Lite is built in high safety, adhering fully to user terms and regulations. Version 1.0.4")}
              className="bg-zinc-900 hover:bg-zinc-850 border-2 border-black p-3.5 rounded-2xl flex items-center justify-between cursor-pointer shadow-[2px_2px_0_0_rgb(0,0,0)] active:translate-x-[1px] active:translate-y-[1px] transition-all"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4.5 h-4.5 text-zinc-400" />
                <span className="text-xs font-black text-white">{t.about}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-500" />
            </div>

            {/* Sign Out to login triggers */}
            <div 
              onClick={onSignOut}
              className="bg-rose-500/10 hover:bg-rose-550/20 text-rose-500 border-2 border-rose-500 p-3.5 rounded-2xl flex items-center justify-between cursor-pointer shadow-[2px_2px_0_0_rgb(239,68,68)] active:translate-x-[1px] active:translate-y-[1px] transition-all mt-4"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4.5 h-4.5 text-rose-500" />
                <span className="text-xs font-black uppercase tracking-wider">{t.signOutPrompt}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-rose-500" />
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
