import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import Login from "@/pages/Login";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import OrganizerDashboard from "@/pages/organizer/OrganizerDashboard";
import StudentDashboard from "@/pages/student/StudentDashboard";
import Members from "@/pages/admin/Members";
import ImportUsers from "@/pages/admin/ImportUsers";
import OrganizerEvents from "@/pages/organizer/Events";
import GalleryManager from "@/pages/admin/GalleryManager";
import Messages from "@/pages/admin/Messages";

import About from "@/pages/About";
import Team from "@/pages/Team";
import WhyUs from "@/pages/WhyUs";
import Gallery from "@/pages/GalleryPage";
import Membership from "@/pages/Membership";
import Profile from "@/pages/Profile";
import Contact from "@/pages/Contact";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // If there is a hash, try to scroll to the element. We use a short timeout to ensure the DOM has finished painting the new page component.
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
}

function ProtectedRoute({ component: Component, roles }: { component: any, roles?: string[] }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  if (roles && !roles.includes(user.role)) {
    setLocation(`/${user.role}/dashboard`);
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/team" component={Team} />
          <Route path="/why-us" component={WhyUs} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/membership" component={Membership} />
          <Route path="/contact" component={Contact} />
          <Route path="/events" component={Events} />
          <Route path="/profile">
            {() => <ProtectedRoute component={Profile} />}
          </Route>
          <Route path="/login" component={Login} />

          <Route path="/admin/dashboard">
            {() => <ProtectedRoute component={AdminDashboard} roles={["admin"]} />}
          </Route>
          <Route path="/admin/members">
            {() => <ProtectedRoute component={Members} roles={["admin"]} />}
          </Route>
          <Route path="/admin/import">
            {() => <ProtectedRoute component={ImportUsers} roles={["admin", "organizer"]} />}
          </Route>
          <Route path="/admin/gallery">
            {() => <ProtectedRoute component={GalleryManager} roles={["admin", "organizer"]} />}
          </Route>
          <Route path="/admin/messages">
            {() => <ProtectedRoute component={Messages} roles={["admin"]} />}
          </Route>

          <Route path="/organizer/dashboard">
            {() => <ProtectedRoute component={OrganizerDashboard} roles={["organizer"]} />}
          </Route>
          <Route path="/organizer/events">
            {() => <ProtectedRoute component={OrganizerEvents} roles={["admin", "organizer"]} />}
          </Route>
          <Route path="/student/dashboard">
            {() => <ProtectedRoute component={StudentDashboard} roles={["student"]} />}
          </Route>

          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
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
