import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderGit2,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  Trophy,
  Quote,
  Mail,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { api } from "../lib/api";
import { AdminHeader } from "../components/layout/AdminHeader";

interface UnreadResponse {
  unread: number;
}

export const DashboardPage: React.FC = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoints = ["projects", "skills", "experience", "education", "certifications", "achievements", "testimonials"];
    Promise.all([
      ...endpoints.map(async (endpoint) => {
        const data = await api.get<unknown[]>(`/${endpoint}`);
        return [endpoint, Array.isArray(data) ? data.length : 0];
      }),
      api.get<UnreadResponse>("/contact-submissions/unread-count"),
    ])
      .then((results) => {
        const countMap: Record<string, number> = {};
        for (const [key, value] of results.slice(0, endpoints.length) as [string, number][]) {
          countMap[key] = value;
        }
        setCounts(countMap);
        setUnread((results.at(-1) as UnreadResponse)?.unread ?? 0);
      })
      .catch(() => {
        /* partial data is fine */
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { key: "projects", label: "Projects", icon: FolderGit2, to: "/projects", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" },
    { key: "skills", label: "Skills", icon: Wrench, to: "/skills", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
    { key: "experience", label: "Experience", icon: Briefcase, to: "/experience", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    { key: "education", label: "Education", icon: GraduationCap, to: "/education", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
    { key: "certifications", label: "Certifications", icon: Award, to: "/certifications", color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30" },
    { key: "achievements", label: "Achievements", icon: Trophy, to: "/achievements", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
    { key: "testimonials", label: "Testimonials", icon: Quote, to: "/testimonials", color: "text-rose-400 bg-rose-500/10 border-rose-500/30" },
  ];

  return (
    <div className="min-h-screen">
      <AdminHeader title="Dashboard" description="Overview of your portfolio content" />

      <div className="p-8">
        {loading ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-16 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading dashboard...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.key}
                    to={card.to}
                    className="group rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-700 hover:bg-slate-800/60 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${card.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-3xl font-bold text-slate-100">{counts[card.key] ?? 0}</span>
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                      {card.label}
                    </p>
                  </Link>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Link
                to="/messages"
                className="rounded-xl border border-slate-800 bg-slate-900 p-6 hover:border-slate-700 transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-100">Contact Form Messages</h3>
                  <p className="text-sm text-slate-400">
                    {unread > 0 ? (
                      <span className="text-emerald-400 font-semibold">{unread} unread</span>
                    ) : (
                      "All caught up"
                    )}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </Link>

              <a
                href="http://localhost:5173"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-800 bg-slate-900 p-6 hover:border-slate-700 transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">View Public Site</h3>
                  <p className="text-sm text-slate-400">Open the live portfolio in a new tab</p>
                </div>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
