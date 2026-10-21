import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Compass, Sparkles } from "lucide-react";

export type RobotState = "idle" | "greeting" | "thinking" | "speaking" | "clicked";

export interface SoloBotRobotProps {
  state?: RobotState;
  onClick?: () => void;
  className?: string;
  isChatOpen?: boolean;
  isGrabbed?: boolean;
  isDragging?: boolean;
  isLanding?: boolean;
  tiltAngle?: number;
  stretchScale?: { x: number; y: number };
  lookOffset?: { x: number; y: number };
  followMode?: boolean;
  onToggleFollowMode?: () => void;
  onPointerDown?: (e: React.PointerEvent) => void;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
}

export const SoloBotRobot: React.FC<SoloBotRobotProps> = ({
  state = "idle",
  onClick,
  className = "",
  isChatOpen = false,
  isGrabbed = false,
  isDragging = false,
  isLanding = false,
  tiltAngle = 0,
  stretchScale = { x: 1, y: 1 },
  lookOffset = { x: 0, y: 0 },
  followMode = false,
  onToggleFollowMode,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) => {
  // Blinking control: periodic natural blinks
  const [isBlinking, setIsBlinking] = useState(false);
  const [glanceDirection, setGlanceDirection] = useState<"center" | "left" | "right">("center");

  // Random blink generator
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const scheduleNextBlink = () => {
      const delay = Math.random() * 3200 + 2600; // 2.6s - 5.8s
      blinkTimeout = setTimeout(() => {
        if (!isGrabbed && !isDragging) {
          setIsBlinking(true);
          setTimeout(() => {
            setIsBlinking(false);
            // 25% chance of double blink
            if (Math.random() < 0.25) {
              setTimeout(() => {
                setIsBlinking(true);
                setTimeout(() => setIsBlinking(false), 120);
              }, 100);
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

  // Subtle glancing movement in idle state
  useEffect(() => {
    const glanceInterval = setInterval(() => {
      if (state === "idle" && !isDragging && !isGrabbed) {
        const rand = Math.random();
        if (rand < 0.35) setGlanceDirection("left");
        else if (rand < 0.7) setGlanceDirection("right");
        else setGlanceDirection("center");
      } else {
        setGlanceDirection("center");
      }
    }, 3800);

    return () => clearInterval(glanceInterval);
  }, [state, isDragging, isGrabbed]);

  // Combine idle glance with physics drag offset
  const computedEyeX =
    lookOffset.x !== 0
      ? lookOffset.x
      : glanceDirection === "left"
      ? -3.2
      : glanceDirection === "right"
      ? 3.2
      : 0;
  const computedEyeY = lookOffset.y;

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="button"
      tabIndex={0}
      aria-label="Solo Bot Animated Assistant - Drag me or Click to chat"
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
      className={`relative select-none outline-none focus-visible:ring-4 focus-visible:ring-purple-400 rounded-3xl cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* Ambient Sci-Fi Glow Backdrop */}
      <div
        className={`absolute -inset-4 rounded-full blur-xl pointer-events-none transition-all duration-300 ${
          isGrabbed || isDragging
            ? "bg-purple-500/50 scale-125"
            : isLanding
            ? "bg-emerald-500/40 scale-135"
            : "bg-purple-600/25 group-hover:bg-purple-500/35"
        }`}
      />
      <div
        className={`absolute -inset-2 rounded-full blur-lg pointer-events-none transition-all duration-300 ${
          isLanding || isGrabbed
            ? "bg-emerald-400/35 scale-120"
            : "bg-emerald-500/10 group-hover:bg-emerald-400/25"
        }`}
      />

      {/* Landing Dynamic Ripple Wave Expansion */}
      {isLanding && (
        <motion.div
          initial={{ scale: 0.6, opacity: 0.9, borderColor: "#00FF66" }}
          animate={{ scale: 2.4, opacity: 0, borderColor: "#A855F7" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="absolute -inset-2 rounded-full border-2 pointer-events-none shadow-[0_0_16px_#00FF66]"
        />
      )}

      {/* Floating Robot Main Transform Node */}
      <motion.div
        style={{
          rotate: `${tiltAngle}deg`,
          scaleX: stretchScale.x,
          scaleY: stretchScale.y,
        }}
        animate={
          isDragging || isGrabbed
            ? { y: -8, scale: 1.05 }
            : isLanding
            ? { y: [4, -6, 2, 0], scale: [0.92, 1.08, 0.98, 1] }
            : state === "clicked"
            ? {
                y: [0, -18, 4, -8, 0],
                rotate: [0, -6, 6, -3, 0],
                scale: [1, 1.14, 0.96, 1.05, 1],
                transition: { duration: 0.65, ease: "easeOut" },
              }
            : state === "greeting"
            ? {
                y: [0, -12, 2, -6, 0],
                rotate: [0, -4, 4, -2, 0],
                scale: [1, 1.08, 0.98, 1],
                transition: { duration: 0.8, ease: "easeInOut" },
              }
            : {
                y: [-5, 5, -5],
                transition: {
                  repeat: Infinity,
                  duration: 3.4,
                  ease: "easeInOut",
                },
              }
        }
        className="relative flex flex-col items-center justify-center transition-transform duration-75 ease-out"
      >
        {/* Top Floating Glowing Orb & Antenna */}
        <div className="relative flex flex-col items-center">
          {/* Glowing Orb */}
          <motion.div
            animate={{
              scale:
                isGrabbed || isDragging
                  ? [1.1, 1.35, 1.1]
                  : state === "thinking"
                  ? [1, 1.45, 0.9, 1.35, 1]
                  : [1, 1.2, 1],
              opacity:
                isGrabbed || isDragging
                  ? 1
                  : state === "thinking"
                  ? [0.8, 1, 0.7, 1]
                  : [0.75, 1, 0.75],
            }}
            transition={{
              repeat: Infinity,
              duration: isDragging ? 0.8 : state === "thinking" ? 1.2 : 2.2,
              ease: "easeInOut",
            }}
            className="w-4 h-4 rounded-full bg-gradient-to-tr from-purple-500 via-fuchsia-400 to-[#00FF66] shadow-[0_0_14px_#A855F7,0_0_22px_#00FF66] z-20 flex items-center justify-center border border-white/70"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
          </motion.div>

          {/* Antenna Stem */}
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

        {/* Head & Body Unit */}
        <div className="relative flex items-center justify-center -mt-0.5">
          {/* Left Ear Component */}
          <div className="relative flex items-center -mr-1 z-0">
            <div className="w-2.5 h-7 bg-gradient-to-b from-purple-900 via-purple-600 to-purple-950 rounded-l-md border-l-2 border-y border-purple-400/80 shadow-[0_0_8px_rgba(168,85,247,0.7)] flex flex-col items-center justify-center py-0.5">
              <motion.div
                animate={{
                  boxShadow:
                    isDragging || isGrabbed
                      ? "0 0 12px #00FF66, 0 0 18px #A855F7"
                      : [
                          "0 0 4px #00FF66",
                          "0 0 10px #00FF66, 0 0 14px #A855F7",
                          "0 0 4px #00FF66",
                        ],
                }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                className="w-1.5 h-3 bg-[#00FF66] rounded-full"
              />
            </div>
          </div>

          {/* Main Faceplate Helmet */}
          <div
            className={`relative z-10 w-[96px] h-[78px] sm:w-[104px] sm:h-[84px] bg-gradient-to-b from-[#180E2E] via-[#0C071A] to-[#05030A] rounded-[22px] border-[2.5px] shadow-[0_0_18px_rgba(168,85,247,0.65),inset_0_1px_3px_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,255,102,0.25)] flex flex-col items-center justify-between p-2 overflow-hidden transition-colors ${
              isGrabbed || isDragging
                ? "border-emerald-400 shadow-[0_0_24px_rgba(0,255,102,0.6)]"
                : isLanding
                ? "border-[#00FF66] shadow-[0_0_26px_#00FF66]"
                : "border-purple-500/90"
            }`}
          >
            {/* Top Gloss Refraction Stripe */}
            <div className="absolute top-1 left-3 right-3 h-[7px] bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-full pointer-events-none" />

            {/* Subtle Futuristic Tech Corner Accents */}
            <div className="absolute top-1.5 left-2 w-1.5 h-1.5 border-t border-l border-emerald-400/60 pointer-events-none" />
            <div className="absolute top-1.5 right-2 w-1.5 h-1.5 border-t border-r border-emerald-400/60 pointer-events-none" />
            <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 border-b border-l border-purple-400/60 pointer-events-none" />
            <div className="absolute bottom-1.5 right-2 w-1.5 h-1.5 border-b border-r border-purple-400/60 pointer-events-none" />

            {/* Status / Model Mini Badge */}
            <div className="w-full flex items-center justify-between px-1.5 pt-0.5">
              <span className="text-[7px] font-mono font-bold tracking-widest text-purple-400/90 uppercase">
                {isDragging ? "DRAGGING" : followMode ? "COMPANION" : "SOLO·AI"}
              </span>
              <motion.div
                animate={{
                  opacity:
                    isDragging || isGrabbed
                      ? 1
                      : state === "thinking"
                      ? [0.4, 1, 0.4]
                      : [0.7, 1, 0.7],
                  scale: isDragging ? 1.3 : state === "thinking" ? [0.9, 1.25, 0.9] : [1, 1.1, 1],
                }}
                transition={{ repeat: Infinity, duration: state === "thinking" ? 0.6 : 1.8 }}
                className={`w-1.5 h-1.5 rounded-full ${
                  followMode
                    ? "bg-amber-300 shadow-[0_0_8px_#F59E0B]"
                    : "bg-[#00FF66] shadow-[0_0_6px_#00FF66]"
                }`}
              />
            </div>

            {/* Robot Eyes Screen Display */}
            <div className="relative w-full flex items-center justify-center gap-4 py-1">
              {/* Left Eye */}
              <motion.div
                style={{
                  transform: `translate3d(${computedEyeX}px, ${computedEyeY}px, 0)`,
                }}
                animate={{
                  scaleY: isBlinking
                    ? 0.08
                    : isGrabbed
                    ? 1.25
                    : state === "clicked" || isLanding
                    ? 0.75
                    : 1,
                  scaleX: isBlinking
                    ? 1.1
                    : isGrabbed
                    ? 1.2
                    : state === "clicked" || isLanding
                    ? 1.15
                    : 1,
                }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="relative flex items-center justify-center"
              >
                {state === "clicked" || isLanding ? (
                  // Cheerful Happy Eye: ^ curved arc on click & landing
                  <div className="w-5 h-3 border-t-[3.5px] border-x-[1px] border-b-0 border-[#00FF66] rounded-t-full shadow-[0_0_14px_#00FF66]" />
                ) : state === "thinking" ? (
                  // Thinking Eye: Pulsing Matrix Ring
                  <motion.div
                    animate={{ rotate: 360, scale: [0.9, 1.1, 0.9] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
                    className="w-4 h-4 rounded-full border-2 border-dashed border-[#00FF66] shadow-[0_0_10px_#00FF66] flex items-center justify-center"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  </motion.div>
                ) : (
                  // Normal Expressive Glowing Green Eye (widens when grabbed)
                  <div
                    className={`rounded-full bg-gradient-to-b from-[#00FF88] via-[#00E676] to-[#00B0FF] shadow-[0_0_12px_#00FF66,0_0_24px_rgba(0,255,102,0.45)] relative overflow-hidden border border-emerald-200/60 ${
                      isGrabbed
                        ? "w-5 h-6 sm:w-5.5 sm:h-6.5 shadow-[0_0_18px_#00FF66]"
                        : "w-4 h-5 sm:w-4.5 sm:h-5.5"
                    }`}
                  >
                    {/* Eye Glimmer / Pupil Highlight */}
                    <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#ffffff]" />
                    <div className="absolute bottom-1 right-1 w-0.8 h-0.8 rounded-full bg-emerald-200 opacity-70" />
                  </div>
                )}
              </motion.div>

              {/* Right Eye */}
              <motion.div
                style={{
                  transform: `translate3d(${computedEyeX}px, ${computedEyeY}px, 0)`,
                }}
                animate={{
                  scaleY: isBlinking
                    ? 0.08
                    : isGrabbed
                    ? 1.25
                    : state === "clicked" || isLanding
                    ? 0.75
                    : 1,
                  scaleX: isBlinking
                    ? 1.1
                    : isGrabbed
                    ? 1.2
                    : state === "clicked" || isLanding
                    ? 1.15
                    : 1,
                }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="relative flex items-center justify-center"
              >
                {state === "clicked" || isLanding ? (
                  // Cheerful Happy Eye: ^ curved arc on click & landing
                  <div className="w-5 h-3 border-t-[3.5px] border-x-[1px] border-b-0 border-[#00FF66] rounded-t-full shadow-[0_0_14px_#00FF66]" />
                ) : state === "thinking" ? (
                  // Thinking Eye: Pulsing Matrix Ring
                  <motion.div
                    animate={{ rotate: -360, scale: [0.9, 1.1, 0.9] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
                    className="w-4 h-4 rounded-full border-2 border-dashed border-[#00FF66] shadow-[0_0_10px_#00FF66] flex items-center justify-center"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  </motion.div>
                ) : (
                  // Normal Expressive Glowing Green Eye
                  <div
                    className={`rounded-full bg-gradient-to-b from-[#00FF88] via-[#00E676] to-[#00B0FF] shadow-[0_0_12px_#00FF66,0_0_24px_rgba(0,255,102,0.45)] relative overflow-hidden border border-emerald-200/60 ${
                      isGrabbed
                        ? "w-5 h-6 sm:w-5.5 sm:h-6.5 shadow-[0_0_18px_#00FF66]"
                        : "w-4 h-5 sm:w-4.5 sm:h-5.5"
                    }`}
                  >
                    {/* Eye Glimmer / Pupil Highlight */}
                    <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#ffffff]" />
                    <div className="absolute bottom-1 right-1 w-0.8 h-0.8 rounded-full bg-emerald-200 opacity-70" />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Digital Mouth / Soundwave Equalizer Display */}
            <div className="w-full flex items-center justify-center h-3.5 pb-0.5">
              {state === "speaking" ? (
                // Speaking: Animated Audio Equalizer Waveform
                <div className="flex items-center gap-0.8 h-3">
                  {[0.4, 0.9, 0.6, 1, 0.7, 0.3].map((height, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scaleY: [height * 0.4, height * 1.3, height * 0.3],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.35 + i * 0.08,
                        ease: "easeInOut",
                      }}
                      className="w-1 bg-[#00FF66] rounded-full shadow-[0_0_6px_#00FF66] origin-center"
                      style={{ height: "10px" }}
                    />
                  ))}
                </div>
              ) : state === "thinking" ? (
                // Thinking: Digital Scanning Beam
                <div className="relative w-12 h-1 bg-purple-950/80 rounded-full overflow-hidden border border-purple-500/50">
                  <motion.div
                    animate={{ x: [-24, 48] }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-6 h-full bg-gradient-to-r from-transparent via-[#00FF66] to-transparent shadow-[0_0_6px_#00FF66]"
                  />
                </div>
              ) : state === "clicked" || isLanding ? (
                // Cheerful Smile Line
                <div className="w-6 h-2 border-b-2 border-[#00FF66] rounded-b-full shadow-[0_0_8px_#00FF66]" />
              ) : isGrabbed || isDragging ? (
                // Playful O mouth when grabbed/dragged
                <div className="w-3 h-2 rounded-full border border-[#00FF66] bg-[#00FF66]/20 shadow-[0_0_6px_#00FF66]" />
              ) : (
                // Idle Subtle Cyber Line
                <div className="flex items-center gap-1 opacity-70">
                  <div className="w-1.5 h-0.5 bg-purple-400 rounded-full" />
                  <div className="w-6 h-0.5 bg-gradient-to-r from-purple-400 via-[#00FF66] to-purple-400 rounded-full shadow-[0_0_4px_#00FF66]" />
                  <div className="w-1.5 h-0.5 bg-purple-400 rounded-full" />
                </div>
              )}
            </div>
          </div>

          {/* Right Ear Component */}
          <div className="relative flex items-center -ml-1 z-0">
            <div className="w-2.5 h-7 bg-gradient-to-b from-purple-900 via-purple-600 to-purple-950 rounded-r-md border-r-2 border-y border-purple-400/80 shadow-[0_0_8px_rgba(168,85,247,0.7)] flex flex-col items-center justify-center py-0.5">
              <motion.div
                animate={{
                  boxShadow:
                    isDragging || isGrabbed
                      ? "0 0 12px #00FF66, 0 0 18px #A855F7"
                      : [
                          "0 0 4px #00FF66",
                          "0 0 10px #00FF66, 0 0 14px #A855F7",
                          "0 0 4px #00FF66",
                        ],
                }}
                transition={{ repeat: Infinity, duration: 1.8, delay: 0.3 }}
                className="w-1.5 h-3 bg-[#00FF66] rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Floating Under-Body Thruster/Neck Joint */}
        <div
          className={`w-7 h-2 bg-gradient-to-b from-purple-900 to-black rounded-b-lg border-x border-b border-purple-500/70 shadow-[0_0_8px_rgba(168,85,247,0.5)] -mt-0.5 ${
            isDragging ? "scale-x-125" : ""
          }`}
        />
      </motion.div>

      {/* Subtle Glowing Circular Base / Anti-Gravity Portal Ring beneath robot */}
      <div className="relative w-full flex items-center justify-center mt-1">
        <motion.div
          animate={
            isLanding
              ? { scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }
              : isDragging || isGrabbed
              ? { scale: 0.75, opacity: 0.4 }
              : state === "clicked"
              ? { scale: [1, 1.4, 0.9, 1], opacity: [0.6, 1, 0.5, 0.7] }
              : {
                  scale: [0.85, 1.15, 0.85],
                  opacity: [0.55, 0.85, 0.55],
                }
          }
          transition={{
            repeat: isDragging || isGrabbed ? 0 : Infinity,
            duration: 3.4,
            ease: "easeInOut",
          }}
          className={`w-16 h-3 rounded-[100%] bg-gradient-to-r from-purple-600/40 via-[#00FF66]/50 to-purple-600/40 blur-xs border shadow-[0_0_14px_#A855F7,0_0_20px_#00FF66] transition-colors ${
            isLanding ? "border-[#00FF66] shadow-[0_0_22px_#00FF66]" : "border-purple-400/50"
          }`}
        />
      </div>

      {/* Mini Companion Follow-Me Toggle Button attached on robot */}
      {onToggleFollowMode && !isChatOpen && (
        <div className="absolute -top-2.5 -right-2.5 z-30">
          <button
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFollowMode();
            }}
            title={
              followMode
                ? "Follow-Me Companion Mode is ON — Click to pause"
                : "Enable Follow-Me Companion Mode"
            }
            aria-label="Toggle Follow-Me companion mode"
            className={`w-6 h-6 rounded-full flex items-center justify-center border shadow-md transition-all cursor-pointer ${
              followMode
                ? "bg-[#00FF66] text-black border-white shadow-[0_0_12px_#00FF66] scale-110 animate-pulse"
                : "bg-[#0D071F]/90 text-purple-300 border-purple-500/60 hover:text-white hover:border-purple-300"
            }`}
          >
            {followMode ? (
              <Sparkles className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Compass className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      )}

      {/* Hover Pulse Tooltip / Status hint */}
      {!isChatOpen && !isDragging && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-purple-300 bg-black/85 px-2 py-0.5 rounded-full border border-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.5)]">
            Drag · Click to Chat
          </span>
        </div>
      )}
    </div>
  );
};
