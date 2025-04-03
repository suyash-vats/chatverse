
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigate } from "react-router-dom";

enum AuthMode {
  SIGN_IN,
  SIGN_UP
}

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [mode, setMode] = useState<AuthMode>(AuthMode.SIGN_IN);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === AuthMode.SIGN_IN) {
        await signIn(email, password);
      } else {
        await signUp(email, password, username);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setError(null);
    setMode(mode === AuthMode.SIGN_IN ? AuthMode.SIGN_UP : AuthMode.SIGN_IN);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-whatsapp-green border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-whatsapp-gray">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-whatsapp-green mb-6">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === AuthMode.SIGN_IN ? "Welcome back" : "Create an account"}
          </h1>
          <p className="mt-2 text-gray-600">
            {mode === AuthMode.SIGN_IN 
              ? "Sign in to your ChatterVerse account" 
              : "Join ChatterVerse to start chatting"}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            {mode === AuthMode.SIGN_UP && (
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••••••"
                required
                minLength={6}
              />
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-whatsapp-green hover:bg-opacity-90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                {mode === AuthMode.SIGN_IN ? "Signing in..." : "Signing up..."}
              </>
            ) : (
              mode === AuthMode.SIGN_IN ? "Sign In" : "Sign Up"
            )}
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-whatsapp-green hover:underline mt-4 focus:outline-none"
            >
              {mode === AuthMode.SIGN_IN 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
        
        <p className="mt-8 text-xs text-center text-gray-500">
          By using ChatterVerse, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;
