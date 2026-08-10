import React from "react";
import { auth } from "../../lib/auth";
import { ExternalLink, LogOut, UserCheck } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  description?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, description }) => {
  const user = auth.getUser();

  const handleLogout = () => {
    auth.logout();
    window.location.href = "/login";
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-bold text-slate-100">{title}</h2>
        {description && <p className="text-xs text-slate-400">{description}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Open Public Site Link */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 hover:text-white transition-all"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* User Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-300 text-xs font-medium">
          <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>{user?.email || "Admin"}</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 hover:border-red-500/40 transition-all cursor-pointer"
          title="Sign out of CMS"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
