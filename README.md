# Thermoviz Studio: Tarang Thermodynamics

An advanced, design-led thermodynamics and engineering visualization platform. Built for students and engineers to explore complex thermodynamic cycles, fluid dynamics, and mechanical principles through interactive simulations and real-time data visualization.

---

## 🚀 Key Modules

### 🌡️ Thermodynamics
Explore classical cycles with real-time P-V, T-S, P-H, and H-S diagrams.
- **Cycles:** Otto, Diesel, Brayton, Rankine, Carnot, and Refrigeration.
- **Real Gas Behavior:** Toggle between Ideal Gas and Real Gas (Van der Waals) calculations.
- **Steam Properties:** Full support for water/steam property analysis and quality (x) calculations.

### 💧 Fluid Mechanics
Visualize flow regimes and conservation laws.
- **Bernoulli's Principle:** Interactive Venturi effect simulations with pressure and velocity tracking.
- **Pipe Flow:** Reynolds Number analysis with transitions between Laminar and Turbulent flow profiles.
- **Continuity:** Mass conservation across varying pipe diameters.

### 🏗️ Engineering Mechanics
Analyze statics and dynamics with visual decomposition.
- **Inclined Planes:** Friction analysis, static vs. kinetic coefficients, and the "Angle of Repose".
- **Vector Math:** Visual force decomposition and reconstruction.
- **Torque & Moments:** Interactive moment calculation and vector cross-product visualization.

### ☀️ Renewable Energy
Physics-based simulations of green energy systems.
- **Solar Power:** Efficiency analysis using the Shockley-Queisser limit and irradiance equations.
- **Wind Power:** Power curve modeling based on the Betz Limit (59.3%) and cubic wind speed relationships.

### 🧮 Engineering Calculator
A unified, high-performance tool for symbolic and scientific math.
- **Standard Tab:** Complete scientific calculator with physics constants (c, G, R, etc.) and history.
- **Calculus Tab:** Symbolic differentiation and integration with step-by-step logic and interactive graphing.

---

## ✨ Recent Enhancements

We have recently upgraded the platform with significant educational and UI improvements:
- **Consolidated Calculators:** Combined Scientific and Symbolic Calculus calculators into a single tabbed interface.
- **Expanded Study Mode:** Deep-dive theoretical explanations added to every module, featuring engineering derivations and practical context.
- **Focused UI:** Streamlined the interface by restricting navigation sidebars to specialized modules, improving workspace focus.
- **Advanced Physics Context:** Integrated concepts like LMTD (Log Mean Temperature Difference), Heat Exchanger effectiveness, and material-specific conductivities.

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Animations:** Framer Motion + Lucide Icons
- **Visualization:** Recharts + Three.js (@react-three/fiber)
- **Math Engine:** Nerdamer (Symbolic math processing)
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend/Auth:** Supabase

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. **Clone the repo:**
   ```bash
   git clone https://github.com/gurbaazsingh411-hub/thermodynamics.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Setup:**
   Create a `.env` file in the root and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. **Run Dev Server:**
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```text
src/
├── components/          # React components
│   ├── diagrams/        # Interactive P-V, T-S graphs
│   ├── educational/     # Study Mode layers
│   ├── layout/          # Header, Sidebar, Bottom Panels
│   └── ui/              # shadcn/ui base components
├── lib/                # Thermodynamic & Physics engines
├── store/              # Zustand global state management
├── pages/              # Main application modules (Fluid, Heat, etc.)
└── types/              # Global TypeScript definitions
```

---

## 📜 License
Licensed under the [MIT License](LICENSE).

---
*Built with passion for Engineering Education.*
