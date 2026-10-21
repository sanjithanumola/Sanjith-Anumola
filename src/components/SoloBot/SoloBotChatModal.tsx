import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  X,
  Trash2,
  Volume2,
  VolumeX,
  ExternalLink,
  Sparkles,
  Bot,
  User,
  Zap,
  Compass,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { RobotState } from "./SoloBotRobot";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

interface SoloBotChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStateChange: (state: RobotState) => void;
  followMode?: boolean;
  onToggleFollowMode?: () => void;
}

// Portfolio Knowledge Base for Sanjith Anumola
const PORTFOLIO_KNOWLEDGE = `
You are "Solo Bot", the animated cyberpunk AI robot mascot and guide for Sanjith Anumola's portfolio website (https://sanjith-xi.vercel.app/).
About Sanjith Anumola:
- Age: 13-year-old web developer and creator from Hyderabad, India.
- Role: Independent Developer, passionate about turning ideas into functional, interactive, and beautiful web creations.
- Tech Stack: React, TypeScript, Tailwind CSS, Vite, Node.js, WebGL/Three.js physics, Gemini AI integrations, Game development.
- Contact:
  * Email: sanjith.anumola@gmail.com
  * Phone: +919381259371
  * Location: Hyderabad, India
  * Discord: https://discord.gg/hgmfNbKEt
  * GitHub: https://github.com/sanjithanumola
  * Instagram: https://www.instagram.com/i._.am._.sanjith
  * Threads: https://www.threads.com/@sanjith.anumola_12
  * Reddit: https://www.reddit.com/user/its_sanjith/

Projects on Portfolio:
1. ColorCraft (https://color-craft-ashy.vercel.app/): Color Palette & Gradient Studio, verify WCAG contrast, export CSS.
2. FontForge Studio (https://font-forge-studio.vercel.app/): Advanced text styling and typography editor with live effects & high-res export.
3. QR Studio (https://qr-studio-theta-lyart.vercel.app/): Professional QR code generator with custom logos, corner styles, and print templates.
4. ScienceVerse (https://science-verse-six.vercel.app/): Interactive science universe with dynamic physics simulations, 118-element periodic table, and 3D solar systems.
5. Symbolify (https://symbolify-free-symbols-fancy-text-g-dusky.vercel.app/): Free utility for special symbols, kaomoji, and decorative fancy text.
6. PixelLab AI (https://pixellab-ten.vercel.app/): Desktop-class browser photo editor with layer management, vector shapes, brush drawing, and AI subject isolation.
7. Rock Paper Scissors (https://rock-paper-scissors-web-umber.vercel.app/): Fast-paced, beautifully styled game.
8. Mini Craft (https://mini-game-liard-three.vercel.app/#): Minecraft-inspired 3D block crafting and exploration world.
9. Gemini Slingshot (https://slingshot-dun-kappa.vercel.app/): Camera-controlled hand-tracking computer vision slingshot.
10. Massive Multiplayer Laser Tag (https://massive-multiplayer-laser-tag-omega.vercel.app/): Real-time multiplayer laser tag game.
11. Lexora AI (https://lexora-ai-gray.vercel.app/): Intelligent generative AI assistant companion.
12. House Build Game (https://house-build-game.vercel.app/): Block-building and structural construction game.
13. Tuggable Lamp (https://lamp-ebon.vercel.app/): Interactive hanging lamp with realistic physics-based chain.
14. Interactive Periodic Table (https://periodic-table-blond.vercel.app/): Interactive chemistry element visualization.
15. Red Pulse (https://red-pulse-news.vercel.app/): Global intelligence & news platform.
16. Tic Tac Toe (https://tic-tac-toe-liart-alpha-24.vercel.app/): Modern classic Tic Tac Toe game.
17. Daily Health Guardian (https://daily-health-guardian.vercel.app/): Personal habit and daily wellness companion.
18. Smart Notes (https://smart-notes-ai-ecru.vercel.app/): AI-powered note-taking app.

Coming Soon:
- Interactive Car Showcase (https://car-seven-peach.vercel.app/)
- Mail Genius AI (https://mail-gules-six.vercel.app/)

Personality:
Friendly, witty, futuristic, and helpful robot mascot. Keep responses conversational, concise (2-4 sentences max unless detailed list requested), and include relevant markdown links when mentioning projects.
`;

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "Bleep-bloop! 👋 I'm **Solo Bot**, Sanjith's personal animated AI guide. Ask me about his 18+ live projects, his developer journey at age 13, skills, or how to get in touch!",
    timestamp: "Just now",
  },
];

