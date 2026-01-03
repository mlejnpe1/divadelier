import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.LOCAL_API_URL;

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
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-sm bg-white p-6 rounded-lg shadow-md'>
        <h1 className='text-xl font-semibold text-center mb-6'>Přihlášení</h1>

        <div className='space-y-4'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300'
          />

          <input
            type='password'
            placeholder='Heslo'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300'
          />

          {error && <p className='text-sm text-red-600'>{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50'
          >
            {loading ? "Přihlašuji..." : "Přihlásit"}
          </button>
        </div>
      </div>
    </div>
  );
}
