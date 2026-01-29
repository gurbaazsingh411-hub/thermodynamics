# 📘 Project PRD: Interactive Engineering Simulation Platform

## 1. Overview

### Project Name
Interactive Engineering Concepts Simulator (IECS)

### Purpose
To provide an interactive, simulation-first educational platform for first-year engineering students, combining **conceptual simulations** with **toggleable study material** for deeper understanding and exam preparation.

### Target Audience
- First-year B.Tech / Engineering students
- Faculty evaluators and professors
- Self-learners in engineering fundamentals

### Core Philosophy
> “See it happen → Understand why → Then read the theory”

Simulations are the **primary experience**, study material is secondary but always accessible.

---

## 2. Platform & Technology

### Platform
- Web-based (Desktop + Mobile browser)
- No installation required

### Simulation Types
- **2D simulations** (Canvas / SVG-based)
- **Light 3D simulations** (basic Three.js visuals only)

### Accuracy Level
- Educational / conceptual accuracy
- Not industry-grade numerical precision

---

## 3. Global App Structure

Home
├── Simulation Mode
│ ├── Subject Selection
│ └── Interactive Simulations
│
├── Study Mode (Toggle)
│ ├── Theory
│ ├── Diagrams
│ ├── Formulas
│ └── Examples
│
├── Practice Mode
│ ├── MCQs
│ └── Numericals
│
└── Viva / Concept Review

yaml
Copy code

---

## 4. Core Feature Set

### 4.1 Simulation Mode (Primary Mode)

Common features across all simulations:
- Play / Pause / Reset
- Sliders for parameters
- Live graphs
- Real-time visual feedback
- Parameter locking for comparison
- Annotation overlays (on/off)

---

### 4.2 Study Mode (Toggleable for Every Topic)

**Toggle Button:** `Simulation ↔ Study Mode`

Study Mode includes:
- Simple definition
- Step-by-step explanation
- Key formulas
- Labeled diagrams
- Real-world relevance
- Common mistakes

⚠️ Study mode NEVER replaces simulation — it complements it.

---

## 5. Subjects & Topics (Complete List)

---

## 🔥 5.1 Thermodynamics (Already Implemented)

### Simulations
- P–V, T–S, P–T diagrams
- Isothermal process
- Adiabatic process
- Isochoric process
- Isobaric process
- Carnot cycle
- Heat vs work visualization
- Entropy trend (qualitative)

### Study Topics
- Zeroth Law
- First Law
- Second Law
- Third Law
- Thermodynamic systems
- State variables
- Cycles & efficiency

---

## 🌡️ 5.2 Heat Transfer

### 2D Simulations
- Conduction through a wall
- Temperature gradient visualization
- Cooling curve (Newton’s law)
- Radiation intensity vs temperature

### Light 3D
- Heat flow through layered materials (block model)

### Study Topics
- Modes of heat transfer
- Fourier’s law
- Newton’s law of cooling
- Stefan–Boltzmann law
- Thermal resistance
- Heat exchangers (conceptual)

---

## 💧 5.3 Fluid Mechanics

### 2D Simulations
- Flow through pipes
- Bernoulli’s theorem demo
- Continuity equation visualization
- Pressure vs velocity

### Light 3D
- Fluid flow in varying pipe diameter
- Streamline visualization (conceptual)

### Study Topics
- Properties of fluids
- Pressure
- Bernoulli’s principle
- Continuity equation
- Laminar vs turbulent flow
- Real-life applications

---

## ⚙️ 5.4 Engineering Mechanics

### 2D Simulations
- Block on inclined plane
- Force decomposition
- Work-energy transfer
- Friction impact
- Projectile motion

### Light 3D
- Vector visualization in 3D space

### Study Topics
- Scalars & vectors
- Newton’s laws
- Work, energy, power
- Momentum & impulse
- Equilibrium
- Friction

---

## 🔁 5.5 Thermal Engineering (Applied)

### 2D Simulations
- Heat engine energy flow
- Refrigerator cycle
- Efficiency vs losses

### Light 3D
- Simplified engine block visualization

### Study Topics
- Heat engines
- Refrigeration cycles
- COP
- Power plants (overview)
- IC engines (conceptual)

---

## ☀️ 5.6 Renewable Energy Systems

### 2D Simulations
- Solar output vs sunlight
- Wind power vs wind speed
- Efficiency vs losses

### Light 3D
- Wind turbine rotation
- Solar panel orientation

### Study Topics
- Solar thermal vs PV
- Wind energy
- Geothermal basics
- Biomass energy
- Energy sustainability

---

## 📐 5.7 Engineering Mathematics (Visualization-Based)

### 2D Simulations
- Graph slope visualization
- Area under curve
- Rate of change demo

### Study Topics
- Differentiation (physical meaning)
- Integration (work, energy)
- Partial derivatives (thermo relevance)
- Error analysis

---

## 6. Practice & Viva Mode

### Practice Mode
- Topic-wise MCQs
- Numerical problems
- Step-by-step solutions
- Hint system

### Viva Mode
- Conceptual questions
- “Why” based questions
- Common professor questions
- Compare two concepts

---

## 7. UI / UX Principles

- Simulation-first layout
- Minimal text during simulation
- Color-coded parameters
- Dark & light mode
- Mobile-friendly sliders
- Clear labels and legends

---

## 8. Evaluation & Academic Value

### What This Project Demonstrates
- Strong conceptual understanding
- Visualization-based learning
- Practical application of theory
- Modern educational approach
- Clear separation of simulation vs theory

### Suggested Project Description Line
> “An interactive, simulation-driven educational platform for visualizing and understanding core engineering concepts.”

---

## 9. Future Enhancements (Optional)

- AI concept explainer
- Difficulty-based simulations
- User progress tracking
- Custom parameter presets
- Export graphs as images

---

## 10. Success Criteria

- User understands concept without reading theory first
- Simulations behave intuitively
- Study mode clarifies, not overwhelms
- Faculty can easily evaluate correctness
