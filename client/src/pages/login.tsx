import { useState } from "react";
import { useLocation } from "wouter";
import { Film, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Demo login - accept any username/password
    setTimeout(() => {
      setIsLoading(false);
      
      // Store simple session flag
      sessionStorage.setItem("isLoggedIn", "true");
      
      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${username || "Guest"}`,
      });
      
      setLocation("/home");
    }, 800);
  };

  const handleDemoLogin = () => {
    setUsername("demo@example.com");
    setPassword("demo123");
    setTimeout(() => {
      sessionStorage.setItem("isLoggedIn", "true");
      toast({
        title: "Demo Login",
        description: "Logged in with demo credentials",
      });
      setLocation("/home");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center mb-8 gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
            <Film className="h-9 w-9 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold font-heading" data-testid="text-login-title">
            My Collection
          </h1>
        </div>

        <Card className="border-card-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl" data-testid="text-card-title">
              Sign in
            </CardTitle>
            <CardDescription data-testid="text-card-description">
              Enter any credentials to access your collection
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" data-testid="label-username">
                  Username or Email
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="demo@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  data-testid="input-username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" data-testid="label-password">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  data-testid="input-password"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
                data-testid="button-login"
              >
                <LogIn className="mr-2 h-5 w-5" />
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
                onClick={handleDemoLogin}
                disabled={isLoading}
                data-testid="button-demo-login"
              >
                Try Demo Login
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4" data-testid="text-demo-note">
          This is a demo application. Any credentials will work.
        </p>
      </div>
    </div>
  );
}
