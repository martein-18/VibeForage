import { useState, useMemo } from "react";
import { useApp } from "../context/useApp";
import { Sparkles, AlertCircle, Check, X, LogIn } from "lucide-react";

function getPasswordStrength(password: string) {
  const checks = [
    { label: "At least 8 characters",   passed: password.length >= 8 },
    { label: "One uppercase letter",     passed: /[A-Z]/.test(password) },
    { label: "One lowercase letter",     passed: /[a-z]/.test(password) },
    { label: "One number",               passed: /[0-9]/.test(password) },
    { label: "One special character",    passed: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.passed).length;
  return { checks, score };
}

export default function AuthScreen() {
  const { login, signup } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [info, setInfo]         = useState("");
  const [loading, setLoading]   = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const strengthColor = strength.score <= 1 ? "bg-red-500" : strength.score <= 3 ? "bg-yellow-500" : "bg-[#1DB954]";
  const strengthLabel = strength.score <= 1 ? "Weak" : strength.score <= 3 ? "Medium" : "Strong";

  const switchToLogin = (prefillEmail?: string) => {
    setIsSignUp(false);
    setError("");
    if (prefillEmail) setEmail(prefillEmail);
  };

  const switchToSignUp = () => {
    setIsSignUp(true);
    setError("");
    setInfo("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setInfo("");
    setLoading(true);

    if (isSignUp) {
      const { error: err } = await signup(name, email, password);
      if (err) {
        // If already registered, auto-switch to login with the same email
        if (err.toLowerCase().includes("already registered") || err.toLowerCase().includes("already exists") || err.toLowerCase().includes("user already")) {
          switchToLogin(email);
          setInfo("This email is already registered. Your email has been filled in — just enter your password to log in.");
        } else {
          setError(err);
        }
      }
    } else {
      const { error: err } = await login(email, password);
      if (err) {
        if (err.toLowerCase().includes("invalid") || err.toLowerCase().includes("wrong") || err.toLowerCase().includes("credentials")) {
          setError("Wrong email or password. Please check and try again.");
        } else if (err.toLowerCase().includes("email not confirmed") || err.toLowerCase().includes("not confirmed")) {
          setError("Please confirm your email address first. Check your inbox for a verification email.");
        } else {
          setError(err);
        }
      }
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#121212] flex items-center justify-center z-[70] overflow-y-auto">
      <div className="w-full max-w-sm px-6 py-8 animate-fadeIn">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#1DB954]/20">
            <Sparkles size={28} className="text-black" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">VibeForge</h1>
          <p className="text-[#a7a7a7]">Your Personal Music Universe</p>
        </div>

        {/* Tab toggle */}
        <div className="flex bg-[#282828] rounded-full p-1 mb-6">
          <button
            onClick={() => switchToLogin()}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
              !isSignUp ? "bg-white text-black" : "text-[#a7a7a7] hover:text-white"
            }`}
          >
            Log In
          </button>
          <button
            onClick={switchToSignUp}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
              isSignUp ? "bg-white text-black" : "text-[#a7a7a7] hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Info banner (e.g. auto-switched from signup) */}
        {info && (
          <div className="flex items-start gap-2 bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-lg px-4 py-3 mb-4">
            <LogIn size={15} className="text-[#1DB954] flex-shrink-0 mt-0.5" />
            <p className="text-[#1DB954] text-sm leading-relaxed">{info}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full bg-[#282828] text-white px-4 py-3 rounded-lg outline-none placeholder-[#6a6a6a] focus:ring-2 focus:ring-[#1DB954] transition-all"
              required
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full bg-[#282828] text-white px-4 py-3 rounded-lg outline-none placeholder-[#6a6a6a] focus:ring-2 focus:ring-[#1DB954] transition-all"
            required
          />

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignUp ? "Create a strong password" : "Password"}
              className="w-full bg-[#282828] text-white px-4 py-3 rounded-lg outline-none placeholder-[#6a6a6a] focus:ring-2 focus:ring-[#1DB954] transition-all"
              required
            />

            {isSignUp && password.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6a6a6a]">Password strength</span>
                  <span className={`text-xs font-semibold ${
                    strength.score <= 1 ? "text-red-400" : strength.score <= 3 ? "text-yellow-400" : "text-[#1DB954]"
                  }`}>{strengthLabel}</span>
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.score ? strengthColor : "bg-[#3e3e3e]"}`} />
                  ))}
                </div>
                <div className="space-y-1 mt-2">
                  {strength.checks.map((check) => (
                    <div key={check.label} className="flex items-center gap-2 text-xs">
                      {check.passed
                        ? <Check size={12} className="text-[#1DB954] flex-shrink-0" />
                        : <X size={12} className="text-[#535353] flex-shrink-0" />
                      }
                      <span className={check.passed ? "text-[#a7a7a7]" : "text-[#535353]"}>{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-3">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm leading-relaxed">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (isSignUp && strength.score < 5)}
            className="w-full bg-[#1DB954] text-black font-bold py-3 rounded-full hover:bg-[#1ed760] transition-colors text-base disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Log In to VibeForge"}
          </button>

          <p className="text-[#6a6a6a] text-xs text-center">
            {isSignUp
              ? "By signing up, you agree to VibeForge's terms. Your data is stored securely."
              : "Don't have an account? Switch to Sign Up above."
            }
          </p>
        </form>
      </div>
    </div>
  );
}
