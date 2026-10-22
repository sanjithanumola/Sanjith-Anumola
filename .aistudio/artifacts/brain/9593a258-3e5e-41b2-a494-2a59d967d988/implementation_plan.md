# Implementation Plan — Solo Bot: Organic Cursor Following Companion & Drag Physics

Upgrade the Solo Bot mascot on Sanjith's portfolio into an organic, lifelike companion that naturally follows the user's cursor across the screen, complete with 60fps spring dynamics, polite non-intrusive floating offset, drag & toss physics, facial rigging, and safe-landing squash & stretch — with no buttons or toggles.

---

## Completed Architecture & Behaviors

### 1. Organic Cursor Follower Engine (`src/components/SoloBot/useRobotPhysics.ts`)
- **Polite Companion Offset:** Computes an intelligent floating target relative to the cursor (hovering ~110px to the left or ~35px to the right, slightly above the pointer line) so it never blocks clicks on cards, links, or text.
- **Unified 60fps Spring Simulation:** Damped spring physics with dynamic banking tilt (`vx * 0.88`), aerodynamic stretch when flying fast, and soft hover bob when stationary.
- **Inactivity & Window Exit Detection:** If the cursor exits the window or goes idle for > 8.5s, the companion drifts back to its resting dock in the bottom-right corner. It immediately awakens and glides to follow once mouse movement resumes.
- **Full Drag & Toss Physics:** Users can grab the character, drag anywhere with pointer capture, and fling it. On release, it retains toss velocity, springs smoothly into its companion follow orbit, and triggers a squish-and-rebound safe landing.
- **Safe Viewport Clamping:** Rigid boundaries keep the mascot inside the visible viewport and safely above the footer marquee.

### 2. Facial Rigging & Expression Engine (`src/components/SoloBot/SoloBotRobot.tsx`)
- **Interactive Cursor Tracking:** Pupils and head tilt dynamically track the cursor while floating alongside it.
- **Rich Expression Palette:** 8 distinct emotional states (`happy`, `curious`, `surprised`, `confused`, `sleepy`, `playful`, `dragged`, `landing`) with natural double-blinking.
- **Visor Status & Anti-Gravity Ring:** Displays live state (`FOLLOWING`, `WHEEE!`, `SPRINGING`) with cyan/purple thruster glow.

### 3. Clean Companion Experience (`src/components/SoloBot/SoloBotWidget.tsx`)
- Zero button clutters: no manual "Follow" toggles or pills needed; companion behavior is automatic, natural, and delightful.
- Web Audio synthesizer generates sound chirps, spring notes, and soft landing impacts.

