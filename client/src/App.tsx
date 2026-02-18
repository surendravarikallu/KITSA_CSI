import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/events" component={Events} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin" component={Dashboard} />
      
      {/* Add placeholders for pages not yet fully implemented to avoid 404s during demo */}
      <Route path="/about" component={Home} /> 
      <Route path="/gallery" component={Home} />
      <Route path="/contact" component={Home} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
