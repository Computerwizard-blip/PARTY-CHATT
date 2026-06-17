import React, { useState, useEffect, useRef } from 'react';
import { Send, Coins, Users, ShieldAlert, Gift, Phone, Video, Mic, Image as ImageIcon, Smile, Play, ArrowLeft } from 'lucide-react';
import { ChatSession, UserProfile, AppLanguage, ChatMessage } from '../types';
import { mockProfiles, getInteractiveResponse } from '../data';

interface ChatInboxProps {
  language: AppLanguage;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  sessions: ChatSession[];
  setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  openStore: () => void;
  onViewProfile: (userId: string) => void;
  onRecordSentMessage?: (userId: string) => void;
}

export default function ChatInbox({
  language,
  coins,
  setCoins,
  sessions,
  setSessions,
  openStore,
  onViewProfile,
  onRecordSentMessage
}: ChatInboxProps) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [typingId, setTypingId] = useState<string | null>(null);
  const [insufficientModal, setInsufficientModal] = useState(false);
  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const [adTimer, setAdTimer] = useState(3);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.userId === activeSessionId);
  const activeProfile = mockProfiles.find(p => p.id === activeSessionId);

  const t = {
    en: {
      inbox: "Chat Messages",
      noSessions: "No conversations active yet. Go match with someone!",
      insufficientTitle: "Coins insufficient",
      insufficientBody: "Coins can be obtained by completing daily tasks or recharging. Don't miss your fate, you can get free coins below or top up now!",
      rechargeBtn: "Recharge now",
      claimBtn: "Max Claim +50 Coins (Watch 3s Ad)",
      playingAd: "Simulating Sponsor Ad. Please wait...",
      adCoinsClaimed: "Awarded +50 free party coins! ⚡🎁",
      cannotSendAlert: "Earn coins automatically for every text you send!",
      typing: "typing...",
      placeholder: "Write a friendly message...",
      vibePrompt: "Vibe match",
    },
    sw: {
      inbox: "Ujumbe wa Mazungumzo",
      noSessions: "Bado hakuna mazungumzo. Nenda kalingane na mtu!",
      insufficientTitle: "Sarafu hazitoshi",
      insufficientBody: "Sarafu zinaweza kupatikana kwa kukamilisha kazi au kuongeza. Usikose hatima yako, unaweza kupata sarafu za bure hapa chini!",
      rechargeBtn: "Ongeza sasa",
      claimBtn: "Dai Sarafu +50 (Tazama Ad 3s)",
      playingAd: "Inatayarisha Tangazo la Mdhamini. Tafadhali subiri...",
      adCoinsClaimed: "Umepewa sarafu +50 za bure za sherehe! ⚡🎁",
      cannotSendAlert: "Pata sarafu za bure kiotomatiki kwa kila ujumbe unaotuma!",
      typing: "anaandika...",
      placeholder: "Andika ujumbe wa kirafiki...",
      vibePrompt: "Kulingana",
    }
  }[language];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, typingId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeSessionId) return;

    const messageText = inputText;
    setInputText("");

    // Award / Record coins
    if (onRecordSentMessage) {
      onRecordSentMessage(activeSessionId);
    }

    // Append user message with initial sending status (single gray check)
    const msgId = "msg_" + Date.now();
    const userMsg: ChatMessage = {
      id: msgId,
      senderId: "me",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      status: 'sending'
    };

    setSessions(prev => prev.map(s => {
      if (s.userId === activeSessionId) {
        return {
          ...s,
          lastMessage: messageText,
          unreadCount: 0,
          messages: [...s.messages, userMsg]
        };
      }
      return s;
    }));

    // 1. Double gray tick transition after 600ms (received check)
    setTimeout(() => {
      setSessions(prev => prev.map(s => {
        if (s.userId === activeSessionId) {
          return {
            ...s,
            messages: s.messages.map(m => m.id === msgId ? { ...m, status: 'sent' } : m)
          };
        }
        return s;
      }));
    }, 600);

    // 2. Double blue tick transition after 1500ms (opened check)
    setTimeout(() => {
      setSessions(prev => prev.map(s => {
        if (s.userId === activeSessionId) {
          return {
            ...s,
            messages: s.messages.map(m => m.id === msgId ? { ...m, status: 'read' } : m)
          };
        }
        return s;
      }));
    }, 1500);

    // Trigger AI response with typing simulation
    setTypingId(activeSessionId);
    
    // Call the server API for human-like interactive Gemini responses
    fetch("/api/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        profileId: activeSessionId,
        userMessage: messageText
      })
    })
    .then(res => {
      if (!res.ok) throw new Error("HTTP error " + res.status);
      return res.json();
    })
    .then(data => {
      const replyText = data.reply || "Safi sana! Let's chat more. ✨";
      
      // Calculate typing speed dynamically: 35ms per character (human mode)
      // Cap between 1600ms and 4500ms to keep it realistic without being frustrating
      const typingTime = Math.min(Math.max(replyText.length * 35, 1600), 4500);
      
      setTimeout(() => {
        const hostMsg: ChatMessage = {
          id: "msg_" + (Date.now() + 1),
          senderId: activeSessionId,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMine: false
        };

        setSessions(prev => prev.map(s => {
          if (s.userId === activeSessionId) {
            return {
              ...s,
              lastMessage: replyText,
              messages: [...s.messages, hostMsg]
            };
          }
          return s;
        }));
        setTypingId(null);
      }, typingTime);
    })
    .catch(err => {
      console.warn("API reply error, falling back to local chat heuristics:", err);
      // Fallback
      setTimeout(() => {
        const replyText = getInteractiveResponse(activeSessionId, messageText);
        const hostMsg: ChatMessage = {
          id: "msg_" + (Date.now() + 1),
          senderId: activeSessionId,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMine: false
        };

        setSessions(prev => prev.map(s => {
          if (s.userId === activeSessionId) {
            return {
              ...s,
              lastMessage: replyText,
              messages: [...s.messages, hostMsg]
            };
          }
          return s;
        }));
        setTypingId(null);
      }, 2000);
    });
  };

  // Simulates watching an ad and claiming coins
  const startClaimAd = () => {
    setIsPlayingAd(true);
    setAdTimer(3);
    const interval = setInterval(() => {
      setAdTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsPlayingAd(false);
          setInsufficientModal(false);
          setCoins(current => current + 50);
          alert(t.adCoinsClaimed);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 pb-20 overflow-hidden relative">
      
      {/* 1. SESSION SELECTION VIEW */}
      {!activeSessionId ? (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          <h2 className="text-xl font-black text-white italic tracking-wide uppercase border-b border-zinc-900 pb-3 mb-4">
            💬 {t.inbox}
          </h2>

          {sessions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
              <span className="text-4xl">💭</span>
              <p className="text-zinc-500 font-extrabold text-sm mt-3">{t.noSessions}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sessions.map(s => {
                const p = mockProfiles.find(profile => profile.id === s.userId);
                if (!p) return null;

                return (
                  <div
                    key={s.userId}
                    onClick={() => {
                      setActiveSessionId(s.userId);
                      // Reset unread count
                      setSessions(prev => prev.map(item => item.userId === s.userId ? { ...item, unreadCount: 0 } : item));
                    }}
                    className="bg-zinc-900 hover:bg-zinc-850 border-2 border-black p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full border-2 border-black overflow-hidden bg-zinc-850">
                        <img src={p.images[0]} alt={p.name} className="img-no-watermark" referrerPolicy="no-referrer" />
                        {p.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full"></span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-white">{p.name}</span>
                          <span className="bg-yellow-400 text-black text-[9px] font-black px-1 rounded">
                            {p.age}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400 font-semibold truncate max-w-[180px]">
                          {s.lastMessage}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] text-zinc-500 font-bold">{s.lastActive}</span>
                      {s.unreadCount > 0 && (
                        <span className="bg-rose-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full">
                          {s.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        
        // 2. ACTIVE CHAT DIALOG VIEW (Soyo style)
        <div className="flex-1 flex flex-col h-full bg-zinc-950">
          
          {/* Active Chat Header */}
          <div className="bg-yellow-400 border-b-3 border-black p-3 px-4 flex items-center justify-between shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveSessionId(null)}
                className="bg-black hover:bg-zinc-900 border border-white text-white p-1.5 rounded-xl block cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>

              <div 
                className="relative w-10 h-10 rounded-full border-2 border-black overflow-hidden bg-zinc-800 cursor-pointer"
                onClick={() => onViewProfile(activeProfile?.id || "")}
              >
                <img src={activeProfile?.images[0]} alt={activeProfile?.name} className="img-no-watermark" referrerPolicy="no-referrer" />
                {activeProfile?.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full"></span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <span className="font-black text-xs text-black uppercase tracking-wide">{activeProfile?.name}</span>
                  <span className="bg-black text-yellow-400 font-black text-[8px] px-1 rounded-sm">
                    {activeProfile?.age}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-black/80 font-bold uppercase font-mono">
                    {activeProfile?.online ? 'Online' : 'Offline'} • {activeProfile?.distance}
                  </span>
                </div>
              </div>
            </div>

            {/* Sim Match Score & Call buttons */}
            <div className="flex items-center gap-2">
              <span className="bg-black text-white text-[9px] font-black px-2 py-1 rounded-lg border border-white uppercase">
                🤝 {activeProfile?.personalitySimilarity}% Match
              </span>
              
              <button 
                onClick={() => alert("Simulated Live Call is starting... Insufficient credits for audio call.")}
                className="bg-black hover:bg-zinc-900 text-yellow-400 p-1.5 rounded-xl border border-white cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Core Messages Scrolling Wall */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            <div className="self-center bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500 font-black px-3.5 py-1 rounded-full uppercase my-2 max-w-[280px] text-center">
              🔒 Chat sessions are private. {t.cannotSendAlert}
            </div>

            {activeSession?.messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[75%] ${
                  msg.isMine ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                {/* Bubble box */}
                <div
                  className={`p-3.5 rounded-2xl border-2 text-xs font-semibold leading-relaxed shadow-[1.5px_1.5px_0_0_rgb(0,0,0)] ${
                    msg.isMine
                      ? 'bg-purple-600 text-white border-black rounded-tr-none'
                      : 'bg-zinc-900 text-zinc-100 border-black rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                {/* Time status line with simulated double tick and blue tick receipt */}
                <span className="text-[9px] text-zinc-500 font-bold mt-1 px-1 flex items-center gap-1">
                  <span>{msg.timestamp}</span>
                  {msg.isMine && (
                    <span className="inline-flex items-center ml-0.5 select-none">
                      {msg.status === 'sending' && (
                        <span className="text-zinc-650 text-[10.5px]" title="Sending">✔</span>
                      )}
                      {msg.status === 'sent' && (
                        <span className="text-zinc-550 text-[10.5px] font-extrabold tracking-[-2.5px] inline-block pr-1" style={{ letterSpacing: '-2.5px' }} title="Received">✔✔</span>
                      )}
                      {(msg.status === 'read' || !msg.status) && (
                        <span className="text-sky-400 text-[10.5px] font-extrabold tracking-[-2.5px] inline-block pr-1" style={{ letterSpacing: '-2.5px' }} title="Opened">✔✔</span>
                      )}
                    </span>
                  )}
                </span>
              </div>
            ))}

            {/* Sim Typing indicator */}
            {typingId === activeSessionId && (
              <div className="self-start flex items-center gap-1.5 bg-zinc-900 border-2 border-black p-3 rounded-2xl rounded-tl-none shadow-[1.5px_1.5px_0_0_rgb(0,0,0)]">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-bounce delay-200"></span>
                <span className="text-[10px] text-zinc-400 font-black uppercase ml-1">{t.typing}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Interactive footer actions: Mic, Image, Gift, Smile, Text with Yellow circle Send */}
          <form onSubmit={handleSendMessage} className="bg-zinc-900 border-t-3 border-black p-2 shrink-0 flex flex-col gap-1">
            {/* Quick pre-saved templates matching video */}
            <div className="flex gap-2 overflow-x-auto py-1 px-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setInputText("Hello beautiful! 😊")}
                className="bg-zinc-950 hover:bg-zinc-90 w-max shrink-0 text-[10px] font-extrabold text-[#facc15] px-2.5 py-1 rounded-full border border-zinc-800"
              >
                Hello! 😊
              </button>
              <button
                type="button"
                onClick={() => setInputText("Where are you from?")}
                className="bg-zinc-950 hover:bg-zinc-90 w-max shrink-0 text-[10px] font-extrabold text-[#facc15] px-2.5 py-1 rounded-full border border-zinc-800"
              >
                Where are you from? 🌍
              </button>
              <button
                type="button"
                onClick={() => setInputText("What are your hobbies? 🍹")}
                className="bg-zinc-950 hover:bg-zinc-90 w-max shrink-0 text-[10px] font-extrabold text-[#facc15] px-2.5 py-1 rounded-full border border-zinc-800"
              >
                Hobbies? 🍹
              </button>
            </div>

            <div className="flex items-center gap-2 mt-1">
              
              {/* Media utility controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button 
                  type="button" 
                  onClick={() => alert("Simulated mic - Press and hold to record is locked.")} 
                  className="p-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 text-xs flex items-center justify-center cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <button 
                  type="button" 
                  onClick={() => alert("Choose image is simulated.")} 
                  className="p-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 text-xs flex items-center justify-center cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setCoins(c => c + 150);
                    alert("Gave 150 coins gift!");
                  }} 
                  className="p-1.5 bg-zinc-950 hover:bg-yellow-500/10 border border-zinc-850 rounded-xl text-yellow-400 text-xs flex items-center justify-center cursor-pointer"
                  title="Virtual Gift (Cheat to add coins!)"
                >
                  <Gift className="w-3.5 h-3.5 hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* Text Area Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full bg-zinc-950 text-white rounded-xl border border-zinc-800 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-yellow-400 placeholder:text-zinc-500 pr-8"
                />
                <button type="button" className="absolute right-2 top-2.5 text-zinc-500 hover:text-white">
                  <Smile className="w-4 h-4" />
                </button>
              </div>

              {/* Round customized Send trigger button */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`p-2.5 rounded-full border-2 border-black shadow-[1.5px_1.5px_0_0_rgb(0,0,0)] transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                  inputText.trim()
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                    : 'bg-zinc-800 text-zinc-650 border-zinc-900 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5 fill-current" />
              </button>

            </div>
          </form>
        </div>
      )}

      {/* 3. COINS INSUFFICIENT MODAL WARNING (Matched Soyo Lite video absolutely) */}
      {insufficientModal && (
        <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-5 z-50 animate-fade-in">
          <div className="bg-zinc-900 border-4 border-black p-6 rounded-3xl max-w-xs w-full text-center shadow-[6px_6px_0_0_#ef4444] flex flex-col items-center">
            
            {/* Spinning coin icon */}
            <div className="w-16 h-16 bg-yellow-400 rounded-full border-3 border-black flex items-center justify-center shadow-[3px_3px_0_0_rgba(0,0,0,1)] text-2xl font-black text-black animate-pulse mb-4">
              $
            </div>

            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide">
              ⚠️ {t.insufficientTitle}
            </h3>
            
            <p className="text-zinc-400 text-xs font-semibold leading-relaxed mb-6">
              {t.insufficientBody}
            </p>

            {/* Simulated Ad stream view */}
            {isPlayingAd ? (
              <div className="w-full bg-black border-2 border-yellow-400 p-4 rounded-xl flex flex-col items-center gap-1.5 mb-2 animate-pulse">
                <p className="text-yellow-400 font-extrabold text-[11px] uppercase tracking-wider">
                  🎬 {t.playingAd}
                </p>
                <span className="text-white font-mono font-black text-xl">
                  {adTimer}s
                </span>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 transition-all duration-1000" 
                    style={{ width: `${(adTimer / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 w-full">
                {/* Watch Ad simulation trigger button */}
                <button
                  onClick={startClaimAd}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-3 px-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer text-xs uppercase"
                >
                  🎁 {t.claimBtn}
                </button>

                {/* Direct recharge option button */}
                <button
                  onClick={() => {
                    setInsufficientModal(false);
                    openStore();
                  }}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-2.5 px-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer text-xs"
                >
                  💰 {t.rechargeBtn}
                </button>
                
                <button
                  onClick={() => setInsufficientModal(false)}
                  className="w-full text-zinc-500 font-bold py-1.5 text-xs hover:text-white"
                >
                  Close
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
