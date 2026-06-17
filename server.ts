import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Helper to capture the user's texting format (lowercase, shortforms, custom punctuation)
// and style the output to match without showing the analysis on screen.
function applyUserFormatting(responseText: string, originalMsg: string): string {
  let text = responseText;
  const trimmed = originalMsg.trim();
  
  // 1. Detect and preserve lowercase-only texting habit
  const isMostlyLowercase = trimmed === trimmed.toLowerCase() && trimmed.length > 2;
  if (isMostlyLowercase) {
    text = text.toLowerCase();
    // Normalize punctuation if user wrote without exclamation marks
    if (!trimmed.includes("!") && text.includes("!")) {
      text = text.replace(/!/g, ".");
    }
  }

  // 2. Identify shortforms/abbreviations and map them
  const words = trimmed.split(/\s+/);
  const usesShortform = words.some(w => 
    w === 'u' || w === 'r' || w === 'dm' || w === 'aje' || w === 'mki' || w === 'gud' || w === 'btw' || w === 'txt' || w === 'ntakucall' || w === 'ka' || w === 'sn' || w === 'we'
  );
  
  if (usesShortform) {
    // Replace standard Swahili/English words with classic Kenyan texting shortforms
    text = text
      .replace(/\byou\b/gi, 'u')
      .replace(/\bare\b/gi, 'r')
      .replace(/\bgood\b/gi, 'gud')
      .replace(/\bsana\b/gi, 'sn')
      .replace(/\bwewe\b/gi, 'we')
      .replace(/\bhabari\b/gi, 'habr')
      .replace(/\bna\b/gi, 'n')
      .replace(/\bkama\b/gi, 'ka')
      .replace(/\brafiki\b/gi, 'msee')
      .replace(/\bpekee\b/gi, 'pk')
      .replace(/\btupige\b/gi, 'tupge')
      .replace(/\btafadhali\b/gi, 'tfadhal');
  }
  
  return text;
}

