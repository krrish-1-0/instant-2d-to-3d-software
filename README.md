# Instant 2D-to-3D Software

Transform 2D sketches and images into 3D models directly in your browser with real-time viewport rendering, custom geometry generation, and export capabilities.

## 🚀 Features

- **2D-to-3D Reconstruction**: Convert 2D drawings, silhouettes, and heightmaps into 3D geometries.
- **Interactive 3D Studio**: Real-time rendering powered by Three.js and React Three Fiber (`@react-three/fiber` & `@react-three/drei`).
- **Sketch & Import Tools**: Draw directly in the viewport or import existing images.
- **3D Export**: Export generated models into common 3D formats (OBJ, STL, GLTF).
- **Modern Tech Stack**: Built with Next.js (App Router), Tailwind CSS, Zustand, and Drizzle ORM.

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router) & React 19
- **3D Engine**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Database & ORM**: PostgreSQL, Drizzle ORM
- **Algorithms**: Marching Squares & Contour tracing for mesh generation

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm / yarn / pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (if using database features):
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 License

MIT License
