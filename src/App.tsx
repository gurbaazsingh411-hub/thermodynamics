import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import HeatTransfer from "./pages/HeatTransfer";
import FluidMechanics from "./pages/FluidMechanics";
import EngineeringMechanics from "./pages/EngineeringMechanics";
import AppliedThermal from "./pages/AppliedThermal";
import RenewableEnergy from "./pages/RenewableEnergy";
import EngineeringMathematics from "./pages/EngineeringMathematics";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import BackgroundParticles from "@/components/layout/BackgroundParticles";

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BackgroundParticles />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col relative z-10">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/thermodynamics" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/heat-transfer" element={<HeatTransfer />} />
              <Route path="/fluid-mechanics" element={<FluidMechanics />} />
              <Route path="/mechanics" element={<EngineeringMechanics />} />
              <Route path="/thermal-applied" element={<AppliedThermal />} />
              <Route path="/renewables" element={<RenewableEnergy />} />
              <Route path="/math" element={<EngineeringMathematics />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