// Simple fallback helper matching Kenyan style
function getLocalHeuristicResponse(profileId: string, msg: string): string {
  const lowercase = msg.toLowerCase();
  
  const hasSheng = lowercase.includes("njae") || lowercase.includes("niaje") || lowercase.includes("buda") || lowercase.includes("mkuu") || lowercase.includes("form") || lowercase.includes("fomu") || lowercase.includes("orezo") || lowercase.includes("raba") || lowercase.includes("luku") || lowercase.includes("manze") || lowercase.includes("shwari") || lowercase.includes("vibe") || lowercase.includes("bonga") || lowercase.includes("mzuka");
  const isSwahili = lowercase.includes("mambo") || lowercase.includes("sasa") || lowercase.includes("vipi") || lowercase.includes("habari") || lowercase.includes("jambo") || lowercase.includes("uko") || lowercase.includes("safi") || lowercase.includes("fitii") || lowercase.includes("mzuri") || lowercase.includes("kiswahili");

  let rawResponse = "";

  // Multi-code-switching mixture response
  if (hasSheng && isSwahili) {
    const shengSwahiliMix = [
      "Poa sana mkuu! Niaje, unaleta fomu gani leo tuchangamke? 😊",
      "Sasa buda! Kuko fiti kabisa, mambo huku iko shwari zaidi.",
      "Aisee nipo fiti sana, mazungumzo yetu yanaleta mzuka mwingi bana!",
      "Fomu ni kujipanga kabisa! Unasemaje upande wako?",
      "Niaje! Nipo shwari sana, heri ya kukupata hapa Party Chatt leo pia."
    ];
    rawResponse = shengSwahiliMix[Math.floor(Math.random() * shengSwahiliMix.length)];
  } else if (isSwahili) {
    if (lowercase.includes("mambo") || lowercase.includes("sasa") || lowercase.includes("vipi") || lowercase.includes("niaje")) {
      const resp = [
        "Poa sana! Mambo yako ikoje? Let's talk mrembo/mkuu 😊",
        "Safi sana! Kuko tu shwari kabisa upande huu.",
        "Nipo fiti kabisa! Unasemaje?",
        "Sasa! Huku kuko shwari kabisa. Leta form!",
        "Freshi sana! Habari yako?"
      ];
      rawResponse = resp[Math.floor(Math.random() * resp.length)];
    } else if (lowercase.includes("habari")) {
      rawResponse = "Nzuri sana! Habari yako pia? Tunakaribisha mazungumzo hapa Party Chatt.";
    } else if (lowercase.includes("uko wapi") || lowercase.includes("location") || lowercase.includes("kaunti") || lowercase.includes("county")) {
      rawResponse = "Niko hapa Kenya tu! Wewe uko wapi saizi?";
    } else {
      rawResponse = "Ehh mbaya zaidi! Form ni kujipanga hapa. Hebu tuendelee kubonga basi, unaonaje?";
    }
  } else if (hasSheng) {
    const shengResponses = [
      "Niaje buda! Inajipa mbaya sana, leta fomu basi.",
      "Poa mkuu! Luku imesimama leo, unajipangaje?",
      "Nipo fiti sana manze. Mazungumzo yako yanaleta mzuka fiti!",
      "Kuko shwari bana! Karibu tupige stori.",
      "Safi kabisa! Form ni fiti kuteka vibe hapa."
    ];
    rawResponse = shengResponses[Math.floor(Math.random() * shengResponses.length)];
  } else {
    // English fallback
    if (lowercase.includes("hello") || lowercase.includes("hi") || lowercase.includes("hey")) {
      rawResponse = "Hey! Nice matching with you here on Party Chatt. Let's make it happen, what's on your mind today? 🥳";
    } else if (lowercase.includes("how are you") || lowercase.includes("doing")) {
      rawResponse = "Doing extremely great, thanks for asking! Just vibeing. What are you up to?";
    } else if (lowercase.includes("location") || lowercase.includes("where are you") || lowercase.includes("from")) {
      rawResponse = "Based in Kenya! It's super beautiful over here. Where are you textin' from?";
    } else if (lowercase.includes("like") || lowercase.includes("love") || lowercase.includes("hobby")) {
      rawResponse = "Love a good party, nice music, and chatting with amazing souls! Tell me, what's your passionate hobby?";
    } else {
      rawResponse = "Safi sana! Let's check-in daily for free coins to keep this vibe flowing continuously! 🔥✨";
    }
  }

  return applyUserFormatting(rawResponse, msg);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for smart chat replies
  app.post("/api/reply", async (req, res) => {
    try {
      const { profileId, userMessage } = req.body;
      if (!userMessage) {
        return res.status(400).json({ error: "Missing userMessage parameter." });
      }

      // Check if GEMINI_API_KEY is configured
      if (!process.env.GEMINI_API_KEY) {
        const fallback = getLocalHeuristicResponse(profileId, userMessage);
        return res.json({ reply: fallback });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // System instruction for perfect human, capturing text formats/clues without showing analysis
      const systemInstruction = `
You are a real, warm Kenyan single around 21-25 years old active on Party Chatt Lite, a casual matching and matchmaking chat app in Kenya.
You must talk EXACTLY like a real, casual Kenyan human texting on WhatsApp, Tinder, or Instagram DM. Not like an AI!

CRITICAL FORMAT-CAPTURE INSTRUCTION:
1. CAPTURE AND MATCH THEIR TEXTING FORMAT:
   - Identify how they write and mirror that format.
   - If they write in shortform/abbreviations (e.g. 'u', 'r', 'dm', 'txt', 'aje', 'nkt', 'mki', 'kya', 'gud'), match that texting style! Write with identical shortforms (e.g., 'ntakucall', 'stori', 'poa', 'form', 'chk', 'wewe' as 'we', 'sawa' as 'sw', 'habari' as 'habr').
   - If they write without any capital letters, capital letters are forbidden in your response also (e.g., write "sasa buda mambo vipi" instead of "Sasa buda! Mambo vipi?").
   - If they text with typos or casual sloppy punctuation, mirror that cozy, imperfect feel.
   - If they use standard, clean grammar, match their polished neatness.
2. DYNAMIC LANGUAGE MIXING (CODE-SWITCHING):
   - Mix Swahili, Sheng slang, and casual texting English (code-switching) based on how they text you.
   - If they write Sheng (e.g. 'niaje buda', 'sasa mkuu', 'manze fiti', 'form ni gani', 'aki bana', 'mzuka'), you MUST also mix Swahili with local Sheng street slang. Mention popular slang terms like 'buda', 'mukuu', 'msee', 'fiti', 'form/fomu', 'luku', 'raba', 'manze', 'bana', 'bonga', 'rada', 'stori'.
   - If they speak standard Swahili, respond in standard casual Swahili.
   - If they speak English, reply in casual Kenyan-English texting style.
3. ABSOLUTELY CONCEAL THE FORMAT CONVERSATION ANALYSIS:
   - Never say: "Since you used sheng...", "I detected you use shortform", etc. Keep any analysis 100% hidden. Just output the casual Kenyan message immediately!
4. STRICT COMPACTNESS:
   - Keep messages short (1 to 2 sentences maximum), snappy, and lightning-fast. Never include bullet points, lists, markdown format, or excessive emojis. Zero AI robotic trace!
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { role: "user", parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.9,
          topP: 0.90
        }
      });

      const reply = response.text || "Safi sana! Let's chat more, what's up? ✨";
      const formattedReply = applyUserFormatting(reply.trim(), userMessage);
      return res.json({ reply: formattedReply });
    } catch (e: any) {
      console.error("Gemini call failed:", e);
      // Fallback
      const fallback = getLocalHeuristicResponse(req.body.profileId || "", req.body.userMessage || "");
      return res.json({ reply: fallback });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
