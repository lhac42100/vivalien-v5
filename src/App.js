import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Loading } from "./components/UI";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/admin/AdminPage";
import CompanionPage from "./pages/companion/CompanionPage";
import FamilyPage from "./pages/family/FamilyPage";

function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <LoginPage />;

  switch (user.role) {
    case "admin": return <AdminPage />;
    case "companion": return <CompanionPage />;
    case "family": return <FamilyPage />;
    default: return <LoginPage />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
