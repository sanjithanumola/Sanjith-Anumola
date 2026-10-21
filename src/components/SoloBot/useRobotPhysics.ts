import React, { useState, useEffect, useRef, useCallback } from "react";

export interface Position {
  x: number;
  y: number;
}

export type BubblePlacement = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface UseRobotPhysicsOptions {
  robotWidth?: number;
  robotHeight?: number;
  safeMargin?: number;
  onTap?: () => void;
  isChatOpen?: boolean;
}

export function useRobotPhysics({
  robotWidth = 115,
  robotHeight = 110,
  safeMargin = 16,
  onTap,
  isChatOpen = false,
}: UseRobotPhysicsOptions = {}) {
  // Check reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Viewport-based position state
  const [position, setPosition] = useState<Position>({ x: -999, y: -999 });
  const [isInitialized, setIsInitialized] = useState(false);

  // Interaction states
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLanding, setIsLanding] = useState(false);
  const [followMode, setFollowMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("solobot_follow_mode");
      return stored === "true";
    }
    return false;
  });

  // Dynamic visual feedback values
  const [tiltAngle, setTiltAngle] = useState(0);
  const [stretchScale, setStretchScale] = useState({ x: 1, y: 1 });
  const [lookOffset, setLookOffset] = useState({ x: 0, y: 0 });

  // Refs for tracking animation loops and pointer gestures
  const positionRef = useRef<Position>({ x: 0, y: 0 });
  const velocityRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const animFrameRef = useRef<number | null>(null);

  const isDraggingRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const pointerStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const robotStartPosRef = useRef<Position>({ x: 0, y: 0 });
  const pointerHistoryRef = useRef<Array<{ x: number; y: number; time: number }>>([]);

  // Follow-me target coordinates
  const companionTargetRef = useRef<Position | null>(null);
  const lastPointerActivityRef = useRef<number>(Date.now());

  // Safe clamping bounds calculation
  const getBounds = useCallback(() => {
    if (typeof window === "undefined") return { minX: 16, maxX: 400, minY: 16, maxY: 600 };
    const minX = safeMargin;
    const maxX = Math.max(minX, window.innerWidth - robotWidth - safeMargin);
    const minY = safeMargin;
    const maxY = Math.max(minY, window.innerHeight - robotHeight - safeMargin);
    return { minX, maxX, minY, maxY };
  }, [robotWidth, robotHeight, safeMargin]);

  // Set initial default position near bottom right
  useEffect(() => {
    if (typeof window === "undefined") return;

    const bounds = getBounds();
    const defaultX = bounds.maxX - 12;
    const defaultY = bounds.maxY - (window.innerWidth < 640 ? 10 : 30);

    const initialPos = {
      x: Math.max(bounds.minX, defaultX),
      y: Math.max(bounds.minY, defaultY),
    };

    positionRef.current = initialPos;
    setPosition(initialPos);
    setIsInitialized(true);
  }, [getBounds]);

  // Handle window resizing / orientation change to keep robot inside bounds
  useEffect(() => {
    const handleResize = () => {
      const bounds = getBounds();
      const clampedX = Math.min(Math.max(bounds.minX, positionRef.current.x), bounds.maxX);
      const clampedY = Math.min(Math.max(bounds.minY, positionRef.current.y), bounds.maxY);

      positionRef.current = { x: clampedX, y: clampedY };
      setPosition({ x: clampedX, y: clampedY });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [getBounds]);

  // Helper to trigger landing animation
  const triggerLanding = useCallback(() => {
    setIsLanding(true);
    // Squash & rebound settle
    setStretchScale({ x: 1.18, y: 0.82 });
    setTiltAngle(0);
    setLookOffset({ x: 0, y: 0 });

    setTimeout(() => {
      setStretchScale({ x: 0.96, y: 1.05 });
      setTimeout(() => {
        setStretchScale({ x: 1, y: 1 });
        setIsLanding(false);
      }, 250);
    }, 180);
  }, []);

  // Momentum arc deceleration physics loop
  const startMomentumLoop = useCallback(() => {
    if (prefersReducedMotion) {
      const bounds = getBounds();
      const clampedX = Math.min(Math.max(bounds.minX, positionRef.current.x), bounds.maxX);
      const clampedY = Math.min(Math.max(bounds.minY, positionRef.current.y), bounds.maxY);
      positionRef.current = { x: clampedX, y: clampedY };
      setPosition({ x: clampedX, y: clampedY });
      triggerLanding();
      return;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const bounds = getBounds();
    const friction = 0.91; // Smooth air resistance
    const bounceDamping = 0.45; // Soft bounce off walls

    const step = () => {
      let { vx, vy } = velocityRef.current;
      let { x, y } = positionRef.current;

      x += vx;
      y += vy;

      // Viewport bounce check
      if (x <= bounds.minX) {
        x = bounds.minX;
        vx = -vx * bounceDamping;
      } else if (x >= bounds.maxX) {
        x = bounds.maxX;
        vx = -vx * bounceDamping;
      }

      if (y <= bounds.minY) {
        y = bounds.minY;
        vy = -vy * bounceDamping;
      } else if (y >= bounds.maxY) {
        y = bounds.maxY;
        vy = -vy * bounceDamping;
      }

      vx *= friction;
      vy *= friction;

      velocityRef.current = { vx, vy };
      positionRef.current = { x, y };
      setPosition({ x, y });

      // Tilt gently toward deceleration direction
      setTiltAngle(Math.max(-18, Math.min(18, vx * 0.75)));
      setLookOffset({
        x: Math.max(-3.5, Math.min(3.5, vx * 0.35)),
        y: Math.max(-2.5, Math.min(2.5, vy * 0.25)),
      });

      const currentSpeed = Math.hypot(vx, vy);

      // Dynamic stretch based on speed
      if (currentSpeed > 3) {
        setStretchScale({
          x: 1 + Math.min(0.15, currentSpeed * 0.008),
          y: 1 - Math.min(0.12, currentSpeed * 0.006),
        });
      }

      if (currentSpeed > 0.35) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        // Safe settle into position
        velocityRef.current = { vx: 0, vy: 0 };
        animFrameRef.current = null;
        triggerLanding();
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, [getBounds, prefersReducedMotion, triggerLanding]);

  // Pointer drag start handler
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only respond to primary button
    if (e.button !== 0) return;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore if not supported
    }

    isPointerDownRef.current = true;
    isDraggingRef.current = false;
    setIsGrabbed(true);
    setIsDragging(false);

    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
    };

    robotStartPosRef.current = { ...positionRef.current };
    pointerHistoryRef.current = [
      { x: e.clientX, y: e.clientY, time: performance.now() },
    ];

    // Lift effect
    setStretchScale({ x: 0.95, y: 1.08 });
  }, []);

  // Pointer drag move handler
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;

    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    const dist = Math.hypot(dx, dy);

    // Intent threshold to separate clicks from drags
    if (!isDraggingRef.current && dist > 6) {
      isDraggingRef.current = true;
      setIsDragging(true);
    }

    if (isDraggingRef.current) {
      const bounds = getBounds();
      const rawX = robotStartPosRef.current.x + dx;
      const rawY = robotStartPosRef.current.y + dy;

      // Soft clamp: allow a few px overshoot with resistance
      const clampedX = Math.min(Math.max(bounds.minX - 6, rawX), bounds.maxX + 6);
      const clampedY = Math.min(Math.max(bounds.minY - 6, rawY), bounds.maxY + 6);

      const now = performance.now();
      const history = pointerHistoryRef.current;
      history.push({ x: e.clientX, y: e.clientY, time: now });
      // Keep recent 120ms history
      while (history.length > 1 && now - history[0].time > 120) {
        history.shift();
      }

      // Compute instant velocity for tilt and look direction
      let vx = 0;
      let vy = 0;
      if (history.length >= 2) {
        const oldest = history[0];
        const dt = Math.max(1, now - oldest.time);
        vx = ((e.clientX - oldest.x) / dt) * 16.6;
        vy = ((e.clientY - oldest.y) / dt) * 16.6;
      }

      positionRef.current = { x: clampedX, y: clampedY };
      setPosition({ x: clampedX, y: clampedY });

      // Tilt toward movement
      setTiltAngle(Math.max(-24, Math.min(24, vx * 0.85)));

      // Eyes look in movement direction
      setLookOffset({
        x: Math.max(-4, Math.min(4, vx * 0.4)),
        y: Math.max(-3, Math.min(3, vy * 0.3)),
      });

      // Stretch & squash acceleration effect
      const speed = Math.hypot(vx, vy);
      setStretchScale({
        x: 0.94 + Math.min(0.2, speed * 0.008),
        y: 1.06 - Math.min(0.15, speed * 0.006),
      });
    }
  }, [getBounds]);

  // Pointer drag end handler
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;

    isPointerDownRef.current = false;
    setIsGrabbed(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    if (!isDraggingRef.current) {
      // Pure click / tap without meaningful movement!
      setStretchScale({ x: 1, y: 1 });
      setTiltAngle(0);
      setLookOffset({ x: 0, y: 0 });
      onTap?.();
      return;
    }

    // Finished dragging
    setIsDragging(false);
    isDraggingRef.current = false;

    // Calculate release velocity from history
    const now = performance.now();
    const history = pointerHistoryRef.current;
    let releaseVx = 0;
    let releaseVy = 0;

    if (history.length >= 2) {
      const oldest = history[0];
      const newest = history[history.length - 1];
      const dt = Math.max(1, newest.time - oldest.time);
      releaseVx = ((newest.x - oldest.x) / dt) * 16.6;
      releaseVy = ((newest.y - oldest.y) / dt) * 16.6;
    }

    // Clamp extreme flick velocities to a realistic dynamic arc
    const maxVelocity = 28;
    const speed = Math.hypot(releaseVx, releaseVy);
    if (speed > maxVelocity) {
      const ratio = maxVelocity / speed;
      releaseVx *= ratio;
      releaseVy *= ratio;
    }

    velocityRef.current = { vx: releaseVx, vy: releaseVy };

    if (speed > 1.2) {
      // Dynamic arc launch with realistic momentum
      startMomentumLoop();
    } else {
      // Settle gently immediately if released at rest
      const bounds = getBounds();
      const clampedX = Math.min(Math.max(bounds.minX, positionRef.current.x), bounds.maxX);
      const clampedY = Math.min(Math.max(bounds.minY, positionRef.current.y), bounds.maxY);
      positionRef.current = { x: clampedX, y: clampedY };
      setPosition({ x: clampedX, y: clampedY });
      triggerLanding();
    }
  }, [getBounds, onTap, startMomentumLoop, triggerLanding]);

  // Follow-Me Companion Mode loop
  useEffect(() => {
    if (!followMode || isChatOpen || prefersReducedMotion) return;

    // Track cursor movement on window
    const handleGlobalPointerMove = (e: PointerEvent) => {
      // Don't follow if dragging robot or dragging other elements
      if (isPointerDownRef.current) return;

      // Don't follow touch events aggressively to avoid fighting scrolling
      if (e.pointerType === "touch") return;

      // Check if user is typing in an input or textarea
      const activeEl = document.activeElement;
      const isTyping =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          (activeEl as HTMLElement).isContentEditable);

      if (isTyping) return;

      lastPointerActivityRef.current = Date.now();

      // Companion hovers above and slightly left or right of the pointer
      const bounds = getBounds();
      const targetX = Math.min(Math.max(bounds.minX, e.clientX - robotWidth / 2 - 35), bounds.maxX);
      const targetY = Math.min(Math.max(bounds.minY, e.clientY - robotHeight - 40), bounds.maxY);

      companionTargetRef.current = { x: targetX, y: targetY };
    };

    window.addEventListener("pointermove", handleGlobalPointerMove, { passive: true });

    // Smooth companion interpolation rAF loop
    let companionAnimId: number;

    const followStep = () => {
      if (
        companionTargetRef.current &&
        !isPointerDownRef.current &&
        !velocityRef.current.vx &&
        !velocityRef.current.vy
      ) {
        const current = positionRef.current;
        const target = companionTargetRef.current;

        const dx = target.x - current.x;
        const dy = target.y - current.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 8) {
          // Lerp smoothly toward companion target
          const lerpFactor = 0.055;
          const nextX = current.x + dx * lerpFactor;
          const nextY = current.y + dy * lerpFactor;

          positionRef.current = { x: nextX, y: nextY };
          setPosition({ x: nextX, y: nextY });

          // Gentle companion tilt
          setTiltAngle(Math.max(-14, Math.min(14, dx * 0.08)));

          // Look toward target pointer
          setLookOffset({
            x: Math.max(-3.5, Math.min(3.5, dx * 0.04)),
            y: Math.max(-2.5, Math.min(2.5, dy * 0.04)),
          });
        } else {
          // Close enough, settle
          setTiltAngle(0);
          setLookOffset({ x: 0, y: 0 });
        }
      }

      companionAnimId = requestAnimationFrame(followStep);
    };

    companionAnimId = requestAnimationFrame(followStep);

    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      cancelAnimationFrame(companionAnimId);
    };
  }, [followMode, isChatOpen, prefersReducedMotion, getBounds, robotWidth, robotHeight]);

  // Toggle follow mode
  const toggleFollowMode = useCallback(() => {
    setFollowMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("solobot_follow_mode", String(next));
      }
      return next;
    });
  }, []);

  // Compute smart speech bubble placement based on current robot coordinates
  const computeBubblePlacement = useCallback((): BubblePlacement => {
    if (typeof window === "undefined") return "top-right";
    const midX = window.innerWidth / 2;
    const isRight = position.x > midX - 40;
    const isTop = position.y < 210;

    if (isTop) {
      return isRight ? "bottom-right" : "bottom-left";
    }
    return isRight ? "top-right" : "top-left";
  }, [position.x, position.y]);

  return {
    position,
    isInitialized,
    isGrabbed,
    isDragging,
    isLanding,
    followMode,
    tiltAngle,
    stretchScale,
    lookOffset,
    bubblePlacement: computeBubblePlacement(),
    toggleFollowMode,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
