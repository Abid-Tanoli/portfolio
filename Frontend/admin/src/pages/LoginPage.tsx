import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Loader2, ShieldCheck, AlertTriangle, Clock } from "lucide-react";
import { api } from "../lib/api";
import { auth } from "../lib/auth";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionExpired = searchParams.get("expired") === "1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post<{ token: string; admin: { id: string; email: string } }>("/auth/login", { email, password });
      auth.setToken(res.token, res.admin);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 items-center justify-center mb-4">
            <ShieldCheck className="w-7 h-7 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Admin CMS</h1>
          <p className="text-sm text-slate-400 mt-1">Abid Ali Tanoli — Portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur">
          {sessionExpired && (
            <div className="mb-5 px-4 py-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0" />
              Your session expired. Please log in again.
            </div>
          )}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5" htmlFor="email">
            Email
          </label>
          <div className="relative mb-5">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500"
            />
          </div>

          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5" htmlFor="password">
            Password
          </label>
          <div className="relative mb-6">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Secure JWT-authenticated content management
        </p>
      </div>
    </div>
  );
};
