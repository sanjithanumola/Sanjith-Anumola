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
  onLand?: () => void;
}

export function useRobotPhysics({
  robotWidth = 110,
  robotHeight = 110,
  safeMargin = 20,
  onTap,
  onLand,
}: UseRobotPhysicsOptions = {}) {
  // Check reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Viewport positions
  const [position, setPosition] = useState<Position>({ x: -999, y: -999 });
  const [isInitialized, setIsInitialized] = useState(false);

  // Interaction & motion states
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpringingHome, setIsSpringingHome] = useState(false);
  const [isLanding, setIsLanding] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isDashing, setIsDashing] = useState(false);
  const [isFollowEnabled, setIsFollowEnabled] = useState(false);
  const isFollowEnabledRef = useRef(false);

  // Dynamic visual feedback values
  const [tiltAngle, setTiltAngle] = useState(0);
  const [stretchScale, setStretchScale] = useState({ x: 1, y: 1 });
  const [eyeTrackOffset, setEyeTrackOffset] = useState({ x: 0, y: 0 });
  const [headPitch, setHeadPitch] = useState(0);
  const [cursorDistance, setCursorDistance] = useState(9999);
  const [isCursorNear, setIsCursorNear] = useState(false);

  // Physics refs
  const positionRef = useRef<Position>({ x: 0, y: 0 });
  const homePositionRef = useRef<Position>({ x: 0, y: 0 });
  const followTargetRef = useRef<Position>({ x: 0, y: 0 });
  const velocityRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const physicsFrameRef = useRef<number | null>(null);

  // Drag tracking refs
  const isDraggingRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const pointerStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const robotStartPosRef = useRef<Position>({ x: 0, y: 0 });
  const pointerHistoryRef = useRef<Array<{ x: number; y: number; time: number }>>([]);
  const lastCursorPosRef = useRef<{ x: number; y: number } | null>(null);

  // Follower activity tracking refs
  const hasUserMovedPointerRef = useRef(false);
  const lastPointerMoveTimeRef = useRef<number>(0);
  const isCursorInsideWindowRef = useRef(true);
  const isSpringReturningRef = useRef(false);

  // Compute safe viewport boundaries
  const getBounds = useCallback(() => {
    if (typeof window === "undefined") return { minX: 16, maxX: 400, minY: 16, maxY: 600 };
    const minX = safeMargin;
    const maxX = Math.max(minX, window.innerWidth - robotWidth - safeMargin);
    const minY = safeMargin + 28;
    // Keep safely above bottom nav/footer marquee on screens >= 768px
    const bottomNavReserve = window.innerWidth >= 768 ? 58 : 20;
    const maxY = Math.max(minY, window.innerHeight - robotHeight - bottomNavReserve);
    return { minX, maxX, minY, maxY };
  }, [robotWidth, robotHeight, safeMargin]);

  // Compute home dock position (anchored neatly in bottom-right corner)
  const computeHomePosition = useCallback((): Position => {
    const bounds = getBounds();
    return {
      x: bounds.maxX,
      y: bounds.maxY,
    };
  }, [getBounds]);

  // Compute polite companion offset relative to cursor
  const computeFollowTarget = useCallback(
    (cursorX: number, cursorY: number): Position => {
      const bounds = getBounds();
      const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1200;

      // If cursor is on the right half, hover to the left; otherwise hover to the right
      const placeOnLeft = cursorX > screenWidth / 2;
      const offsetX = placeOnLeft ? -(robotWidth + 16) : 34;
      const offsetY = -28;

      const rawX = cursorX + offsetX;
      const rawY = cursorY + offsetY;

      return {
        x: Math.min(Math.max(bounds.minX, rawX), bounds.maxX),
        y: Math.min(Math.max(bounds.minY, rawY), bounds.maxY),
      };
    },
    [getBounds, robotWidth]
  );

  // Initialize position to home dock
  useEffect(() => {
    if (typeof window === "undefined") return;

    const home = computeHomePosition();
    homePositionRef.current = home;
    followTargetRef.current = home;
    positionRef.current = home;
    setPosition(home);
    setIsInitialized(true);
  }, [computeHomePosition]);

  // Window resize & orientation change handler
  useEffect(() => {
    const handleResize = () => {
      const home = computeHomePosition();
      homePositionRef.current = home;

      if (lastCursorPosRef.current && hasUserMovedPointerRef.current) {
        followTargetRef.current = computeFollowTarget(
          lastCursorPosRef.current.x,
          lastCursorPosRef.current.y
        );
      } else {
        followTargetRef.current = home;
      }

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
  }, [computeHomePosition, computeFollowTarget, getBounds]);

  // Landing squash-and-rebound safe landing effect
  const triggerLanding = useCallback(() => {
    setIsLanding(true);
    setIsSpringingHome(false);
    setIsDashing(false);
    isSpringReturningRef.current = false;

    // Squash on landing
    setStretchScale({ x: 1.25, y: 0.78 });
    setTiltAngle(0);
    setHeadPitch(2);

    onLand?.();

    // Rebound
    const t1 = setTimeout(() => {
      setStretchScale({ x: 0.94, y: 1.08 });
      setHeadPitch(-1);

      // Settle back to normal
      const t2 = setTimeout(() => {
        setStretchScale({ x: 1, y: 1 });
        setHeadPitch(0);
        setIsLanding(false);
      }, 180);

      return () => clearTimeout(t2);
    }, 160);

    return () => clearTimeout(t1);
  }, [onLand]);

  // Click-to-Move Trigger: makes the mascot playfully leap & dash across the screen!
  const triggerClickMove = useCallback(() => {
    if (typeof window === "undefined") return;

    const bounds = getBounds();
    const current = positionRef.current;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    // Pick an energetic new destination across the screen
    // If currently on the right half, dash across to the left; if on left, dash across to right!
    const isOnRight = current.x > screenW / 2;
    let targetX: number;
    if (isOnRight) {
      targetX = bounds.minX + Math.random() * (screenW * 0.35);
    } else {
      targetX = bounds.maxX - Math.random() * (screenW * 0.35);
    }

    // Varied altitude across middle and upper viewport
    const availableHeight = bounds.maxY - bounds.minY;
    const targetY = bounds.minY + Math.random() * (availableHeight * 0.65);

    const clampedTargetX = Math.min(Math.max(bounds.minX, targetX), bounds.maxX);
    const clampedTargetY = Math.min(Math.max(bounds.minY, targetY), bounds.maxY);

    followTargetRef.current = { x: clampedTargetX, y: clampedTargetY };

    // Inject strong dynamic impulse: upward rocket arc + lateral dash
    const dx = clampedTargetX - current.x;
    const dirX = Math.sign(dx) || 1;
    const jumpVx = dirX * (Math.random() * 6 + 16); // 16 to 22 px/frame lateral speed
    const jumpVy = -(Math.random() * 4 + 14); // -14 to -18 px/frame upward leap

    velocityRef.current = { vx: jumpVx, vy: jumpVy };
    isSpringReturningRef.current = true;
    setIsSpringingHome(true);
    setIsDashing(true);
    hasUserMovedPointerRef.current = true;
    lastPointerMoveTimeRef.current = performance.now();

    // Visual reaction to the click impulse
    setTiltAngle(dirX * 26);
    setStretchScale({ x: 0.85, y: 1.25 });

    onTap?.();
  }, [getBounds, onTap]);

  // Toggle follow mode: explicitly enabled when user clicks "Follow Me"
  const toggleFollowMode = useCallback((forced?: boolean) => {
    setIsFollowEnabled((prev) => {
      const next = typeof forced === "boolean" ? forced : !prev;
      isFollowEnabledRef.current = next;

      if (!next) {
        // Turning off follow mode: glide smoothly back to home dock
        isSpringReturningRef.current = true;
        setIsSpringingHome(true);
      } else {
        // Turning on follow mode: activate follower targeting
        hasUserMovedPointerRef.current = true;
        lastPointerMoveTimeRef.current = performance.now();
        isCursorInsideWindowRef.current = true;

        if (lastCursorPosRef.current) {
          followTargetRef.current = computeFollowTarget(
            lastCursorPosRef.current.x,
            lastCursorPosRef.current.y
          );
        } else if (typeof window !== "undefined") {
          followTargetRef.current = computeFollowTarget(
            window.innerWidth * 0.5,
            window.innerHeight * 0.5
          );
        }

        // Friendly lift-off boost towards cursor
        const current = positionRef.current;
        const dx = followTargetRef.current.x - current.x;
        const dy = followTargetRef.current.y - current.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 30) {
          velocityRef.current = {
            vx: (dx / dist) * 12,
            vy: (dy / dist) * 12 - 6,
          };
          isSpringReturningRef.current = true;
        }
      }

      return next;
    });
  }, [computeFollowTarget]);

  // Unified 60fps Physics & Follower Engine Loop
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(32, Math.max(8, now - lastTime)) / 16.6;
      lastTime = now;

      // While user is manually dragging, skip autonomous follower spring
      if (isDraggingRef.current) {
        physicsFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      const bounds = getBounds();
      const pos = positionRef.current;
      const timeSinceMove = now - lastPointerMoveTimeRef.current;

      // Follow cursor only when follow mode is enabled!
      const shouldFollow =
        isFollowEnabledRef.current &&
        hasUserMovedPointerRef.current &&
        isCursorInsideWindowRef.current &&
        timeSinceMove < 8500;

      const activeTarget = shouldFollow
        ? followTargetRef.current
        : homePositionRef.current;

      const dx = activeTarget.x - pos.x;
      const dy = activeTarget.y - pos.y;
      const dist = Math.hypot(dx, dy);

      const isSpringReturning = isSpringReturningRef.current;
      const stiffness = prefersReducedMotion
        ? 0.15
        : isSpringReturning
        ? 0.082
        : 0.048;
      const damping = prefersReducedMotion
        ? 0.7
        : isSpringReturning
        ? 0.81
        : 0.84;

      const ax = dx * stiffness;
      const ay = dy * stiffness;

      let vx = (velocityRef.current.vx + ax * dt) * Math.pow(damping, dt);
      let vy = (velocityRef.current.vy + ay * dt) * Math.pow(damping, dt);

      // Organic hover floating bob when nearly stationary near target
      let hoverBobY = 0;
      if (dist < 10 && Math.hypot(vx, vy) < 0.9 && !prefersReducedMotion) {
        hoverBobY = Math.sin(now * 0.0028) * 0.42;
      }

      let nextX = pos.x + vx * dt;
      let nextY = pos.y + vy * dt + hoverBobY;

      // Viewport collision safety with soft rebound
      if (nextX < bounds.minX) {
        nextX = bounds.minX;
        vx = Math.abs(vx) * 0.25;
      } else if (nextX > bounds.maxX) {
        nextX = bounds.maxX;
        vx = -Math.abs(vx) * 0.25;
      }

      if (nextY < bounds.minY) {
        nextY = bounds.minY;
        vy = Math.abs(vy) * 0.25;
      } else if (nextY > bounds.maxY) {
        nextY = bounds.maxY;
        vy = -Math.abs(vy) * 0.25;
      }

      velocityRef.current = { vx, vy };
      positionRef.current = { x: nextX, y: nextY };
      setPosition({ x: nextX, y: nextY });

      const speed = Math.hypot(vx, vy);

      // Actively following flag for visual state
      const currentlyFollowing = shouldFollow && (dist > 18 || speed > 1.2);
      setIsFollowing(currentlyFollowing);

      if (!prefersReducedMotion) {
        // Dynamic banking tilt facing the flight direction
        const flightTilt = Math.max(-26, Math.min(26, vx * 0.88));
        setTiltAngle(flightTilt);

        // Aerodynamic stretch based on flight speed
        if (speed > 1.6) {
          const stretch = Math.min(0.2, speed * 0.011);
          setStretchScale({
            x: 1 - stretch * 0.55,
            y: 1 + stretch,
          });
        } else {
          setStretchScale({ x: 1, y: 1 });
        }

        // Head pitch looking toward movement
        setHeadPitch(Math.max(-4, Math.min(4, vy * 0.22)));
      }

      // Eye tracking: Eyes look directly at the user's cursor while floating near it
      if (lastCursorPosRef.current) {
        const robotCenterX = nextX + robotWidth / 2;
        const robotCenterY = nextY + robotHeight / 2;
        const lookDx = lastCursorPosRef.current.x - robotCenterX;
        const lookDy = lastCursorPosRef.current.y - robotCenterY;

        const eyeFactor = 0.024;
        const eyeX = Math.max(-5.5, Math.min(5.5, lookDx * eyeFactor));
        const eyeY = Math.max(-4.5, Math.min(4.5, lookDy * eyeFactor));
        setEyeTrackOffset({ x: eyeX, y: eyeY });

        const cursorDist = Math.hypot(lookDx, lookDy);
        setCursorDistance(cursorDist);
        setIsCursorNear(cursorDist < 160);
      }

      // Arrival check when returning from fling/drag or click dash
      if (isSpringReturning && dist < 6 && speed < 0.6) {
        isSpringReturningRef.current = false;
        setIsSpringingHome(false);
        setIsDashing(false);
        triggerLanding();
      }

      physicsFrameRef.current = requestAnimationFrame(loop);
    };

    physicsFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (physicsFrameRef.current) {
        cancelAnimationFrame(physicsFrameRef.current);
      }
    };
  }, [
    isInitialized,
    getBounds,
    robotWidth,
    robotHeight,
    prefersReducedMotion,
    triggerLanding,
  ]);

  // Global Pointer / Mouse Move Tracking & Page Click Guide
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePointerTrack = (clientX: number, clientY: number) => {
      hasUserMovedPointerRef.current = true;
      lastPointerMoveTimeRef.current = performance.now();
      isCursorInsideWindowRef.current = true;
      lastCursorPosRef.current = { x: clientX, y: clientY };

      // Compute and update polite follower target position
      followTargetRef.current = computeFollowTarget(clientX, clientY);
    };

    const onPointerMove = (e: PointerEvent) => handlePointerTrack(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => handlePointerTrack(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        handlePointerTrack(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onMouseLeave = () => {
      isCursorInsideWindowRef.current = false;
    };

    const onMouseEnter = () => {
      isCursorInsideWindowRef.current = true;
      lastPointerMoveTimeRef.current = performance.now();
    };

    // When clicking on page background (not on buttons/links), robot dashes toward click location if follow mode is active
    const onDocumentClick = (e: MouseEvent) => {
      if (!isFollowEnabledRef.current) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("a, button, input, textarea, select, [role='button']")) {
        return;
      }

      const targetPos = computeFollowTarget(e.clientX, e.clientY);
      followTargetRef.current = targetPos;
      hasUserMovedPointerRef.current = true;
      lastPointerMoveTimeRef.current = performance.now();

      const current = positionRef.current;
      const dx = targetPos.x - current.x;
      const dy = targetPos.y - current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 45) {
        velocityRef.current = {
          vx: velocityRef.current.vx + (dx / dist) * 10,
          vy: velocityRef.current.vy + (dy / dist) * 10 - 4,
        };
        isSpringReturningRef.current = true;
        setIsDashing(true);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("click", onDocumentClick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("click", onDocumentClick);
    };
  }, [computeFollowTarget]);

  // Pointer Down (Drag Start on Robot)
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return; // Primary button only

    // Cancel fling / spring recovery if clicked mid-flight
    isSpringReturningRef.current = false;
    setIsSpringingHome(false);
    setIsDashing(false);

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore if unsupported
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

    // Lift anticipation effect
    setStretchScale({ x: 0.94, y: 1.1 });
  }, []);

  // Pointer Move (Dragging the Robot)
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPointerDownRef.current) return;

      const dx = e.clientX - pointerStartRef.current.x;
      const dy = e.clientY - pointerStartRef.current.y;
      const dist = Math.hypot(dx, dy);

      // Drag threshold (6px) cleanly distinguishes clicks from dragging
      if (!isDraggingRef.current && dist > 6) {
        isDraggingRef.current = true;
        setIsDragging(true);
      }

      if (isDraggingRef.current) {
        const bounds = getBounds();
        const rawX = robotStartPosRef.current.x + dx;
        const rawY = robotStartPosRef.current.y + dy;

        // Viewport safe clamping
        const clampedX = Math.min(Math.max(bounds.minX, rawX), bounds.maxX);
        const clampedY = Math.min(Math.max(bounds.minY, rawY), bounds.maxY);

        const now = performance.now();
        const history = pointerHistoryRef.current;
        history.push({ x: e.clientX, y: e.clientY, time: now });
        while (history.length > 1 && now - history[0].time > 120) {
          history.shift();
        }

        // Velocity computation for tilt and release toss
        let vx = 0;
        let vy = 0;
        if (history.length >= 2) {
          const oldest = history[0];
          const dt = Math.max(1, now - oldest.time);
          vx = ((e.clientX - oldest.x) / dt) * 16.6;
          vy = ((e.clientY - oldest.y) / dt) * 16.6;
        }

        velocityRef.current = { vx, vy };
        positionRef.current = { x: clampedX, y: clampedY };
        setPosition({ x: clampedX, y: clampedY });

        // Dynamic tilt based on drag motion
        setTiltAngle(Math.max(-28, Math.min(28, vx * 0.9)));

        // Eyes glance in direction of drag
        setEyeTrackOffset({
          x: Math.max(-5, Math.min(5, vx * 0.4)),
          y: Math.max(-4, Math.min(4, vy * 0.35)),
        });

        // Stretch along velocity vector
        const speed = Math.hypot(vx, vy);
        setStretchScale({
          x: 0.92 + Math.min(0.2, speed * 0.009),
          y: 1.08 - Math.min(0.16, speed * 0.007),
        });
      }
    },
    [getBounds]
  );

  // Pointer Up (Release Robot: Trigger Click Move OR Release Toss)
  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isPointerDownRef.current) return;

      isPointerDownRef.current = false;
      setIsGrabbed(false);

      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }

      if (!isDraggingRef.current) {
        // Pure tap / click without drag: trigger dynamic leap & move!
        triggerClickMove();
        return;
      }

      // Drag ended: release with momentum
      setIsDragging(false);
      isDraggingRef.current = false;

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

      // Clamp max release flick velocity
      const maxSpeed = 30;
      const speed = Math.hypot(releaseVx, releaseVy);
      if (speed > maxSpeed) {
        const ratio = maxSpeed / speed;
        releaseVx *= ratio;
        releaseVy *= ratio;
      }

      velocityRef.current = { vx: releaseVx * 0.7, vy: releaseVy * 0.7 };
      isSpringReturningRef.current = true;
      setIsSpringingHome(true);
      lastPointerMoveTimeRef.current = performance.now();
    },
    [triggerClickMove]
  );

  return {
    position,
    homePosition: homePositionRef.current,
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
    setIsFollowEnabled,
  };
}
