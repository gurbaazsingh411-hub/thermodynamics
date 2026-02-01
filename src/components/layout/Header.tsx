import { Activity, BookOpen, Settings, Download, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="h-14 border-b border-white/10 bg-card/20 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Tarang</h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5">Engineering Concepts Simulator</p>
          </div>
        </div>

        <div className="h-6 w-px bg-border mx-2" />

        <nav className="flex items-center gap-1">
          <Link to="/thermodynamics">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Activity className="w-4 h-4 mr-2" />
              Simulator
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Gauge className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <BookOpen className="w-4 h-4 mr-2" />
            Learn
          </Button>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
