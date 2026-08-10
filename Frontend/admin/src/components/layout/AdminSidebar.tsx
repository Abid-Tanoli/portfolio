import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  FileText,
  Quote,
  Trophy,
  Mail,
  Settings,
  Sparkles,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/projects", label: "Projects", icon: FolderGit2 },
  { path: "/experience", label: "Experience", icon: Briefcase },
  { path: "/education", label: "Education", icon: GraduationCap },
  { path: "/skills", label: "Skills", icon: Wrench },
  { path: "/certifications", label: "Certifications", icon: Award },
  { path: "/resume", label: "Resume PDF", icon: FileText },
  { path: "/testimonials", label: "Testimonials", icon: Quote },
  { path: "/achievements", label: "Achievements", icon: Trophy },
  { path: "/messages", label: "Contact Form", icon: Mail },
  { path: "/settings", label: "Settings", icon: Settings },
];

export const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg">
          <Sparkles className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-slate-100 leading-tight">Admin CMS</h1>
          <p className="text-xs text-slate-400 font-mono">Abid Ali Tanoli</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`
              }
            >
              <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-200 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
        <span>Dynamic CMS v1.0</span>
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live
        </span>
      </div>
    </aside>
  );
};
