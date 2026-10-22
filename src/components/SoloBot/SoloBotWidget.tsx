import React, { useState, useEffect, useCallback, useRef } from "react";
import { SoloBotRobot, RobotState } from "./SoloBotRobot";
import { useRobotPhysics } from "./useRobotPhysics";

// Playful sci-fi robot audio synthesizer (pure Web Audio API, harmless, no assets needed)
const playRobotSound = (type: "chirp" | "land" | "click") => {
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
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);
      osc.frequency.exponentialRampToValueAtTime(1240, now + 0.16);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === "land") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    }
  } catch {
    // Gracefully ignore if audio context is blocked
  }
};

export const SoloBotWidget: React.FC = () => {
  const [robotState, setRobotState] = useState<RobotState>("greeting");
  const prevIsLandingRef = useRef(false);

  // Initial greeting animation settling to idle
  useEffect(() => {
    const timer = setTimeout(() => {
      setRobotState("idle");
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  // Click handler on the robot mascot: playful bounce and sci-fi chirp
  const handleRobotClick = useCallback(() => {
    playRobotSound("chirp");

    // Cheerful celebration bounce
    setRobotState("clicked");

    setTimeout(() => {
      setRobotState("idle");
    }, 1200);
  }, []);

  // Connect physics, dragging, safe landing, and companion follow mode
  const {
    position,
    isInitialized,
    isGrabbed,
    isDragging,
    isLanding,
    followMode,
    tiltAngle,
    stretchScale,
    lookOffset,
    toggleFollowMode,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useRobotPhysics({
    robotWidth: 115,
    robotHeight: 110,
    safeMargin: 16,
    isChatOpen: false,
    onTap: handleRobotClick,
  });

  // Play subtle land sound on landing impact
  useEffect(() => {
    if (isLanding && !prevIsLandingRef.current) {
      playRobotSound("land");
    }
    prevIsLandingRef.current = isLanding;
  }, [isLanding]);

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
            zIndex: 45,
            willChange: "transform",
          }}
          className="pointer-events-none select-none"
        >
          {/* Animated Draggable Mascot */}
          <div className="pointer-events-auto">
            <SoloBotRobot
              state={robotState}
              isGrabbed={isGrabbed}
              isDragging={isDragging}
              isLanding={isLanding}
              tiltAngle={tiltAngle}
              stretchScale={stretchScale}
              lookOffset={lookOffset}
              followMode={followMode}
              onToggleFollowMode={toggleFollowMode}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onClick={handleRobotClick}
            />
          </div>
        </div>
      )}
    </>
  );
};
