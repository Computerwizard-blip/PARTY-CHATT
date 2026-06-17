import React, { useState } from 'react';
import { User, Wallet, Sparkles, Languages, RefreshCw, HelpCircle, ShieldAlert, LogOut, ArrowRight, Check, Coins, Camera, Edit3, X } from 'lucide-react';
import { AppLanguage, CoinPackage, UserProfile } from '../types';
import { coinPackages, mockProfiles } from '../data';
import CameraCapture from './CameraCapture';

interface ProfilePageProps {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  onSignOut: () => void;
  showStoreTabInitially?: boolean;
  currentUser: { name: string; avatar: string; id: string; location?: string; phone?: string };
  setCurrentUser: React.Dispatch<React.SetStateAction<{ name: string; avatar: string; id: string; location?: string; phone?: string }>>;
  followedIds?: string[];
  friendIds?: string[];
  onSelectUser?: (user: UserProfile) => void;

  challengeDay?: number;
  setChallengeDay?: React.Dispatch<React.SetStateAction<number>>;
  dailyMessagesSent?: Record<string, number>;
  setDailyMessagesSent?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  momentPostedToday?: boolean;
  setMomentPostedToday?: React.Dispatch<React.SetStateAction<boolean>>;
  momentsPostedHistory?: Record<number, boolean>;
  setMomentsPostedHistory?: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  hasWithdrawn?: boolean;
  setHasWithdrawn?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProfilePage({
  language,
  setLanguage,
  coins,
  setCoins,
  onSignOut,
  showStoreTabInitially = false,
  currentUser,
  setCurrentUser,
  followedIds = [],
  friendIds = [],
  onSelectUser,
  challengeDay = 1,
  setChallengeDay,
  dailyMessagesSent = {},
  setDailyMessagesSent,
  momentPostedToday = false,
  setMomentPostedToday,
  momentsPostedHistory = {},
  setMomentsPostedHistory,
  hasWithdrawn = false,
  setHasWithdrawn
}: ProfilePageProps) {
  const [activeSubView, setActiveSubView] = useState<'main' | 'store'>(showStoreTabInitially ? 'store' : 'main');
  const [purchasedPackage, setPurchasedPackage] = useState<string | null>(null);

  // Challenge and Withdrawal internal states
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawPhone, setWithdrawPhone] = useState(() => {
    if (currentUser.phone) {
      const digits = currentUser.phone.replace(/\D/g, '');
      return digits.slice(-9);
    }
    return "";
  });
  const [withdrawStatus, setWithdrawStatus] = useState<'idle' | 'linking' | 'verifying' | 'paying' | 'success'>('idle');

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [showCamera, setShowCamera] = useState(false);
  const [activeMemberType, setActiveMemberType] = useState<'friends' | 'following' | 'followers' | 'visitors' | null>(null);

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
          
          <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
            <h2 className="text-xl font-black text-white italic tracking-wide uppercase">
              👤 {t.profile}
            </h2>

            {/* Quick Edit Mode trigger button */}
            <button
              onClick={() => {
                setEditName(currentUser.name);
                setIsEditing(!isEditing);
              }}
              className="bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white px-2.5 py-1.2 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1 hover:border-yellow-400 transition"
            >
              <Edit3 className="w-3 h-3 text-yellow-400" />
              <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
            </button>
          </div>

          {/* ACTIVE PARTY VIBE / STATUS BADGE AT TOP */}
          <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 border-2 border-zinc-800 p-3.5 rounded-2xl shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="animate-pulse text-xs">🔥</span>
              <span className="text-[10px] font-black uppercase text-zinc-300 tracking-wider">
                {language === 'en' ? 'My Active Party Vibe' : 'Vibe Yangu Hai'}
              </span>
            </div>
            <span className="text-[10.5px] font-black text-yellow-400 bg-black/85 px-3 py-1.1 rounded-xl border border-zinc-800 shrink-0 select-none shadow-inner">
              {(() => {
                const activeTheme = localStorage.getItem('party_chatt_theme') || 'all';
                if (activeTheme === 'all') return language === 'en' ? '🎉 Normal Party' : '🎉 Sherehe Kawaida';
                if (activeTheme === 'karaoke') return language === 'en' ? '🎤 Karaoke Stage' : '🎤 Jukwaa la Karaoke';
                if (activeTheme === 'clubbing') return language === 'en' ? '💃 Clubbing Mood' : '💃 Hali ya Klabu';
                if (activeTheme === 'chill') return language === 'en' ? '🛋️ Chill Lounge' : '🛋️ Kupumzika';
                return language === 'en' ? 'Normal Party' : 'Sherehe Kawaida';
              })()}
            </span>
          </div>

