
import HeroSection from '@/components/landing/HeroSection';
import ModuleShowcase from '@/components/landing/ModuleShowcase';
import StudyModeFeature from '@/components/landing/StudyModeFeature';
import TechStackSection from '@/components/landing/TechStackSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Github } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* 1. Hero Section (3D & Interactive) */}
      <HeroSection />

      {/* 2. Core Capabilities (Modules) */}
      <ModuleShowcase />

      {/* 3. Educational Focus (Study Mode) */}
      <StudyModeFeature />

      {/* 4. Tech & Credibility */}
      <TechStackSection />

      {/* 5. Final CTA */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Enter the Lab</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join a community of engineers who demand more than static diagrams.
            Start visualizing physics today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg hover:shadow-primary/20 transition-all">
                Launch Thermoviz <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="https://github.com/gurbaazsingh411-hub/thermodynamics" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-full gap-2">
                <Github className="w-5 h-5" /> View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 border-t border-border/50 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Thermoviz Studio. Built for Engineering Excellence.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;