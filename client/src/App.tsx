import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { ContactProvider } from "@/context/ContactContext";
import Home from "@/pages/Home";
import FloorPlansPage from "@/pages/FloorPlansPage";
import ConfigurePage from "@/pages/ConfigurePage";
import FurnishingsPage from "@/pages/FurnishingsPage";
import ProcessPage from "@/pages/ProcessPage";
import FinancingPage from "@/pages/FinancingPage";
import FAQPage from "@/pages/FAQPage";
import BlogIndexPage from "@/pages/BlogIndexPage";
import BlogPostPage from "@/pages/BlogPostPage";
import CityGuidesPage from "@/pages/CityGuidesPage";
import CityGuidePage from "@/pages/CityGuidePage";
import ThankYouPage from "@/pages/ThankYouPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import AccessibilityPage from "@/pages/AccessibilityPage";
import LicenseInfoPage from "@/pages/LicenseInfoPage";
import { AdminApp } from "@/admin/AdminApp";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/floor-plans" component={FloorPlansPage} />
      <Route path="/configure" component={ConfigurePage} />
      <Route path="/furnishings" component={FurnishingsPage} />
      <Route path="/materials" component={FurnishingsPage} />
      <Route path="/process" component={ProcessPage} />
      <Route path="/financing" component={FinancingPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/blog" component={BlogIndexPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/city-guides" component={CityGuidesPage} />
      <Route path="/city-guides/:slug" component={CityGuidePage} />
      <Route path="/thank-you" component={ThankYouPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/accessibility" component={AccessibilityPage} />
      <Route path="/license" component={LicenseInfoPage} />
      <Route path="/admin" component={AdminApp} />
      <Route path="/admin/:rest*" component={AdminApp} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <ContactProvider>
            <Router />
          </ContactProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
