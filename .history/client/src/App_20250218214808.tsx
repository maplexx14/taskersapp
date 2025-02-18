
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";
import SettingsPage from "@/pages/settings-page";
import CompletedTasksPage from "@/pages/completed-tasks-page";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { ThemeProvider } from "./hooks/use-theme";
import { Home, CheckCircle, User, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "./lib/utils";
import { useIsMobile } from "./hooks/use-mobile";
import { useTranslation } from "@/lib/i18n";
function MobileNav() {
  const {t} = useTranslation();
  const [location] = useLocation();
  const isMobile = useIsMobile();

  if (!isMobile || location === "/auth") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around items-center h-16 px-4">
      
      <Link href="/">
        <a className={cn("flex flex-col items-center", location === "/" && "text-gray-500")}>
          <Home size={24} />
          <span className="text-xs mt-1">{t('tasks')}</span>
        </a>
      </Link>
      <Link href="/completed">
        <a className={cn("flex flex-col items-center", location === "/completed" && "text-gray-500")}>
          <CheckCircle size={24} />
          <span className="text-xs mt-1">{t('completedTasksHome')}</span>
        </a>
      </Link>
      <Link href="/profile">
        <a className={cn("flex flex-col items-center", location === "/profile" && "text-gray-500")}>
          <User size={24} />
          <span className="text-xs mt-1">{t('profile')}</span>
        </a>
      </Link>
      <Link href="/settings">
        <a className={cn("flex flex-col items-center", location === "/settings" && "text-gray-500")}>
          <Settings size={24} />
          <span className="text-xs mt-1">{t('settings')}</span>
        </a>
      </Link>
    </nav>
  );
}

function Router() {
  return (
    <>
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/" component={HomePage} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        <ProtectedRoute path="/settings" component={SettingsPage} />
        <ProtectedRoute path="/completed" component={CompletedTasksPage} />
        <Route component={NotFound} />
      </Switch>
      <Route path="/auth">
        {() => null}
      </Route>
      <Route>
        {({ location }) => location !== "/auth" && <MobileNav />}
      </Route>
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
