import { useLocation } from "wouter";
import { Film, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Splash() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] gap-12">
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl">
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-1000">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Film className="h-9 w-9 text-primary-foreground" />
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-top-4 duration-1000 delay-100" data-testid="text-splash-title">
              My Collection
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl animate-in fade-in slide-in-from-top-4 duration-1000 delay-200" data-testid="text-splash-subtitle">
              Organize and manage your favorite movies and TV shows in one beautiful place
            </p>

            <Button
              size="lg"
              onClick={handleGetStarted}
              className="mt-4 text-lg px-8 py-6 animate-in fade-in slide-in-from-top-4 duration-1000 delay-300 group"
              data-testid="button-get-started"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
