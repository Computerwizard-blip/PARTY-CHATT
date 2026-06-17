import React, { useState } from 'react';
import { Sparkles, MapPin, Heart, MessageSquare, ShieldAlert, ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { UserProfile, AppLanguage } from '../types';
import { getPartyActivity } from '../data';

interface UserProfileModalProps {
  language: AppLanguage;
  profile: UserProfile;
  onClose: () => void;
  onStartChat: (userId: string) => void;
}

export default function UserProfileModal({
  language,
  profile,
  onClose,
  onStartChat
}: UserProfileModalProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const t = {
    en: {
      about: "About Me",
      hobbies: "Hobbies & Vibes",
      truthsTitle: "Tell two truths and one lie",
      alwaysSays: "I always like to say...",
      similarityTitle: "Personality similarity",
      canChat: "Can chat with her/him immediately!",
      chatBtn: "Send Message",
      back: "Back",
      status: "Status",
    },
    sw: {
      about: "Kuhusu Mimi",
      hobbies: "Hobbies na Vibe yake",
      truthsTitle: "Sema mambo mawili ya kweli na uwongo mmoja",
      alwaysSays: "Mimi hupenda kusema siku zote...",
      similarityTitle: "Ulinganifu wa kibinadamu",
      canChat: "Unaweza kuzungumza naye mara moja!",
      chatBtn: "Tuma Ujumbe",
      back: "Rudi",
      status: "Hali yake",
    }
  }[language];

  const handleNextPhoto = () => {
    setActivePhotoIdx((prev) => (prev + 1) % profile.images.length);
  };

  const handlePrevPhoto = () => {
    setActivePhotoIdx((prev) => (prev - 1 + profile.images.length) % profile.images.length);
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-45 overflow-y-auto pb-8 flex items-start justify-center p-2 xs:p-4">
      <div className="w-full max-w-sm bg-zinc-950 border-4 border-black rounded-[32px] overflow-hidden shadow-[8px_8px_0_0_#9333ea] flex flex-col relative my-4">
        
        {/* Top Floating back action bubble */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-50 bg-black/80 hover:bg-black text-white p-2 rounded-xl border border-zinc-700 shadow-md cursor-pointer transition-transform active:scale-95"
          title={t.back}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* 1. HORIZONTAL PHOTO SLIDESHOW (Matching Soyo layout) */}
        <div className="relative aspect-[4/5] w-full bg-zinc-900 border-b-3 border-black group select-none overflow-hidden">
          <img
            src={profile.images[activePhotoIdx]}
            alt={`${profile.name} photo`}
            className="img-no-watermark"
            referrerPolicy="no-referrer"
          />

          {/* Dots Indicators at the top inside image view */}
          <div className="absolute top-4 right-4 flex gap-1.5 bg-black/60 px-2.5 py-1 rounded-full border border-zinc-805">
            {profile.images.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === activePhotoIdx ? 'bg-yellow-400 scale-125' : 'bg-zinc-500'
                }`}
              ></span>
            ))}
          </div>

          {/* Silder directions arrows triggers */}
          {profile.images.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black border border-zinc-700 text-white p-1 rounded-xl cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black border border-zinc-700 text-white p-1 rounded-xl cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Bottom gradient name label tag overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/45 to-transparent p-4 flex flex-col pt-12">
            {(() => {
              const activity = getPartyActivity(profile);
              const activityText = language === 'sw' ? activity.textSw : activity.text;
              return (
                <>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-2xl font-black text-white leading-none tracking-tight">
                      {profile.name}
                    </h3>
                    <span 
                      className="inline-flex items-center justify-center text-xl cursor-help select-none bg-black/60 px-1.5 py-0.5 rounded-full border border-zinc-800 animate-bounce"
                      style={{ animationDuration: '3s' }}
                      title={activityText}
                    >
                      {activity.emoji}
                    </span>
                    
                    {/* Gender icon indicator card */}
                    <span className={`text-xs px-2 py-0.5 rounded-full border-1.5 border-black font-black leading-none flex items-center gap-0.5 ${
                      profile.gender === 'Female' ? 'bg-amber-400 text-black' : 'bg-emerald-500 text-white'
                    }`}>
                      {profile.gender === 'Female' ? '♀' : '♂'} {profile.age}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-zinc-300 text-[11px] font-extrabold mt-1.5 uppercase font-mono tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    <span>{profile.location} • {profile.distance} • Real Person</span>
                  </div>

                  {/* Active Live Activity indicator */}
                  <div className="flex items-center gap-1.5 text-yellow-400 text-[9px] font-black tracking-wider uppercase mt-2 bg-black/75 px-2 py-1 rounded-lg border border-yellow-400/30 w-fit max-w-full">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping shrink-0"></span>
                    <span className="text-zinc-400 normal-case font-bold">{language === 'en' ? 'Currently at party:' : 'Kwenye sherehe sasa hivi:'}</span>
                    <span className="text-yellow-400">{activityText}</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* 2. PROFILE DETAILS WRAPPER (About me & Hobbies) */}
        <div className="p-4 flex flex-col gap-5 bg-zinc-950">
          
          {/* Personality matcher visual banner */}
          <div className="bg-yellow-400 border-3 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-left select-none flex items-center justify-between">
            <div>
              <p className="text-[10px] text-black/75 font-black uppercase tracking-wider leading-none">
                🧠 {t.similarityTitle}
              </p>
              <p className="text-base text-black font-black leading-tight mt-1">
                {profile.personalitySimilarity}% compatibility
              </p>
              <span className="text-[10px] text-black/70 font-bold block mt-0.5">
                {t.canChat}
              </span>
            </div>

            <span className="text-3xl animate-bounce">💬</span>
          </div>

          {/* Status section */}
          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest pl-0.5">
              {t.status}
            </span>
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-xs font-semibold text-zinc-300 italic leading-relaxed">
              "{profile.status}"
            </div>
          </div>

          {/* Quick Badges table for About Me parameters (Matches Soyo Lite screen icons lists) */}
          <div className="flex flex-col gap-2 text-left">
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest pl-0.5">
              {t.about}
            </span>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl flex items-center gap-2 text-[11px] font-semibold text-zinc-300">
                <span>🏃</span>
                <span>{profile.aboutMe.active}</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl flex items-center gap-2 text-[11px] font-semibold text-zinc-300">
                <span>🎓</span>
                <span>{profile.aboutMe.education}</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl flex items-center gap-2 text-[11px] font-semibold text-zinc-300">
                <span>🍻</span>
                <span>Alcohol: {profile.aboutMe.alcohol}</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl flex items-center gap-2 text-[11px] font-semibold text-zinc-300">
                <span>🔮</span>
                <span>Sign: {profile.aboutMe.sign}</span>
              </div>
            </div>
          </div>

          {/* Hobbies selection tag blocks */}
          <div className="flex flex-col gap-2 text-left">
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest pl-0.5">
              {t.hobbies}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.hobbies.map((h, i) => {
                const colors = [
                  'bg-rose-500/10 text-rose-400 border-rose-500',
                  'bg-yellow-400/10 text-yellow-400 border-yellow-400',
                  'bg-purple-600/10 text-purple-400 border-purple-600',
                  'bg-emerald-500/10 text-emerald-400 border-emerald-500',
                  'bg-blue-400/10 text-blue-400 border-blue-400'
                ];
                const activeColor = colors[i % colors.length];

                return (
                  <span
                    key={h}
                    className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${activeColor}`}
                  >
                    #{h}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Questionnaire layout (Soyo two truths and one lie!) */}
          <div className="bg-zinc-900 border-2 border-black p-4 rounded-2xl shadow-[2px_2px_0_0_rgb(0,0,0)] text-left flex flex-col gap-2">
            <span className="text-yellow-400 text-xs font-black uppercase tracking-wide flex items-center gap-1">
              <span>🎭</span> {t.truthsTitle}
            </span>

            <div className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-300 pl-1 mt-1">
              {profile.truthsAndLie.truths.map((truth, i) => (
                <div key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#a855f7]">✔</span>
                  <span>{truth}</span>
                </div>
              ))}
              <div className="flex items-start gap-2 leading-relaxed text-zinc-400/80">
                <span className="text-rose-500 font-extrabold italic">×</span>
                <span>{profile.truthsAndLie.lie} (Lie)</span>
              </div>
            </div>
          </div>

          {/* What I always says section */}
          <div className="flex flex-col gap-1 text-left">
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest pl-0.5">
              💬 {t.alwaysSays}
            </span>
            <blockquote className="bg-black border border-zinc-800 p-3.5 rounded-2xl text-[11px] font-extrabold text-zinc-400 tracking-tight font-mono uppercase">
              "{profile.alwaysSays}"
            </blockquote>
          </div>

          {/* Bottom triggering Floating chat activator */}
          <button
            onClick={() => onStartChat(profile.id)}
            className="w-full bg-yellow-400 hover:bg-yellow-300 border-3 border-black p-4 rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-black text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-all mt-4"
          >
            <MessageSquare className="w-4 h-4 text-black fill-black" />
            <span>{t.chatBtn}</span>
          </button>

        </div>

      </div>
    </div>
  );
}
