import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

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
    <div style={styles.container}>
      {/* Background gradient */}
      <div style={styles.bgLeft} />
      <div style={styles.bgRight} />
      <div style={styles.bgBottom} />

      {/* Decorative hearts */}
      <svg style={{ position: "absolute", top: "20%", left: "8%", opacity: 0.15 }} width="40" height="40" viewBox="0 0 24 24" fill="#2E7D32"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      <svg style={{ position: "absolute", bottom: "25%", left: "12%", opacity: 0.1 }} width="30" height="30" viewBox="0 0 24 24" fill="#E65100"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      <svg style={{ position: "absolute", top: "30%", right: "10%", opacity: 0.12 }} width="35" height="35" viewBox="0 0 24 24" fill="#E65100"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      <svg style={{ position: "absolute", bottom: "20%", right: "8%", opacity: 0.1 }} width="25" height="25" viewBox="0 0 24 24" fill="#2E7D32"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>

      {/* Illustration gauche - Senior couple */}
      <div style={styles.illuLeft}>
        <svg width="200" height="220" viewBox="0 0 200 220" fill="none">
          {/* Homme senior */}
          <circle cx="70" cy="60" r="22" fill="#E8D5B7" stroke="#C4A882" strokeWidth="1.5"/>
          <path d="M55 52 C55 40, 85 40, 85 52" fill="#D4D4D4" stroke="#AAAAAA" strokeWidth="1"/>
          <circle cx="63" cy="58" r="2" fill="#555"/>
          <circle cx="77" cy="58" r="2" fill="#555"/>
          <path d="M64 68 Q70 73 76 68" stroke="#555" strokeWidth="1.5" fill="none"/>
          <rect x="48" y="82" width="44" height="55" rx="8" fill="#7B9E6B" stroke="#5A7D4A" strokeWidth="1"/>
          <path d="M60 82 L60 100" stroke="#5A7D4A" strokeWidth="1"/>
          <path d="M80 82 L80 100" stroke="#5A7D4A" strokeWidth="1"/>
          {/* Femme senior */}
          <circle cx="130" cy="65" r="20" fill="#F0DCC8" stroke="#D4B896" strokeWidth="1.5"/>
          <path d="M110 55 Q115 35 130 38 Q145 35 150 55" fill="#E8E8E8" stroke="#CCCCCC" strokeWidth="1"/>
          <circle cx="124" cy="63" r="2" fill="#555"/>
          <circle cx="136" cy="63" r="2" fill="#555"/>
          <path d="M125 73 Q130 77 135 73" stroke="#555" strokeWidth="1.5" fill="none"/>
          <rect x="112" y="85" width="40" height="50" rx="8" fill="#C17B50" stroke="#A0613A" strokeWidth="1"/>
          {/* Bras qui se tiennent */}
          <path d="M92 100 Q100 95 112 100" stroke="#E8D5B7" strokeWidth="4" fill="none" strokeLinecap="round"/>
          {/* Coeur au dessus */}
          <path d="M100 30 C100 25, 108 20, 108 28 C108 20, 116 25, 116 30 C116 38, 108 44, 108 44 C108 44, 100 38, 100 30Z" fill="#E65100" opacity="0.3"/>
        </svg>
      </div>

      {/* Illustration droite - Famille */}
      <div style={styles.illuRight}>
        <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
          {/* Senior homme */}
          <circle cx="170" cy="60" r="20" fill="#E8D5B7" stroke="#C4A882" strokeWidth="1.5"/>
          <circle cx="164" cy="58" r="2" fill="#555"/>
          <circle cx="176" cy="58" r="2" fill="#555"/>
          <path d="M165 68 Q170 72 175 68" stroke="#555" strokeWidth="1.5" fill="none"/>
          <rect x="152" y="80" width="38" height="50" rx="8" fill="#5B8C5A" stroke="#3D6B3C" strokeWidth="1"/>
          {/* Jeune homme */}
          <circle cx="120" cy="55" r="18" fill="#DEB887" stroke="#C4A06A" strokeWidth="1.5"/>
          <circle cx="114" cy="53" r="2" fill="#555"/>
          <circle cx="126" cy="53" r="2" fill="#555"/>
          <path d="M115 62 Q120 67 125 62" stroke="#555" strokeWidth="1.5" fill="none"/>
          <rect x="104" y="73" width="34" height="50" rx="8" fill="#4A90D9" stroke="#3570B0" strokeWidth="1"/>
          {/* Jeune femme */}
          <circle cx="75" cy="58" r="17" fill="#F0DCC8" stroke="#D4B896" strokeWidth="1.5"/>
          <path d="M58 48 Q62 35 75 38 Q88 35 92 48" fill="#8B5E3C" stroke="#6D4A2E" strokeWidth="1"/>
          <circle cx="70" cy="56" r="2" fill="#555"/>
          <circle cx="80" cy="56" r="2" fill="#555"/>
          <path d="M71 65 Q75 69 79 65" stroke="#555" strokeWidth="1.5" fill="none"/>
          <rect x="60" y="75" width="32" height="48" rx="8" fill="#E88D5A" stroke="#C47040" strokeWidth="1"/>
          {/* Enfant */}
          <circle cx="40" cy="95" r="14" fill="#F5E6D3" stroke="#E0CDB8" strokeWidth="1.5"/>
          <circle cx="36" cy="93" r="1.5" fill="#555"/>
          <circle cx="44" cy="93" r="1.5" fill="#555"/>
          <path d="M37 100 Q40 104 43 100" stroke="#555" strokeWidth="1.5" fill="none"/>
          <rect x="28" y="109" width="26" height="35" rx="6" fill="#F0C040" stroke="#D4A830" strokeWidth="1"/>
          {/* Rires */}
          <path d="M90 45 L95 40" stroke="#E65100" strokeWidth="1" opacity="0.4"/>
          <path d="M92 48 L98 46" stroke="#E65100" strokeWidth="1" opacity="0.4"/>
          {/* Coeur */}
          <path d="M145 35 C145 30, 153 25, 153 33 C153 25, 161 30, 161 35 C161 43, 153 49, 153 49 C153 49, 145 43, 145 35Z" fill="#E65100" opacity="0.25"/>
        </svg>
      </div>

      {/* Main content */}
      <div style={styles.content}>
        {/* Title */}
        <h1 style={styles.title}>
          <span style={{ color: "#2E7D32" }}>Vivalien</span>
        </h1>
        <p style={styles.subtitle}>ESPACE PROTEGE</p>

        {/* Logo */}
        <div style={styles.logoWrap}>
          <img src="/logo.png" alt="Vivalien" style={styles.logo} />
        </div>

        {/* Form card */}
        <form onSubmit={handleLogin} style={styles.formCard}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input
              value={email}
              onChange={function(e) { setEmail(e.target.value); }}
              type="email"
              required
              style={styles.input}
              onFocus={function(e) { e.target.style.borderColor = "#2E7D32"; }}
              onBlur={function(e) { e.target.style.borderColor = "#C8A882"; }}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input
              value={password}
              onChange={function(e) { setPassword(e.target.value); }}
              type="password"
              required
              style={styles.input}
              onFocus={function(e) { e.target.style.borderColor = "#2E7D32"; }}
              onBlur={function(e) { e.target.style.borderColor = "#C8A882"; }}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <p style={styles.footer}>
            Contactez votre administrateur pour obtenir vos identifiants
          </p>
        </form>
      </div>

      {/* Decorative wave lines */}
      <svg style={{ position: "absolute", bottom: "15%", left: "5%", opacity: 0.08 }} width="120" height="30" viewBox="0 0 120 30">
        <path d="M0 15 Q15 0, 30 15 Q45 30, 60 15 Q75 0, 90 15 Q105 30, 120 15" stroke="#2E7D32" strokeWidth="2" fill="none"/>
      </svg>
      <svg style={{ position: "absolute", top: "15%", right: "5%", opacity: 0.08 }} width="120" height="30" viewBox="0 0 120 30">
        <path d="M0 15 Q15 0, 30 15 Q45 30, 60 15 Q75 0, 90 15 Q105 30, 120 15" stroke="#E65100" strokeWidth="2" fill="none"/>
      </svg>
    </div>
  );
}

var styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
    background: "#F5F0E8"
  },
  bgLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "50%",
    height: "50%",
    background: "linear-gradient(180deg, #2E7D32 0%, rgba(46,125,50,0.3) 60%, transparent 100%)",
    zIndex: 0
  },
  bgRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "50%",
    height: "50%",
    background: "linear-gradient(180deg, #E8A04C 0%, rgba(232,160,76,0.3) 60%, transparent 100%)",
    zIndex: 0
  },
  bgBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "55%",
    background: "linear-gradient(180deg, transparent 0%, #F0EBE0 40%, #EDE7DA 100%)",
    zIndex: 0
  },
  content: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: 420,
    padding: "0 20px"
  },
  title: {
    fontSize: 42,
    fontWeight: 800,
    margin: "0 0 4px",
    letterSpacing: -1
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#E65100",
    letterSpacing: 4,
    margin: "0 0 16px",
    textTransform: "uppercase"
  },
  logoWrap: {
    marginBottom: 16
  },
  logo: {
    width: 130,
    height: "auto",
    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))"
  },
  formCard: {
    width: "100%",
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: 20,
    padding: "32px 28px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
    border: "1px solid rgba(255,255,255,0.6)"
  },
  fieldGroup: {
    marginBottom: 18
  },
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    color: "#4A4A4A",
    marginBottom: 6
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    border: "2px solid #C8A882",
    borderRadius: 12,
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box",
    outline: "none",
    background: "rgba(255,255,255,0.9)",
    transition: "border-color 0.2s"
  },
  error: {
    color: "#DC2626",
    fontSize: 13,
    textAlign: "center",
    margin: "0 0 12px"
  },
  button: {
    width: "100%",
    padding: "16px",
    background: "#2E7D32",
    color: "#FFFFFF",
    border: "none",
    borderRadius: 14,
    fontSize: 17,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
    boxShadow: "0 4px 14px rgba(46,125,50,0.3)"
  },
  footer: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 12,
    color: "#999"
  },
  illuLeft: {
    position: "absolute",
    bottom: "8%",
    left: "3%",
    zIndex: 5,
    opacity: 0.7
  },
  illuRight: {
    position: "absolute",
    bottom: "8%",
    right: "1%",
    zIndex: 5,
    opacity: 0.7
  }
};
