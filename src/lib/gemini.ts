// Hardcoded responses for ThermoBot chatbot
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

// Predefined Q&A pairs for common engineering questions
const HARDCODED_RESPONSES: Record<string, string> = {
    "explain the laws of thermodynamics": `**The Laws of Thermodynamics:**

**Zeroth Law:** If two systems are in thermal equilibrium with a third system, they are in thermal equilibrium with each other. This establishes the concept of temperature.

**First Law (Energy Conservation):** Energy cannot be created or destroyed, only converted from one form to another.
- Formula: ΔU = Q - W
- ΔU = Change in internal energy
- Q = Heat added to system
- W = Work done by system

**Second Law (Entropy):** The total entropy of an isolated system always increases over time. Heat naturally flows from hot to cold, not the reverse.
- Efficiency of heat engines is always less than 100%
- Carnot efficiency: η = 1 - (T_cold/T_hot)

**Third Law:** As temperature approaches absolute zero (0 K), the entropy of a perfect crystal approaches zero.`,

    "how do i calculate heat transfer?": `**Heat Transfer Calculation Methods:**

**1. Conduction (Fourier's Law):**
- q = -k · A · (dT/dx)
- For steady-state through a wall: Q = k · A · ΔT / L

**2. Convection (Newton's Law of Cooling):**
- q = h · A · (T_surface - T_fluid)
- h = convection coefficient (W/m²·K)

**3. Radiation (Stefan-Boltzmann Law):**
- q = ε · σ · A · (T₁⁴ - T₂⁴)
- σ = 5.67 × 10⁻⁸ W/m²·K⁴

**Combined Heat Transfer:**
For systems with multiple modes, use thermal resistance networks:
- R_total = R_conduction + R_convection + R_radiation
- Q = ΔT / R_total`,

    "what is bernoulli's principle?": `**Bernoulli's Principle:**

Bernoulli's equation states that for an ideal fluid flowing along a streamline, the total mechanical energy remains constant.

**Equation:**
P + ½ρv² + ρgh = constant

Where:
- P = Static pressure (Pa)
- ρ = Fluid density (kg/m³)
- v = Flow velocity (m/s)
- g = Gravitational acceleration (9.81 m/s²)
- h = Height above reference (m)

**Key Insights:**
- As velocity increases, pressure decreases (and vice versa)
- Explains lift on airplane wings
- Used in venturi meters, carburetors, and atomizers

**Applications:**
- Aircraft wing design (lift generation)
- Pitot tubes (airspeed measurement)
- Spray bottles and perfume atomizers
- Blood flow in arteries`,

    "how does a heat engine work?": `**Heat Engine Fundamentals:**

A heat engine converts thermal energy into mechanical work by operating between a hot reservoir (T_H) and cold reservoir (T_C).

**Basic Cycle:**
1. **Heat Input (Q_H):** Absorb heat from hot reservoir
2. **Expansion:** Gas expands, doing work (W_out)
3. **Heat Rejection (Q_C):** Release waste heat to cold reservoir
4. **Compression:** Return to initial state (W_in)

**Efficiency:**
- η = W_net / Q_H = (Q_H - Q_C) / Q_H
- η = 1 - (T_C / T_H) for Carnot engine (theoretical maximum)

**Common Types:**
- **Otto Cycle:** Gasoline engines (spark ignition)
- **Diesel Cycle:** Diesel engines (compression ignition)
- **Rankine Cycle:** Steam power plants
- **Brayton Cycle:** Gas turbines, jet engines

**Real-World Example:**
A car engine with T_H = 1200K and T_C = 400K has maximum efficiency of 67%, but real engines achieve only 25-30% due to friction and heat losses.`
};

// Function to find best matching response
function findBestMatch(userMessage: string): string | null {
    const normalizedMessage = userMessage.toLowerCase().trim();

    // Direct match
    for (const [question, answer] of Object.entries(HARDCODED_RESPONSES)) {
        if (normalizedMessage.includes(question.toLowerCase())) {
            return answer;
        }
    }

    // Keyword matching
    if (normalizedMessage.includes('thermodynamic') && normalizedMessage.includes('law')) {
        return HARDCODED_RESPONSES["explain the laws of thermodynamics"];
    }
    if (normalizedMessage.includes('heat transfer') || normalizedMessage.includes('calculate heat')) {
        return HARDCODED_RESPONSES["how do i calculate heat transfer?"];
    }
    if (normalizedMessage.includes('bernoulli')) {
        return HARDCODED_RESPONSES["what is bernoulli's principle?"];
    }
    if (normalizedMessage.includes('heat engine') || normalizedMessage.includes('engine work')) {
        return HARDCODED_RESPONSES["how does a heat engine work?"];
    }

    return null;
}

export async function sendMessageToGemini(
    message: string,
    conversationHistory: ChatMessage[] = []
): Promise<string> {
    // Simulate API delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 800));

    // Try to find a hardcoded response
    const hardcodedResponse = findBestMatch(message);

    if (hardcodedResponse) {
        return hardcodedResponse;
    }

    // Default response for unmatched questions
    return `I'm currently running in demo mode with limited responses. I can help you with these topics:

📚 **Available Questions:**
- "Explain the laws of thermodynamics"
- "How do I calculate heat transfer?"
- "What is Bernoulli's principle?"
- "How does a heat engine work?"

Try asking one of these questions, or explore the interactive simulations in the dashboard to learn more about engineering concepts!`;
}
