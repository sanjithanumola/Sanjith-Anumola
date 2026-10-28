import React, { useState, useEffect, useCallback, useRef } from "react";
import { Sparkles } from "lucide-react";
import { SoloBotRobot, CharacterExpression } from "./SoloBotRobot";
import { useRobotPhysics } from "./useRobotPhysics";

// Playful sci-fi robot audio synthesizer (pure Web Audio API, harmless, no assets needed)
const playRobotSound = (type: "chirp" | "land" | "click" | "spring" | "dash") => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === "click" || type === "chirp") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(560, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.16);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === "dash") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(1180, now + 0.16);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.26);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "land") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === "spring") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.15);
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch {
    // Gracefully ignore if audio context is blocked
  }
};

export const SoloBotWidget: React.FC = () => {
  const [expression, setExpression] = useState<CharacterExpression>("happy");
  const prevIsLandingRef = useRef(false);
  const prevIsSpringingRef = useRef(false);

  // Initial greeting smile settling to idle
  useEffect(() => {
    const timer = setTimeout(() => {
      setExpression("idle");
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Periodic spontaneous emotion cycle while idle
  useEffect(() => {
    const expressions: CharacterExpression[] = [
      "happy",
      "curious",
      "playful",
      "confused",
      "sleepy",
    ];

    let timer: NodeJS.Timeout;

    const scheduleEmotion = () => {
      // Every 6 to 10 seconds, make the character playfully emote
      const interval = Math.random() * 4000 + 6000;
      timer = setTimeout(() => {
        const nextExpr = expressions[Math.floor(Math.random() * expressions.length)];
        setExpression(nextExpr);

        // Revert to idle after 2.8s
        const revertTimer = setTimeout(() => {
          setExpression("idle");
          scheduleEmotion();
        }, 2800);

        return () => clearTimeout(revertTimer);
      }, interval);
    };

    scheduleEmotion();
    return () => clearTimeout(timer);
  }, []);

  // Click handler on the robot: dash whoosh and playful expression
  const handleRobotClick = useCallback(() => {
    playRobotSound("dash");
    setExpression("playful");

    setTimeout(() => {
      setExpression("happy");
      setTimeout(() => {
        setExpression("idle");
      }, 1200);
    }, 900);
  }, []);

  // Landing callback triggered when arriving at destination
  const handleLand = useCallback(() => {
    playRobotSound("land");
    setExpression("landing");

    setTimeout(() => {
      setExpression("idle");
    }, 1200);
  }, []);

  // Connect physics, dragging, safe landing, following, click-dash, and Follow Me toggle
  const {
    position,
    isInitialized,
    isGrabbed,
    isDragging,
    isSpringingHome,
    isLanding,
    isFollowing,
    isDashing,
    isFollowEnabled,
    tiltAngle,
    stretchScale,
    eyeTrackOffset,
    headPitch,
    cursorDistance,
    isCursorNear,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    triggerClickMove,
    toggleFollowMode,
  } = useRobotPhysics({
    robotWidth: 110,
    robotHeight: 110,
    safeMargin: 20,
    onTap: handleRobotClick,
    onLand: handleLand,
  });

  // Sound and expression feedback on toggling "Follow Me"
  const handleToggleFollow = useCallback(() => {
    if (!isFollowEnabled) {
      playRobotSound("chirp");
      setExpression("happy");
      setTimeout(() => setExpression("idle"), 1400);
    } else {
      playRobotSound("land");
      setExpression("landing");
      setTimeout(() => setExpression("idle"), 1200);
    }
    toggleFollowMode();
  }, [isFollowEnabled, toggleFollowMode]);

  // Sound effect when spring return starts
  useEffect(() => {
    if (isSpringingHome && !prevIsSpringingRef.current && !isDashing) {
      playRobotSound("spring");
    }
    prevIsSpringingRef.current = isSpringingHome;
  }, [isSpringingHome, isDashing]);

  return (
    <>
      {/* Physics-driven Floating Robot Container positioned across viewport */}
      {isInitialized && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            zIndex: 60, // Above marquee footer (z-50) so it's always visible and unclipped
            willChange: "transform",
          }}
          className="pointer-events-none select-none flex flex-col items-center"
        >
          {/* Animated Draggable Mascot with Follow Me Button Above */}
          <div className="pointer-events-auto flex flex-col items-center">
            {/* "Follow Me" Button (Placed Above Solo Bot) */}
            <div className="mb-2 flex items-center justify-center z-20">
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFollow();
                }}
                className={`group flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-black uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[3px_3px_0_0_#000] border-2 border-black active:translate-x-0.5 active:translate-y-0.5 select-none ${
                  isFollowEnabled
                    ? "bg-[#00FF66] text-black shadow-[0_0_14px_rgba(0,255,102,0.7),3px_3px_0_0_#000] hover:bg-[#10B981]"
                    : "bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-[3px_3px_0_0_#000]"
                }`}
                title={
                  isFollowEnabled
                    ? "Click to stop following"
                    : "Click to make SoloBot follow your cursor"
                }
                aria-label={isFollowEnabled ? "Stop following" : "Follow Me"}
              >
                {isFollowEnabled ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-black" />
                    </span>
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#00FF66]" />
                    <span>Follow Me</span>
                  </>
                )}
              </button>
            </div>

            <SoloBotRobot
              expression={expression}
              isGrabbed={isGrabbed}
              isDragging={isDragging}
              isSpringingHome={isSpringingHome}
              isFollowing={isFollowing}
              isDashing={isDashing}
              isLanding={isLanding}
              tiltAngle={tiltAngle}
              headPitch={headPitch}
              stretchScale={stretchScale}
              eyeTrackOffset={eyeTrackOffset}
              cursorDistance={cursorDistance}
              isCursorNear={isCursorNear}
              onClick={triggerClickMove}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />
          </div>
        </div>
      )}
    </>
  );
};
