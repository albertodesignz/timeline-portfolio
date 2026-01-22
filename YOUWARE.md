# YOUWARE Template - React Modern Development Guide

This is a modern React application template built with React 18, TypeScript, Vite, and Tailwind CSS.

## Project Status

- **Project Type**: React + TypeScript Modern Web Application
- **Entry Point**: `src/main.tsx` (React application entry)
- **Build System**: Vite 7.0.0 (Fast development and build)
- **Styling System**: Tailwind CSS 3.4.17 (Atomic CSS framework)
- **UI Library**: shadcn/ui (Initialized)

## Implemented Features

### Timeline Widget
- **Retro/Terminal Aesthetic**: Green and off-black color scheme with grid overlay.
- **Analogue Watch Face**:
  - Interactive hour hand that rotates to select months.
  - "Elevon"-style font (Orbitron) for futuristic look.
  - December at the noon position.
  - **Default Selection**: January (Index 1) is selected by default.
- **Dynamic Bento Grid**:
  - Updates content based on the selected month.
  - **Dynamic Content**: Alternates between 3-4 cards per month with related themes.
  - **Animations**: Sleek staggered entrance animations using Framer Motion.
  - Uses `MagicBento` for smooth animations and hover effects.
- **Aurora Background**:
  - Realistic northern lights simulation using `Aurora` component.
  - Configured with specific green tones (`#10603d`, `#08492d`, `#009454`).
  - **Prominence**: Increased opacity for better visibility.

### Components
- `TimelineWidget`: Main container and logic.
- `Aurora`: WebGL-based background animation.
- `MagicBento`: Interactive grid layout with particle effects.

## Project Architecture

### Directory Structure

```
project-root/
├── index.html              # Main HTML template
├── package.json            # Node.js dependencies and scripts
├── src/                   # Source code directory
    ├── App.tsx            # Main application component
    ├── components/        # Reusable components
    │   ├── TimelineWidget.tsx # Main widget
    │   └── reactbits/     # React Bits components
    │       ├── Aurora.tsx
    │       ├── Aurora.css
    │       ├── MagicBento.tsx
    │       └── MagicBento.css
    ├── lib/               # Utility functions (shadcn)
    │   └── utils.ts
```
