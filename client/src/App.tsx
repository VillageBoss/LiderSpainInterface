import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PropertyDetails from "@/pages/PropertyDetails";
import Contact from "@/pages/Contact";
import Favorites from "@/pages/Favorites";
import Search from "@/pages/Search";
import { useAppContext } from "./context/AppContext";
import { AnimatePresence } from "framer-motion";
import Header from "./components/layout/Header";
import SideMenu from "./components/layout/SideMenu";
import MobileNavbar from "./components/layout/MobileNavbar";
import Footer from "./components/layout/Footer";
import useTelegram from "./hooks/useTelegram";

function App() {
  const { isLoading, toggleSideMenu, isSideMenuOpen } = useAppContext();
  const { webApp } = useTelegram();
  const [location, setLocation] = useLocation();

  // Skip the loading screen completely for development
  const appIsLoading = false;

  useEffect(() => {
    // Set up Telegram back button handler - disabled for development
    // if (webApp) {
    //   webApp.BackButton.onClick(() => {
    //     setLocation("/");
    //   });
      
    //   // Set back button visibility based on location
    //   if (location === "/") {
    //     webApp.BackButton.hide();
    //   } else {
    //     webApp.BackButton.show();
    //   }
    // }
  }, [webApp, setLocation, location]);

  return (
    <div className="relative min-h-screen font-montserrat text-leader-black bg-white">
      {/* Loading Screen - Disabled for development */}
      {appIsLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
          <div className="loading-indicator mb-8"></div>
          <h2 className="font-playfair text-2xl font-semibold text-leader-red">LeaderSpain</h2>
          <p className="text-sm text-gray-500 mt-2">Discovering luxury properties...</p>
        </div>
      )}

      {/* Header */}
      <Header />

      {/* Side Menu */}
      <SideMenu isOpen={isSideMenuOpen} onClose={() => toggleSideMenu(false)} />

      {/* Main Content - Always show, no loading condition */}
      <main className="pt-16 pb-20">
        <AnimatePresence mode="wait">
          <Switch location={location} key={location}>
            <Route path="/" component={Home} />
            <Route path="/property/:id" component={PropertyDetails} />
            <Route path="/contact" component={Contact} />
            <Route path="/favorites" component={Favorites} />
            <Route path="/search" component={Search} />
            <Route component={NotFound} />
          </Switch>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Navigation */}
      <MobileNavbar />

      <Toaster />
    </div>
  );
}

export default App;
