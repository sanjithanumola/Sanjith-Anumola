import React, { useState } from "react";
import { SoloBotRobot, RobotState } from "./SoloBotRobot";
import { SoloBotBubble } from "./SoloBotBubble";
import { SoloBotChatModal } from "./SoloBotChatModal";
import { useRobotPhysics } from "./useRobotPhysics";

export const SoloBotWidget: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userClosedBubble, setUserClosedBubble] = useState(false);
  const [robotState, setRobotState] = useState<RobotState>("greeting");

  // Initial greeting animation settling to idle
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setRobotState("idle");
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  const handleRobotClick = () => {
    // Playful bounce & state transition
    setRobotState("clicked");

    setTimeout(() => {
      // Toggle or open chat
      setIsChatOpen((prev) => {
        const nextState = !prev;
        if (nextState) {
          // Temporarily hide bubble while chat is open
        }
        return nextState;
      });
      setRobotState("idle");
    }, 320);
  };

  const handleBubbleClick = () => {
    setUserClosedBubble(true);
    setRobotState("greeting");
    setIsChatOpen(true);
    setTimeout(() => setRobotState("idle"), 1200);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setRobotState("idle");
  };

  const handleCloseBubble = () => {
    setUserClosedBubble(true);
  };

  // Connect physics, dragging, safe landing, and companion mode
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
    bubblePlacement,
    toggleFollowMode,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useRobotPhysics({
    robotWidth: 115,
    robotHeight: 110,
    safeMargin: 16,
    isChatOpen,
    onTap: handleRobotClick,
  });

  // Dynamic bubble position wrapper classes matching placement
  const bubblePositionClass = {
    "top-right": "bottom-full right-0 mb-3.5",
    "top-left": "bottom-full left-0 mb-3.5",
    "bottom-right": "top-full right-0 mt-3.5",
    "bottom-left": "top-full left-0 mt-3.5",
  }[bubblePlacement];

  // Speech bubble is hidden while dragging or while chat modal is open
  const showBubble = isInitialized && !isChatOpen && !userClosedBubble && !isDragging;

  return (
    <>
      {/* Interactive Chat Panel Modal */}
      <SoloBotChatModal
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        onStateChange={(newState) => setRobotState(newState)}
        followMode={followMode}
        onToggleFollowMode={toggleFollowMode}
      />

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
          {/* Smart Edge-Flipping Speech Bubble */}
          <div
            className={`absolute ${bubblePositionClass} pointer-events-auto transition-all duration-300`}
          >
            <SoloBotBubble
              isVisible={showBubble}
              onClose={handleCloseBubble}
              onClick={handleBubbleClick}
              placement={bubblePlacement}
            />
          </div>

          {/* Animated Draggable Mascot */}
          <div className="pointer-events-auto">
            <SoloBotRobot
              state={robotState}
              isChatOpen={isChatOpen}
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
