import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { COLORS, btnStyle, inputStyle } from "../utils/constants";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError("Email ou mot de passe incorrect");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenD} 100%)` }}>
      <form onSubmit={handleLogin} style={{ background: "#FFF", borderRadius: 24, padding: "48px 40px", width: "100%", maxWidth: 420, boxShadow: "0 24px 64px rgba(0,0,0,.2)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: COLORS.green, margin: 0, letterSpacing: -1 }}>Vivalien</h1>
          <p style={{ color: COLORS.orange, fontSize: 13, fontWeight: 700, margin: "6px 0 0", textTransform: "uppercase", letterSpacing: 3 }}>Espace sécurisé</p>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.sub }}>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="votre@email.fr" required style={inputStyle} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.sub }}>Mot de passe</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" required style={inputStyle} />
        </div>
        {error && <p style={{ color: COLORS.danger, fontSize: 13, textAlign: "center", margin: "0 0 16px" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ ...btnStyle, width: "100%", background: COLORS.green, color: "#FFF", padding: 16, fontSize: 16, opacity: loading ? 0.6 : 1 }}>
          {loading ? "Connexio
