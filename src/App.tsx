import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Recover from "./pages/auth/Recover";
import NotFound from "./pages/NotFound";
import DevHub from "./pages/DevHub";
import Guardian from "./pages/Guardian";
import Atlas from "./pages/Atlas";
import Documentation from "./pages/Documentation";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";

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
            <Route path="/feed" element={<Feed />} />
            <Route path="/devhub" element={<DevHub />} />
            <Route path="/guardian" element={<Guardian />} />
            <Route path="/atlas" element={<Atlas />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/recover" element={<Recover />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
