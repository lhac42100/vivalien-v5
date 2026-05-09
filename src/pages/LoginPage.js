import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  var auth = useAuth();
  var login = auth.login;
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [error, setError] = useState("");
  var [loading, setLoading] = useState(false);

  var handleLogin = async function(e) {
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

  return React.createElement("div", { style: styles.container },

    // Background image
    React.createElement("div", { style: styles.bgImage }),

    // Overlay for readability
    React.createElement("div", { style: styles.overlay }),

    // Main content
    React.createElement("div", { style: styles.content },

      // Logo
      React.createElement("img", { src: "/logo.png", alt: "Vivalien", style: styles.logo }),

      // Title
      React.createElement("h1", { style: styles.title }, "Vivalien"),

      // Slogan
      React.createElement("p", { style: styles.slogan }, "Vivre ensemble, en toute s\u00e9curit\u00e9"),

      // Badge
      React.createElement("div", { style: styles.badge },
        React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "#5A8C69", style: { marginRight: 6 } },
          React.createElement("path", { d: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" })
        ),
        "ESPACE PROTEGE"
      ),

      // Form
      React.createElement("form", { onSubmit: handleLogin, style: styles.formCard },

        React.createElement("div", { style: styles.fieldGroup },
          React.createElement("label", { style: styles.label }, "Email"),
          React.createElement("div", { style: styles.inputWrap },
            React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "#999", style: styles.inputIcon },
              React.createElement("path", { d: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" })
            ),
            React.createElement("input", {
              value: email,
              onChange: function(e) { setEmail(e.target.value); },
              type: "email",
              placeholder: "Email",
              required: true,
              style: styles.input
            })
          )
        ),

        React.createElement("div", { style: styles.fieldGroup },
          React.createElement("label", { style: styles.label }, "Mot de passe"),
          React.createElement("div", { style: styles.inputWrap },
            React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "#999", style: styles.inputIcon },
              React.createElement("path", { d: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" })
            ),
            React.createElement("input", {
              value: password,
              onChange: function(e) { setPassword(e.target.value); },
              type: "password",
              placeholder: "Mot de passe",
              required: true,
              style: styles.input
            })
          )
        ),

        error && React.createElement("p", { style: styles.error }, error),

        React.createElement("button", {
          type: "submit",
          disabled: loading,
          style: { ...styles.button, opacity: loading ? 0.7 : 1 }
        }, loading ? "CONNEXION..." : "SE CONNECTER"),

        React.createElement("p", { style: styles.footer }, "Contactez votre administrateur pour vos identifiants.")
      )
    )
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
    overflow: "hidden"
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "url(/bg-login.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: 0
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255,255,255,0.15)",
    zIndex: 1
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
  logo: {
    width: 90,
    height: "auto",
    marginBottom: 6,
    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))"
  },
  title: {
    fontSize: 46,
    fontWeight: 800,
    color: "#2E7D32",
    margin: "0 0 2px",
    letterSpacing: -1,
    textShadow: "0 2px 8px rgba(255,255,255,0.8)"
  },
  slogan: {
    fontSize: 17,
    color: "#444",
    margin: "0 0 16px",
    fontWeight: 500,
    fontStyle: "italic",
    textShadow: "0 1px 4px rgba(255,255,255,0.9)"
  },
  badge: {
    display: "flex",
    alignItems: "center",
    padding: "6px 18px",
    background: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    color: "#5A8C69",
    letterSpacing: 2,
    marginBottom: 10,
    border: "1px solid rgba(90,140,105,0.2)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
  },
  formCard: {
    width: "100%",
    background: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: 20,
    padding: "30px 28px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
    border: "1px solid rgba(196,168,130,0.35)"
  },
  fieldGroup: {
    marginBottom: 18
  },
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 700,
    color: "#333",
    marginBottom: 6
  },
  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  inputIcon: {
    position: "absolute",
    left: 14,
    zIndex: 2
  },
  input: {
    width: "100%",
    padding: "14px 16px 14px 44px",
    border: "1.5px solid #C8C0B4",
    borderRadius: 12,
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box",
    outline: "none",
    background: "rgba(255,255,255,0.95)",
    transition: "border-color 0.2s",
    color: "#333"
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
    background: "linear-gradient(135deg, #2E7D32 0%, #3D8B40 100%)",
    color: "#FFFFFF",
    border: "none",
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
    boxShadow: "0 4px 16px rgba(46,125,50,0.35)",
    letterSpacing: 2,
    textTransform: "uppercase"
  },
  footer: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 13,
    color: "#777"
  }
};
