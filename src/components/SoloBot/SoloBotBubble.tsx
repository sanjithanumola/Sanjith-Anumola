import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, RefreshCw } from "lucide-react";
import { BubblePlacement } from "./useRobotPhysics";

export const ROBOT_MESSAGES = [
  "Hey! Welcome to my corner of the internet 👋",
  "Check out 31+ live projects built by Sanjith!",
  "Click 'Follow Me' and I'll fly along with your cursor! 🚀",
  "Watch my eyes and head track your cursor wherever you go 👀",
  "Drag me anywhere on screen — or toss me for a bouncy safe landing!",
  "From AI tools to multiplayer games, Sanjith builds it all ⚡",
  "13-year-old developer building the future from Hyderabad 🇮🇳",
  "Explore Motion Lab, Sound Space, BioScope, Maze Shift & more below!",
  "Click or tap me anytime to watch me leap and dash across the screen! ⚡",
];

interface SoloBotBubbleProps {
  isVisible: boolean;
  onClose: () => void;
  onClick: () => void;
  placement?: BubblePlacement;
  messageIndex?: number;
}

export const SoloBotBubble: React.FC<SoloBotBubbleProps> = ({
  isVisible,
  onClose,
  onClick,
  placement = "top-right",
  messageIndex = 0,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const currentFullMessage = ROBOT_MESSAGES[messageIndex % ROBOT_MESSAGES.length];

  // Typing effect
  useEffect(() => {
    if (!isVisible) return;

    let charIndex = 0;
    setDisplayedText("");
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (charIndex < currentFullMessage.length) {
        setDisplayedText(currentFullMessage.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 28);

    return () => clearInterval(typeInterval);
  }, [messageIndex, isVisible, currentFullMessage]);

  // Pointer styling depending on placement
  const pointerClasses = {
    "top-right": "-bottom-2 right-8 w-4 h-4 bg-[#0D0A1A] border-r border-b border-purple-500/70 rotate-45 pointer-events-none",
    "top-left": "-bottom-2 left-8 w-4 h-4 bg-[#0D0A1A] border-r border-b border-purple-500/70 rotate-45 pointer-events-none",
    "bottom-right": "-top-2 right-8 w-4 h-4 bg-[#0D0A1A] border-l border-t border-purple-500/70 rotate-45 pointer-events-none",
    "bottom-left": "-top-2 left-8 w-4 h-4 bg-[#0D0A1A] border-l border-t border-purple-500/70 rotate-45 pointer-events-none",
  }[placement];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: placement.startsWith("top") ? 14 : -14, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: placement.startsWith("top") ? 8 : -8, scale: 0.94 }}
          transition={{ type: "spring", damping: 22, stiffness: 290 }}
          className="relative max-w-[270px] sm:max-w-[310px] select-none"
        >
          {/* Glassmorphic Speech Bubble Body */}
          <div
            onClick={onClick}
            role="button"
            tabIndex={0}
            title="Click to hear another thought from Solo Bot!"
            className="group relative cursor-pointer bg-[#0D0A1A]/95 hover:bg-[#140E2A] backdrop-blur-xl border border-purple-500/70 hover:border-purple-400 p-3.5 rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.8),0_0_20px_rgba(168,85,247,0.35)] transition-all duration-300"
          >
            {/* Ambient Purple/Green Glow Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/20 via-emerald-500/10 to-transparent rounded-tr-2xl pointer-events-none" />

            {/* Bubble Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-500/30">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF66] shadow-[0_0_8px_#00FF66]" />
                </span>
                <span className="text-[10px] font-mono font-black tracking-widest text-[#00FF66] uppercase drop-shadow-[0_0_6px_rgba(0,255,102,0.6)]">
                  SOLOBOT · COMPANION
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                  }}
                  className="w-5 h-5 rounded-md text-gray-400 hover:text-[#00FF66] hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                  title="Next thought"
                  aria-label="Next message"
                >
                  <RefreshCw className="w-3 h-3 group-hover:rotate-45 transition-transform" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="w-5 h-5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                  title="Dismiss message"
                  aria-label="Dismiss speech bubble"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Message Body with Typing Effect */}
            <div className="min-h-[44px] flex flex-col justify-center">
              <p className="text-xs sm:text-[13px] font-medium text-neutral-100 leading-snug tracking-tight">
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#00FF66] animate-pulse align-middle shadow-[0_0_6px_#00FF66]" />
                )}
              </p>
            </div>

            {/* Bottom Call to Action hint */}
            <div className="mt-2.5 pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-purple-300/80">
              <span className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" /> Click or drag me
              </span>
              <span className="text-gray-400">Click to rotate tips</span>
            </div>

            {/* Directional Pointer Arrow */}
            <div className={`absolute ${pointerClasses}`} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
