1. Purpose

The purpose of ThermoVis is to provide a comprehensive, interactive, and visual platform for simulating thermodynamic systems, processes, cycles, and properties across physics, engineering, and chemistry domains.

The system emphasizes:

Conceptual clarity

Accurate computation

Visual understanding

Educational explanations

2. Product Vision

To make thermodynamics intuitive by combining equations, simulations, and diagrams into one interactive web-based environment.

ThermoVis is designed as:

A learning tool

A simulation tool

A visual reasoning tool

3. Target Users

Students learning thermodynamics

Engineering undergraduates

Educators and instructors

Self-learners

4. Design Philosophy

Dark, engineering-grade UI

Diagram-first interface

Immediate visual feedback

Minimal text, maximum insight

Physics-aware color semantics

5. Core System Architecture
Frontend (React)
 ├── Simulation UI
 ├── Visualization Engine
 ├── Educational Mode
Backend (Python / FastAPI)
 ├── Property Solver
 ├── Process Engine
 ├── Cycle Engine
 ├── Numerical Solver
Database
 ├── Projects
 ├── Presets
 ├── State Data

6. Feature Overview

ThermoVis is organized by thermodynamics concepts, not by exams or disciplines.

7. Functional Requirements (Topic-Based)
7.1 Thermodynamic Property Engine
Capabilities

Compute state properties from any two independent variables

Support ideal and real gas behavior

Phase identification

Quality (dryness fraction) calculation

Properties Supported

Temperature (T)

Pressure (P)

Volume (V)

Internal Energy (U)

Enthalpy (H)

Entropy (S)

7.2 Thermodynamic Processes
Supported Processes

Isothermal process

Isobaric process

Isochoric process

Adiabatic process

Cyclic process

Polytropic process

Functional Behavior

Single-process simulation

Real-time P–V and T–S visualization

Work and heat calculation

Entropy change computation

7.3 Process Comparison & Irreversibility
Capabilities

Comparison of two or more processes

Reversible vs irreversible processes

Free expansion modeling

Entropy generation visualization

7.4 Heat Engines, Refrigerators & Heat Pumps
Supported Systems

Ideal heat engine

Ideal refrigerator

Ideal heat pump

Metrics Displayed

Thermal efficiency

Coefficient of performance (COP)

Heat absorbed and rejected

Net work output

7.5 Thermodynamic Cycles
Supported Cycles

Otto cycle

Diesel cycle

Dual cycle

Brayton cycle

Carnot cycle

Rankine cycle

Vapour compression refrigeration cycle

Features

Air-standard assumptions

Adjustable cycle parameters

State-point tracking

Closed-loop diagram visualization

7.6 Cycle Optimization & Performance Analysis
Capabilities

Efficiency optimization

Compression ratio variation

Cut-off ratio variation

Pressure ratio optimization

Performance vs parameter graphs

7.7 Entropy & Second Law Analysis
Features

Entropy change in closed systems

Entropy change in open systems

Total entropy balance

Second law validation

Visualization of impossible cycles (Educational Mode only)

7.8 Steam & Phase Change Modeling
Supported States

Saturated liquid

Saturated vapor

Superheated steam

Two-phase mixture

Features

Steam-table-based property calculation

Quality determination

Enthalpy and entropy plots

7.9 Real vs Ideal Behavior
Capabilities

Ideal gas behavior

Real gas deviation

High-pressure effects

Low-temperature effects

7.10 Exergy & Availability (Advanced)
Features

Exergy calculation

Lost work due to irreversibility

Availability analysis of heat engines

This module is marked as Advanced.

7.11 Chemistry-Oriented Thermodynamics
Supported Concepts

Enthalpy change at constant pressure

Internal energy change at constant volume

Isothermal expansion (chemistry convention)

Entropy change of reactions

Gibbs free energy variation with temperature

8. Visualization Requirements
Diagrams

P–V diagram

T–S diagram

P–H diagram

H–S diagram (optional)

Interaction

Zoom and pan

Hover tooltips

Drag state points

Real-time updates

9. Educational Mode
Purpose

To explain why a result occurs, not just what the result is.

Features

Step-by-step equation derivation

Highlight active equations

Explain assumptions

Visual explanation of laws

Common misconception warnings

10. Preset System
Preset Characteristics

Concept-based naming

Editable parameters

Safe default values

Reusable configurations

Presets act as:

“Starting points for exploration”

11. Reporting & Export
Capabilities

Auto-generated simulation summary

Export tables and plots

Include assumptions and equations

Formats: PDF, CSV

12. Non-Functional Requirements

Smooth UI animations

Numerical stability

Error handling for non-physical inputs

Modular, extensible architecture

13. Validation & Accuracy

Cross-check with standard thermodynamics results

Error margin display

Consistent unit handling

14. Success Criteria

Users understand concepts visually

Diagrams correctly represent physics

Results match theoretical expectations

Platform usable for learning and demonstration

15. Final Positioning Statement (Use in Viva)

“ThermoVis is a concept-driven thermodynamics simulation platform that integrates property calculation, process analysis, cycle simulation, and educational visualization into a single interactive web application.”

That line works everywhere.