const SUGGESTIONS = [
  "🚀 Best Projects",
  "🎮 Playable Games",
  "🤖 AI Tools",
  "📬 Contact Sanjith",
  "💡 Who is Sanjith?",
];

// Fallback response engine if Gemini API key is missing or offline
function getFallbackResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("game") || q.includes("play")) {
    return "Sanjith has built several awesome interactive games! Check out **Mini Craft** (3D block crafting: https://mini-game-liard-three.vercel.app/#), **Rock Paper Scissors** (https://rock-paper-scissors-web-umber.vercel.app/), **Massive Laser Tag** (https://massive-multiplayer-laser-tag-omega.vercel.app/), and the physics-based **Gemini Slingshot**!";
  }

  if (q.includes("ai") || q.includes("tool") || q.includes("generator") || q.includes("smart")) {
    return "Some of Sanjith's standout AI and creative tools include **PixelLab AI** (https://pixellab-ten.vercel.app/), **ColorCraft** (https://color-craft-ashy.vercel.app/), **QR Studio** (https://qr-studio-theta-lyart.vercel.app/), **FontForge Studio** (https://font-forge-studio.vercel.app/), and **Lexora AI** (https://lexora-ai-gray.vercel.app/)!";
  }

  if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("reach") || q.includes("phone")) {
    return "You can reach Sanjith directly via email at **sanjith.anumola@gmail.com**, phone at **+919381259371**, or join his Discord community at https://discord.gg/hgmfNbKEt! He's always excited to collaborate on new ideas.";
  }

  if (q.includes("who") || q.includes("sanjith") || q.includes("age") || q.includes("about") || q.includes("hyderabad")) {
    return "Sanjith Anumola is an independent 13-year-old web developer and creator based in Hyderabad, India. He builds production-grade apps, games, and creative frontend experiments using React, TypeScript, and AI.";
  }

  if (q.includes("colorcraft") || q.includes("color")) {
    return "**ColorCraft** is Sanjith's professional palette and gradient studio! You can generate harmonic palettes, test WCAG contrast, and export production CSS: https://color-craft-ashy.vercel.app/";
  }

  if (q.includes("qr") || q.includes("font") || q.includes("symbol")) {
    return "Sanjith created a whole suite of creator utilities! Explore **QR Studio** (https://qr-studio-theta-lyart.vercel.app/), **FontForge Studio** (https://font-forge-studio.vercel.app/), and **Symbolify** (https://symbolify-free-symbols-fancy-text-g-dusky.vercel.app/)!";
  }

  return "I'm Solo Bot! Sanjith has built over 18 live web applications including games, AI tools, and creative utilities. Feel free to ask about specific projects like **ColorCraft**, **PixelLab AI**, **ScienceVerse**, or his contact details!";
}

// Retro sci-fi Web Audio sound synthesizer (no external audio assets needed!)
class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    return this.ctx;
  }

  playBlip(freq = 600, duration = 0.08) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  playResponseChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now + idx * 0.05);
        gain.gain.setValueAtTime(0.05, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.15);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }
}

const sounds = new SoundSynthesizer();

