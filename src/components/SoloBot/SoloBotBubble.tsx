import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles } from "lucide-react";
import { BubblePlacement } from "./useRobotPhysics";

interface SoloBotBubbleProps {
  isVisible: boolean;
  onClose: () => void;
  onClick: () => void;
  placement?: BubblePlacement;
}

const MESSAGES = [
  "Hey! Welcome to my corner of the internet.",
  "Want to explore Sanjith's projects?",
  "Need help finding something cool?",
  "Ask me anything about Sanjith's work!",
];

export const SoloBotBubble: React.FC<SoloBotBubbleProps> = ({
  isVisible,
  onClose,
  onClick,
  placement = "top-right",
}) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const currentFullMessage = MESSAGES[messageIndex];

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
    }, 32);

    return () => clearInterval(typeInterval);
  }, [messageIndex, isVisible, currentFullMessage]);

  // Message rotation cycle: change every 11 seconds if idle
  useEffect(() => {
    if (!isVisible) return;

    const rotationInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 11000);

    return () => clearInterval(rotationInterval);
  }, [isVisible]);

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
            className="group relative cursor-pointer bg-[#0D0A1A]/95 hover:bg-[#130E26] backdrop-blur-xl border border-purple-500/70 hover:border-purple-400 p-3.5 rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.8),0_0_20px_rgba(168,85,247,0.35)] transition-all duration-300"
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
                  SOLOBOT · GUIDE
                </span>
              </div>

              {/* Close Button */}
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

            {/* Message Body with Typing Effect */}
            <div className="min-h-[42px] flex flex-col justify-center">
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
              <span className="text-gray-500">v2.5 AI</span>
            </div>

            {/* Directional Pointer Arrow */}
            <div className={`absolute ${pointerClasses}`} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
