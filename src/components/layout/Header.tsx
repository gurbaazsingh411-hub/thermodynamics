import { Activity, BookOpen, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export function Header() {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">ThermoVis</h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5">Thermodynamics Simulator</p>
          </div>
        </div>
        
        <div className="h-6 w-px bg-border mx-2" />
        
        <nav className="flex items-center gap-1">
          <Link to={isAuthenticated ? '/dashboard' : '/'}>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Activity className="w-4 h-4 mr-2" />
              {isAuthenticated ? 'Dashboard' : 'Home'}
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <BookOpen className="w-4 h-4 mr-2" />
              Learn
            </Button>
          </Link>
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
        <Link to={isAuthenticated ? '/dashboard' : '/login'}>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            {isAuthenticated ? 'Account' : 'Sign In'}
          </Button>
        </Link>
      </div>
    </header>
  );
}
