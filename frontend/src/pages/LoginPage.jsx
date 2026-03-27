import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import HeroBG1 from "../assets/images/heroBG1.webp";
import Button from "../components/layout/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Neplatné přihlašovací údaje");
      }

      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 sm:px-6"
      style={{
        backgroundImage: `url(${HeroBG1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute left-[-100px] top-[-100px] h-[300px] w-[300px] rounded-full bg-orange-400/20 blur-3xl" />
      <div className="absolute bottom-[-100px] right-[-100px] h-[300px] w-[300px] rounded-full bg-yellow-300/20 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <h1 className="mb-6 text-center text-2xl font-semibold text-white">
          Přihlášení
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pr-10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-white/60 hover:text-white"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {error && <p className="text-center text-sm text-red-300">{error}</p>}

          <Button
            onClick={handleLogin}
            disabled={loading}
            fullWidth
            radius="xl"
            size="lg"
            className="bg-orange-500 shadow-lg shadow-orange-500/30 hover:bg-orange-400 disabled:hover:translate-y-0 disabled:hover:scale-100"
          >
            {loading ? "Přihlašuji..." : "Přihlásit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
