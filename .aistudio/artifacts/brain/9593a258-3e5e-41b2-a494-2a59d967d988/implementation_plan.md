# Implementation Plan — Solo Bot: Interactive Drag, Follow & Safe Landing Animations

Upgrade the existing animated Solo Bot mascot on Sanjith's portfolio with a physics-driven interaction system featuring smooth dragging, realistic momentum landing arcs, viewport edge safety, Follow-Me companion mode, and a dynamically flipping speech bubble.

---

## User Preferences & Requirements Grounding
- **Follow-Me Companion Mode:** Controlled via dedicated toggle button on both the robot widget and inside the chat modal header/toolbar.
- **Landing Deceleration:** Dynamic momentum arc with realistic velocity decay, edge bounce cushioning, and soft squash-and-settle.
- **Speech Bubble Behavior:** Auto-hides during drag/follow, fades back in on safe landing, and intelligently flips orientation (top/bottom, left/right) based on viewport position to prevent clipping.

---

## Proposed Architecture & File Changes

### 1. New Physics Hook & Engine (`src/components/SoloBot/useSoloBotPhysics.ts`)
Create a custom hook managing robot coordinates, drag states, velocity, follow-me tracking, and viewport safety:
- **Pointer Events**: Pointer down, move, up, cancel with pointer capture (`setPointerCapture`) for seamless mouse, touch, and stylus support.
- **Drag Threshold**: 5px movement threshold before drag initiates to prevent accidental drags during normal clicks/taps (ensures chat toggle remains crisp).
- **Physics Engine (`requestAnimationFrame`)**:
  - Velocity calculation: $(v_x, v_y)$ computed from pointer movement deltas over time.
  - Momentum arc on release: dynamic deceleration using friction coefficient ($\sim 0.92$) and gentle gravity/floating arc.
  - Viewport boundary collision detection: cushions safely against top, bottom, left, and right screen edges with minimum margins ($16\text{px}-24\text{px}$ padding).
  - Squash & stretch calculation: scales dynamically based on acceleration and velocity vectors.
  - Tilt calculation: rotational tilt proportional to horizontal velocity (clamped to $[-16^\circ, 16^\circ]$).
  - Eye direction vector: calculates normalized gaze $(dx, dy)$ towards drag direction.
- **Follow-Me Companion Mode**:
  - Global pointer tracker with damped lerp (linear interpolation) following cursor with slight delay.
  - Auto-pauses when interacting with input elements (`input`, `textarea`, chat input) or during active drag.
  - Default disabled on touch devices, user toggleable with persistence in `localStorage`.
- **Responsive Viewport Clamping**: Automatically reclamps robot position on window resize or orientation changes.
- **Accessibility**: Honors `prefers-reduced-motion` media query by bypassing physics loops and instant-snapping to safe coordinates.

### 2. Enhanced Mascot Component (`src/components/SoloBot/SoloBotRobot.tsx`)
Extend the current visual SVG/CSS robot to respond to physical interaction states:
- **Extended Robot States**: `"idle" | "greeting" | "thinking" | "speaking" | "clicked" | "grabbed" | "dragging" | "landing" | "happy"`.
- **Dynamic Eye Tracking**: Pupil offset follows $(dx, dy)$ drag vector during movement, wide-eyed curious expression on grab, cheerful squint on happy landing.
- **Stretch & Squash Transforms**: Embedded spring-like scale adjustments during grab, drag, and landing rebound.
- **Thruster & Glowing Landing Ripple**:
  - Animated ring/ripple effect expanding on release/landing with neon purple and emerald accents.
  - Enhanced particle trail / glow trail when velocity is high.
- **Companion Mode Badge / Toggle**:
  - Sleek mini-indicator on the robot or its floating pedestal showing Follow-Me status with one-click toggle.

### 3. Dynamic Adaptive Speech Bubble (`src/components/SoloBot/SoloBotBubble.tsx`)
Upgrade speech bubble to handle floating coordinates and intelligent viewport flipping:
- **Auto-Hide During Drag**: Smooth fade/scale exit as soon as drag threshold is crossed; fades back in upon settle.
- **Smart Edge Flipping**:
  - Detects if robot is in the upper or lower half of screen: renders bubble above (default) or below the robot.
  - Detects if robot is on the left or right half: positions pointer and bubble body to avoid horizontal clipping.
  - Inverts triangle pointer orientation automatically (pointing down when bubble is above, pointing up when bubble is below).

### 4. Chat Modal Integration (`src/components/SoloBot/SoloBotChatModal.tsx`)
- Add Follow-Me companion toggle in the chat modal header alongside the existing sound and clear buttons.
- Keep full conversational context, knowledge base, and Gemini streaming responses untouched.

### 5. Master Orchestrator (`src/components/SoloBot/SoloBotWidget.tsx`)
- Connect `useSoloBotPhysics` with `SoloBotRobot`, `SoloBotBubble`, and `SoloBotChatModal`.
- Manage persistent coordinates, companion mode state, drag lifecycle, and chat open/close logic.

---

## Verification & Validation Plan
1. **Compilation & Build**:
   - Run `compile_applet` to ensure TypeScript types, imports, and bundling pass cleanly.
2. **Drag & Touch Interactions**:
   - Test mouse click without moving $\rightarrow$ opens/closes chat normally.
   - Test mouse drag $\rightarrow$ robot tilts, eyes look in direction of movement, bubble auto-hides.
   - Test fast flick/throw $\rightarrow$ robot coasts on momentum arc, bounces softly at viewport boundary, triggers landing ripple and squash-settle.
3. **Follow-Me Companion Mode**:
   - Toggle companion mode ON $\rightarrow$ robot glides gently behind pointer with slight delay.
   - Focus chat input or typing field $\rightarrow$ companion pauses in place.
   - Toggle companion mode OFF $\rightarrow$ robot floats in place safely.
4. **Boundary & Orientation**:
   - Drag to screen corners $\rightarrow$ robot remains fully visible, bubble flips away from edges.
   - Resize window $\rightarrow$ robot stays within safe bounds without clipping or causing scrollbars.
