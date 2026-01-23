import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/button'
import { LineChart, User } from 'lucide-react'

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 flex flex-col min-h-0">
          {/* Mode Toggle */}
          <div className="px-6 py-3 border-b border-border bg-card/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Simulation</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
              >
                <User className="w-4 h-4" />
                Account
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome to Thermoviz Studio
              </span>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex min-h-0 p-6">
            <div className="flex-1 flex flex-col gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Thermoviz Studio</h2>
                <p className="text-muted-foreground mb-4">
                  Welcome to the thermodynamics visualization platform. Select a cycle type from the sidebar to begin your simulation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Features</h3>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>Interactive PV and TS diagrams</li>
                      <li>Multiple thermodynamic cycles</li>
                      <li>Real-time calculations</li>
                      <li>Educational mode</li>
                    </ul>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Getting Started</h3>
                    <p className="text-sm text-muted-foreground">
                      1. Select a cycle type from the sidebar<br/>
                      2. Adjust parameters using the controls<br/>
                      3. View results in the diagrams<br/>
                      4. Export data when ready
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Controls Placeholder */}
            <div className="w-80 border-l border-border flex flex-col">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-lg mb-4">Parameters</h3>
                <p className="text-sm text-muted-foreground">
                  Parameter controls will appear here when a cycle is selected.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Index