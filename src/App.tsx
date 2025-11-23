
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Team from "./pages/Team";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AgentDashboard from "./pages/AgentDashboard";
import AgentFarmersManagement from "./pages/agent/FarmersManagement";
import AgentFarmMonitoring from "./pages/agent/FarmMonitoring";
import AgentInvestorMatches from "./pages/agent/InvestorFarmerMatches";
import AgentDisputeManagement from "./pages/agent/DisputeManagement";
import AgentTrainingPerformance from "./pages/agent/TrainingPerformance";
import AgentNotificationsCenter from "./pages/agent/AgentNotifications";
import FarmAnalytics from "./pages/FarmAnalytics";
import InvestorMatches from "./pages/InvestorMatches";
import TrainingSessions from "./pages/TrainingSessions";
import FarmManagement from "./pages/FarmManagement";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DarkModeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/who-we-are" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/portfolio" element={<Gallery />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard/agent" element={<AgentDashboard />} />
            <Route path="/dashboard/agent/farmers-management" element={<AgentFarmersManagement />} />
            <Route path="/dashboard/agent/farm-monitoring" element={<AgentFarmMonitoring />} />
            <Route path="/dashboard/agent/investor-farmer-matches" element={<AgentInvestorMatches />} />
            <Route path="/dashboard/agent/dispute-management" element={<AgentDisputeManagement />} />
            <Route path="/dashboard/agent/training-performance" element={<AgentTrainingPerformance />} />
            <Route path="/dashboard/agent/notifications-center" element={<AgentNotificationsCenter />} />
            <Route path="/dashboard/:userType" element={<Dashboard />} />
            <Route path="/dashboard/:userType/farm-analytics" element={<FarmAnalytics />} />
            <Route path="/dashboard/:userType/investor-matches" element={<InvestorMatches />} />
            <Route path="/dashboard/:userType/training-sessions" element={<TrainingSessions />} />
            <Route path="/dashboard/:userType/farm-management" element={<FarmManagement />} />
            <Route path="/dashboard/:userType/notifications" element={<Notifications />} />
            <Route path="/dashboard/:userType/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DarkModeProvider>
  </QueryClientProvider>
);

export default App;