          {/* Interactive Profile Editor card vs Standard Display Card */}
          {isEditing ? (
            <div className="bg-zinc-900 border-3 border-black p-4 rounded-3xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 animate-slide-down">
              <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                <span className="text-[10px] uppercase font-black text-yellow-400 tracking-wider">✏️ Modify Profile</span>
                <span className="text-[10px] font-mono text-zinc-500">{t.accId}</span>
              </div>

              {/* Avatar options changer */}
              <div className="flex items-center gap-4 border-b border-zinc-850/50 pb-4">
                <div className="w-16 h-16 bg-zinc-850 border-3 border-black rounded-full overflow-hidden flex items-center justify-center text-zinc-500 shadow-[2px_2px_0px_rgba(0,0,0,1)] relative select-none">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Profile avatar candidate" className="img-no-watermark" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-9 h-9" />
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-600 border border-black text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    VIP
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 flex-1 justify-center">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest block mb-0.5">Avatar Source</span>
                  <div className="flex gap-2">
                    {/* Live camera taker trigger */}
                    <button
                      type="button"
                      onClick={() => setShowCamera(true)}
                      className="bg-purple-600 hover:bg-purple-500 border border-black text-white text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg shadow-[1.5px_1.5px_0_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] transition cursor-pointer"
                    >
                      📸 Live Cam
                    </button>
                    
                    {/* Standard file selector */}
                    <label className="bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-300 text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg shadow-[1.5px_1.5px_0_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] transition cursor-pointer flex items-center justify-center">
                      📁 Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (reader.result) {
                                const base64 = reader.result as string;
                                setCurrentUser(prev => {
                                  const updated = { ...prev, avatar: base64 };
                                  localStorage.setItem('party_chatt_current_user', JSON.stringify(updated));
                                  return updated;
                                });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Username Input Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-extrabold tracking-widest text-zinc-400">Username / Nickname</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-zinc-950 text-white border border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-yellow-400 placeholder:text-zinc-600 w-full"
                  placeholder="Insert Nickname..."
                  maxLength={24}
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!editName.trim()) return;
                  setCurrentUser(prev => {
                    const updated = { ...prev, name: editName.trim() };
                    localStorage.setItem('party_chatt_current_user', JSON.stringify(updated));
                    return updated;
                  });
                  setIsEditing(false);
                }}
                className="bg-yellow-400 hover:bg-yellow-300 border-2 border-black text-black font-black text-xs py-2.5 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition uppercase tracking-wider"
              >
                Save Changes
              </button>
            </div>
          ) : (
            /* Header element with User details */
            <div className="bg-zinc-900 border-3 border-black p-4 rounded-3xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                
                {/* User avatar snapshot */}
                <div 
                  onClick={() => setIsEditing(true)}
                  className="w-14 h-14 bg-zinc-800 border-3 border-black rounded-full overflow-hidden flex items-center justify-center text-zinc-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative select-none cursor-pointer group"
                >
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="User Avatar" className="img-no-watermark" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-8 h-8 font-black text-yellow-400" />
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-600 border border-black text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    VIP
                  </div>
                  {/* Subtle hover icon overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-base font-black text-white tracking-tight flex items-center gap-1">
                    {currentUser.name}
                  </span>
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
              <div 
                onClick={() => setIsEditing(true)}
                className="bg-amber-400/10 border border-amber-305 text-yellow-400 hover:bg-amber-400/20 px-2 py-1 rounded-xl text-[10px] font-black flex items-center gap-1 select-none cursor-pointer transition"
              >
                <span>✨ SVIP</span>
              </div>
            </div>
          )}

          {/* Statistics grid matching Soyo Lite (Francis layout: Friends, Following, Followers, Visitors) */}
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { label: t.friends, val: friendIds.length, color: 'text-zinc-400', type: 'friends' },
              { label: t.following, val: followedIds.length, color: 'text-zinc-400', type: 'following' },
              { label: t.followers, val: 14 + friendIds.length, color: 'text-zinc-400', type: 'followers' },
              { label: t.visitors, val: 45, color: 'text-yellow-400 animate-pulse', type: 'visitors' }
            ].map((stat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveMemberType(stat.type as any)}
                className="bg-zinc-900 border-2 border-black p-2.5 rounded-2xl text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center select-none active:translate-x-[1px] active:translate-y-[1px] cursor-pointer hover:border-yellow-400/80 transition-all focus:outline-none"
              >
                <span className={`text-base font-black ${stat.color}`}>{stat.val}</span>
                <span className="text-[9px] text-zinc-500 font-extrabold uppercase mt-0.5 truncate leading-none">
                  {stat.label}
                </span>
              </button>
            ))}
          </div>

          {/* Quick Wallet overview strip with cash rewards and withdraw button */}
          <div 
            className="bg-gradient-to-r from-purple-600 to-indigo-700 border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 select-none relative overflow-hidden"
          >
            {/* Background sparkle accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Coins className="w-5 h-5 text-yellow-400 animate-bounce" />
                <div className="flex flex-col">
                  <span className="text-white font-black text-xs tracking-wider uppercase opacity-90">{t.balance}</span>
                  <span className="text-yellow-300 font-black text-lg">{coins} Coins</span>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-[10px] text-zinc-200 block font-black uppercase tracking-wider">WALLET CASHBACK</span>
                <span className="text-xl font-black text-white">
                  {coins >= 2000 ? (hasWithdrawn ? "KES 0.00 (Paid)" : "KES 200.00") : "KES 0.00"}
                </span>
              </div>
            </div>

            {/* Withdraw button and status indicator */}
            <div className="border-t border-white/20 pt-3 flex items-center justify-between gap-1">
              <span className="text-[9.5px] text-zinc-200 font-bold block leading-snug">
                {coins >= 2000 ? (
                  hasWithdrawn ? (
                    <span className="text-emerald-300 flex items-center gap-1">✔ Cash successfully withdrawn via M-Pesa</span>
                  ) : (
                    <span className="text-yellow-300 font-black flex items-center gap-1">🎉 200sh active reward achieved!</span>
                  )
                ) : (
                  <span>🔒 Withdraw active when coins reach 2,000</span>
                )}
              </span>

              {coins >= 2000 ? (
                hasWithdrawn ? (
                  <button
                    disabled
                    className="bg-zinc-800 border-2 border-black text-zinc-500 font-black text-[10px] uppercase px-4 py-2 rounded-xl cursor-not-allowed"
                  >
                    Paid Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setWithdrawStatus('idle');
                      setWithdrawPhone("");
                      setShowWithdrawModal(true);
                    }}
                    className="bg-yellow-400 hover:bg-yellow-300 border-2 border-black text-black font-black text-[11px] uppercase px-4 py-2 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] active:translate-y-0 transition cursor-pointer shrink-0"
                  >
                    Withdraw Now 💸
                  </button>
                )
              ) : (
                <button
                  disabled
                  title="Accumulate 2000 coins first"
                  className="bg-purple-900/50 border-2 border-white/10 text-white/30 font-black text-[10px] uppercase px-3 py-2 rounded-xl cursor-not-allowed shrink-0"
                >
                  Locked ({Math.min(100, Math.floor((coins / 2000) * 100))}% Saved)
                </button>
              )}
            </div>
          </div>

          {/* 1-WEEK TASK EARNING CHALLENGE TRACKING WIDGET */}
          <div className="bg-zinc-900 border-3 border-black p-4 rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-yellow-400">📅</span>
                <span className="text-[11px] font-black text-white uppercase tracking-wider truncate">
                  Challenge Day {challengeDay} of 7
                </span>
                <span className="bg-purple-600 text-[8px] font-black tracking-widest text-white px-1.5 py-0.2 rounded uppercase shrink-0">
                  TASK
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 font-bold tracking-tight shrink-0">200sh cash payout target</span>
            </div>

            {/* Today's active tracking requirements checklist */}
            <div className="flex flex-col gap-2.5 my-1">
              
              {/* Checklist 1: Message 10 accounts with at least 5 messages each */}
              <div className="flex items-start gap-2.5">
                <div className={`mt-0.5 p-0.5 rounded-full shrink-0 ${
                  Object.values(dailyMessagesSent).filter(msgCount => msgCount >= 5).length >= 10 
                    ? 'bg-emerald-500 text-black' 
                    : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-black text-zinc-200">
                      Chat with &gt;10 accounts (min 5 messages per acc)
                    </span>
                    <span className="text-[10px] text-yellow-400 font-black font-mono shrink-0">
                      {Object.values(dailyMessagesSent).filter(msgCount => msgCount >= 5).length} / 10
                    </span>
                  </div>
                  {/* Detailed profile message counts visualization */}
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {mockProfiles.slice(0, 10).map((p, idx) => {
                      const msgCount = dailyMessagesSent[p.id] || 0;
                      return (
                        <div 
                          key={p.id}
                          className={`flex items-center gap-1 text-[8px] font-bold px-1.5 py-0.5 rounded border leading-none ${
                            msgCount >= 5 
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                              : msgCount > 0 
                                ? 'bg-amber-400/15 text-amber-400 border-amber-400/20' 
                                : 'bg-transparent text-zinc-650 border-zinc-850'
                          }`}
                        >
                          <span>Acc {idx + 1}</span>
                          <span className={`font-black rounded-sm px-1 ${
                            msgCount >= 5 ? 'bg-emerald-500 text-black' : msgCount > 0 ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-500'
                          }`}>
                            {msgCount}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Checklist 2: Post 1 moment daily */}
              <div className="flex items-start gap-2.5">
                <div className={`mt-0.5 p-0.5 rounded-full shrink-0 ${
                  momentPostedToday ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between leading-normal">
                    <span className="text-[11px] font-black text-zinc-200">
                      Post 1 moment daily
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded shrink-0 ${
                      momentPostedToday ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {momentPostedToday ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

            </div>


          </div>

          {/* VERIFIED ACCOUNT INFORMATION CARD */}
          <div className="bg-zinc-900 border-3 border-black p-4 rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex flex-col gap-3 select-none">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-yellow-400">🛡️</span>
              <span className="text-[11px] font-black text-white uppercase tracking-wider">
                {language === 'en' ? 'Verified Account Credentials' : 'Maelezo ya Akaunti Yako'}
              </span>
            </div>
            
            <div className="flex flex-col gap-2 text-xs">
              {/* Full Name field */}
              <div className="flex items-center justify-between py-1 border-b border-zinc-850/50">
                <span className="text-zinc-500 font-extrabold uppercase text-[10px]">
                  {language === 'en' ? 'Full Name' : 'Jina Kamili'}
                </span>
                <span className="text-white font-black">{currentUser.name}</span>
              </div>

              {/* Location field */}
              <div className="flex items-center justify-between py-1 border-b border-zinc-850/50">
                <span className="text-zinc-500 font-extrabold uppercase text-[10px]">
                  {language === 'en' ? 'Location' : 'Eneo'}
                </span>
                <span className="text-white font-black">{currentUser.location || 'Nairobi, Kenya'}</span>
              </div>

              {/* Phone number field */}
              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-500 font-extrabold uppercase text-[10px]">
                  {language === 'en' ? 'Registered Phone' : 'Nambari ya Simu'}
                </span>
                <span className="text-yellow-400 font-black font-mono">
                  {currentUser.phone || '0712******'}
                </span>
              </div>
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

      {/* Profile Live Camera Capture popup */}
      {showCamera && (
        <CameraCapture
          language={language}
          onCapture={(base64Img) => {
            setCurrentUser(prev => {
              const updated = { ...prev, avatar: base64Img };
              localStorage.setItem('party_chatt_current_user', JSON.stringify(updated));
              return updated;
            });
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Interactive Statistics Members List Drawer/Modal Popup */}
      {activeMemberType && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-zinc-950 border-3 border-black rounded-[28px] overflow-hidden shadow-[4px_4px_0_0_rgba(147,51,234,1)] flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Header of Modal */}
            <div className="bg-yellow-400 border-b-3 border-black p-4 flex items-center justify-between shrink-0">
              <h3 className="font-black text-black text-xs uppercase tracking-wider">
                {(() => {
                  if (language === 'en') {
                    return {
                      friends: "My Friends Members",
                      following: "Profiles I Follow",
                      followers: "My Followers List",
                      visitors: "Recent Visitors"
                    }[activeMemberType];
                  } else {
                    return {
                      friends: "Marafiki Zangu",
                      following: "Orodha Ninayofuata",
                      followers: "Wafuasi Wangu",
                      visitors: "Wageni Walionitembelea"
                    }[activeMemberType];
                  }
                })()}
              </h3>
              <button 
                onClick={() => setActiveMemberType(null)}
                className="bg-black hover:bg-zinc-905 text-white border-2 border-black p-1.5 rounded-xl cursor-pointer hover:scale-105 active:scale-95 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scrollable Members List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
              {(() => {
                let list: UserProfile[] = [];
                if (activeMemberType === 'friends') {
                  list = mockProfiles.filter(p => friendIds.includes(p.id));
                } else if (activeMemberType === 'following') {
                  list = mockProfiles.filter(p => followedIds.includes(p.id));
                } else if (activeMemberType === 'followers') {
                  const friends = mockProfiles.filter(p => friendIds.includes(p.id));
                  const extra = mockProfiles.filter(p => !friendIds.includes(p.id)).slice(0, 14);
                  list = [...friends, ...extra];
                } else if (activeMemberType === 'visitors') {
                  list = mockProfiles.slice(0, 18);
                }

                if (list.length === 0) {
                  return (
                    <div className="text-center py-10 flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl">🏜️</span>
                      <p className="text-zinc-500 text-[11px] font-bold leading-normal max-w-[200px]">
                        {language === 'en' 
                          ? "No matches in this list yet. Swipe or match more on your discover feed!"
                          : "Hakuna mechi kwenye orodha hii bado. Telezesha kidole na ulingane zaidi kwenye feed!"}
                      </p>
                    </div>
                  );
                }

                return list.map(p => (
                  <div 
                    key={p.id}
                    className="bg-zinc-900 border-2 border-black p-3 rounded-2xl flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:border-purple-600 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-11 h-11 rounded-full border-2 border-black overflow-hidden bg-zinc-800 shrink-0">
                        <img src={p.images[0]} alt={p.name} className="img-no-watermark" referrerPolicy="no-referrer" />
                        {p.online && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-black rounded-full"></span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-extrabold text-xs text-white truncate max-w-[110px]">{p.name}</span>
                          <span className="bg-yellow-400 text-black text-[8px] font-black px-1 rounded-sm">
                            {p.age}
                          </span>
                        </div>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">{p.distance} • {p.location}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setActiveMemberType(null);
                        if (onSelectUser) onSelectUser(p);
                      }}
                      className="bg-purple-600 hover:bg-purple-500 border border-black text-white text-[9px] font-black uppercase px-2.5 py-1.5 rounded-xl shadow-[1.5px_1.5px_0_rgba(0,0,0,1)] active:translate-x-[0.5px] active:translate-y-[0.5px] transition cursor-pointer shrink-0"
                    >
                      {language === 'en' ? 'View' : 'Tazama'}
                    </button>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* M-PESA CASH WITHDRAWAL SUCCESS PROGRESS TIMELINE FLOW MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-zinc-900 border-4 border-black rounded-[32px] p-6 text-center shadow-[6px_6px_0_0_#9333ea] relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-20 h-20 bg-purple-600/10 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="text-3xl mb-1">📲</div>
            
            <h3 className="text-xl font-black text-purple-400 uppercase tracking-wide">
              M-Pesa cashout
            </h3>
            <p className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest mt-0.5">
              Target Amount: KES 200.00
            </p>

            {withdrawStatus === 'idle' ? (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!withdrawPhone.trim()) return;
                  
                  // Start interactive payout sequence simulation
                  setWithdrawStatus('linking');
                  setTimeout(() => {
                    setWithdrawStatus('verifying');
                    setTimeout(() => {
                      setWithdrawStatus('paying');
                      setTimeout(() => {
                        setWithdrawStatus('success');
                        if (setHasWithdrawn) setHasWithdrawn(true);
                      }, 1500);
                    }, 1500);
                  }, 1200);
                }}
                className="my-5 flex flex-col gap-4 text-left"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
                    Enter Safaricom M-Pesa Phone Number
                  </label>
                  <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-xl px-2">
                    <span className="text-xs font-black text-zinc-400 shrink-0 select-none">🇰🇪 +254</span>
                    <input
                      type="tel"
                      value={withdrawPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                        setWithdrawPhone(val);
                      }}
                      placeholder="712345678"
                      className="w-full bg-transparent text-white px-1.5 py-2.5 text-xs font-bold focus:outline-none"
                      required
                    />
                  </div>
                  <span className="text-[8.5px] text-zinc-550 font-semibold leading-relaxed">
                    Ensure you specify an active M-Pesa client line. Your name reference will register as {currentUser.name}.
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={withdrawPhone.length < 9}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-800 disabled:text-zinc-650 disabled:border-zinc-850 text-black font-black text-xs py-3 rounded-2xl border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] cursor-pointer select-none transition uppercase tracking-wider"
                  >
                    Verify & Cash Out 💸
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="text-zinc-500 hover:text-zinc-350 text-[10px] font-black uppercase tracking-wider py-1 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="my-8 flex flex-col items-center justify-center gap-4">
                {withdrawStatus !== 'success' && (
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"></div>
                  </div>
                )}

                <p className="text-xs font-bold text-white px-2 leading-relaxed">
                  {withdrawStatus === 'linking' && "⏳ Connecting to Safaricom Daraja G2 API gateway..."}
                  {withdrawStatus === 'verifying' && "⏳ Authenticating Francis Ndungu activity certificates..."}
                  {withdrawStatus === 'paying' && "⏳ Payout amount (KES 200.00) dispatching to +254 " + withdrawPhone + "..."}
                  {withdrawStatus === 'success' && (
                    <span className="block text-center flex flex-col items-center gap-2">
                      <span className="text-4xl text-green-400">🎉</span>
                      <span className="text-emerald-400 font-black text-sm uppercase">Withdrawal Successful!</span>
                      <span className="text-zinc-300 text-xs font-semibold leading-relaxed mt-1 block">
                        Amount KES 200.00 has been sent successfully to +254 {withdrawPhone} reference ID MPR-{Date.now().toString().slice(-6)}. Check your phone's SMS inbox!
                      </span>
                    </span>
                  )}
                </p>

                {withdrawStatus === 'success' && (
                  <button
                    onClick={() => {
                      setShowWithdrawModal(false);
                      setWithdrawStatus('idle');
                    }}
                    className="mt-4 w-full bg-zinc-800 border-2 border-black hover:bg-zinc-700 text-white font-black text-xs py-2 px-6 rounded-xl shadow-[1.5px_1.5px_0_rgba(0,0,0,1)] transition cursor-pointer"
                  >
                    Close Window
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
