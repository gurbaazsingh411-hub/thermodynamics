# Thermoviz Studio

An advanced thermodynamics visualization platform that enables students and engineers to explore, analyze, and understand thermodynamic cycles through interactive diagrams and simulations.

## Features

- **Interactive PV and TS Diagrams**: Visualize thermodynamic processes in real-time
- **Multiple Cycle Types**: Otto, Diesel, Brayton, Rankine, Carnot, and Refrigeration cycles
- **Real-time Calculations**: Instant thermodynamic property calculations
- **Educational Mode**: Step-by-step learning with explanations
- **Export Capabilities**: Export diagrams as PNG, data as CSV, and reports as PDF
- **Keyboard Navigation**: Full keyboard shortcut support for enhanced accessibility
- **Preset Library**: Predefined configurations and custom preset saving
- **User Authentication**: Secure login with Supabase
- **Test Case Management**: Save and share thermodynamic configurations
- **Responsive UI**: Modern interface built with shadcn/ui and Tailwind CSS

## Tech Stack

- Vite
- TypeScript
- React
- Zustand (state management)
- Supabase (authentication & database)
- shadcn/ui (UI components)
- Tailwind CSS (styling)
- Recharts (diagrams)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone https://github.com/gurbaazsingh411-hub/thermodynamics.git

# Navigate to the project directory
cd thermodynamics

# Install dependencies
npm install

# Create environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start the development server
npm run dev
```

### Configuration

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project and copy your Project URL and anon key
3. Update your `.env` file with the credentials
4. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
5. Enable email authentication in your Supabase dashboard

## Usage

1. **Select Cycle Type**: Choose between Otto, Diesel, Brayton, Rankine, Carnot, or Refrigeration cycles
2. **Adjust Parameters**: Modify temperatures, pressures, ratios, and other parameters
3. **Visualize**: See real-time updates in PV and TS diagrams
4. **Analyze**: View calculated thermodynamic properties and cycle efficiency
5. **Export**: Save diagrams, data, or reports in various formats
6. **Save**: Create test cases to store and share configurations

## Key Shortcuts

- `Ctrl/Cmd + S`: Save current configuration
- `Ctrl/Cmd + Z`: Reset to default parameters
- `Space`: Toggle educational mode
- Arrow keys: Fine-tune slider values

## Project Structure

```
src/
├── components/          # UI components
│   ├── diagrams/        # PV and TS diagram components
│   ├── educational/     # Educational mode components
│   ├── layout/          # Layout components
│   ├── panels/          # Control panels
│   └── ui/              # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and core logic
├── store/              # Zustand stores
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Vite and React
- UI components from shadcn/ui
- Thermodynamic calculations based on engineering principles
- Inspired by educational needs in thermodynamics courses
