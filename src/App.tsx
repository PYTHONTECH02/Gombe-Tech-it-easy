import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";

// Components
import { Layout } from "@/components/layout/Layout";

// Pages
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Account from "@/pages/Account";
import Gaming from "@/pages/Gaming";
import Cyber from "@/pages/Cyber";
import Coding from "@/pages/Coding";
import Members from "@/pages/Members";
import Announcements from "@/pages/Announcements";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={Auth} />
        <Route path="/account" component={Account} />
        <Route path="/gaming" component={Gaming} />
        <Route path="/cyber" component={Cyber} />
        <Route path="/coding" component={Coding} />
        <Route path="/members" component={Members} />
        <Route path="/announcements" component={Announcements} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
