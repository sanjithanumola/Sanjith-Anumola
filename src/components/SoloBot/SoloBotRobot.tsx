import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

export type CharacterExpression =
  | "happy"
  | "curious"
  | "surprised"
  | "confused"
  | "sleepy"
  | "playful"
  | "dragged"
  | "landing"
  | "idle";

export interface SoloBotRobotProps {
  expression?: CharacterExpression;
  isGrabbed?: boolean;
  isDragging?: boolean;
  isSpringingHome?: boolean;
  isFollowing?: boolean;
  isDashing?: boolean;
  isLanding?: boolean;
  tiltAngle?: number;
  headPitch?: number;
  stretchScale?: { x: number; y: number };
  eyeTrackOffset?: { x: number; y: number };
  cursorDistance?: number;
  isCursorNear?: boolean;
  onClick?: () => void;
  className?: string;
  onPointerDown?: (e: React.PointerEvent) => void;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
}

export const SoloBotRobot: React.FC<SoloBotRobotProps> = ({
  expression = "idle",
  isGrabbed = false,
  isDragging = false,
  isSpringingHome = false,
  isFollowing = false,
  isDashing = false,
  isLanding = false,
  tiltAngle = 0,
  headPitch = 0,
  stretchScale = { x: 1, y: 1 },
  eyeTrackOffset = { x: 0, y: 0 },
  cursorDistance = 9999,
  isCursorNear = false,
  onClick,
  className = "",
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) => {
  // Natural blinking with randomized intervals
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Random natural blink generator
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const scheduleNextBlink = () => {
      // Blinks every 2.4s to 5.4s
      const delay = Math.random() * 3000 + 2400;
      blinkTimeout = setTimeout(() => {
        // Only blink if not grabbed or dragging
        if (!isGrabbed && !isDragging) {
          setIsBlinking(true);
          setTimeout(() => {
            setIsBlinking(false);
            // 30% chance of an adorable quick double-blink
            if (Math.random() < 0.3) {
              setTimeout(() => {
                setIsBlinking(true);
                setTimeout(() => setIsBlinking(false), 110);
              }, 120);
            }
            scheduleNextBlink();
          }, 140);
        } else {
          scheduleNextBlink();
        }
      }, delay);
    };

    scheduleNextBlink();
    return () => clearTimeout(blinkTimeout);
  }, [isGrabbed, isDragging]);

  // Determine effective current facial expression based on interaction priority
  const activeExpression: CharacterExpression = useMemo(() => {
    if (isLanding) return "landing";
    if (isDragging || isGrabbed) return "dragged";
    if (isDashing) return "playful";
    if (isSpringingHome) return "playful";
    if (isHovered) return "happy";
    if (isCursorNear && expression === "idle") return "curious";
    if (isFollowing && expression === "idle") return "playful";
    return expression;
  }, [isLanding, isDragging, isGrabbed, isDashing, isSpringingHome, isHovered, isCursorNear, isFollowing, expression]);

  // Eyebrow configuration per expression
  const eyebrows = useMemo(() => {
    switch (activeExpression) {
      case "happy":
        return {
          left: { y: -2.5, rotate: -10, scaleX: 1.05 },
          right: { y: -2.5, rotate: 10, scaleX: 1.05 },
        };
      case "curious":
        // One eyebrow raised inquisitively, one relaxed
        return {
          left: { y: -4.5, rotate: -16, scaleX: 1.1 },
          right: { y: 0.5, rotate: 6, scaleX: 0.95 },
        };
      case "surprised":
      case "dragged":
        // Both eyebrows raised high in excitement
        return {
          left: { y: -5.5, rotate: -8, scaleX: 1.2 },
          right: { y: -5.5, rotate: 8, scaleX: 1.2 },
        };
      case "confused":
        // Asymmetric tilt
        return {
          left: { y: -4, rotate: -18, scaleX: 1.05 },
          right: { y: 1.5, rotate: 14, scaleX: 1 },
        };
      case "sleepy":
        // Drooping low over eyes
        return {
          left: { y: 2, rotate: 6, scaleX: 0.9 },
          right: { y: 2, rotate: -6, scaleX: 0.9 },
        };
      case "playful":
        // Cheeky wink expression: left raised, right angled
        return {
          left: { y: -3.5, rotate: -14, scaleX: 1.15 },
          right: { y: 1, rotate: -8, scaleX: 0.95 },
        };
      case "landing":
        return {
          left: { y: -1, rotate: -6, scaleX: 1.05 },
          right: { y: -1, rotate: 6, scaleX: 1.05 },
        };
      case "idle":
      default:
        return {
          left: { y: 0, rotate: 0, scaleX: 1 },
          right: { y: 0, rotate: 0, scaleX: 1 },
        };
    }
  }, [activeExpression]);

  // Eye shape and eyelid configuration per expression
  const eyeStates = useMemo(() => {
    const isWinkPlayful = activeExpression === "playful";
    const isJoyfulArc = activeExpression === "happy" || activeExpression === "landing";
    const isSleepy = activeExpression === "sleepy";
    const isSurprisedOrDragged = activeExpression === "surprised" || activeExpression === "dragged";

    return {
      left: {
        isArc: isJoyfulArc,
        isWink: false,
        scaleY: isBlinking ? 0.08 : isSleepy ? 0.45 : isSurprisedOrDragged ? 1.25 : 1,
        scaleX: isBlinking ? 1.15 : isSurprisedOrDragged ? 1.18 : 1,
      },
      right: {
        isArc: isJoyfulArc,
        isWink: isWinkPlayful, // Right eye winks playfully
        scaleY: isBlinking || isWinkPlayful ? 0.08 : isSleepy ? 0.45 : isSurprisedOrDragged ? 1.25 : 1,
        scaleX: isBlinking || isWinkPlayful ? 1.15 : isSurprisedOrDragged ? 1.18 : 1,
      },
    };
  }, [activeExpression, isBlinking]);

  // Eye pupil offset (cursor tracking dampened during sleepy or wink)
  const pupilOffsetX = activeExpression === "sleepy" ? eyeTrackOffset.x * 0.3 : eyeTrackOffset.x;
  const pupilOffsetY = activeExpression === "sleepy" ? 1.5 : eyeTrackOffset.y;

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label="SoloBot Companion - Drag me around or click to interact"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      style={{
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      className={`relative select-none outline-none focus-visible:ring-4 focus-visible:ring-purple-400 rounded-3xl cursor-grab active:cursor-grabbing group ${className}`}
    >
      {/* Sci-Fi Atmospheric Glow Halo */}
      <div
        className={`absolute -inset-5 rounded-full blur-2xl pointer-events-none transition-all duration-300 ${
          isGrabbed || isDragging
            ? "bg-purple-500/60 scale-130"
            : isLanding
            ? "bg-emerald-400/60 scale-140"
            : isDashing
            ? "bg-emerald-400/50 scale-135"
            : isFollowing
            ? "bg-cyan-500/35 scale-120"
            : isHovered
            ? "bg-purple-600/40 scale-115"
            : "bg-purple-600/25 scale-100"
        }`}
      />
      <div
        className={`absolute -inset-2 rounded-full blur-lg pointer-events-none transition-all duration-300 ${
          isLanding
            ? "bg-[#00FF66]/50 scale-125"
            : isGrabbed || isDragging
            ? "bg-emerald-400/35 scale-120"
            : isDashing
            ? "bg-[#00FF66]/40 scale-125"
            : isFollowing
            ? "bg-cyan-400/30 scale-115"
            : "bg-emerald-500/15"
        }`}
      />

      {/* Spring Landing Dynamic Shockwave Expansion */}
      {isLanding && (
        <motion.div
          initial={{ scale: 0.5, opacity: 1, borderColor: "#00FF66" }}
          animate={{ scale: 2.6, opacity: 0, borderColor: "#A855F7" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="absolute -inset-3 rounded-full border-2 pointer-events-none shadow-[0_0_20px_#00FF66]"
        />
      )}

      {/* Main Robot Body Node */}
      <motion.div
        style={{
          rotate: `${tiltAngle}deg`,
          scaleX: stretchScale.x,
          scaleY: stretchScale.y,
          y: headPitch,
        }}
        animate={
          isDragging || isGrabbed
            ? { y: -8, scale: 1.06 }
            : isLanding
            ? { y: [6, -8, 2, 0], scale: [0.9, 1.1, 0.98, 1] }
            : isSpringingHome
            ? { y: [0, -12, 0], scale: [1, 1.08, 1] }
            : activeExpression === "happy"
            ? {
                y: [-3, 3, -3],
                scale: [1, 1.04, 1],
                transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
              }
            : activeExpression === "sleepy"
            ? {
                y: [-2, 2, -2],
                scale: [0.98, 1, 0.98],
                transition: { repeat: Infinity, duration: 4.8, ease: "easeInOut" },
              }
            : {
                y: [-5, 5, -5],
                transition: {
                  repeat: Infinity,
                  duration: 3.2,
                  ease: "easeInOut",
                },
              }
        }
        className="relative flex flex-col items-center justify-center transition-transform duration-75 ease-out"
      >
        {/* Antenna System */}
        <div className="relative flex flex-col items-center">
          {/* Glowing Antenna Orb */}
          <motion.div
            animate={{
              scale:
                isGrabbed || isDragging
                  ? [1.1, 1.4, 1.1]
                  : activeExpression === "surprised" || activeExpression === "playful"
                  ? [1, 1.35, 1]
                  : [1, 1.2, 1],
              opacity: isGrabbed || isDragging ? 1 : [0.75, 1, 0.75],
            }}
            transition={{
              repeat: Infinity,
              duration: isDragging ? 0.6 : 2,
              ease: "easeInOut",
            }}
            className="w-4 h-4 rounded-full bg-gradient-to-tr from-purple-500 via-fuchsia-400 to-[#00FF66] shadow-[0_0_14px_#A855F7,0_0_22px_#00FF66] z-20 flex items-center justify-center border border-white/70"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
          </motion.div>

          {/* Flexible Antenna Stem with inertia tilt */}
          <motion.div
            animate={{
              rotate: isDragging ? tiltAngle * -0.6 : 0,
            }}
            transition={{ duration: 0.1 }}
            className="w-1.5 h-4 bg-gradient-to-b from-purple-400 to-purple-800 rounded-t-sm shadow-[0_0_6px_rgba(168,85,247,0.8)] -mt-0.5 border-x border-purple-300/40 origin-bottom"
          />

          {/* Antenna Base Cap */}
          <div className="w-5 h-1.5 bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 rounded-full border border-purple-300/60 shadow-[0_0_8px_#A855F7]" />
        </div>

        {/* Head Chassis with Stereo Ears */}
        <div className="relative flex items-center justify-center -mt-0.5">
          {/* Left Cyber Ear */}
          <div className="relative flex items-center -mr-1 z-0">
            <div className="w-2.5 h-8 bg-gradient-to-b from-purple-900 via-purple-600 to-purple-950 rounded-l-md border-l-2 border-y border-purple-400/80 shadow-[0_0_8px_rgba(168,85,247,0.7)] flex flex-col items-center justify-center py-0.5">
              <motion.div
                animate={{
                  boxShadow:
                    isDragging || isGrabbed
                      ? "0 0 14px #00FF66, 0 0 20px #A855F7"
                      : activeExpression === "playful"
                      ? ["0 0 6px #00FF66", "0 0 16px #00FF66", "0 0 6px #00FF66"]
                      : ["0 0 4px #00FF66", "0 0 10px #00FF66", "0 0 4px #00FF66"],
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-3 bg-[#00FF66] rounded-full"
              />
            </div>
          </div>

          {/* Faceplate Visor Container */}
          <div
            className={`relative z-10 w-[100px] h-[82px] sm:w-[108px] sm:h-[88px] bg-gradient-to-b from-[#180E2E] via-[#0C071A] to-[#05030A] rounded-[24px] border-[2.5px] shadow-[0_0_20px_rgba(168,85,247,0.65),inset_0_1px_3px_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,255,102,0.25)] flex flex-col items-center justify-between p-2 overflow-hidden transition-all duration-200 ${
              isGrabbed || isDragging
                ? "border-emerald-400 shadow-[0_0_26px_rgba(0,255,102,0.7)]"
                : isLanding
                ? "border-[#00FF66] shadow-[0_0_28px_#00FF66]"
                : isHovered
                ? "border-purple-400 shadow-[0_0_22px_rgba(168,85,247,0.8)]"
                : "border-purple-500/90"
            }`}
          >
            {/* Top Gloss Refraction Strip */}
            <div className="absolute top-1 left-3 right-3 h-[7px] bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-full pointer-events-none" />

            {/* Futuristic Tech Corner Accents */}
            <div className="absolute top-1.5 left-2 w-1.5 h-1.5 border-t border-l border-emerald-400/60 pointer-events-none" />
            <div className="absolute top-1.5 right-2 w-1.5 h-1.5 border-t border-r border-emerald-400/60 pointer-events-none" />
            <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 border-b border-l border-purple-400/60 pointer-events-none" />
            <div className="absolute bottom-1.5 right-2 w-1.5 h-1.5 border-b border-r border-purple-400/60 pointer-events-none" />

            {/* Cute Status Top Header */}
            <div className="w-full flex items-center justify-between px-1.5 pt-0.5">
              <span className="text-[7.5px] font-mono font-bold tracking-widest text-purple-300/90 uppercase transition-colors">
                {isDashing
                  ? "ZOOM! ⚡"
                  : activeExpression === "dragged"
                  ? "WHEEE!"
                  : isSpringingHome
                  ? "SPRINGING"
                  : isFollowing
                  ? "FOLLOWING"
                  : activeExpression === "happy"
                  ? "HAPPY ^_^"
                  : activeExpression === "curious"
                  ? "CURIOUS?"
                  : activeExpression === "surprised"
                  ? "WHOA!"
                  : activeExpression === "confused"
                  ? "HMM..."
                  : activeExpression === "sleepy"
                  ? "SLEEPY zZ"
                  : activeExpression === "playful"
                  ? "PLAYFUL ;)"
                  : "SOLO·BOT"}
              </span>

              {/* Glowing Pulse Dot */}
              <motion.div
                animate={{
                  opacity:
                    isDragging || isGrabbed
                      ? [0.6, 1, 0.6]
                      : activeExpression === "sleepy"
                      ? [0.3, 0.7, 0.3]
                      : [0.7, 1, 0.7],
                  scale: isDragging ? 1.3 : activeExpression === "sleepy" ? 0.9 : [1, 1.15, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: activeExpression === "sleepy" ? 3 : 1.6,
                }}
                className="w-1.5 h-1.5 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66]"
              />
            </div>

            {/* Facial Rig: Eyebrows + Eyes Display */}
            <div className="relative w-full flex flex-col items-center justify-center py-0.5">
              {/* Eyebrows Container */}
              <div className="w-full flex items-center justify-around px-3 mb-1">
                {/* Left Eyebrow */}
                <motion.div
                  style={{
                    transformOrigin: "center",
                  }}
                  animate={{
                    y: eyebrows.left.y,
                    rotate: eyebrows.left.rotate,
                    scaleX: eyebrows.left.scaleX,
                  }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="w-5 h-1 rounded-full bg-gradient-to-r from-purple-400 via-[#00FF66] to-purple-400 shadow-[0_0_6px_#00FF66]"
                />

                {/* Right Eyebrow */}
                <motion.div
                  style={{
                    transformOrigin: "center",
                  }}
                  animate={{
                    y: eyebrows.right.y,
                    rotate: eyebrows.right.rotate,
                    scaleX: eyebrows.right.scaleX,
                  }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="w-5 h-1 rounded-full bg-gradient-to-r from-purple-400 via-[#00FF66] to-purple-400 shadow-[0_0_6px_#00FF66]"
                />
              </div>

              {/* Eyes Container */}
              <div className="relative w-full flex items-center justify-around px-3">
                {/* Left Eye */}
                <div className="relative flex items-center justify-center w-6 h-6">
                  {eyeStates.left.isArc ? (
                    // Joyful Arched Eye (^ shape)
                    <div className="w-5 h-3.5 border-t-[3.5px] border-x-[1.5px] border-b-0 border-[#00FF66] rounded-t-full shadow-[0_0_14px_#00FF66] mt-1" />
                  ) : (
                    // Glowing Eye with Interactive Pupil Tracking Cursor
                    <motion.div
                      animate={{
                        scaleY: eyeStates.left.scaleY,
                        scaleX: eyeStates.left.scaleX,
                      }}
                      transition={{ duration: 0.12, ease: "easeOut" }}
                      className="w-5 h-6 rounded-full bg-black/60 border border-purple-500/40 relative overflow-hidden flex items-center justify-center shadow-inner"
                    >
                      {/* Iris & Pupil that tracks cursor */}
                      <motion.div
                        style={{
                          transform: `translate3d(${pupilOffsetX}px, ${pupilOffsetY}px, 0)`,
                        }}
                        transition={{ duration: 0.08, ease: "easeOut" }}
                        className="w-4 h-5 rounded-full bg-gradient-to-b from-[#00FF88] via-[#00E676] to-[#00B0FF] shadow-[0_0_12px_#00FF66,0_0_20px_rgba(0,255,102,0.5)] relative flex items-center justify-center border border-white/40"
                      >
                        {/* Highlights */}
                        <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#ffffff]" />
                        <div className="absolute bottom-1 right-1 w-0.8 h-0.8 rounded-full bg-emerald-200 opacity-80" />
                      </motion.div>
                    </motion.div>
                  )}
                </div>

                {/* Right Eye */}
                <div className="relative flex items-center justify-center w-6 h-6">
                  {eyeStates.right.isArc ? (
                    // Joyful Arched Eye (^ shape)
                    <div className="w-5 h-3.5 border-t-[3.5px] border-x-[1.5px] border-b-0 border-[#00FF66] rounded-t-full shadow-[0_0_14px_#00FF66] mt-1" />
                  ) : eyeStates.right.isWink ? (
                    // Playful Wink (closed wink line with eyelash)
                    <div className="w-5 h-1.5 border-b-[3px] border-[#00FF66] rounded-b-md shadow-[0_0_10px_#00FF66] mt-1.5" />
                  ) : (
                    // Glowing Eye with Interactive Pupil Tracking Cursor
                    <motion.div
                      animate={{
                        scaleY: eyeStates.right.scaleY,
                        scaleX: eyeStates.right.scaleX,
                      }}
                      transition={{ duration: 0.12, ease: "easeOut" }}
                      className="w-5 h-6 rounded-full bg-black/60 border border-purple-500/40 relative overflow-hidden flex items-center justify-center shadow-inner"
                    >
                      {/* Iris & Pupil tracking cursor */}
                      <motion.div
                        style={{
                          transform: `translate3d(${pupilOffsetX}px, ${pupilOffsetY}px, 0)`,
                        }}
                        transition={{ duration: 0.08, ease: "easeOut" }}
                        className="w-4 h-5 rounded-full bg-gradient-to-b from-[#00FF88] via-[#00E676] to-[#00B0FF] shadow-[0_0_12px_#00FF66,0_0_20px_rgba(0,255,102,0.5)] relative flex items-center justify-center border border-white/40"
                      >
                        {/* Highlights */}
                        <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#ffffff]" />
                        <div className="absolute bottom-1 right-1 w-0.8 h-0.8 rounded-full bg-emerald-200 opacity-80" />
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Holographic Blush Spots (fades in on happy, playful, landing) */}
              {(activeExpression === "happy" ||
                activeExpression === "playful" ||
                activeExpression === "landing") && (
                <div className="w-full flex items-center justify-between px-2.5 -mt-1 pointer-events-none">
                  <div className="w-2.5 h-1 rounded-full bg-pink-400/50 blur-[1px] shadow-[0_0_6px_#F472B6]" />
                  <div className="w-2.5 h-1 rounded-full bg-pink-400/50 blur-[1px] shadow-[0_0_6px_#F472B6]" />
                </div>
              )}
            </div>

            {/* Expressive Mouth Display */}
            <div className="w-full flex items-center justify-center h-4 pb-0.5">
              <AnimatePresence mode="wait">
                {activeExpression === "happy" || activeExpression === "landing" ? (
                  // Cheerful Smile Arc
                  <motion.div
                    key="smile"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-7 h-2.5 border-b-[2.5px] border-[#00FF66] rounded-b-full shadow-[0_0_10px_#00FF66]"
                  />
                ) : activeExpression === "curious" ? (
                  // Cute Small 'o' mouth
                  <motion.div
                    key="curious"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-3 h-3 rounded-full border-[2px] border-[#00FF66] bg-[#00FF66]/20 shadow-[0_0_8px_#00FF66]"
                  />
                ) : activeExpression === "surprised" || activeExpression === "dragged" ? (
                  // Open Oval 'O' mouth in awe / excitement
                  <motion.div
                    key="surprised"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1.1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="w-4 h-3.5 rounded-full border-[2px] border-[#00FF66] bg-[#00FF66]/30 shadow-[0_0_12px_#00FF66]"
                  />
                ) : activeExpression === "confused" ? (
                  // Quirky Wavy SVG Mouth
                  <motion.div
                    key="confused"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-6 h-2 flex items-center justify-center"
                  >
                    <svg viewBox="0 0 24 8" className="w-full h-full stroke-[#00FF66] fill-none drop-shadow-[0_0_6px_#00FF66]">
                      <path d="M 2 4 Q 6 1 12 5 T 22 3" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                ) : activeExpression === "sleepy" ? (
                  // Gentle Sleepy Line / Soft Yawn
                  <motion.div
                    key="sleepy"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-0.5 bg-gradient-to-r from-purple-400 via-[#00FF66] to-purple-400 rounded-full shadow-[0_0_4px_#00FF66]"
                  />
                ) : activeExpression === "playful" ? (
                  // Cheeky Smile with Wink
                  <motion.div
                    key="playful"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-6 h-2 border-b-[2.5px] border-r-[2px] border-[#00FF66] rounded-br-full shadow-[0_0_8px_#00FF66] rotate-[-4deg]"
                  />
                ) : (
                  // Default Idle Subtle Cyber Indicator
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.75 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1"
                  >
                    <div className="w-1.5 h-0.5 bg-purple-400 rounded-full" />
                    <div className="w-5 h-0.5 bg-gradient-to-r from-purple-400 via-[#00FF66] to-purple-400 rounded-full shadow-[0_0_4px_#00FF66]" />
                    <div className="w-1.5 h-0.5 bg-purple-400 rounded-full" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Cyber Ear */}
          <div className="relative flex items-center -ml-1 z-0">
            <div className="w-2.5 h-8 bg-gradient-to-b from-purple-900 via-purple-600 to-purple-950 rounded-r-md border-r-2 border-y border-purple-400/80 shadow-[0_0_8px_rgba(168,85,247,0.7)] flex flex-col items-center justify-center py-0.5">
              <motion.div
                animate={{
                  boxShadow:
                    isDragging || isGrabbed
                      ? "0 0 14px #00FF66, 0 0 20px #A855F7"
                      : activeExpression === "playful"
                      ? ["0 0 6px #00FF66", "0 0 16px #00FF66", "0 0 6px #00FF66"]
                      : ["0 0 4px #00FF66", "0 0 10px #00FF66", "0 0 4px #00FF66"],
                }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                className="w-1.5 h-3 bg-[#00FF66] rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Floating Under-Body Thruster Neck Joint */}
        <div
          className={`w-8 h-2 bg-gradient-to-b from-purple-900 to-black rounded-b-lg border-x border-b border-purple-500/70 shadow-[0_0_8px_rgba(168,85,247,0.5)] -mt-0.5 ${
            isDragging ? "scale-x-125" : ""
          }`}
        />
      </motion.div>

      {/* Glowing Anti-Gravity Portal Base Ring */}
      <div className="relative w-full flex items-center justify-center mt-1">
        <motion.div
          animate={
            isLanding
              ? { scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }
              : isDragging || isGrabbed
              ? { scale: 0.7, opacity: 0.3 }
              : isDashing
              ? { scale: [1, 1.45, 1], opacity: [0.8, 1, 0.8] }
              : isSpringingHome || isFollowing
              ? { scale: [0.95, 1.35, 0.95], opacity: [0.65, 0.95, 0.65] }
              : {
                  scale: [0.85, 1.15, 0.85],
                  opacity: [0.55, 0.85, 0.55],
                }
          }
          transition={{
            repeat: isDragging || isGrabbed ? 0 : Infinity,
            duration: isDashing ? 0.8 : isFollowing ? 1.4 : 3,
            ease: "easeInOut",
          }}
          className={`w-16 h-3 rounded-[100%] bg-gradient-to-r from-purple-600/40 via-[#00FF66]/50 to-purple-600/40 blur-xs border shadow-[0_0_14px_#A855F7,0_0_20px_#00FF66] transition-colors ${
            isLanding ? "border-[#00FF66] shadow-[0_0_22px_#00FF66]" : "border-purple-400/50"
          }`}
        />
      </div>

      {/* Subtle Hint on Hover (clean, non-intrusive) */}
      <div className="text-center mt-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-[8px] font-mono tracking-wider text-purple-300/80 uppercase bg-black/60 px-2 py-0.5 rounded-full border border-purple-500/30">
          Drag & Toss · Click to Leap
        </span>
      </div>
    </div>
  );
};
