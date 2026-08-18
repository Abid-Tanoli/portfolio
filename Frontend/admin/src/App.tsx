import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AdminSidebar } from "./components/layout/AdminSidebar";
import { SessionExpiryWatcher } from "./components/layout/SessionExpiryWatcher";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { CrudPage } from "./pages/CrudPage";
import { ContactSubmissionsPage } from "./pages/ContactSubmissionsPage";
import { ResumeManager } from "./pages/ResumeManager";

const CrudRoute: React.FC<{ resource: string }> = ({ resource }) => (
  <CrudPage resource={resource} />
);

const AdminLayout: React.FC = () => (
  <div className="flex min-h-screen bg-slate-950 text-slate-100">
    <AdminSidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <SessionExpiryWatcher />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  </div>
);

const App: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="projects" element={<CrudRoute resource="projects" />} />
        <Route path="experience" element={<CrudRoute resource="experience" />} />
        <Route path="education" element={<CrudRoute resource="education" />} />
        <Route path="skills" element={<CrudRoute resource="skills" />} />
        <Route path="certifications" element={<CrudRoute resource="certifications" />} />
        <Route path="testimonials" element={<CrudRoute resource="testimonials" />} />
        <Route path="achievements" element={<CrudRoute resource="achievements" />} />
        <Route path="contact-submissions" element={<ContactSubmissionsPage />} />
        <Route path="resume" element={<ResumeManager />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Route>
  </Routes>
);

export default App;