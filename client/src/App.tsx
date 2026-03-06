import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import SalaoLayout from "./components/SalaoLayout";
import AgendaPage from "./pages/AgendaPage";
import ClientesPage from "./pages/ClientesPage";
import FuncionariosPage from "./pages/FuncionariosPage";
import ServicosPage from "./pages/ServicosPage";
import CaixaPage from "./pages/CaixaPage";
import DashboardCaixaPage from "./pages/DashboardCaixaPage";
import RelatoriosPage from "./pages/RelatoriosPage";
import HistoricoPage from "./pages/HistoricoPage";
import HistoricoAgendamentosPage from "./pages/HistoricoAgendamentosPage";
import BackupPage from "./pages/BackupPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import FerramentasClientesPage from "./pages/FerramentasClientesPage";
import { useEffect } from "react";
import { seedDemoData } from "./lib/store";

function AppContent() {
  useEffect(() => {
    seedDemoData();
  }, []);

  return (
    <SalaoLayout>
      <Switch>
        <Route path="/">
          <Redirect to="/agenda" />
        </Route>
        <Route path="/agenda" component={AgendaPage} />
        <Route path="/clientes" component={ClientesPage} />
        <Route path="/ferramentas-clientes" component={FerramentasClientesPage} />
        <Route path="/funcionarios" component={FuncionariosPage} />
        <Route path="/servicos" component={ServicosPage} />
        <Route path="/caixa" component={CaixaPage} />
        <Route path="/caixa/dashboard" component={DashboardCaixaPage} />
        <Route path="/relatorios" component={RelatoriosPage} />
        <Route path="/historico" component={HistoricoPage} />
        <Route path="/historico/agendamentos" component={HistoricoAgendamentosPage} />
        <Route path="/backup" component={BackupPage} />
        <Route path="/configuracoes" component={ConfiguracoesPage} />
        <Route component={NotFound} />
      </Switch>
    </SalaoLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
