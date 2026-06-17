import React, { useState, useEffect } from 'react';
import { Home, Image as ImageIcon, MessageSquare, User, HelpCircle, Coins, Heart } from 'lucide-react';
import { UserProfile, ChatSession, MomentPost, Gender, AppLanguage } from './types';
import { mockProfiles, mockMoments } from './data';

import Onboarding from './components/Onboarding';
import Header from './components/Header';
import HomeFeed from './components/HomeFeed';
import Moments from './components/Moments';
import ChatInbox from './components/ChatInbox';
import ProfilePage from './components/ProfilePage';
import DailyCheckIn from './components/DailyCheckIn';
import UserProfileModal from './components/UserProfileModal';

export default function App() {
  // Onboarding Completed state
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => {
    return localStorage.getItem('party_chatt_onboarding') === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('party_chatt_current_user');
    if (saved) return JSON.parse(saved);
    return {
      name: "Francis Ndungu",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
      id: "388037431"
    };
  });

  const [genderPreference, setGenderPreference] = useState<Gender>(() => {
    return (localStorage.getItem('party_chatt_pref_gender') as Gender) || 'Female';
  });

  // Coins balance starts at 0 as requested ("let the coins start with zero coins and accumulate as he/she texts")
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('party_chatt_coins');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Track daily text/moments progress for the 1-Week challenge to earn KES 200sh
  const [challengeDay, setChallengeDay] = useState<number>(() => {
    const saved = localStorage.getItem('party_chatt_challenge_day');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [dailyMessagesSent, setDailyMessagesSent] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('party_chatt_daily_messages');
    return saved ? JSON.parse(saved) : {};
  });

  const [momentPostedToday, setMomentPostedToday] = useState<boolean>(() => {
    return localStorage.getItem('party_chatt_moment_posted_today') === 'true';
  });

  const [momentsPostedHistory, setMomentsPostedHistory] = useState<Record<number, boolean>>(() => {
    const saved = localStorage.getItem('party_chatt_moments_history');
    return saved ? JSON.parse(saved) : {};
  });

  const [hasWithdrawn, setHasWithdrawn] = useState<boolean>(() => {
    return localStorage.getItem('party_chatt_has_withdrawn') === 'true';
  });

  // App language default (en or sw)
  const [language, setLanguage] = useState<AppLanguage>(() => {
    return (localStorage.getItem('party_chatt_lang') as AppLanguage) || 'en';
  });

  // Bottom Tabs Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'moments' | 'messages' | 'profile'>('home');

  // Daily Check-in claimed days list
  const [checkedInDays, setCheckedInDays] = useState<number[]>(() => {
    const saved = localStorage.getItem('party_chatt_checked_in');
    return saved ? JSON.parse(saved) : [1]; // preloaded with Day 1 checked-in matching the video!
  });

  // Followed profile IDs list
  const [followedIds, setFollowedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('party_chatt_followed_ids');
    return saved ? JSON.parse(saved) : [];
  });

  // Mutual friend profiles list
  const [friendIds, setFriendIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('party_chatt_friend_ids');
    return saved ? JSON.parse(saved) : [];
  });

  // Celebratory mutual follow match modal alert state
  const [matchAlert, setMatchAlert] = useState<{
    show: boolean;
    userName: string;
    userAvatar: string;
  } | null>(null);

  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Moments list
  const [posts, setPosts] = useState<MomentPost[]>(() => {
    const saved = localStorage.getItem('party_chatt_posts');
    return saved ? JSON.parse(saved) : mockMoments;
  });

  // Simulated conversations database
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('party_chatt_sessions');
    if (saved) return JSON.parse(saved);

    // Default preconfigured chats matching the Soyo video logs:
    return [
      {
        userId: "lovergirl",
        lastMessage: "Hi friend! Let's match and talk, can we be genuine buddies?",
        lastActive: "Today 10:14",
        unreadCount: 1,
        messages: [
          {
            id: "m_pre_1_1",
            senderId: "lovergirl",
            text: "Hi friend! Let's match and talk, can we be genuine buddies?",
            timestamp: "10:14 AM",
            isMine: false
          }
        ]
      },
      {
        userId: "daniellah",
        lastMessage: "Where are you from? I am checking sunset views in Nairobi! 🌄🍹",
        lastActive: "Today 08:30",
        unreadCount: 0,
        messages: [
          {
            id: "m_pre_2_1",
            senderId: "daniellah",
            text: "Hey! What's up?",
            timestamp: "08:14 AM",
            isMine: false
          },
          {
            id: "m_pre_2_2",
            senderId: "me",
            text: "Vibein' at home. How about you?",
            timestamp: "08:25 AM",
            isMine: true,
            status: "read"
          },
          {
            id: "m_pre_2_3",
            senderId: "daniellah",
            text: "Where are you from? I am checking sunset views in Nairobi! 🌄🍹",
            timestamp: "08:30 AM",
            isMine: false
          }
        ]
      }
    ];
  });

  // Persist variables in localStorage
  useEffect(() => {
    localStorage.setItem('party_chatt_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('party_chatt_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('party_chatt_checked_in', JSON.stringify(checkedInDays));
  }, [checkedInDays]);

  useEffect(() => {
    localStorage.setItem('party_chatt_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('party_chatt_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('party_chatt_challenge_day', challengeDay.toString());
  }, [challengeDay]);

  useEffect(() => {
    localStorage.setItem('party_chatt_daily_messages', JSON.stringify(dailyMessagesSent));
  }, [dailyMessagesSent]);

  useEffect(() => {
    localStorage.setItem('party_chatt_moment_posted_today', momentPostedToday ? 'true' : 'false');
  }, [momentPostedToday]);

  useEffect(() => {
    localStorage.setItem('party_chatt_moments_history', JSON.stringify(momentsPostedHistory));
  }, [momentsPostedHistory]);

  useEffect(() => {
    localStorage.setItem('party_chatt_has_withdrawn', hasWithdrawn ? 'true' : 'false');
  }, [hasWithdrawn]);

  // Translate navigation labels
  const navLabels = {
    en: {
      home: "Party",
      moments: "Moments",
      messages: "Chats",
      profile: "Me",
    },
    sw: {
      home: "Sherehe",
      moments: "Matukio",
      messages: "Ujumbe",
      profile: "Mimi",
    }
  }[language];

  const handleOnboardingComplete = (
    gender: Gender,
    preference: string,
    regName?: string,
    regLocation?: string,
    regPhone?: string,
    regPassword?: string
  ) => {
    setGenderPreference(gender);

    // If registree information is present, bootstrap a new user profile
    if (regName && regName.trim()) {
      const selectedAvatar = gender === 'Male'
        ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150";

      const newUser = {
        name: regName.trim(),
        avatar: selectedAvatar,
        id: Math.floor(100000000 + Math.random() * 900000000).toString(),
        location: (regLocation || "Nairobi").trim(),
        phone: (regPhone || "").trim(),
        password: (regPassword || "").trim()
      };

      setCurrentUser(newUser);
      localStorage.setItem('party_chatt_current_user', JSON.stringify(newUser));

      // Persist to registered accounts array
      const rawAccounts = localStorage.getItem('party_chatt_registered_accounts') || '[]';
      const accounts = JSON.parse(rawAccounts);
      // Ensure we don't save duplicates
      const cleanPhone = newUser.phone.replace(/\s+/g, '');
      const filtered = accounts.filter((acc: any) => acc.phone?.replace(/\s+/g, '') !== cleanPhone);
      filtered.push(newUser);
      localStorage.setItem('party_chatt_registered_accounts', JSON.stringify(filtered));
    }

    setOnboardingCompleted(true);
    localStorage.setItem('party_chatt_onboarding', 'true');
    localStorage.setItem('party_chatt_pref_gender', gender);
    
    // Auto show Daily Check-in modal to engage user immediately upon finishing onboarding!
    setShowCheckInModal(true);
  };

  const handleSignOut = () => {
    setOnboardingCompleted(false);
    localStorage.removeItem('party_chatt_onboarding');
    setActiveTab('home');
  };

  const handleRestoreSession = () => {
    setOnboardingCompleted(true);
    localStorage.setItem('party_chatt_onboarding', 'true');
  };

  // Like / Unlike moment status
  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const liked = !post.hasLiked;
        return {
          ...post,
          hasLiked: liked,
          likes: liked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  // Follow & Friend reciprocity action
  const handleFollowToggle = (userId: string) => {
    const isCurrentlyFollowing = followedIds.includes(userId);
    let nextFollowed: string[];
    let nextFriends: string[];

    if (isCurrentlyFollowing) {
      nextFollowed = followedIds.filter(id => id !== userId);
      nextFriends = friendIds.filter(id => id !== userId);
    } else {
      nextFollowed = [...followedIds, userId];
      nextFriends = [...friendIds, userId];

      const targetUser = mockProfiles.find(p => p.id === userId);
      if (targetUser) {
        setMatchAlert({
          show: true,
          userName: targetUser.name,
          userAvatar: targetUser.images[0]
        });
      }
    }

    setFollowedIds(nextFollowed);
    setFriendIds(nextFriends);
    localStorage.setItem('party_chatt_followed_ids', JSON.stringify(nextFollowed));
    localStorage.setItem('party_chatt_friend_ids', JSON.stringify(nextFriends));
  };

  // Method to record a text message and award coins (hidden cap)
  const handleRecordSentMessage = (targetId: string) => {
    setDailyMessagesSent(prev => {
      const curCount = prev[targetId] || 0;
      const nextCount = curCount + 1;
      const nextMap = { ...prev, [targetId]: nextCount };
      
      // Award 15 coins per message up to a maximum of 5 messages per account, per day (don't tell him!)
      if (curCount < 5) {
        setCoins(c => {
          const nextCoins = c + 15;
          return nextCoins;
        });
      }
      return nextMap;
    });
  };

  // Create customized Moment post
  const handleAddPost = (content: string, imageSrc?: string) => {
    const newPost: MomentPost = {
      id: "user_post_" + Date.now(),
      authorName: currentUser.name, // Client username
      authorAvatar: currentUser.avatar,
      authorAge: 24,
      authorGender: "Male",
      content: content,
      image: imageSrc,
      likes: 0,
      comments: 0,
      timestamp: "Just now",
      hasLiked: false,
      isUserPost: true
    };

    setPosts(prev => [newPost, ...prev]);

    // Daily Moment challenge tracker:
    // Award 40 coins for first moment posted today (1 per day for 1 week to achieve 2000 coins)
    if (!momentPostedToday) {
      setMomentPostedToday(true);
      setMomentsPostedHistory(prev => ({
        ...prev,
        [challengeDay]: true
      }));
      setCoins(c => c + 40);
    }
  };

  // Click on direct "Hi!" quick speech bubble in feeds (completely free, no cost!)
  const handleFastChat = (userId: string) => {
    const existing = sessions.find(s => s.userId === userId);

    if (!existing) {
      // Setup a brand new chat session with default welcome greetings
      const targetUser = mockProfiles.find(p => p.id === userId);
      const newSession: ChatSession = {
        userId: userId,
        lastMessage: "Hi! Say hi back to unlock free connections! 🥳🍹",
        lastActive: "Now",
        unreadCount: 0,
        messages: [
          {
            id: "instant_hi_" + Date.now(),
            senderId: "me",
            text: "Hello! 👋 Glad to match with you on Party Chatt!",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMine: true,
            status: "read"
          },
          {
            id: "instant_reply_" + Date.now(),
            senderId: userId,
            text: targetUser ? `Hey there! 😊 So energetic to see you. Thanks for matches metrics! "${targetUser.status}".` : "Hello!",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMine: false
          }
        ]
      };
      
      setSessions(prev => [newSession, ...prev]);
      // Record first sent message for coin accumulation
      handleRecordSentMessage(userId);
    }

    setActiveTab('messages');
  };

  // Initiate direct chat sequence from active profile popup dialog modal
  const handleStartChatFromModal = (userId: string) => {
    setSelectedUser(null);
    handleFastChat(userId);
  };

  // Compute total unread message counts for dynamic red alert badge in navigation bar!
  const totalUnreads = sessions.reduce((accum, val) => accum + (val.unreadCount || 0), 0);

  return (
    <div className="absolute inset-0 bg-zinc-950 font-sans antialiased text-white overflow-hidden">
      
      {/* ONBOARDING FLOW PANEL SCREEN */}
      {!onboardingCompleted ? (
        <Onboarding 
          language={language} 
          onComplete={handleOnboardingComplete} 
          onRestoreSession={handleRestoreSession} 
        />
      ) : (
        <div className="flex flex-col h-full max-w-sm mx-auto bg-black relative shadow-2xl border-x-4 border-black">
          
          {/* Persistent engaging header titled 'PARTY CHATT' */}
          <Header
            coins={coins}
            language={language}
            setLanguage={setLanguage}
            onOpenStore={() => setActiveTab('profile')} // Opens profile tab which acts as the shop
            onOpenCheckIn={() => setShowCheckInModal(true)}
          />

          {/* ACTIVE ROUTING TABS PORTAL CONTAINER */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeTab === 'home' && (
              <HomeFeed
                language={language}
                onSelectUser={(user) => setSelectedUser(user)}
                onFastChat={handleFastChat}
                followedIds={followedIds}
                friendIds={friendIds}
                onFollowToggle={handleFollowToggle}
              />
            )}

            {activeTab === 'moments' && (
              <Moments
                language={language}
                posts={posts}
                onLikePost={handleLikePost}
                onAddPost={handleAddPost}
                currentUser={currentUser}
              />
            )}

            {activeTab === 'messages' && (
              <ChatInbox
                language={language}
                coins={coins}
                setCoins={setCoins}
                sessions={sessions}
                setSessions={setSessions}
                openStore={() => setActiveTab('profile')}
                onViewProfile={(userId) => {
                  const target = mockProfiles.find(p => p.id === userId);
                  if (target) setSelectedUser(target);
                }}
                onRecordSentMessage={handleRecordSentMessage}
              />
            )}

            {activeTab === 'profile' && (
              <ProfilePage
                language={language}
                setLanguage={setLanguage}
                coins={coins}
                setCoins={setCoins}
                onSignOut={handleSignOut}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                followedIds={followedIds}
                friendIds={friendIds}
                onSelectUser={(user) => setSelectedUser(user)}
                challengeDay={challengeDay}
                setChallengeDay={setChallengeDay}
                dailyMessagesSent={dailyMessagesSent}
                setDailyMessagesSent={setDailyMessagesSent}
                momentPostedToday={momentPostedToday}
                setMomentPostedToday={setMomentPostedToday}
                momentsPostedHistory={momentsPostedHistory}
                setMomentsPostedHistory={setMomentsPostedHistory}
                hasWithdrawn={hasWithdrawn}
                setHasWithdrawn={setHasWithdrawn}
              />
            )}
          </div>

          {/* CUSTOM BOTTOM NAVIGATION NAVIGATION BAR (Soyo pop out themed layout) */}
          <nav className="absolute bottom-0 inset-x-0 h-18 bg-zinc-900 border-t-4 border-black px-3.5 py-2 flex items-center justify-around z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
            
            {/* Nav: Party Feed Tab */}
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                activeTab === 'home' ? 'text-yellow-400 scale-110' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className={`p-1.5 rounded-xl border border-transparent ${activeTab === 'home' ? 'bg-black border-yellow-400' : ''}`}>
                <Home className="w-5 h-5 text-current fill-current" />
              </div>
              <span className="text-[10px] font-black tracking-wider uppercase">{navLabels.home}</span>
            </button>

            {/* Nav: Moments Wall Tab */}
            <button
              onClick={() => setActiveTab('moments')}
              className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                activeTab === 'moments' ? 'text-yellow-400 scale-110' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className={`p-1.5 rounded-xl border border-transparent ${activeTab === 'moments' ? 'bg-black border-yellow-400' : ''}`}>
                <ImageIcon className="w-5 h-5 text-current fill-current" />
              </div>
              <span className="text-[10px] font-black tracking-wider uppercase">{navLabels.moments}</span>
            </button>

            {/* Nav: Messages Chat-Inbox */}
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all relative ${
                activeTab === 'messages' ? 'text-yellow-400 scale-110' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className={`p-1.5 rounded-xl border border-transparent relative ${activeTab === 'messages' ? 'bg-black border-yellow-400' : ''}`}>
                <MessageSquare className="w-5 h-5 text-current fill-current" />
                {totalUnreads > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-rose-500 border border-black text-white text-[9px] font-black px-1.5 py-0.2 rounded-full transform rotate-12 scale-100 animate-pulse">
                    {totalUnreads}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-black tracking-wider uppercase">{navLabels.messages}</span>
            </button>

            {/* Nav: Personal center */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                activeTab === 'profile' ? 'text-yellow-400 scale-110' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className={`p-1.5 rounded-xl border border-transparent ${activeTab === 'profile' ? 'bg-black border-yellow-400' : ''}`}>
                <User className="w-5 h-5 text-current fill-current" />
              </div>
              <span className="text-[10px] font-black tracking-wider uppercase">{navLabels.profile}</span>
            </button>

          </nav>

          {/* DYNAMIC BACKEND DETAILED MODALS LIST */}
          {selectedUser && (
            <UserProfileModal
              language={language}
              profile={selectedUser}
              onClose={() => setSelectedUser(null)}
              onStartChat={handleStartChatFromModal}
            />
          )}

          {showCheckInModal && (
            <DailyCheckIn
              language={language}
              coins={coins}
              setCoins={setCoins}
              checkedInDays={checkedInDays}
              setCheckedInDays={setCheckedInDays}
              onClose={() => setShowCheckInModal(false)}
            />
          )}

          {/* CELEBRATORY MUTUAL FOLLOW MATCH ALERT MODAL */}
          {matchAlert && matchAlert.show && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-xs bg-zinc-900 border-4 border-black rounded-[32px] p-6 text-center shadow-[6px_6px_0_0_#e11d48] shrink-0 relative overflow-hidden">
                {/* Background decorative sparks */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-rose-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2"></div>

                <div className="text-3xl mb-2">🎉</div>
                
                <h3 className="text-xl font-black text-rose-500 uppercase tracking-wide">
                  {language === 'en' ? "It's a Match!" : "Ni Mechi!"}
                </h3>
                <p className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest mt-1">
                  {language === 'en' ? "Mutual Followers" : "Mnafuatana Sasa"}
                </p>

                {/* Match Avatars representation */}
                <div className="flex items-center justify-center gap-4 my-6 relative">
                  {/* Mine */}
                  <div className="w-14 h-14 rounded-full border-3 border-black overflow-hidden shadow-[2px_2px_0_0_rgba(0,0,0,1)] relative z-10 shrink-0">
                    <img src={currentUser.avatar} alt="Me" className="img-no-watermark w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>

                  {/* Heart Spacer */}
                  <div className="absolute bg-rose-600 border-2 border-black text-white p-1.5 rounded-full shadow-md z-25 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 scale-110">
                    <Heart className="w-3.5 h-3.5 fill-current text-white animate-pulse" />
                  </div>

                  {/* Theirs */}
                  <div className="w-14 h-14 rounded-full border-3 border-black overflow-hidden shadow-[2px_2px_0_0_rgba(0,0,0,1)] relative z-10 shrink-0">
                    <img src={matchAlert.userAvatar} alt="Match" className="img-no-watermark w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>

                <p className="text-xs font-bold text-white mb-6 leading-relaxed px-1">
                  {language === 'en' 
                    ? `You and ${matchAlert.userName} followed each other and became Friends! 🤝`
                    : `Wewe na ${matchAlert.userName} mmefuatana na sasa ninyi ni Marafiki! 🤝`
                  }
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setMatchAlert(null);
                      // Instantly transition to messages and start a conversation with them!
                      const targetId = mockProfiles.find(p => p.name === matchAlert.userName)?.id || "";
                      handleFastChat(targetId);
                    }}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs py-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-y-[0.5px] cursor-pointer transition uppercase tracking-wider"
                  >
                    {language === 'en' ? "Chat Now 💬" : "Zungumza Sasa 💬"}
                  </button>
                  <button
                    onClick={() => setMatchAlert(null)}
                    className="text-zinc-500 hover:text-zinc-300 text-[10px] font-black uppercase tracking-wider py-1 cursor-pointer"
                  >
                    {language === 'en' ? "Close" : "Funga"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
