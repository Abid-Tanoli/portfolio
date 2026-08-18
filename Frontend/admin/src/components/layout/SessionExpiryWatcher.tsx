import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/auth";

export const SessionExpiryWatcher: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => {
      if (!auth.isAuthenticated()) {
        navigate("/login?expired=1", { replace: true });
      }
    }, 15000);
    return () => clearInterval(id);
  }, [navigate]);

  return null;
};