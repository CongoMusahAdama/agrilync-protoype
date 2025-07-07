
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import About from "./pages/About";
import AIConsultation from "./pages/AIConsultation";
import Weather from "./pages/Weather";
import FarmPartner from "./pages/FarmPartner";
import FarmerDashboard from "./pages/FarmerDashboard";
import InvestorDashboard from "./pages/InvestorDashboard";
import ExtensionAgentDashboard from "./pages/ExtensionAgentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/ai-consultation" element={
              <ProtectedRoute>
                <AIConsultation />
              </ProtectedRoute>
            } />
            <Route path="/weather" element={
              <ProtectedRoute>
                <Weather />
              </ProtectedRoute>
            } />
            <Route path="/farm-partner" element={
              <ProtectedRoute>
                <FarmPartner />
              </ProtectedRoute>
            } />
            <Route path="/farmer-dashboard" element={
              <ProtectedRoute>
                <FarmerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/investor-dashboard" element={
              <ProtectedRoute>
                <InvestorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/agent-dashboard" element={
              <ProtectedRoute>
                <ExtensionAgentDashboard />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
