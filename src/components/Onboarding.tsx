import React, { useState } from 'react';
import { Chrome, Heart, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import { Gender, AppLanguage } from '../types';

interface OnboardingProps {
  language: AppLanguage;
  onComplete: (gender: Gender, preference: string) => void;
}

type Step = 'splash' | 'gender' | 'preferences' | 'avatar_choice' | 'terms';

export default function Onboarding({ language, onComplete }: OnboardingProps) {
  const [step, setStep] = useState<Step>('splash');
  const [gender, setGender] = useState<Gender>('Female');
  const [showConfirmGender, setShowConfirmGender] = useState(false);
  const [preference, setPreference] = useState<'serious' | 'casual'>('casual');

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
      agree: "I agree"
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
      createProfile: "Tengeneza wasifu wangu",
      termsTitle: "Kuwa mkarimu na heshimiana",
      termsSubtitle: "Karibu kwenye Party Chatt Lite!",
      termsBody: "Hapa tunawatendea kila mtu kwa wema na heshima. Katika dhamira yetu ya kuweka Party Chatt kuwa salama na jumuishi, tunakuomba ujiunge nasi kwa kuzingatia sheria za jamii yetu.\n\nNa kumbuka: Tuko hapa kwa ajili yako kila wakati!",
      termsSignature: "Kila la heri, Timu ya Party Chatt Lite",
      agree: "Ninakubali"
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
        
        {/* STEP 1: SPLASH SCREEN WITH MONSTER BLOBS */}
        {step === 'splash' && (
          <div className="flex-1 bg-yellow-400 p-6 flex flex-col justify-between relative overflow-hidden">
            {/* Background geometric art */}
            <div className="absolute top-4 left-6 text-black/30 font-bold text-xs tracking-widest uppercase">
              Connecting People
            </div>

            {/* Monsters illustration (Vibrant, high quality vector-ish graphics layout) */}
            <div className="flex-1 flex flex-col items-center justify-center relative mt-12 select-none">
              
              {/* Title Logo representation styled like Soyo */}
              <div className="text-center z-15 transform -rotate-2">
                <h1 className="text-6xl font-black tracking-tighter text-black drop-shadow-[5px_5px_0px_#ffffff] font-sans">
                  Party
                </h1>
                <h1 className="text-6xl font-black tracking-tighter text-black drop-shadow-[5px_5px_0px_#ffffff] font-sans -mt-2">
                  Chatt
                </h1>
                <span className="inline-block bg-black text-yellow-400 font-extrabold text-[12px] px-3 py-1 rounded-full border-2 border-white transform rotate-6 uppercase mt-1 shadow-md">
                  Lite Version
                </span>
              </div>

              {/* Character Blob 1: Green alien on left */}
              <div className="absolute left-[5%] bottom-[10%] w-24 h-40 bg-emerald-500 rounded-full border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex flex-col justify-start p-4 transform -rotate-12 animate-bounce duration-1000">
                <div className="flex gap-2">
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-black flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-black flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                  </div>
                </div>
                {/* Tooth style mouth */}
                <div className="w-10 h-7 bg-black rounded-b-xl mt-4 flex justify-around items-start overflow-hidden px-1">
                  <div className="w-2.5 h-2 bg-white rounded-b-md"></div>
                  <div className="w-2.5 h-2 bg-white rounded-b-md"></div>
                </div>
              </div>

              {/* Character Blob 2: Yellow happy face on right */}
              <div className="absolute right-[4%] bottom-[5%] w-28 h-28 bg-amber-400 rounded-full border-4 border-black shadow-[4.5px_4.5px_0_0_rgba(0,0,0,1)] flex flex-col justify-center items-center p-3 transform rotate-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="flex flex-col gap-0.5">
                    <div className="w-2 h-1 bg-black rounded-t-full transform rotate-12"></div>
                    <div className="w-3 h-3 rounded-full bg-black"></div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="w-2 h-1 bg-black rounded-t-full transform -rotate-12"></div>
                    <div className="w-3 h-3 rounded-full bg-black"></div>
                  </div>
                </div>
                <div className="w-6 h-3 bg-red-500 rounded-b-full border-2 border-black mt-2"></div>
                {/* Cheeks */}
                <div className="flex justify-between w-16 -mt-3.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-80"></div>
                </div>
              </div>

              {/* Character Blob 3: White cute bunny hovering above */}
              <div className="absolute right-[12%] top-[14%] w-14 h-14 bg-white rounded-full border-3 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] flex flex-col items-center justify-center transform rotate-12">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>
                <div className="text-[6px] font-bold text-pink-400 -mt-0.5">♥</div>
                {/* Bunny ears */}
                <div className="absolute -top-3 left-1 w-3 h-4 bg-white border-2 border-black rounded-t-full"></div>
                <div className="absolute -top-3 right-1 w-3 h-4 bg-white border-2 border-black rounded-t-full"></div>
              </div>

            </div>

            {/* Onboarding Trigger Actions */}
            <div className="flex flex-col gap-3.5 z-20 mt-auto pb-4">
              <button
                onClick={() => setStep('gender')}
                className="w-full bg-white hover:bg-neutral-50 text-black font-black py-4 px-6 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgb(0,0,0)] transition-all cursor-pointer text-sm"
              >
                <Chrome className="w-5 h-5 text-red-500" />
                <span>{t.googleLogin}</span>
                <span className="ml-auto bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded transform rotate-3 uppercase">
                  Recommend
                </span>
              </button>

              <button
                onClick={() => setStep('gender')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 px-6 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgb(0,0,0)] transition-all cursor-pointer text-sm"
              >
                <span>⚡ {t.fastLogin}</span>
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
              onClick={() => onComplete(gender, preference)}
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
