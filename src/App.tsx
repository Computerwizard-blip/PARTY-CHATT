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

  const [genderPreference, setGenderPreference] = useState<Gender>(() => {
    return (localStorage.getItem('party_chatt_pref_gender') as Gender) || 'Female';
  });

  // Coins balance starts at 540 (just like Soyo Lite screen coin counter 540!)
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('party_chatt_coins');
    return saved ? parseInt(saved, 10) : 540;
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
            isMine: true
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

  const handleOnboardingComplete = (gender: Gender, preference: string) => {
    setGenderPreference(gender);
    setOnboardingCompleted(true);
    localStorage.setItem('party_chatt_onboarding', 'true');
    localStorage.setItem('party_chatt_pref_gender', gender);
    
    // Auto show Daily Check-in modal to engage user immediately upon finishing onboarding!
    setShowCheckInModal(true);
  };

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out? It will reset your local onboarding state.")) {
      setOnboardingCompleted(false);
      localStorage.removeItem('party_chatt_onboarding');
      setActiveTab('home');
    }
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

  // Create customized Moment post
  const handleAddPost = (content: string, imageSrc?: string) => {
    const newPost: MomentPost = {
      id: "user_post_" + Date.now(),
      authorName: "Francis Ndungu", // Client username
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
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
  };

  // Click on direct "Hi!" quick speech bubble in feeds
  const handleFastChat = (userId: string) => {
    const existing = sessions.find(s => s.userId === userId);
    
    // Check if user has sufficient coins to message (20 coins)
    if (coins < 20) {
      setActiveTab('messages'); // Swaps tab first
      return;
    }

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
            isMine: true
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
      // Reduce coins!
      setCoins(prev => Math.max(0, prev - 20));
      setSessions(prev => [newSession, ...prev]);
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
        <Onboarding language={language} onComplete={handleOnboardingComplete} />
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
              />
            )}

            {activeTab === 'moments' && (
              <Moments
                language={language}
                posts={posts}
                onLikePost={handleLikePost}
                onAddPost={handleAddPost}
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
              />
            )}

            {activeTab === 'profile' && (
              <ProfilePage
                language={language}
                setLanguage={setLanguage}
                coins={coins}
                setCoins={setCoins}
                onSignOut={handleSignOut}
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

        </div>
      )}
    </div>
  );
}
