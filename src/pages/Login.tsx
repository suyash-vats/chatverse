
import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const { login } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-whatsapp-gray">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-whatsapp-green mb-6">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to ChatterVerse</h1>
          <p className="mt-2 text-gray-600">Sign in to start chatting</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1"
              placeholder="Enter your name"
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-whatsapp-green hover:bg-opacity-90 text-white"
            disabled={!username.trim()}
          >
            Start Chatting
          </Button>
        </form>
        
        <p className="mt-8 text-xs text-center text-gray-500">
          By signing in, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
