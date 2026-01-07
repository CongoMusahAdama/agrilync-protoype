
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Team from "./pages/Team";
import TeamMemberProfile from "./pages/TeamMemberProfile";
import Signup from "./pages/Signup";
import SignupFarmer from "./pages/SignupFarmer";
import SignupGrower from "./pages/SignupGrower";
import SignupInvestor from "./pages/SignupInvestor";
import SignupAgent from "./pages/SignupAgent";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AgentDashboard from "./pages/AgentDashboard";
import AgentProfile from "./pages/agent/AgentProfile";
import AgentFarmersManagement from "./pages/agent/FarmersManagement";
import AgentFarmManagement from "./pages/agent/FarmManagement";
import AgentFarmMonitoring from "./pages/agent/FarmMonitoring";
import AgentInvestorMatches from "./pages/agent/InvestorFarmerMatches";
import AgentDisputeManagement from "./pages/agent/DisputeManagement";
import AgentTrainingPerformance from "./pages/agent/TrainingPerformance";
import AgentNotificationsCenter from "./pages/agent/AgentNotifications";
import ChangePassword from "./pages/agent/ChangePassword";
import PrivateRoute from "./contexts/PrivateRoute";
import FarmAnalytics from "./pages/FarmAnalytics";
import InvestorMatches from "./pages/InvestorMatches";
import TrainingSessions from "./pages/TrainingSessions";
import FarmManagement from "./pages/FarmManagement";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import GrowerProfile from "./pages/grower/GrowerProfile";
import NotFound from "./pages/NotFound";
import SuperAdminDashboard from "@/pages/super-admin/SuperAdminDashboard";
import Overview from "@/pages/super-admin/Overview";
import UserManagement from "@/pages/super-admin/UserManagement";
import AgentAccountability from "@/pages/super-admin/AgentAccountability";
import RegionalPerformance from "@/pages/super-admin/RegionalPerformance";
import Escalations from "@/pages/super-admin/Escalations";
import SystemLogs from "@/pages/super-admin/SystemLogs";
import FarmFarmerOversight from "@/pages/super-admin/FarmFarmerOversight";
import PartnershipsSummary from "@/pages/super-admin/PartnershipsSummary";
import ReportsAnalytics from "@/pages/super-admin/ReportsAnalytics";
import SettingsRoles from "@/pages/super-admin/SettingsRoles";
import DashboardRedirect from "./pages/DashboardRedirect";

// Configure QueryClient with optimized caching defaults
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes - garbage collection time (was cacheTime in v4)
            refetchOnWindowFocus: false, // Disabled for better mobile performance
            refetchOnMount: true, // Refetch on mount to ensure fresh data
            refetchOnReconnect: true, // Refetch when connection restored
            retry: 2, // Retry failed requests twice
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
        },
        mutations: {
            retry: 1, 
        },
    },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DarkModeProvider>
      <AuthProvider>
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
              <Route path="/team/:memberId" element={<TeamMemberProfile />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup/farmer" element={<SignupFarmer />} />
              <Route path="/signup/grower" element={<SignupGrower />} />
              <Route path="/signup/investor" element={<SignupInvestor />} />
              <Route path="/signup/agent" element={<SignupAgent />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard/agent/change-password" element={<ChangePassword />} />
                <Route path="/dashboard/agent" element={<AgentDashboard />} />
                <Route path="/dashboard/agent/profile" element={<AgentProfile />} />
                <Route path="/dashboard/agent/farmers-management" element={<AgentFarmersManagement />} />
                <Route path="/dashboard/agent/farm-management" element={<AgentFarmManagement />} />
                <Route path="/dashboard/agent/farm-monitoring" element={<AgentFarmMonitoring />} />
                <Route path="/dashboard/agent/investor-farmer-matches" element={<AgentInvestorMatches />} />
                <Route path="/dashboard/agent/dispute-management" element={<AgentDisputeManagement />} />
                <Route path="/dashboard/agent/training-performance" element={<AgentTrainingPerformance />} />
                <Route path="/dashboard/agent/notifications-center" element={<AgentNotificationsCenter />} />
                <Route path="/dashboard/grower/profile" element={<GrowerProfile />} />
                <Route path="/dashboard/farmer/profile" element={<GrowerProfile />} />
                <Route path="/dashboard/:userType" element={<Dashboard />} />
                <Route path="/dashboard/:userType/farm-analytics" element={<FarmAnalytics />} />
                <Route path="/dashboard/:userType/investor-matches" element={<InvestorMatches />} />
                <Route path="/dashboard/:userType/training-sessions" element={<TrainingSessions />} />
                <Route path="/dashboard/:userType/farm-management" element={<FarmManagement />} />
                <Route path="/dashboard/:userType/notifications" element={<Notifications />} />
                <Route path="/dashboard/:userType/settings" element={<Settings />} />
              </Route>

              {/* Super Admin Routes */}
              <Route path="/dashboard/super-admin" element={<SuperAdminDashboard />}>
                <Route index element={<Overview />} />
                <Route path="regions" element={<RegionalPerformance />} />
                <Route path="agents" element={<AgentAccountability />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="farms" element={<FarmFarmerOversight />} />
                <Route path="oversight" element={<FarmFarmerOversight />} />
                <Route path="partnerships" element={<PartnershipsSummary />} />
                <Route path="escalations" element={<Escalations />} />
                <Route path="analytics" element={<ReportsAnalytics />} />
                <Route path="reports" element={<ReportsAnalytics />} />
                <Route path="logs" element={<SystemLogs />} />
                <Route path="settings" element={<SettingsRoles />} />
                <Route path="*" element={<Overview />} />
              </Route>

              <Route path="/dashboard/redirect" element={<DashboardRedirect />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </DarkModeProvider>
  </QueryClientProvider>
);

export default App;
