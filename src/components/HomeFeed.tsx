import React, { useState } from 'react';
import { Sparkles, MapPin, Heart, MessageCircle, Sliders, Search, X } from 'lucide-react';
import { UserProfile, AppLanguage, Gender } from '../types';
import { mockProfiles } from '../data';

interface HomeFeedProps {
  language: AppLanguage;
  onSelectUser: (user: UserProfile) => void;
  onMuteToggle?: () => void;
  onFastChat: (userId: string) => void;
}

export default function HomeFeed({
  language,
  onSelectUser,
  onFastChat
}: HomeFeedProps) {
  const [subTab, setSubTab] = useState<'recommend' | 'newcomer' | 'nearby'>('recommend');
  const [filterGender, setFilterGender] = useState<'All' | 'Female' | 'Male'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const t = {
    en: {
      recommend: "Recommend",
      newcomer: "Newcomer",
      nearby: "Nearby",
      similarity: "Similarity",
      hi: "Hi!",
      filterAll: "All",
      filterFemale: "Girls",
      filterMale: "Boys",
      searchPlaceholder: "Search by interest (e.g. Cooking) or city...",
      clearSearch: "Clear",
      noResults: "No one matches your search. Try another vibe!",
    },
    sw: {
      recommend: "Pendekeza",
      newcomer: "Mpya",
      nearby: "Karibu",
      similarity: "Ulinganifu",
      hi: "Hujambo!",
      filterAll: "Wote",
      filterFemale: "Wasichana",
      filterMale: "Wavulana",
      searchPlaceholder: "Tafuta kwa hobby (mfn. Cooking) au mji...",
      clearSearch: "Futa",
      noResults: "Hakuna mtu aliyepatikana kwa utafutaji huu. Jaribu vibe tofauti!",
    }
  }[language];

  // Filter profiles based on selected subsection tabs, gender filter, and search queries
  const getFilteredProfiles = () => {
    let list = [...mockProfiles];
    
    // Simulate slight ordering differences for tabs
    if (subTab === 'newcomer') {
      list.sort((a, b) => b.age - a.age); // older first as newcomer simulation
    } else if (subTab === 'nearby') {
      list.sort((a, b) => a.distance.localeCompare(b.distance)); // sorted by closer
    } else {
      list.sort((a, b) => b.personalitySimilarity - a.personalitySimilarity); // high matching recommend
    }

    if (filterGender !== 'All') {
      list = list.filter(p => p.gender === filterGender);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => {
        const matchLocation = p.location.toLowerCase().includes(q);
        const matchHobbies = p.hobbies.some(h => h.toLowerCase().includes(q));
        const matchName = p.name.toLowerCase().includes(q);
        const matchStatus = p.status.toLowerCase().includes(q);
        return matchLocation || matchHobbies || matchName || matchStatus;
      });
    }

    return list;
  };

  const filtered = getFilteredProfiles();

  return (
    <div className="flex flex-col flex-1 bg-zinc-950 p-4 pb-20 overflow-y-auto animate-fade-in">
      
      {/* Neobrutalist Pop Search Bar */}
      <div className="mb-4">
        <div className="relative flex items-center w-full border-3 border-black rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-zinc-900 group focus-within:border-yellow-400 transition-all overflow-hidden">
          <div className="pl-3.5 pr-2 py-3 text-zinc-400 group-focus-within:text-yellow-400 shrink-0">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            id="party-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-white py-3 pr-10 text-xs font-bold focus:outline-none placeholder:text-zinc-505"
          />
          {searchQuery && (
            <button
              id="clear-search-button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center justify-center border border-zinc-700"
              title={t.clearSearch}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Upper Navigation Sections & Gender Filters matching Soyo Lite */}
      <div className="flex items-center justify-between border-b-2 border-zinc-805 pb-3 gap-2 flex-wrap">
        
        {/* Core Soyo Tabs */}
        <div className="flex gap-2">
          {(['recommend', 'newcomer', 'nearby'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`text-sm font-black px-3.5 py-1.5 rounded-full border-2 transition-all cursor-pointer ${
                subTab === tab
                  ? 'bg-yellow-400 text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              {t[tab]}
            </button>
          ))}
        </div>

        {/* Short Gender Filter pill tags */}
        <div className="flex gap-1.5 self-end mt-2 md:mt-0">
          {(['All', 'Female', 'Male'] as const).map(g => (
            <button
              key={g}
              onClick={() => setFilterGender(g)}
              className={`text-[10px] font-extrabold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                filterGender === g
                  ? 'bg-black text-yellow-400 border-yellow-400'
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800'
              }`}
            >
              {g === 'All' ? t.filterAll : g === 'Female' ? t.filterFemale : g === 'Male' ? t.filterMale : g}
            </button>
          ))}
        </div>

      </div>

      {/* Profile grid matching video */}
      {filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
          <span className="text-4xl">🏜️</span>
          <p className="text-zinc-500 font-extrabold text-sm mt-2">{t.noResults}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 mt-5">
          {filtered.map(profile => (
            <div
              key={profile.id}
              className="bg-zinc-900 border-3 border-black rounded-3xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(250,204,21,0.25)] hover:border-yellow-400 relative flex flex-col group transition-all"
            >
              {/* Profile Image View */}
              <div 
                className="aspect-square w-full relative overflow-hidden bg-zinc-850 cursor-pointer"
                onClick={() => onSelectUser(profile)}
              >
                <img
                  src={profile.images[0]}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="img-no-watermark"
                />

                {/* Similarity Badge Badge (Green cloud) */}
                <div className="absolute top-2 left-2 bg-black/75 border border-zinc-700 text-[10px] font-black tracking-tight text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="text-emerald-400 text-[9px]">⚡</span>
                  <span>{profile.personalitySimilarity}% match</span>
                </div>

                {/* Active pulse */}
                {profile.online && (
                  <div className="absolute top-2 right-2 bg-emerald-500 border-2 border-black text-black text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-md animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    <span>ONLINE</span>
                  </div>
                )}

                {/* Bottom metadata tag */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/50 to-transparent p-2 pt-8 flex flex-col">
                  {/* Name and age */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-white text-sm font-black truncate">{profile.name}</span>
                    <span className="bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full border border-black transform rotate-2">
                      {profile.age}
                    </span>
                  </div>
                  
                  {/* Distance */}
                  <div className="flex items-center gap-1 text-zinc-300 text-[10px] font-extrabold mt-0.5">
                    <MapPin className="w-2.5 h-2.5 text-yellow-400 shrink-0" />
                    <span>{profile.distance} • {profile.location}</span>
                  </div>
                </div>
              </div>

              {/* Action area: Say hi dialog bubble */}
              <div className="p-2 border-t border-zinc-800/80 mt-auto flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-bold max-w-[80px] truncate">
                  "{profile.status}"
                </span>
                
                {/* Instant "Hi!" yellow comic action button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFastChat(profile.id);
                  }}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs px-3 py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3 fill-black text-black" />
                  <span>{t.hi}</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}
