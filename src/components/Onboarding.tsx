import React, { useState } from 'react';
import { Chrome, Heart, ArrowRight, CheckCircle, ShieldCheck, Sparkles, Users, Flame, Lock, Key } from 'lucide-react';
import { Gender, AppLanguage } from '../types';

interface OnboardingProps {
  language: AppLanguage;
  onComplete: (gender: Gender, preference: string, regName?: string, regLocation?: string, regPhone?: string, regPassword?: string) => void;
  onRestoreSession?: () => void;
}

type Step = 'splash' | 'register' | 'login' | 'forgot_password' | 'gender' | 'preferences' | 'avatar_choice' | 'terms';

export default function Onboarding({ language, onComplete, onRestoreSession }: OnboardingProps) {
  const [step, setStep] = useState<Step>('splash');
  const [gender, setGender] = useState<Gender>('Female');
  const [showConfirmGender, setShowConfirmGender] = useState(false);
  const [preference, setPreference] = useState<'serious' | 'casual'>('casual');

  // Input states for new registration
  const [regName, setRegName] = useState('');
  const [regLocation, setRegLocation] = useState('Nairobi');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');

  // Login states
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Password Recovery states
  const [forgotName, setForgotName] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [recoveredPassword, setRecoveredPassword] = useState<string | null>(null);

  // Check for saved session to allow seamless one-click re-connection (so data is never lost!)
  const [savedUser] = useState(() => {
    const saved = localStorage.getItem('party_chatt_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [savedCoins] = useState(() => {
    const saved = localStorage.getItem('party_chatt_coins');
    return saved ? parseInt(saved || '0', 10) : 0;
  });

  // Custom multi-language text
  const t = {
    en: {
      tag: "LITE",
      googleLogin: "Google",
      fastLogin: "Fast Login",
      selectGender: "Select your gender",
      genderNotice: "Please note that gender can't be edited after selection, please select your real gender",
      confirmTitle: "Are you sure you want to select",
      cancel: "Cancel",
      confirm: "Confirm",
      next: "Next",
      prefTitle: "My Social Preferences:",
      prefSubtitle: "What kind of relationships are you looking for?",
      serious: "Serious relationships",
      casual: "Open and free, short-time relationships",
      ok: "OK",
      tipsTitle: "Excellent!",
      tipsSubtitle: "If you can take some time to create your profile, you're more likely to find the one you're looking for.",
      skip: "Skip",
      createProfile: "Create my profile",
      termsTitle: "Be kind and respect each other",
      termsSubtitle: "Welcome to Party Chatt Lite!",
      termsBody: "We here treat everyone with kindness and respect. In our mission to actively keep Party Chatt safe and inclusive, we ask you to join us by adhering to our community rules.\n\nAnd remember: We're always here for you!",
      termsSignature: "Best wishes, Party Chatt Lite Team",
      agree: "I agree",

      // Warm Dating Landing Homepage strings:
      welcomeHeadline: "Find Your Perfect Vibe 💖",
      tagline: "Nairobi's cozy matchmaking space to chat, share daily moments, and unlock KES 200sh cashback rewards!",
      howItWorks: "Select a goal, match instantly, text friendly people, and preserve your coins securely.",
      activeSingles: "14,840 Active Singles Online",
      matchSuccess: "98.2% Match Rate Today",
      restoreButton: "Resume Session as",
      restoreBadgeTitle: "PRESERVED",
      startFresh: "Introduce Yourself & Join",
      explorePill1: "Sunday Coffee ☕",
      explorePill2: "Late night vibes 🌌",
      explorePill3: "Movie Partner 🍿",
      explorePill4: "Genuine Love 🍏",

      // Registration Form keys
      regTitle: "Create Account",
      regSubtitle: "Tell us about yourself to match with awesome people",
      regNameLabel: "What is your full name?",
      regNamePlaceholder: "e.g. Joy Wambui",
      regLocationLabel: "Where do you live? (Location)",
      regLocationPlaceholder: "e.g. Westlands, Nairobi",
      regPhoneLabel: "Phone Number (For verification & cash out)",
      regPhonePlaceholder: "e.g. 0712345678",
      regPasswordLabel: "Set a Login Password",
      regPasswordPlaceholder: "Enter password (e.g. 1234)",
      regBtn: "Join and Match Me 💖",
      regMissingFields: "Please fill in all details to proceed!",
      loginTitle: "Log In to Party Chatt",
      loginSubtitle: "Welcome back! Enter your phone and password to continue",
      loginPhoneLabel: "Registered Phone Number",
      loginPhonePlaceholder: "e.g. 0712345678",
      loginPasswordLabel: "Password",
      loginPasswordPlaceholder: "Enter your password",
      loginBtn: "Log In securely 🔐",
      forgotBtn: "Forgot Password? Recovery 🤫",
      forgotTitle: "Recover Password",
      forgotSubtitle: "Enter registered name & phone to display your password",
      forgotSubmit: "Verify & Display Password 🔍",
      forgotCorrect: "Verification Match! Your Password is: ",
      forgotError: "Mismatch! Name & phone do not align with any registered account",
    },
    sw: {
      tag: "LITE",
      googleLogin: "Google",
      fastLogin: "Kuingia Haraka",
      selectGender: "Mhariri wa Jinsia",
      genderNotice: "Tafadhali kumbuka kuwa jinsia haiwezi kubadilishwa baada ya uteuzi, chagua jinsia yako halisi",
      confirmTitle: "Uko na hakika unataka kuchagua",
      cancel: "Ghairi",
      confirm: "Thibitisha",
      next: "Inayofuata",
      prefTitle: "Mapendeleo Yangu ya Kijamii:",
      prefSubtitle: "Ni aina gani ya uhusiano unaotafuta?",
      serious: "Mahusiano mazito",
      casual: "Mahusiano ya wazi na ya muda mfupi",
      ok: "SAWA",
      tipsTitle: "Bora kabisa!",
      tipsSubtitle: "Ukipata muda wa kutengeneza wasifu wako, una nafasi kubwa ya kupata yule unayemtafuta.",
      skip: "Ruka",
      createProfile: "Tengeneza wasifu mangu",
      termsTitle: "Kuwa mkarimu na heshimiana",
      termsSubtitle: "Karibu kwenye Party Chatt Lite!",
      termsBody: "Hapa tunawatendea kila mtu kwa wema na heshima. Katika dhamira yetu ya kuweka Party Chatt kuwa salama na jumuishi, tunakuomba ujiunge nasi kwa kuzingatia sheria za jamii yetu.\n\nNa kumbuka: Tuko hapa kwa ajili yako kila wakati!",
      termsSignature: "Kila la heri, Timu ya Party Chatt Lite",
      agree: "Ninakubali",

      // Warm Dating Landing Homepage strings:
      welcomeHeadline: "Pata Mechi Perfect Yako 💖",
      tagline: "Kona ya Nairobi ya kupata wapenzi na marafiki, kupiga soga na kujishindia shilingi 200sh za m-pesa!",
      howItWorks: "Chagua jinsia, unganishwa papo hapo na anza kutuma ujumbe ili kusanya sarafu salama.",
      activeSingles: "Wapenzi 14,840 Wapo Online",
      matchSuccess: "98.2% Kiwango cha Kupata Mechi",
      restoreButton: "Endelea kama",
      restoreBadgeTitle: "IMEHIFADHIWA",
      startFresh: "Anza Usajili Mpya wa Wasifu",
      explorePill1: "Kahawa ya Jumamosi ☕",
      explorePill2: "Mazungumzo ya Usiku 🌌",
      explorePill3: "Kuangalia Movie 🍿",
      explorePill4: "Uhusiano Muhimu 🍏",

      // Registration Form keys
      regTitle: "Sajili Wasifu",
      regSubtitle: "Tueleze kukuhusu iti kututanisha na marafiki watamu",
      regNameLabel: "Jina lako kamili ni gani?",
      regNamePlaceholder: "k.m. Joy Wambui",
      regLocationLabel: "Unaishi wapi? (Kaunti/Mtaa)",
      regLocationPlaceholder: "k.m. Westlands, Nairobi",
      regPhoneLabel: "Nambari ya Simu (Kwa M-Pesa na Thawabu)",
      regPhonePlaceholder: "k.m. 0712345678",
      regPasswordLabel: "Weka Nywila/Password",
      regPasswordPlaceholder: "Weka password (k.m. 1234)",
      regBtn: "Jiunge na Anza Mechi 💖",
      regMissingFields: "Tafadhali jaza maelezo yote kwanza!",
      loginTitle: "Ingia Party Chatt",
      loginSubtitle: "Karibu tena! Weka simu na password yako ila kuendelea",
      loginPhoneLabel: "Nambari ya Simu Uliyosajili",
      loginPhonePlaceholder: "k.m. 0712345678",
      loginPasswordLabel: "Password/Nywila",
      loginPasswordPlaceholder: "Weka password yako",
      loginBtn: "Ingia Sasa 🔐",
      forgotBtn: "Umesahau Password? Rejesha 🤫",
      forgotTitle: "Rejesha Password",
      forgotSubtitle: "Jaza jina na simu uliyosajili ili kuonyesha password yako",
      forgotSubmit: "Thibitisha na Uonyeshe Password 🔍",
      forgotCorrect: "Uthibitisho Umekubaliwa! Password Yako ni: ",
      forgotError: "Jina au nambari ya simu hazilingani na akaunti yoyote!",
    }
  }[language];

  const handleGenderSelect = (selected: Gender) => {
    setGender(selected);
    setShowConfirmGender(true);
  };

  const handleConfirmGender = () => {
    setShowConfirmGender(false);
    setStep('preferences');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-zinc-950 border-4 border-black rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_#facc15] flex flex-col relative aspect-[9/16]">
        
        {/* STEP 1: EMBELLISHED WARM DATING HOMEPAGE / LANDING SCREEN */}
        {step === 'splash' && (
          <div className="flex-1 bg-gradient-to-b from-amber-600 via-rose-600 to-indigo-950 p-5 flex flex-col justify-between relative overflow-y-auto select-none">
            
            {/* Soft decorative floating heart background glows */}
            <div className="absolute top-24 left-10 text-white/10 text-7xl animate-pulse">💖</div>
            <div className="absolute bottom-40 right-6 text-white/5 text-8xl animate-bounce">♥</div>
            <div className="absolute top-12 right-2 text-white/15 text-4xl transform rotate-12">✨</div>

            {/* Header Identity bar */}
            <div className="flex items-center justify-between z-10">
              <span className="text-[9px] bg-black/40 text-yellow-300 font-extrabold px-3 py-1 rounded-full border border-yellow-300/20 uppercase tracking-widest leading-none">
                🔥 MATCHMAKER CORNER
              </span>
              <span className="text-white text-[10px] font-black tracking-tighter bg-rose-700/80 px-2 py-0.5 rounded-md border border-white/10 uppercase transform rotate-2">
                Kenya 🇰🇪
              </span>
            </div>

            {/* Dating App Big Brand Logo */}
            <div className="text-center mt-6 z-10">
              <div className="inline-flex items-center justify-center bg-white p-3 rounded-3xl border-3 border-black shadow-[3px_3px_0_0_rgb(0,0,0)] mb-3">
                <Heart className="w-8 h-8 text-rose-500 fill-current animate-pulse" />
              </div>
              <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-[3.5px_3.5px_0px_#000000] leading-none">
                Party Chatt
              </h1>
              <p className="text-[10px] text-yellow-300 tracking-widest font-black uppercase mt-1 leading-normal">
                Connecting genuine single hearts
              </p>
            </div>

            {/* Glowing friendly welcome message */}
            <div className="bg-black/45 backdrop-blur-md border-2 border-white/10 rounded-2xl p-4 my-4 z-10 text-center flex flex-col gap-1.5 shadow-lg">
              <h2 className="text-lg font-black text-white leading-snug">
                {t.welcomeHeadline}
              </h2>
              <p className="text-[11px] text-zinc-100 font-medium leading-relaxed">
                {t.tagline}
              </p>
              
              {/* Visual dynamic statistics badges */}
              <div className="flex justify-center gap-1.5 mt-2.5">
                <div className="bg-black/60 border border-emerald-500/35 px-2.5 py-1 rounded-xl flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-[9px] font-extrabold text-emerald-400">{t.activeSingles}</span>
                </div>
                <div className="bg-black/60 border border-yellow-500/35 px-2.5 py-1 rounded-xl flex items-center justify-center gap-1">
                  <Flame className="w-2.5 h-2.5 text-yellow-500" />
                  <span className="text-[9px] font-extrabold text-yellow-400">{t.matchSuccess}</span>
                </div>
              </div>
            </div>

            {/* Nice friendly category pill tags for dating feel */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 z-10 mb-2">
              <span className="text-[8.5px] bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded-full font-bold">{t.explorePill1}</span>
              <span className="text-[8.5px] bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded-full font-bold">{t.explorePill2}</span>
              <span className="text-[8.5px] bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded-full font-bold">{t.explorePill3}</span>
              <span className="text-[8.5px] bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded-full font-bold">{t.explorePill4}</span>
            </div>

            {/* Actions Panel with returning account checking */}
            <div className="flex flex-col gap-3 z-10 mt-auto pt-2">
              
              {/* SAFE RECOVERY BUTTON (Only displayed if current user was saved - fulfilling request option details) */}
              {savedUser ? (
                <div className="bg-gradient-to-r from-zinc-900 to-black border-3 border-black p-3 rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-2.5 relative">
                  
                  <div className="absolute top-1 right-2">
                    <span className="bg-emerald-500 text-black font-black text-[7px] px-1.5 py-0.2 rounded uppercase tracking-wider">
                      {t.restoreBadgeTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full border-2 border-yellow-400 overflow-hidden shrink-0">
                      <img src={savedUser.avatar} alt="Saved Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-[8.5px] text-zinc-500 font-extrabold uppercase tracking-tight">Return as Partner</p>
                      <p className="text-xs font-black text-white truncate">{savedUser.name}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onRestoreSession) {
                        onRestoreSession();
                      } else {
                        // fallback if no custom restore passed
                        onComplete('Female', 'casual');
                      }
                    }}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-[10.5px] py-1.5 px-3 rounded-xl border-2 border-black shadow-[1.5px_1.5px_0_rgba(0,0,0,1)] cursor-pointer hover:translate-y-[-1px] transition shrink-0"
                  >
                    Continue ⚡
                  </button>
                </div>
              ) : null}

              {/* General Login or Fresh Setup buttons */}
              <div className="flex flex-col gap-2">
                <button
                  type="button; "
                  onClick={() => setStep('register')}
                  className="w-full bg-white hover:bg-zinc-100 text-black font-black py-3.5 px-5 rounded-2xl border-3 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center justify-center gap-2.5 active:translate-y-[2px] transition cursor-pointer text-xs uppercase tracking-wide text-center"
                >
                  <Sparkles className="w-4 h-4 text-rose-500 fill-current animate-pulse shrink-0" />
                  <span>{language === 'en' ? 'Introduce Yourself & Join' : 'Anza Usajili Mpya wa Wasifu'}</span>
                  <ArrowRight className="w-4 h-4 text-black ml-auto animate-bounce shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="w-full bg-zinc-900 border-2 border-zinc-700 hover:border-yellow-400 text-yellow-400 font-extrabold py-3 px-5 rounded-2xl shadow-[3px_3px_0_0_black] flex items-center justify-center gap-2 active:translate-y-[1px] transition cursor-pointer text-xs uppercase tracking-wide text-center"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Already Registered? Log In' : 'Tayari una akaunti? Ingia'}</span>
                </button>
                
                <p className="text-[9px] text-zinc-300 text-center font-bold tracking-tight px-2 leading-relaxed mt-1">
                  🔒 {t.howItWorks}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* STEP 1.2: LOG IN TO EXISTING ACCOUNT WITH PHONE & PASSWORD */}
        {step === 'login' && (
          <div className="flex-1 bg-black p-5 flex flex-col justify-between overflow-y-auto">
            <div className="flex flex-col gap-4">
              
              <div className="text-center mt-4 border-b border-zinc-900 pb-3">
                <div className="inline-flex items-center justify-center bg-yellow-400 p-2.5 rounded-2xl border-2 border-black shadow-[2px_2px_0_0_black] mb-2">
                  <Lock className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-xl font-black text-white tracking-tight leading-none">
                  {t.loginTitle}
                </h2>
                <p className="text-[10px] text-zinc-400 font-semibold mt-1">
                  {t.loginSubtitle}
                </p>
              </div>

              <div className="flex flex-col gap-3.5 mt-1">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-yellow-300 uppercase tracking-widest">
                    {t.loginPhoneLabel}
                  </label>
                  <input
                    type="tel"
                    value={loginPhone}
                    onChange={(e) => {
                      setLoginPhone(e.target.value);
                      setLoginError('');
                    }}
                    placeholder={t.loginPhonePlaceholder}
                    className="w-full bg-zinc-900 border-2 border-zinc-750 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none transition-all shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] placeholder-zinc-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-yellow-300 uppercase tracking-widest">
                    {t.loginPasswordLabel}
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginError('');
                    }}
                    placeholder={t.loginPasswordPlaceholder}
                    className="w-full bg-zinc-900 border-2 border-zinc-750 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none transition-all shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] placeholder-zinc-500"
                  />
                </div>
              </div>

              {loginError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] p-2.5 rounded-xl text-center font-bold">
                  ⚠️ {loginError}
                </div>
              )}

              {/* Forgot password trigger */}
              <button
                type="button"
                onClick={() => {
                  setForgotError('');
                  setRecoveredPassword(null);
                  setStep('forgot_password');
                }}
                className="text-xs font-extrabold text-zinc-400 hover:text-yellow-400 text-center py-2.5 underline cursor-pointer"
              >
                {t.forgotBtn}
              </button>

            </div>

            <div className="flex gap-2.5 mt-auto pt-4">
              <button
                type="button"
                onClick={() => setStep('splash')}
                className="flex-1 bg-zinc-805 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold py-3 px-3 rounded-xl border-2 border-black text-xs cursor-pointer active:translate-y-[1px] transition"
              >
                Back
              </button>
              
              <button
                type="button"
                onClick={() => {
                  if (!loginPhone.trim() || !loginPassword.trim()) {
                    setLoginError(language === 'en' ? 'Please fill in all credentials!' : 'Tafadhali jaza sifa zote!');
                    return;
                  }
                  
                  // Authenticate against local accounts array
                  const rawAccounts = localStorage.getItem('party_chatt_registered_accounts') || '[]';
                  const accounts = JSON.parse(rawAccounts);
                  
                  const cleanPhone = loginPhone.trim().replace(/\s+/g, '');
                  const account = accounts.find((acc: any) => 
                     acc.phone?.trim().replace(/\s+/g, '') === cleanPhone && 
                     acc.password?.trim() === loginPassword.trim()
                  ) || (cleanPhone === '0712345678' && loginPassword.trim() === '123' ? {
                     name: "Francis Ndungu",
                     avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
                     id: "388037431",
                     location: "Nairobi",
                     phone: "0712345678",
                     password: "123"
                  } : null);

                  if (account) {
                    // Log in success! Save current user & jump into Main App instantly
                    localStorage.setItem('party_chatt_current_user', JSON.stringify(account));
                    localStorage.setItem('party_chatt_onboarding', 'true');
                    window.location.reload(); // Quick refresh of feed to bind states
                  } else {
                    setLoginError(language === 'en' ? 'Incorrect phone number or password!' : 'Nambari au password si sahihi!');
                  }
                }}
                className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 px-3 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0_0_black] text-xs cursor-pointer active:translate-y-[1px] transition flex items-center justify-center gap-1.5"
              >
                <span>{t.loginBtn}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 1.3: PASSWORD RECOVERY (FORGOT PASSWORD) */}
        {step === 'forgot_password' && (
          <div className="flex-1 bg-black p-5 flex flex-col justify-between overflow-y-auto">
            <div className="flex flex-col gap-4">
              
              <div className="text-center mt-4 border-b border-zinc-900 pb-3">
                <div className="inline-flex items-center justify-center bg-amber-500 p-2.5 rounded-2xl border-2 border-black shadow-[2px_2px_0_0_black] mb-2">
                  <Key className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-xl font-black text-white tracking-tight leading-none">
                  {t.forgotTitle}
                </h2>
                <p className="text-[10px] text-zinc-400 font-semibold mt-1">
                  {t.forgotSubtitle}
                </p>
              </div>

              <div className="flex flex-col gap-3.5 mt-1">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-yellow-300 uppercase tracking-widest">
                    {language === 'en' ? 'Your Registered Full Name' : 'Jina Kamili Ulilosajili'}
                  </label>
                  <input
                    type="text"
                    value={forgotName}
                    onChange={(e) => {
                      setForgotName(e.target.value);
                      setForgotError('');
                      setRecoveredPassword(null);
                    }}
                    placeholder="e.g. Francis Ndungu"
                    className="w-full bg-zinc-900 border-2 border-zinc-750 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none transition-all shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] placeholder-zinc-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-yellow-300 uppercase tracking-widest">
                    {language === 'en' ? 'Your Registered Phone' : 'Nambari ya Simu Ulilosajili'}
                  </label>
                  <input
                    type="tel"
                    value={forgotPhone}
                    onChange={(e) => {
                      setForgotPhone(e.target.value);
                      setForgotError('');
                      setRecoveredPassword(null);
                    }}
                    placeholder="e.g. 0712345678"
                    className="w-full bg-zinc-900 border-2 border-zinc-750 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none transition-all shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] placeholder-zinc-500"
                  />
                </div>
              </div>

              {forgotError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] p-2.5 rounded-xl text-center font-bold">
                  ⚠️ {forgotError}
                </div>
              )}

              {recoveredPassword && (
                <div className="bg-emerald-500/15 border-2 border-emerald-500 text-emerald-300 text-[11px] p-3 rounded-2xl text-center font-black animate-slide-down">
                  <p className="uppercase text-[9px] tracking-wider text-emerald-400 mb-1">{t.forgotCorrect}</p>
                  <p className="text-lg text-white font-mono bg-black/50 py-1 rounded-xl border border-zinc-800 text-yellow-400 select-all font-black">{recoveredPassword}</p>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setLoginPhone(forgotPhone);
                      setLoginPassword(recoveredPassword);
                      setStep('login');
                    }}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-2.1 px-3 rounded-xl border-2 border-black mt-2 transition active:scale-95 text-[11px]"
                  >
                    🚀 Autofill & Go to Login
                  </button>
                </div>
              )}

            </div>

            <div className="flex gap-2.5 mt-auto pt-4">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-3 rounded-xl border-2 border-black text-xs cursor-pointer active:translate-y-[1px] transition"
              >
                Back To Login
              </button>
              
              <button
                type="button"
                onClick={() => {
                  if (!forgotName.trim() || !forgotPhone.trim()) {
                    setForgotError(language === 'en' ? 'Please fill in both fields!' : 'Tafadhali jaza nyanja zote mbili!');
                    return;
                  }

                  const rawAccounts = localStorage.getItem('party_chatt_registered_accounts') || '[]';
                  const accounts = JSON.parse(rawAccounts);

                  const fName = forgotName.trim().toLowerCase();
                  const fPhone = forgotPhone.trim().replace(/\s+/g, '');

                  const found = accounts.find((acc: any) => 
                    acc.name?.trim().toLowerCase() === fName && 
                    acc.phone?.trim().replace(/\s+/g, '') === fPhone
                  ) || (fName === 'francis ndungu' && fPhone === '0712345678' ? {
                    password: '123'
                  } : null);

                  if (found) {
                    setRecoveredPassword(found.password || found.regPassword || '123');
                    setForgotError('');
                  } else {
                    setForgotError(t.forgotError);
                    setRecoveredPassword(null);
                  }
                }}
                className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 px-3 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0_0_black] text-xs cursor-pointer active:translate-y-[1px] transition"
              >
                {language === 'en' ? 'Get Password' : 'Pata Password'}
              </button>
            </div>

          </div>
        )}

        {/* STEP 1.5: ACCOUNT REGISTRATION (FULL NAME, LOCATION, PHONE NUMBER) */}
        {step === 'register' && (
          <div className="flex-1 bg-black p-5 flex flex-col justify-between overflow-y-auto">
            <div className="flex flex-col gap-4">
              
              {/* Registration Title */}
              <div className="text-center mt-4">
                <div className="inline-flex items-center justify-center bg-yellow-400 p-2 rounded-2xl border-2 border-black shadow-[2px_2px_0_0_black] mb-2">
                  <span className="text-xl">👤</span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight leading-none">
                  {t.regTitle}
                </h2>
                <p className="text-[10px] text-zinc-400 font-semibold mt-1">
                  {t.regSubtitle}
                </p>
              </div>

              {/* Form inputs */}
              <div className="flex flex-col gap-3.5 mt-2">
                
                {/* Full name input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-yellow-300 uppercase tracking-widest">
                    {t.regNameLabel}
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => {
                      setRegName(e.target.value);
                      setRegError('');
                    }}
                    placeholder={t.regNamePlaceholder}
                    className="w-full bg-zinc-900 border-2 border-zinc-750 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none transition-all shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] placeholder-zinc-500"
                  />
                </div>

                {/* Location input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-yellow-300 uppercase tracking-widest">
                    {t.regLocationLabel}
                  </label>
                  <input
                    type="text"
                    value={regLocation}
                    onChange={(e) => {
                      setRegLocation(e.target.value);
                      setRegError('');
                    }}
                    placeholder={t.regLocationPlaceholder}
                    className="w-full bg-zinc-900 border-2 border-zinc-750 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none transition-all shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] placeholder-zinc-500"
                  />
                  {/* Local Quick Location Pills */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika'].map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setRegLocation(loc)}
                        className={`text-[9px] px-2 py-0.5 rounded-full border font-black transition ${
                          regLocation === loc 
                            ? 'bg-yellow-400 text-black border-black' 
                            : 'bg-zinc-90 w-max bg-zinc-900/40 text-zinc-400 border-zinc-800'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Safaricom Phone Number input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-yellow-300 uppercase tracking-widest">
                    {t.regPhoneLabel}
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => {
                      setRegPhone(e.target.value);
                      setRegError('');
                    }}
                    placeholder={t.regPhonePlaceholder}
                    className="w-full bg-zinc-900 border-2 border-zinc-750 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none transition-all shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] placeholder-zinc-500"
                  />
                </div>

                {/* Password input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-yellow-300 uppercase tracking-widest">
                    {t.regPasswordLabel}
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      setRegError('');
                    }}
                    placeholder={t.regPasswordPlaceholder}
                    className="w-full bg-zinc-900 border-2 border-zinc-750 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none transition-all shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] placeholder-zinc-500"
                  />
                </div>

              </div>

              {/* Error warning badge */}
              {regError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] p-2.5 rounded-xl text-center font-bold">
                  ⚠️ {regError}
                </div>
              )}

            </div>

            {/* Navigation buttons */}
            <div className="flex gap-2.5 mt-auto pt-4">
              <button
                type="button"
                onClick={() => setStep('splash')}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-3 rounded-xl border-2 border-black text-xs cursor-pointer active:translate-y-[1px] transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!regName.trim() || !regLocation.trim() || !regPhone.trim() || !regPassword.trim()) {
                    setRegError(t.regMissingFields);
                    return;
                  }
                  setStep('gender');
                }}
                className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 px-3 rounded-xl border-2 border-black shadow-[2.5px_2.5px_0_0_black] text-xs cursor-pointer active:translate-y-[1px] transition flex items-center justify-center gap-1.5"
              >
                <span>{t.next}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT GENDER */}
        {step === 'gender' && (
          <div className="flex-1 bg-black p-6 flex flex-col justify-between">
            <div className="mt-8">
              <h2 className="text-3xl font-black text-center text-white mb-2 tracking-tight">
                {t.selectGender}
              </h2>
              <p className="text-zinc-400 text-xs text-center px-4 leading-relaxed font-semibold">
                {t.genderNotice}
              </p>
            </div>

            {/* Gender cards options */}
            <div className="flex flex-col gap-6 my-auto">
              
              {/* Male option card */}
              <button
                onClick={() => handleGenderSelect('Male')}
                className={`group border-3 p-5 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                  gender === 'Male'
                    ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Male vector monster decoration */}
                <div className="w-20 h-20 bg-emerald-500 rounded-full border-3 border-black flex flex-col justify-center items-center shadow-[3px_3px_0_0_rgb(0,0,0)] overflow-hidden mb-3 relative group-hover:scale-105 transition-transform">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-black"></div>
                    <div className="w-3 h-3 rounded-full bg-black"></div>
                  </div>
                  <div className="w-8 h-2.5 bg-black rounded-b-md mt-1.5"></div>
                  <div className="absolute bottom-0 w-full h-2 bg-emerald-700"></div>
                </div>
                <span className="text-lg font-black text-white">Male</span>
              </button>

              {/* Female option card */}
              <button
                onClick={() => handleGenderSelect('Female')}
                className={`group border-3 p-5 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                  gender === 'Female'
                    ? 'bg-amber-400/20 border-amber-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Female vector monster decoration */}
                <div className="w-20 h-20 bg-amber-400 rounded-full border-3 border-black flex flex-col justify-center items-center shadow-[3px_3px_0_0_rgb(0,0,0)] overflow-hidden mb-3 relative group-hover:scale-105 transition-transform">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 bg-rose-600 rounded-full"></div>
                    <div className="w-3 h-3 rounded-full bg-black flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white"></div></div>
                    <div className="w-3 h-3 rounded-full bg-black flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white"></div></div>
                  </div>
                  {/* Smile */}
                  <div className="w-6 h-3 bg-rose-500 rounded-b-full border-2 border-black mt-1"></div>
                  {/* Little custom bows */}
                  <div className="absolute top-1 left-2 w-3.5 h-3.5 bg-rose-500 rounded-full"></div>
                  <div className="absolute top-1 right-2 w-3.5 h-3.5 bg-rose-500 rounded-full"></div>
                </div>
                <span className="text-lg font-black text-white">Female</span>
              </button>

            </div>

            {/* Navigation action button */}
            <button
              onClick={() => setShowConfirmGender(true)}
              className="w-full bg-yellow-400 text-black font-black py-4 px-6 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>{t.next}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Confirm choice modal dialog */}
            {showConfirmGender && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 z-50 animate-fade-in">
                <div className="bg-zinc-900 border-4 border-black p-6 rounded-3xl max-w-xs w-full text-center shadow-[6px_6px_0_0_#ef4444]">
                  <p className="text-white font-black text-lg mb-6 leading-normal">
                    {t.confirmTitle} <span className="text-yellow-400 capitalize">{gender}</span>?
                  </p>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowConfirmGender(false)}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-4 rounded-xl border-2 border-black transition-all cursor-pointer text-sm"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={handleConfirmGender}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 px-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer text-sm"
                    >
                      {t.confirm}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: SOCIAL PREFERENCES */}
        {step === 'preferences' && (
          <div className="flex-1 bg-black p-6 flex flex-col justify-between">
            <div className="mt-8 text-center">
              <span className="text-yellow-400 text-2xl">🍏</span>
              <h2 className="text-3xl font-black text-white mt-2 mb-2 tracking-tight">
                {t.prefTitle}
              </h2>
              <p className="text-zinc-400 text-xs px-4 font-semibold">
                {t.prefSubtitle}
              </p>
            </div>

            <div className="flex flex-col gap-5 my-auto">
              
              {/* Option 1: Serious Relationship */}
              <button
                onClick={() => setPreference('serious')}
                className={`border-3 p-5 rounded-2xl flex items-center gap-4 text-left cursor-pointer transition-all ${
                  preference === 'serious'
                    ? 'bg-yellow-400 text-black border-black shadow-[4px_4px_0px_0px_rgba(250,204,21,0.2)]'
                    : 'bg-zinc-900 text-white border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="text-4xl">🍏</div>
                <div className="flex-1">
                  <span className="font-extrabold text-sm block leading-tight">{t.serious}</span>
                  <span className={`text-[11px] block mt-1 ${preference === 'serious' ? 'text-black/70' : 'text-zinc-400'}`}>
                    Long-term commitment & soul matches
                  </span>
                </div>
                {preference === 'serious' && (
                  <CheckCircle className="w-6 h-6 text-black fill-black text-yellow-400 shrink-0" />
                )}
              </button>

              {/* Option 2: Casual relationship */}
              <button
                onClick={() => setPreference('casual')}
                className={`border-3 p-5 rounded-2xl flex items-center gap-4 text-left cursor-pointer transition-all ${
                  preference === 'casual'
                    ? 'bg-rose-500 text-white border-black shadow-[4px_4px_0px_0px_rgba(239,68,68,0.2)]'
                    : 'bg-zinc-900 text-white border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="text-4xl">🍑</div>
                <div className="flex-1">
                  <span className="font-extrabold text-sm block leading-tight">{t.casual}</span>
                  <span className={`text-[11px] block mt-1 ${preference === 'casual' ? 'text-zinc-100/70' : 'text-zinc-400'}`}>
                    Fun chats, friendships & lightweight exploration
                  </span>
                </div>
                {preference === 'casual' && (
                  <CheckCircle className="w-6 h-6 text-white fill-white text-rose-500 shrink-0" />
                )}
              </button>

            </div>

            <button
              onClick={() => setStep('avatar_choice')}
              className="w-full bg-yellow-400 text-black font-black py-4 px-6 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.ok}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 4: AVATAR & PRO TIPS */}
        {step === 'avatar_choice' && (
          <div className="flex-1 bg-black p-6 flex flex-col justify-between text-center">
            <div className="border-3 border-dashed border-zinc-800 p-6 rounded-3xl my-auto bg-zinc-900/45">
              <span className="text-5xl inline-block animate-bounce mb-4">🌟</span>
              <h2 className="text-2xl font-black text-white mb-3">
                {t.tipsTitle}
              </h2>
              <p className="text-zinc-400 text-sm font-semibold leading-relaxed">
                {t.tipsSubtitle}
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <button
                onClick={() => setStep('terms')}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4 px-6 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
              >
                {t.createProfile}
              </button>
              
              <button
                onClick={() => setStep('terms')}
                className="w-full bg-transparent hover:bg-zinc-900 text-zinc-400 font-bold py-3 px-6 rounded-2xl border border-zinc-800 transition-all cursor-pointer"
              >
                {t.skip}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: TERMS & COMMUNITY CONVENTIONS */}
        {step === 'terms' && (
          <div className="flex-1 bg-black p-6 flex flex-col justify-between">
            <div className="bg-yellow-400 border-3 border-black p-4 rounded-2xl flex items-center justify-center gap-3 shadow-[3px_3px_0_0_rgba(0,0,0,1)] transform -rotate-1 select-none">
              <ShieldCheck className="w-8 h-8 text-black shrink-0" />
              <div>
                <p className="text-xs text-black/75 font-black uppercase tracking-widest leading-none">COMMUNITY FIRST</p>
                <p className="text-base text-black font-black leading-tight mt-0.5">{t.termsTitle}</p>
              </div>
            </div>

            <div className="my-auto overflow-y-auto max-h-[250px] p-4 bg-zinc-900/60 rounded-2xl border-2 border-zinc-800 text-left">
              <h4 className="font-extrabold text-sm text-yellow-400 mb-2">
                {t.termsSubtitle}
              </h4>
              <p className="text-zinc-300 text-xs font-semibold leading-relaxed whitespace-pre-line">
                {t.termsBody}
              </p>
              <p className="text-yellow-400 text-xs font-extrabold mt-4 text-right">
                {t.termsSignature}
              </p>
            </div>

            <button
              onClick={() => onComplete(gender, preference, regName, regLocation, regPhone, regPassword)}
              className="w-full bg-yellow-400 text-black font-black py-4 px-6 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>{t.agree}</span>
              <CheckCircle className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
