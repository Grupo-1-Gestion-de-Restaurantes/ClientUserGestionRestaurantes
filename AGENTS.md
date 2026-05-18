# AI Agent Guide for ClientUserGestionRestaurantes

## 📋 Project Overview

**Type**: React + Vite SPA for restaurant management/presentation with interactive 3D visualization

**Primary Stack**: React 19, Three.js, GSAP, Tailwind CSS v4, Zustand, React Router

**Current Focus**: Home page with 3D models, hero sections, animations, and scroll-driven sequences

## 🏗️ Architecture & Structure

### Folder Organization (Feature-based)

```
src/
├── app/                  # Core app setup, routing, layouts
│   ├── App.jsx          # Root component with BrowserRouter
│   ├── router/          # Route definitions and guards
│   ├── layouts/         # Page layout wrappers
│   └── main.jsx         # Entry point
├── features/            # Feature modules (scale by adding more)
│   └── home/
│       ├── pages/       # Page-level components (HomePage)
│       ├── components/  # Reusable UI components
│       ├── hooks/       # Custom hooks (e.g., useHeroSlider)
│       └── store/       # Zustand stores for feature state
├── shared/              # Cross-feature utilities
│   ├── api/            # Axios instances and API calls
│   └── [utils, hooks]  # Shared utilities and hooks
├── assets/              # Images, icons, SVGs
└── styles/              # Global CSS (Tailwind config)
```

### Key Files to Know

- **`src/app/router/AppRoutes.jsx`**: Route definitions; guards live in `RoleGuard.jsx`
- **`src/features/home/pages/HomePage.jsx`**: Main home page orchestrator with loading portal sequence
- **`src/features/home/components/HeroSection.jsx`**: Hero carousel with 3D models and GSAP animations
- **`src/features/home/components/HeroModels.jsx`**: Three.js canvas with model management
- **`vite.config.js`**: Vite setup; includes Tailwind CSS v4 plugin

## 🎨 Development Conventions

### Component Patterns

1. **Function Components**: All components are functional; no class components
2. **Hooks**: Use standard React hooks + custom hooks in `features/[feature]/hooks/`
3. **Refs & Performance**: 
   - Use `useRef` for DOM refs and animation targets
   - Optimize canvas rendering: pause when out of viewport (see `HomePage.jsx` IntersectionObserver pattern)
   - Canvas frameloop: `frameloop={paused ? "never" : "always"}` to control rendering
4. **State Management**:
   - Local state: `useState` for UI state
   - Global state: Zustand in `features/[feature]/store/`
   - No Redux—keep it simple

### Styling

- **Tailwind CSS v4**: All styling is utility-first via Tailwind classes
- **CSS Variables**: Project uses `--color-primary`, `--color-secondary`, `--color-background-base` (defined in global CSS)
- **No inline styles**: Prefer Tailwind + CSS vars; avoid hardcoded colors
- **Animations**: Use GSAP for complex sequences; Framer Motion for simpler transitions

### Animation Approach

- **GSAP** for orchestrated sequences (hero transitions, scroll-pinned effects)
- **Framer Motion** for component-level motion (easier for simple enter/exit)
- **Tailwind animations**: Use built-in `animate-*` classes for lightweight effects
- **Pattern**: Import `gsap` + `useGSAP` hook; register plugins with `gsap.registerPlugin()`

### Three.js / React Three Fiber (R3F)

- **Canvas optimization**: Pause canvas when component is out of view using `IntersectionObserver`
- **Suspense**: Wrap 3D models in `<Suspense fallback={null}>` to handle loading
- **Performance**: Memoize heavy models; use instancing for repeated geometry
- **Canvas props**: Always set `gl={{ antialias: true, alpha: true }}` for smooth rendering

## 🛠️ Build & Development Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173 by default)
npm run build     # Production build to dist/
npm run lint      # Run ESLint on all .js/.jsx files
npm run preview   # Preview production build locally
```

**Note**: Project uses `pnpm` for package management (see `pnpm-lock.yaml`)

## 🧩 Common Tasks

### Adding a New Component

1. Create file in `src/features/[feature]/components/MyComponent.jsx`
2. Use named export: `export const MyComponent = () => { ... }`
3. Import in parent and use with JSX syntax
4. Style with Tailwind classes; use CSS variables for theme colors

### Adding State to a Feature

1. Create Zustand store in `src/features/[feature]/store/myStore.js`
2. Export hook: `export const useMyStore = create(...)`
3. Import and use in components: `const { state, actions } = useMyStore()`

### Adding a New Route

1. Edit `src/app/router/AppRoutes.jsx`
2. Create page in `src/features/[feature]/pages/MyPage.jsx`
3. Wrap with layout if needed (see `MainLayout` or `DashboardPage`)

### Debugging Three.js Issues

- Check `HeroModels.jsx` for model loading and material/texture setup
- Use browser devtools: check WebGL renderer warnings in console
- Verify model file paths and that assets are in `public/` or imported
- Test camera positioning and lighting conditions

## ⚠️ Common Pitfalls & Gotchas

1. **Canvas pauses unexpectedly**: Check IntersectionObserver thresholds and `paused` prop propagation
2. **Animations feel sluggish**: Ensure canvas is not running on every frame when off-screen; check GSAP timelines for overlapping tweens
3. **Tailwind classes not applying**: Verify class is in `src/**/*.{jsx,html}` content scan path
4. **CSS vars undefined**: Check `src/styles/index.css` for variable definitions; use `var(--color-name)` syntax
5. **Three.js models don't load**: Check network tab for 404s; verify model paths relative to `public/`
6. **ESLint errors**: Check `eslint.config.js` for rule severity; many warnings can be auto-fixed with `eslint . --fix`

## 📦 Key Dependencies

| Package | Version | Use Case |
|---------|---------|----------|
| `react` | ^19.2 | UI framework |
| `three` | ^0.184 | 3D graphics engine |
| `@react-three/fiber` | ^9.6 | React abstraction over Three.js |
| `@react-three/drei` | ^10.7 | Reusable R3F components (cameras, helpers) |
| `gsap` | ^3.15 | Advanced animations & timelines |
| `@gsap/react` | ^2.1 | GSAP + React hook integration |
| `framer-motion` | ^12.38 | Component-level motion |
| `tailwindcss` | ^4.2 | Utility-first CSS |
| `react-router-dom` | ^7.14 | Client-side routing |
| `zustand` | ^5.0 | Lightweight state management |
| `axios` | ^1.15 | HTTP client |
| `react-hook-form` | ^7.72 | Form state & validation |

## 🔗 File References for Key Patterns

- **Loading portal sequence**: `src/features/home/pages/HomePage.jsx:13-50`
- **Canvas optimization**: `src/features/home/pages/HomePage.jsx:30-41`
- **Hero carousel**: `src/features/home/components/HeroSection.jsx:24-86`
- **Custom hook pattern**: `src/features/home/hooks/useHeroSlider.js`
- **Router setup**: `src/app/router/AppRoutes.jsx`

## 🚀 Before You Start

1. **Install dependencies**: `pnpm install` (or npm/yarn if preferred)
2. **Start dev server**: `npm run dev`
3. **Check console**: Verify no TypeScript/ESLint errors
4. **Open browser**: Navigate to http://localhost:5173
5. **Test interaction**: Verify 3D models load and animations play smoothly

---

**Last Updated**: 2026-05-16 | **Branch**: feature/2024342/HomePage