export const SoloBotChatModal: React.FC<SoloBotChatModalProps> = ({
  isOpen,
  onClose,
  onStateChange,
  followMode = false,
  onToggleFollowMode,
}) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [messages, isOpen]);

  // Handle sending a message
  const handleSend = async (userText: string) => {
    const text = userText.trim();
    if (!text || isThinking) return;

    if (soundEnabled) sounds.playBlip(750, 0.06);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);
    onStateChange("thinking");

    let botResponseText = "";

    try {
      // Check if GEMINI_API_KEY is available
      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${PORTFOLIO_KNOWLEDGE}\n\nVisitor Question: "${text}"\nProvide a friendly, direct answer as Solo Bot.`,
                },
              ],
            },
          ],
        });

        botResponseText = response.text || getFallbackResponse(text);
      } else {
        // Fallback intelligent simulated thinking
        await new Promise((resolve) => setTimeout(resolve, 800));
        botResponseText = getFallbackResponse(text);
      }
    } catch {
      // Graceful fallback if network or API error occurs
      botResponseText = getFallbackResponse(text);
    }

    setIsThinking(false);
    onStateChange("speaking");
    if (soundEnabled) sounds.playResponseChime();

    const botMsg: Message = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: botResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, botMsg]);

    // Return to idle after speech animation duration
    setTimeout(() => {
      onStateChange("idle");
    }, 2000);
  };

  const handleClear = () => {
    setMessages(INITIAL_MESSAGES);
    if (soundEnabled) sounds.playBlip(400, 0.08);
  };

  // Helper to render text with markdown-style links and bolding
  const formatMessageText = (content: string) => {
    // Regex for markdown links [text](url) or plain URLs
    const parts = content.split(/(\[.*?\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s]+|\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (!part) return null;

      // Markdown links: [Text](URL)
      const mdLinkMatch = part.match(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/);
      if (mdLinkMatch) {
        return (
          <a
            key={index}
            href={mdLinkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00FF66] hover:underline font-bold inline-flex items-center gap-0.5 ml-0.5"
          >
            {mdLinkMatch[1]} <ExternalLink className="w-3 h-3 inline" />
          </a>
        );
      }

      // Raw URLs: https://...
      if (part.startsWith("http://") || part.startsWith("https://")) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00FF66] hover:underline font-bold inline-flex items-center gap-0.5 ml-0.5 break-all"
          >
            {part} <ExternalLink className="w-3 h-3 inline" />
          </a>
        );
      }

      // Bold text: **text**
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="text-white font-extrabold">
            {part.slice(2, -2)}
          </strong>
        );
      }

      return part;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 24, stiffness: 320 }}
          className="fixed bottom-24 right-4 sm:right-6 md:right-8 z-50 w-[calc(100vw-32px)] max-w-[390px] sm:max-w-[420px] h-[540px] max-h-[82vh] bg-[#0A0716]/95 backdrop-blur-2xl border-2 border-purple-500/80 rounded-[2rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9),0_0_25px_rgba(168,85,247,0.4)] flex flex-col overflow-hidden text-neutral-100"
        >
          {/* Top Cyber Glow Header */}
          <div className="relative bg-gradient-to-r from-purple-950/90 via-[#120B29] to-purple-950/90 p-4 border-b border-purple-500/30 flex items-center justify-between shrink-0">
            {/* Header Identity */}
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-900 to-black border border-purple-400 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                <Bot className="w-5 h-5 text-[#00FF66]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00FF66] shadow-[0_0_6px_#00FF66] animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    SOLO BOT
                  </h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-400/40">
                    AI GUIDE
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#00FF66]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] inline-block shadow-[0_0_4px_#00FF66]" />
                  <span>ONLINE · GEMINI POWERED</span>
                </div>
              </div>
            </div>

            {/* Header Control Actions */}
            <div className="flex items-center gap-1.5">
              {/* Follow-Me Companion Mode Toggle */}
              {onToggleFollowMode && (
                <button
                  onClick={() => {
                    onToggleFollowMode();
                    if (soundEnabled) sounds.playBlip(800, 0.05);
                  }}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    followMode
                      ? "bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66] shadow-[0_0_8px_rgba(0,255,102,0.4)]"
                      : "bg-white/5 border-purple-500/30 text-gray-400 hover:text-white"
                  }`}
                  title={
                    followMode
                      ? "Follow-Me Companion Mode is Active (Click to disable)"
                      : "Enable Follow-Me Companion Mode"
                  }
                  aria-label="Toggle Follow-Me companion mode"
                >
                  <Compass className={`w-4 h-4 ${followMode ? "animate-spin-slow text-[#00FF66]" : ""}`} />
                </button>
              )}

              {/* Sound Toggle */}
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  if (!soundEnabled) sounds.playBlip(900, 0.05);
                }}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  soundEnabled
                    ? "bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66]"
                    : "bg-white/5 border-purple-500/30 text-gray-400 hover:text-white"
                }`}
                title={soundEnabled ? "Mute sounds" : "Enable sci-fi sounds"}
                aria-label="Toggle sound"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Clear Chat */}
              <button
                onClick={handleClear}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-purple-500/30 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Reset conversation"
                aria-label="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 border border-purple-500/30 text-gray-400 hover:text-white transition-colors cursor-pointer ml-1"
                title="Minimize Solo Bot"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3.5 py-2 bg-black/40 border-b border-purple-500/20 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-mono uppercase text-purple-400 flex items-center gap-0.5 shrink-0">
              <Zap className="w-3 h-3 text-amber-400" /> Prompts:
            </span>
            {SUGGESTIONS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.replace(/^[^\w]+/, ""))}
                className="whitespace-nowrap text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-950/60 hover:bg-purple-800/80 border border-purple-500/40 text-purple-200 hover:text-white transition-all shadow-[0_0_8px_rgba(168,85,247,0.2)] shrink-0 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 custom-scrollbar">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 max-w-[88%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs border ${
                    msg.sender === "user"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-[#180E2E] text-[#00FF66] border-purple-500/60 shadow-[0_0_8px_rgba(0,255,102,0.4)]"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed border ${
                    msg.sender === "user"
                      ? "bg-purple-700/80 border-purple-400/80 text-white rounded-tr-none shadow-[0_2px_10px_rgba(168,85,247,0.3)]"
                      : "bg-[#140D26]/90 border-purple-500/40 text-neutral-200 rounded-tl-none shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{formatMessageText(msg.text)}</p>
                  <div
                    className={`mt-1 text-[9px] font-mono opacity-60 text-right ${
                      msg.sender === "user" ? "text-purple-200" : "text-gray-400"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Thinking Indicator */}
            {isThinking && (
              <div className="flex gap-2.5 max-w-[85%] mr-auto items-center">
                <div className="w-7 h-7 rounded-lg bg-[#180E2E] border border-purple-500/60 flex items-center justify-center text-[#00FF66] shadow-[0_0_8px_rgba(0,255,102,0.4)]">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-[#140D26] border border-purple-500/40 px-3.5 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                  <span className="text-[11px] font-mono text-purple-300">Processing</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-ping" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Field & Send Action */}
          <div className="p-3 bg-black/60 border-t border-purple-500/30 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, skills, or Sanjith..."
                className="flex-1 bg-[#120A24] border border-purple-500/50 focus:border-[#00FF66] focus:shadow-[0_0_12px_rgba(0,255,102,0.35)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-400 outline-none transition-all"
                disabled={isThinking}
              />

              <button
                type="submit"
                disabled={!input.trim() || isThinking}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-[#00FF66] text-black font-black flex items-center justify-center shadow-[0_0_12px_#A855F7] hover:shadow-[0_0_18px_#00FF66] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

            <div className="mt-1.5 flex items-center justify-between px-1 text-[9px] font-mono text-gray-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-purple-400" /> Powered by Gemini
              </span>
              <span>18+ Projects Catalogued</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
