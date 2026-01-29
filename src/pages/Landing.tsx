import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Gauge, Zap, Flame } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-500 mb-6">
            Tarang Engineering
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            An advanced thermodynamics visualization platform that enables students and engineers to explore,
            analyze, and understand thermodynamic cycles through interactive diagrams and simulations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View Demo
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
                View Cycles Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Powerful Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <Thermometer className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Multiple Cycles</CardTitle>
                <CardDescription>Simulate Otto, Diesel, Brayton, Carnot, Rankine, and Refrigeration cycles</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <Gauge className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Interactive Diagrams</CardTitle>
                <CardDescription>P-V, T-S, P-H, and H-S diagrams with real-time visualization</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Educational Mode</CardTitle>
                <CardDescription>Step-by-step learning with equation derivations and explanations</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <Flame className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Real World Physics</CardTitle>
                <CardDescription>Real gas behavior, steam properties, and advanced thermodynamic analysis</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How ThermoVis Studio Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our platform combines mathematical rigor with intuitive visualization to help you understand complex thermodynamic concepts
          </p>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Define Parameters</h3>
              <p className="text-muted-foreground">Set temperatures, pressures, ratios, and other thermodynamic parameters</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Visualize Cycles</h3>
              <p className="text-muted-foreground">Watch your thermodynamic cycles come alive on interactive diagrams</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyze Results</h3>
              <p className="text-muted-foreground">Review performance metrics, efficiencies, and thermodynamic properties</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-primary/5 to-cyan-500/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Master Thermodynamics?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students and engineers who use ThermoVis Studio to understand complex thermodynamic concepts
          </p>

          <Link to="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Learning Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;