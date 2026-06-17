import { UserProfile, MomentPost, CoinPackage, Gender } from './types';

// Raw county profile details spanning all 47 counties of Kenya with tribal/local naming alignment
const countyProfilesRaw = [
  { county: "Mombasa", name: "Lovergirl", age: 22, gender: "Female", images: ["/assets/input_file_0.png", "/assets/input_file_1.png", "/assets/input_file_2.png"], hobbies: ["Design", "Dancing", "Netball", "Festivals", "Cooking"], status: "humble girl looking for cool connections" },
  { county: "Kwale", name: "Daniellah", age: 27, gender: "Female", images: ["/assets/input_file_11.png", "/assets/input_file_12.png"], hobbies: ["Travel", "Photography", "Music", "Fitness"], status: "Chasing sunsets and beautiful memories" },
  { county: "Kilifi", name: "Kiki-C", age: 30, gender: "Female", images: ["/assets/input_file_3.png", "/assets/input_file_8.png"], hobbies: ["Dancing", "Business", "Gym", "Sushi dating"], status: "Independent and loving life!" },
  { county: "Tana River", name: "Spicy", age: 36, gender: "Female", images: ["/assets/input_file_7.png", "/assets/input_file_4.png"], hobbies: ["Reading", "Coffee", "Yoga", "Hiking"], status: "Sassy and classy" },
  { county: "Lamu", name: "Nura", age: 20, gender: "Female", images: ["/assets/input_file_13.png", "/assets/input_file_5.png"], hobbies: ["Cooking", "Tiktok editing", "Movies", "Shopping"], status: "Quiet outside, party inside 💖" },
  { county: "Taita-Taveta", name: "Halima", age: 25, gender: "Female", images: ["/assets/input_file_6.png", "/assets/input_file_10.png", "/assets/input_file_9.png"], hobbies: ["Cooking", "Netball", "Blogging", "Board Games"], status: "Simple, honest, and ready to meet awesome folks" },
  { county: "Garissa", name: "Fatma", age: 23, gender: "Female", images: ["/assets/input_file_0.png", "/assets/input_file_4.png"], hobbies: ["Baking", "Henna Design", "Fashion"], status: "Shy but super friendly once we connect!" },
  { county: "Wajir", name: "Asha", age: 24, gender: "Female", images: ["/assets/input_file_1.png", "/assets/input_file_5.png"], hobbies: ["Reading", "Coffee dating", "Blogging"], status: "Live and laugh, seeking genuine conversations" },
  { county: "Mandera", name: "Amina", age: 21, gender: "Female", images: ["/assets/input_file_2.png", "/assets/input_file_6.png"], hobbies: ["Cooking", "Tiktok", "Music"], status: "Positive vibes only!" },
  { county: "Marsabit", name: "Talaso", age: 26, gender: "Female", images: ["/assets/input_file_11.png", "/assets/input_file_7.png"], hobbies: ["Nature", "Hiking", "Travel"], status: "Let's explore Marsabit's beauty together" },
  { county: "Isiolo", name: "Kaltuma", age: 22, gender: "Female", images: ["/assets/input_file_12.png", "/assets/input_file_8.png"], hobbies: ["Dancing", "Socializing", "Fashion"], status: "Vibrant girl looking for nice vibes" },
  { county: "Meru", name: "Mwenda", age: 25, gender: "Male", images: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600"], hobbies: ["Farming", "Rugby", "Driving"], status: "Chill Meru gentleman ready to mingle" },
  { county: "Tharaka-Nithi", name: "Emily Gakii", age: 24, gender: "Female", images: ["/assets/input_file_3.png", "/assets/input_file_9.png"], hobbies: ["Cooking", "Volleyball", "Cycling"], status: "Simple and humble soul" },
  { county: "Embu", name: "Mwaniki", age: 26, gender: "Male", images: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600"], hobbies: ["Gym", "Gaming", "Swimming"], status: "Embu guy looking for a lovely partner" },
  { county: "Kitui", name: "Syombua", age: 23, gender: "Female", images: ["/assets/input_file_13.png", "/assets/input_file_10.png"], hobbies: ["Singing", "Cooking", "Dancing"], status: "Very sweet and honest girl" },
  { county: "Machakos", name: "Ndinda", age: 24, gender: "Female", images: ["/assets/input_file_0.png", "/assets/input_file_11.png"], hobbies: ["Photography", "Movies", "Netball"], status: "Sweet girl looking for cool catchups" },
  { county: "Makueni", name: "Mutua", age: 27, gender: "Male", images: ["https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600"], hobbies: ["Music", "Road trips", "Hiking"], status: "Spontaneous and outgoing" },
  { county: "Nyandarua", name: "Wanjiku", age: 25, gender: "Female", images: ["/assets/input_file_1.png", "/assets/input_file_12.png"], hobbies: ["Farming", "Cozy Coffee", "Cooking"], status: "Passionate about life and nature" },
  { county: "Nyeri", name: "Wambui", age: 26, gender: "Female", images: ["/assets/input_file_2.png", "/assets/input_file_13.png"], hobbies: ["Nature", "Movies", "Swimming"], status: "Adventure-loving mountain girl 🏔️" },
  { county: "Kirinyaga", name: "Wangari", age: 22, gender: "Female", images: ["/assets/input_file_3.png", "/assets/input_file_0.png"], hobbies: ["Singing", "Blogging", "Travel"], status: "Outgoing and friendly" },
  { county: "Murang'a", name: "Mwangi", age: 28, gender: "Male", images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"], hobbies: ["Football", "Tech", "Investing"], status: "Down to earth and ambitious" },
  { county: "Kiambu", name: "Nyokabi", age: 23, gender: "Female", images: ["/assets/input_file_4.png", "/assets/input_file_1.png"], hobbies: ["Boba Tea", "Shopping", "Gossip"], status: "Independent, sassy and classy" },
  { county: "Turkana", name: "Scolastica", age: 24, gender: "Female", images: ["/assets/input_file_5.png", "/assets/input_file_2.png"], hobbies: ["Dancing", "Nature walks", "Fitness"], status: "A local beauty looking to explore connections" },
  { county: "West Pokot", name: "Chemutai", age: 25, gender: "Female", images: ["/assets/input_file_6.png", "/assets/input_file_3.png"], hobbies: ["Singing", "Podcasts", "Cycling"], status: "Seeking true friendship" },
  { county: "Samburu", name: "Leshore", age: 27, gender: "Male", images: ["https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600"], hobbies: ["Safaris", "History", "Traditional dance"], status: "Samburu warrior vibe, modern mindset" },
  { county: "Trans-Nzoia", name: "Nekesa", age: 22, gender: "Female", images: ["/assets/input_file_7.png", "/assets/input_file_4.png"], hobbies: ["Baking", "Badminton", "Reading"], status: "Warm-hearted and ready to chat!" },
  { county: "Uasin Gishu", name: "Chepkoech", age: 26, gender: "Female", images: ["/assets/input_file_8.png", "/assets/input_file_5.png"], hobbies: ["Athletics", "Running", "Music"], status: "Enthusiastic run-lover, simple spirit" },
  { county: "Elgeyo-Marakwet", name: "Jeruto", age: 23, gender: "Female", images: ["/assets/input_file_9.png", "/assets/input_file_6.png"], hobbies: ["Running", "Dancing", "Movies"], status: "Champions live here. Let's make memories!" },
  { county: "Nandi", name: "Chebet", age: 24, gender: "Female", images: ["/assets/input_file_10.png", "/assets/input_file_7.png"], hobbies: ["Athletics", "Coffee tasting", "Blogging"], status: "Very positive and disciplined" },
  { county: "Baringo", name: "Jepkemoi", age: 25, gender: "Female", images: ["/assets/input_file_11.png", "/assets/input_file_8.png"], hobbies: ["Hiking", "Volleyball", "Baking"], status: "Loving nature, seeking interesting minds" },
  { county: "Laikipia", name: "Ngugi", age: 29, gender: "Male", images: ["https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&q=80&w=600"], hobbies: ["Ranching", "Photography", "Camping"], status: "Laikipia nature lover" },
  { county: "Nakuru", name: "Wairimu", age: 24, gender: "Female", images: ["/assets/input_file_12.png", "/assets/input_file_9.png"], hobbies: ["Tourism", "Partying", "Dancing"], status: "Life is for living! Let's hit the Nakuru clubs!" },
  { county: "Narok", name: "Sian", age: 21, gender: "Female", images: ["/assets/input_file_13.png", "/assets/input_file_10.png"], hobbies: ["Wildfire touring", "Nature photography", "Beading"], status: "Lover of the wild and colorful cultures" },
  { county: "Kajiado", name: "Naisenya", age: 22, gender: "Female", images: ["/assets/input_file_0.png", "/assets/input_file_11.png"], hobbies: ["Cultural tours", "Blogging", "Charity"], status: "Maasai model seeking true friends" },
  { county: "Kericho", name: "Kipsang", age: 26, gender: "Male", images: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600"], hobbies: ["Tea picking", "Music", "Fitness"], status: "Tea-capital guy, warm conversation" },
  { county: "Bomet", name: "Chepkemoi", age: 23, gender: "Female", images: ["/assets/input_file_1.png", "/assets/input_file_12.png"], hobbies: ["Farming", "Podcasts", "Church"], status: "Genuine and respectful lady" },
  { county: "Kakamega", name: "Nafula", age: 24, gender: "Female", images: ["/assets/input_file_2.png", "/assets/input_file_13.png"], hobbies: ["Cooking", "Dancing", "Rugby cheering"], status: "Vibrant Kakamega queen. Let's talk!" },
  { county: "Vihiga", name: "Kageha", age: 22, gender: "Female", images: ["/assets/input_file_3.png", "/assets/input_file_0.png"], hobbies: ["Netball", "TikTok", "Design"], status: "Friendly and happy soul" },
  { county: "Bungoma", name: "Nanjala", age: 25, gender: "Female", images: ["/assets/input_file_4.png", "/assets/input_file_1.png"], hobbies: ["Cooking", "Travel", "Dancing"], status: "Warm and classy Bungoma lady" },
  { county: "Busia", name: "Ajiambo", age: 23, gender: "Female", images: ["/assets/input_file_5.png", "/assets/input_file_2.png"], hobbies: ["Movies", "Swimming", "Fashion"], status: "Lakeside views and happy hearts" },
  { county: "Siaya", name: "Atieno", age: 24, gender: "Female", images: ["/assets/input_file_6.png", "/assets/input_file_3.png"], hobbies: ["Literature", "Debate", "Salsa"], status: "Sharp, intelligent, and funny!" },
  { county: "Kisumu", name: "Anyango", age: 22, gender: "Female", images: ["/assets/input_file_7.png", "/assets/input_file_4.png"], hobbies: ["Fish dining", "Sailing", "Shopping"], status: "Diva with a loving heart 🐟💖" },
  { county: "Homa Bay", name: "Achieng", age: 23, gender: "Female", images: ["/assets/input_file_8.png", "/assets/input_file_5.png"], hobbies: ["Tourism", "Beaches", "Netball"], status: "Let's catch the sunset over the lake" },
  { county: "Migori", name: "Akoth", age: 25, gender: "Female", images: ["/assets/input_file_9.png", "/assets/input_file_6.png"], hobbies: ["Nature", "Music", "Dancing"], status: "Outgoing, sweet, and caring" },
  { county: "Kisii", name: "Kemunto", age: 24, gender: "Female", images: ["/assets/input_file_10.png", "/assets/input_file_7.png"], hobbies: ["Cooking", "Tiktok editing", "Movies"], status: "Happy kid looking for pure vibes" },
  { county: "Nyamira", name: "Moraa", age: 23, gender: "Female", images: ["/assets/input_file_11.png", "/assets/input_file_8.png"], hobbies: ["Dramatics", "Singing", "Cooking"], status: "Love and life, always bubbly!" },
  { county: "Nairobi", name: "Vee", age: 22, gender: "Female", images: ["/assets/input_file_12.png", "/assets/input_file_13.png"], hobbies: ["Socializing", "Clubbing", "Tiktok", "Shopping"], status: "Nairobi party girl looking for a cool partner" },
  { county: "Nairobi", name: "Shanice", age: 22, gender: "Female", images: ["/assets/input_file_14.png"], hobbies: ["Clubbing", "Fashion", "Tiktok", "Blogging"], status: "Form ni kudrop in style! Let's match and bonga hapa Party Chatt 💃❤️" },
  { county: "Mombasa", name: "Faith", age: 21, gender: "Female", images: ["/assets/input_file_15.png"], hobbies: ["Dancing", "Music", "Beach Party", "Cocktails"], status: "Unavyonipenda ndivyo nitakavyokupenda. Vibe yetu isilete drama vipi?" },
  { county: "Nakuru", name: "Joy", age: 23, gender: "Female", images: ["/assets/input_file_16.png"], hobbies: ["Baking", "Dining", "Photography", "Road trips"], status: "Zawadi ndogo ndogo ndio hufurahisha moyo. Niko hapa kwa vibe safi sana 😊🎁" },
  { county: "Eldoret", name: "Cynthia", age: 22, gender: "Female", images: ["/assets/input_file_17.png"], hobbies: ["Gym", "Netball", "TikTok editing", "Music"], status: "Ucheshi na tabasamu ni fomu yangu ya kila siku. Niko fiti kabisa yaani!" },
  { county: "Kisumu", name: "Brenda", age: 24, gender: "Female", images: ["/assets/input_file_18.png"], hobbies: ["Blogging", "Fashion", "Dining", "Boba Tea"], status: "Lover of elegance and red dresses. Mambo vipi mkuu, uko fiti leo?" },
  { county: "Kiambu", name: "Mercy", age: 23, gender: "Female", images: ["/assets/input_file_19.png"], hobbies: ["Tattoo Design", "Blogging", "Rock music", "Gaming"], status: "Siri ya upendo ni uaminifu na kubonga straight! Let's vibe." },
  { county: "Machakos", name: "Anita", age: 22, gender: "Female", images: ["/assets/input_file_20.png"], hobbies: ["Design", "Travel", "Sneakers", "Dancing"], status: "Kujiamini ndio kila kitu. Sisi hapa ni watu wa form fiti pekee!" },
  { county: "Kajiado", name: "Neema", age: 23, gender: "Female", images: ["/assets/input_file_21.png"], hobbies: ["Henna Design", "Fashion", "Music", "Cocktails"], status: "Let's live, love, and connect genuinely. Niko hapa kubonga, hakuna fake vibes" },
  { county: "Nyeri", name: "Shiku", age: 24, gender: "Female", images: ["/assets/input_file_22.png"], hobbies: ["Hiking", "Travel", "Nature", "Movies"], status: "Mlima Kenya beauty. Maisha ni mafupi, tuishi kwa furaha na amani" },
  { county: "Kilifi", name: "Stacy", age: 21, gender: "Female", images: ["/assets/input_file_23.png"], hobbies: ["Boba Tea", "Baking", "TikTok", "Design"], status: "Classy look with a sweet heart. Nisalimie basi uone tabasamu langu!" },
  { county: "Kwale", name: "Stacy Ann", age: 23, gender: "Female", images: ["/assets/input_file_24.png"], hobbies: ["Salsa", "Beach walk", "Hiking", "Netball"], status: "Independent girl enjoying Kwale breeze. Form ni kujipanga hapa" }
];

const femaleImages = [
  "/assets/input_file_0.png",
  "/assets/input_file_1.png",
  "/assets/input_file_2.png",
  "/assets/input_file_3.png",
  "/assets/input_file_4.png",
  "/assets/input_file_5.png",
  "/assets/input_file_6.png",
  "/assets/input_file_7.png",
  "/assets/input_file_8.png",
  "/assets/input_file_9.png"
];

const maleImages = [
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=600"
];

// Dynamically generate the 47 county-based user profiles
export const mockProfiles: UserProfile[] = countyProfilesRaw.map((p, idx) => {
  const isFemale = p.gender === "Female";
  const pool = isFemale ? femaleImages : maleImages;
  
  // Create variations of images for profile galleries
  const pImages = (p.images && p.images.length > 0) ? p.images : [
    pool[idx % pool.length],
    pool[(idx + 1) % pool.length],
    pool[(idx + 2) % pool.length]
  ];

  return {
    id: p.name.toLowerCase().replace(/\s+/g, '_') + "_" + p.county.toLowerCase().replace(/\s+/g, '_'),
    name: p.name,
    age: p.age,
    gender: p.gender as Gender,
    distance: idx === 0 ? "< 0.1km" : `${(idx * 0.4 + 0.1).toFixed(1)}km`,
    location: p.county + ", Kenya",
    images: pImages,
    online: idx % 3 === 0 || idx % 5 === 0,
    status: p.status,
    personalitySimilarity: 70 + (idx % 28),
    aboutMe: {
      active: idx % 4 === 0 ? "Highly Active" : "Active",
      education: idx % 3 === 0 ? "Graduate" : "In college",
      socialness: idx % 2 === 0 ? "Socially" : "Extrovert",
      worldView: idx % 2 === 0 ? "Progress" : "World Peace",
      alcohol: idx % 5 === 0 ? "Yes" : idx % 3 === 0 ? "Occasionally" : "No",
      sign: ["Gemini", "Leo", "Scorpio", "Aries", "Pisces", "Taurus", "Aquarius", "Cancer", "Virgo", "Libra"][idx % 10]
    },
    hobbies: p.hobbies,
    truthsAndLie: {
      truths: [`I live in ${p.county}`, `I love ${p.hobbies[0]}`],
      lie: "I hate partying"
    },
    alwaysSays: "Pamoja Milele ✨"
  };
});

export const mockMoments: MomentPost[] = [
  {
    id: "moment_1",
    authorName: "Rhiaa ✨",
    authorAvatar: "/assets/input_file_2.png",
    authorAge: 23,
    authorGender: "Female",
    content: "SCAM WARNING! 🚨 Don't fall for fake coin offers in private chats! Make sure to recharge safely through the Store or complete daily login tasks to earn coins for chatting. Stay safe folks! 💖",
    likes: 42,
    comments: 14,
    timestamp: "Today 10:15",
    hasLiked: false
  },
  {
    id: "moment_2",
    authorName: "Lovergirl",
    authorAvatar: "/assets/input_file_0.png",
    authorAge: 22,
    authorGender: "Female",
    content: "Today was a lovely day taking coffee around the balcony. What are your plans for the weekend? Let's chat and play games! 👋🍹",
    image: "/assets/input_file_1.png",
    likes: 89,
    comments: 32,
    timestamp: "Today 08:30",
    hasLiked: true
  },
  {
    id: "moment_3",
    authorName: "Sweetie",
    authorAvatar: "/assets/input_file_4.png",
    authorAge: 20,
    authorGender: "Female",
    content: "Feeling cute! Mirrors selfies are my favorite pastime. 📸👗",
    image: "/assets/input_file_7.png",
    likes: 120,
    comments: 54,
    timestamp: "Yesterday 17:26",
    hasLiked: false
  },
  {
    id: "moment_4",
    authorName: "Augustina Ekweb",
    authorAvatar: "/assets/input_file_6.png",
    authorAge: 25,
    authorGender: "Female",
    content: "Feeling cool and chill at work today. Nursing is my passion! 🏥🩺❤️",
    image: "/assets/input_file_8.png", // Changed to make sure it's 100% black model file
    likes: 210,
    comments: 73,
    timestamp: "Yesterday 18:39",
    hasLiked: false
  }
];

export const coinPackages: CoinPackage[] = [
  { id: "pack_1", coins: 100, bonus: 10, priceKsh: 100, badge: "Popular" },
  { id: "pack_2", coins: 500, bonus: 80, priceKsh: 450, badge: "Best Offer" },
  { id: "pack_3", coins: 1000, bonus: 200, priceKsh: 800, badge: "VIP Choice" },
  { id: "pack_4", coins: 2500, bonus: 600, priceKsh: 1800, badge: "Extreme Party" }
];

// Prescripted dynamic responses for profiles based on user keywords
export const getInteractiveResponse = (profileId: string, userMessage: string): string => {
  const lowercase = userMessage.toLowerCase();
  
  if (profileId.startsWith("lovergirl")) {
    if (lowercase.includes("hello") || lowercase.includes("hi") || lowercase.includes("hey")) {
      return "Hello there! 😊 It's so nice to match with you. I am looking for genuine friends here on Party Chatt. How is your day going?";
    }
    if (lowercase.includes("how are you")) {
      return "I am doing super great! Just vibeing and enjoying some music. What are you up to?";
    }
    if (lowercase.includes("where") || lowercase.includes("location") || lowercase.includes("from")) {
      return "I'm currently based in Kenya! 🌍 It's an amazing place with lovely landscapes. Where are you from?";
    }
    if (lowercase.includes("hobby") || lowercase.includes("doing") || lowercase.includes("like")) {
      return "I absolutely love dancing, designing graphics, and playing netball when I am free! I also enjoy festivals, cooking nice meals. What are your major hobbies?";
    }
    return "Ooh, that's interesting! Tell me more. I really enjoy talking to you. We can build incredible similarity! ✨ Let's stay connected!";
  }
  
  // Default generic responses for any user if they matched
  if (lowercase.includes("hello") || lowercase.includes("hi") || lowercase.includes("hey")) {
    return "Hey! Nice to meet you. Thanks for saying Hi! Let's get to know each other. 🥳";
  }
  if (lowercase.includes("how are you")) {
    return "I'm great! Thanks for asking. How are you doing today? Ready to party?";
  }
  if (lowercase.includes("location") || lowercase.includes("country")) {
    return "I am from Kenya! Hope we can match and hang out online or face-to-face!";
  }
  
  return "That's lovely! Party Chatt is awesome, isn't it? Let's check in daily to get free coins so we can keep our conversation active and alive! 🎈📲";
};

// Generates a consistent, dynamic activity and emoji showing what the user is doing at the party
export const getPartyActivity = (profile: UserProfile, theme?: 'all' | 'karaoke' | 'clubbing' | 'chill'): { emoji: string; text: string; textSw: string } => {
  const hash = profile.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  if (theme === 'karaoke') {
    const karaokeActivities = [
      { emoji: '🎤', text: 'Singing latest Swahili classics', textSw: 'Kuimba nyimbo za zamani za Kiswahili' },
      { emoji: '🎵', text: 'Belting out a hot Sheng rap hit', textSw: 'Kuimba miondoko ya Sheng rap kali!' },
      { emoji: '🎙️', text: 'Hosting the Karaoke main stage', textSw: 'Kuongoza jukwaa kuu la Karaoke' },
      { emoji: '🎶', text: 'Backing up a friend on stage', textSw: 'Kushirikiana na rafiki jukwaani mkuu' },
      { emoji: '📣', text: 'Cheering on local singing talents', textSw: 'Washabiki wakipiga kelele jukwaani' }
    ];
    return karaokeActivities[hash % karaokeActivities.length];
  }

  if (theme === 'clubbing') {
    const clubbingActivities = [
      { emoji: '💃', text: 'Doing the Gengetone dance session', textSw: 'Anacheza sarakasi za Gengetone' },
      { emoji: '🕺', text: 'Spicing up the lit dance floor', textSw: 'Kupaza roho kwenye jukwaa la densi' },
      { emoji: '🍷', text: 'Sipping sweet tropical cocktails', textSw: 'Kunywa vinywaji vitamu vya kigeni' },
      { emoji: '🥂', text: 'Cheering a glass with new matches', textSw: 'Kugongesha glasi na mechi mpya' },
      { emoji: '🔊', text: 'Vibing right next to the DJ booth', textSw: 'Kujirusha karibu na kibanda cha DJ!' }
    ];
    return clubbingActivities[hash % clubbingActivities.length];
  }

  if (theme === 'chill') {
    const chillActivities = [
      { emoji: '🍕', text: 'Eating cheesy pizza slice together', textSw: 'Kuvinjari na kula pizza ya jibini' },
      { emoji: '🎮', text: 'Playing vintage arcade video games', textSw: 'Kucheza gemu za zamani za video' },
      { emoji: '🍿', text: 'Sharing a bowl of spiced pop-corn', textSw: 'Kugawana bisi za moto zilizonunuliwa' },
      { emoji: '💬', text: 'Code-shifting sheng stori lazily', textSw: 'Kupiga stori tulivu za sheng' },
      { emoji: '🛌', text: 'Chilling on the cozy lounge sofa', textSw: 'Kupumzika kwenye kochi laini la VIP' }
    ];
    return chillActivities[hash % chillActivities.length];
  }

  // Fallback / default (if 'all' or undefined)
  // Clean hobbies string for easy matching
  const hobbiesStr = (profile.hobbies || []).join(',').toLowerCase();
  
  if (hobbiesStr.includes('clubbing') || hobbiesStr.includes('party') || hobbiesStr.includes('dance') || hobbiesStr.includes('dancing')) {
    const danceActivities = [
      { emoji: '💃', text: 'Dancing on the floor', textSw: 'Anacheza densi jukwaani' },
      { emoji: '🍷', text: 'Sipping sweet cocktails', textSw: 'Kunywa vinywaji vitamu' },
      { emoji: '🍻', text: 'Cheering with friends', textSw: 'Kugongesha glasi na marafiki' },
      { emoji: '✨', text: 'Vibing in the VIP room', textSw: 'Kusherehekea chumba cha VIP' }
    ];
    return danceActivities[hash % danceActivities.length];
  }
  
  if (hobbiesStr.includes('game') || hobbiesStr.includes('gaming') || hobbiesStr.includes('tiktok') || hobbiesStr.includes('blogging')) {
    const mediaActivities = [
      { emoji: '🎮', text: 'Playing retro arcade games', textSw: 'Kucheza gemu za retro' },
      { emoji: '📱', text: 'Filming a TikTok trend', textSw: 'Kupiga picha ya TikTok' },
      { emoji: '🎧', text: 'Listening to Gengetone DJ', textSw: 'Kusikiliza ngoma za DJ' },
      { emoji: '🎙️', text: 'Tuning into local music podcast', textSw: 'Kusikiliza kipindi cha muziki' }
    ];
    return mediaActivities[hash % mediaActivities.length];
  }

  if (hobbiesStr.includes('cook') || hobbiesStr.includes('eat') || hobbiesStr.includes('baking') || hobbiesStr.includes('sushi') || hobbiesStr.includes('dining')) {
    const foodActivities = [
      { emoji: '🍕', text: 'Eating cheesy pizza slice', textSw: 'Kula kipande cha pizza' },
      { emoji: '🧁', text: 'Munching on sweet cupcakes', textSw: 'Kufurahia keki nzuri' },
      { emoji: '🍾', text: 'Uncorking some champagne', textSw: 'Kufungua chupa ya shampeini' },
      { emoji: '🍿', text: 'Snapping photos with snack basket', textSw: 'Kupiga picha na kikapu cha snacks' }
    ];
    return foodActivities[hash % foodActivities.length];
  }

  if (hobbiesStr.includes('gym') || hobbiesStr.includes('fitness') || hobbiesStr.includes('run') || hobbiesStr.includes('running') || hobbiesStr.includes('athletics')) {
    const physicalActivities = [
      { emoji: '💪', text: 'Doing crazy dance-offs', textSw: 'Kufanya mashindano ya densi' },
      { emoji: '👟', text: 'Showing off cool sneakers', textSw: 'Kuonyesha raba zake kali' },
      { emoji: '🔥', text: 'Doing hot yoga stretches', textSw: 'Kufanya mazoezi ya kunyoosha viungo' }
    ];
    return physicalActivities[hash % physicalActivities.length];
  }

  // Fallbacks with cool diverse emojis
  const defaultActivities = [
    { emoji: '🕺', text: 'Dancing under strobe lights', textSw: 'Kucheza chini ya taa za rangi' },
    { emoji: '🍕', text: 'Grabbing a slice of pizza', textSw: 'Kula pizza ya moto' },
    { emoji: '🎮', text: 'Gaming on the VR headset', textSw: 'Kucheza gemu za VR' },
    { emoji: '📸', text: 'Taking crazy party selfies', textSw: 'Kupiga picha kali za selfie' },
    { emoji: '🎤', text: 'Belting out karaoke hits', textSw: 'Kuimba karaoke kwa sauti' },
    { emoji: '🥂', text: 'Raising a toast to matches', textSw: 'Kuinua glasi kwa mechi mpya' },
    { emoji: '🍿', text: 'Snacking on fresh popcorn', textSw: 'Kula bisi za moto' },
    { emoji: '🎵', text: 'Requesting the next hot song', textSw: 'Kuomba wimbo unaofuata' }
  ];
  
  return defaultActivities[hash % defaultActivities.length];
};

