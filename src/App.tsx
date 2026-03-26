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
import RDMIndex from "./pages/rdm/RDMIndex";
import RDMMapa from "./pages/rdm/RDMMapa";
import RDMGastronomia from "./pages/rdm/RDMGastronomia";
import RDMHistoria from "./pages/rdm/RDMHistoria";
import RDMAventura from "./pages/rdm/RDMAventura";
import RDMCultura from "./pages/rdm/RDMCultura";
import RDMDirectorio from "./pages/rdm/RDMDirectorio";
import RDMEventos from "./pages/rdm/RDMEventos";
import RDMComunidad from "./pages/rdm/RDMComunidad";
import RDMRutas from "./pages/rdm/RDMRutas";
import RDMArte from "./pages/rdm/RDMArte";
import RDMRelatos from "./pages/rdm/RDMRelatos";
import RDMEcoturismo from "./pages/rdm/RDMEcoturismo";
import RDMApoya from "./pages/rdm/RDMApoya";

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
            {/* RDM Digital */}
            <Route path="/rdm" element={<RDMIndex />} />
            <Route path="/rdm/mapa" element={<RDMMapa />} />
            <Route path="/rdm/gastronomia" element={<RDMGastronomia />} />
            <Route path="/rdm/historia" element={<RDMHistoria />} />
            <Route path="/rdm/aventura" element={<RDMAventura />} />
            <Route path="/rdm/cultura" element={<RDMCultura />} />
            <Route path="/rdm/directorio" element={<RDMDirectorio />} />
            <Route path="/rdm/eventos" element={<RDMEventos />} />
            <Route path="/rdm/comunidad" element={<RDMComunidad />} />
            <Route path="/rdm/rutas" element={<RDMRutas />} />
            <Route path="/rdm/arte" element={<RDMArte />} />
            <Route path="/rdm/relatos" element={<RDMRelatos />} />
            <Route path="/rdm/ecoturismo" element={<RDMEcoturismo />} />
            <Route path="/rdm/apoya" element={<RDMApoya />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
