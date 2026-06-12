import React, { useState } from 'react';
import { Heart, MessageCircle, Send, PlusCircle, Image as ImageIcon } from 'lucide-react';
import { MomentPost, AppLanguage } from '../types';

interface MomentsProps {
  language: AppLanguage;
  posts: MomentPost[];
  onLikePost: (postId: string) => void;
  onAddPost: (content: string, imageSrc?: string) => void;
}

export default function Moments({
  language,
  posts,
  onLikePost,
  onAddPost
}: MomentsProps) {
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const t = {
    en: {
      moments: "Moments Wall",
      postPlaceholder: "What's on your party mind? Share some vibes...",
      imageUrlPlaceholder: "Unsplash/Image URL (optional)",
      postBtn: "Post Vibe",
      comments: "Comments",
      cancel: "Cancel",
      shareVibe: "Share a Moment",
    },
    sw: {
      moments: "Ukuta wa Matukio",
      postPlaceholder: "Una nini moyoni? Shiriki vibe yako...",
      imageUrlPlaceholder: "Kiungo cha picha ya Unsplash (si lazima)",
      postBtn: "Tuma Vibe",
      comments: "Maoni",
      cancel: "Ghairi",
      shareVibe: "Shiriki Matukio",
    }
  }[language];

  // Pick a couple interesting stock wallpapers for ease of insertion
  const presetImages = [
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    onAddPost(newPostText, newPostImage || undefined);
    setNewPostText("");
    setNewPostImage("");
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col flex-1 bg-zinc-950 p-4 pb-20 overflow-y-auto">
      
      {/* Wall Title section */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <h2 className="text-xl font-black text-white italic tracking-wide uppercase">
          🔥 {t.moments}
        </h2>
        
        {/* Trigger form overlay */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-yellow-400 text-black font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.shareVibe}</span>
        </button>
      </div>

      {/* Quick Creator Form block toggle */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border-3 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-4 animate-slide-down">
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder={t.postPlaceholder}
            className="w-full bg-zinc-950 text-white p-3 rounded-xl border border-zinc-800 text-sm font-semibold focus:outline-none focus:border-yellow-400 placeholder:text-zinc-500 max-h-32 min-h-[80px]"
            required
          />

          <div className="mt-3">
            <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-1">
              Select or Paste Image
            </label>
            <input
              type="text"
              value={newPostImage}
              onChange={(e) => setNewPostImage(e.target.value)}
              placeholder={t.imageUrlPlaceholder}
              className="w-full bg-zinc-950 text-white px-3 py-2 rounded-xl border border-zinc-805 text-xs font-semibold focus:outline-none focus:border-yellow-400 placeholder:text-zinc-650"
            />
            
            {/* Presets picker list */}
            <div className="flex gap-2 mt-2">
              {presetImages.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setNewPostImage(src)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    newPostImage === src ? 'border-yellow-400 scale-105' : 'border-zinc-800 opacity-60'
                  }`}
                >
                  <img src={src} className="img-no-watermark" alt="preset" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4 border-t border-zinc-800/80 pt-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 bg-transparent hover:bg-zinc-800 text-zinc-400 font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 border-2 border-black text-black font-black text-xs rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 fill-black" />
              <span>{t.postBtn}</span>
            </button>
          </div>
        </form>
      )}

      {/* List of high quality moments */}
      <div className="flex flex-col gap-5 mt-5">
        {posts.map(post => (
          <div
            key={post.id}
            className="bg-zinc-900 border-3 border-black rounded-3xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col hover:border-zinc-800 transition-all"
          >
            {/* Top Row: User details */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden bg-zinc-800">
                <img src={post.authorAvatar} alt={post.authorName} className="img-no-watermark" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-sm text-white">{post.authorName}</span>
                  <span className="bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.1 border border-black rounded-full">
                    {post.authorAge}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-semibold">{post.timestamp}</span>
              </div>
            </div>

            {/* Content text */}
            <p className="text-zinc-200 text-xs font-semibold leading-relaxed mt-3 whitespace-pre-wrap">
              {post.content}
            </p>

            {/* Optional image panel */}
            {post.image && (
              <div className="mt-3.5 rounded-2xl overflow-hidden border-2 border-black bg-zinc-800 max-h-72">
                <img
                  src={post.image}
                  alt="Post attachment"
                  className="img-no-watermark"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Bottom Row: Likes/Comments interactive */}
            <div className="flex items-center gap-6 mt-4 pt-3 border-t border-zinc-900/60">
              {/* Like action */}
              <button
                onClick={() => onLikePost(post.id)}
                className={`flex items-center gap-1.5 text-xs font-black select-none cursor-pointer transition-colors ${
                  post.hasLiked ? 'text-rose-500' : 'text-zinc-400 hover:text-rose-400'
                }`}
              >
                <Heart className={`w-4 h-4 transition-transform ${post.hasLiked ? 'fill-rose-500 scale-125' : 'scale-100'}`} />
                <span>{post.likes}</span>
              </button>

              {/* Comments action with dummy increment */}
              <div className="flex items-center gap-1.5 text-xs font-black text-zinc-400">
                <MessageCircle className="w-4 h-4 text-zinc-400" />
                <span>{post.comments} {t.comments}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
