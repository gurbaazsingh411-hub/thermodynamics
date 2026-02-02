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
Physics-based simulations of green energy systems with comprehensive study mode.
- **Solar Power:** Efficiency analysis using the Shockley-Queisser limit and irradiance equations.
- **Wind Power:** Power curve modeling based on the Betz Limit (59.3%) and cubic wind speed relationships.
- **Study Mode:** 6 detailed educational cards per topic covering photovoltaic effect, panel types, wind power equations, turbine types, and real-world applications.

### 🔥 Heat Transfer
Interactive simulations of thermal energy transport mechanisms.
- **Conduction:** Fourier's Law with thermal resistance analysis and material property comparisons.
- **Convection:** Newton's Law of Cooling with boundary layer visualization and dimensionless number analysis.
- **Study Mode:** 12 comprehensive educational cards covering theory, formulas, applications, and interesting facts.

### 🧮 Engineering Calculator
A unified, high-performance tool for symbolic and scientific math.
- **Standard Tab:** Complete scientific calculator with physics constants (c, G, R, etc.) and history.
- **Calculus Tab:** Symbolic differentiation and integration with step-by-step logic and interactive graphing.

### 🤖 ThermoBot AI Assistant
Intelligent chatbot for instant engineering help.
- **Floating Widget:** Always accessible from any page via bottom-right corner button.
- **Hardcoded Responses:** Instant answers for common questions about thermodynamics, heat transfer, Bernoulli's principle, and heat engines.
- **Educational Focus:** Detailed explanations with formulas, applications, and real-world examples.

---

## ✨ Recent Enhancements

We have recently upgraded the platform with significant educational and UI improvements:
- **ThermoBot AI Assistant:** Floating chatbot widget with intelligent responses for common engineering questions.
- **Enhanced Study Modes:** 
  - Renewable Energy: 12 comprehensive cards (6 Solar + 6 Wind) covering theory, limits, and applications.
  - Heat Transfer: 12 detailed cards (6 Conduction + 6 Convection) with formulas, dimensionless numbers, and real-world examples.
- **Dashboard Redesign:** Centered title with gradient styling and feature tabs (Simulation First, Educational Mode, Web-Based).
- **Consolidated Calculators:** Combined Scientific and Symbolic Calculus calculators into a single tabbed interface.
- **Focused UI:** Streamlined the interface by restricting navigation sidebars to specialized modules, improving workspace focus.
- **Advanced Physics Context:** Integrated concepts like LMTD, Betz Limit, Shockley-Queisser limit, and material-specific thermal conductivities.

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
