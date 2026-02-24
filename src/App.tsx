import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import MarketingLayout from "@/layouts/MarketingLayout";
import AppLayout from "@/layouts/AppLayout";

import Landing from "@/pages/Landing";
import Features from "@/pages/Features";
import HowItWorks from "@/pages/HowItWorks";
import Pricing from "@/pages/Pricing";
import FAQ from "@/pages/FAQ";
import { BlogList, BlogPost } from "@/pages/Blog";
import Contact from "@/pages/Contact";

import Login from "@/pages/auth/Login";
import OTP from "@/pages/auth/OTP";
import OnboardingProfile from "@/pages/onboarding/Profile";

import Dashboard from "@/pages/app/Dashboard";
import Picks from "@/pages/app/Picks";
import Matches from "@/pages/app/Matches";
import MatchDetail from "@/pages/app/MatchDetail";
import Tracker from "@/pages/app/Tracker";
import Analytics from "@/pages/app/Analytics";
import Leaderboards from "@/pages/app/Leaderboards";
import Reliability from "@/pages/app/Reliability";
import Settings from "@/pages/app/Settings";
import Profile from "@/pages/app/Profile";
import AdminDashboard from "@/pages/app/admin/AdminDashboard";
import AdminPicks from "@/pages/app/admin/AdminPicks";
import AdminSources from "@/pages/app/admin/AdminSources";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Marketing */}
            <Route element={<MarketingLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/features" element={<Features />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Auth */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/otp" element={<OTP />} />
            <Route path="/onboarding/profile" element={<OnboardingProfile />} />

            {/* App */}
            <Route path="/app" element={<AppLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="picks" element={<Picks />} />
              <Route path="matches" element={<Matches />} />
              <Route path="matches/:id" element={<MatchDetail />} />
              <Route path="tracker" element={<Tracker />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="leaderboards" element={<Leaderboards />} />
              <Route path="reliability" element={<Reliability />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin/picks" element={<AdminPicks />} />
              <Route path="admin/sources" element={<AdminSources />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
