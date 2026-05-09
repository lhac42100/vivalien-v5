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

    // Background gradient layers
    React.createElement("div", { style: styles.bgLeft }),
    React.createElement("div", { style: styles.bgRight }),
    React.createElement("div", { style: styles.bgBottom }),

    // Network lines SVG
    React.createElement("svg", { style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, opacity: 0.12 }, viewBox: "0 0 1200 800", preserveAspectRatio: "xMidYMid slice" },
      React.createElement("path", { d: "M100 200 Q300 100 500 300 Q700 500 900 200 Q1000 100 1100 250", stroke: "#8B7355", strokeWidth: "1.5", fill: "none" }),
      React.createElement("path", { d: "M50 400 Q200 300 400 500 Q600 700 800 400 Q950 250 1150 450", stroke: "#8B7355", strokeWidth: "1.5", fill: "none" }),
      React.createElement("path", { d: "M0 600 Q250 500 450 650 Q650 800 850 550 Q1000 400 1200 600", stroke: "#8B7355", strokeWidth: "1", fill: "none" }),
      React.createElement("path", { d: "M200 50 Q350 200 500 100 Q700 0 850 150 Q1000 300 1100 100", stroke: "#8B7355", strokeWidth: "1", fill: "none" }),
      React.createElement("path", { d: "M80 700 Q300 600 500 750 Q700 600 900 700 Q1050 800 1200 650", stroke: "#8B7355", strokeWidth: "1", fill: "none" }),
      // Dots at intersections
      React.createElement("circle", { cx: "500", cy: "300", r: "3", fill: "#8B7355", opacity: "0.3" }),
      React.createElement("circle", { cx: "800", cy: "400", r: "3", fill: "#8B7355", opacity: "0.3" }),
      React.createElement("circle", { cx: "400", cy: "500", r: "3", fill: "#8B7355", opacity: "0.3" }),
      React.createElement("circle", { cx: "900", cy: "200", r: "3", fill: "#8B7355", opacity: "0.3" }),
      React.createElement("circle", { cx: "300", cy: "100", r: "3", fill: "#8B7355", opacity: "0.3" })
    ),

    // Decorative hearts
    React.createElement("svg", { style: { position: "absolute", top: "12%", left: "15%", zIndex: 2, opacity: 0.15 }, width: "40", height: "40", viewBox: "0 0 24 24", fill: "#A8C5A0" },
      React.createElement("path", { d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" })
    ),
    React.createElement("svg", { style: { position: "absolute", top: "25%", right: "20%", zIndex: 2, opacity: 0.12 }, width: "30", height: "30", viewBox: "0 0 24 24", fill: "#C4A882" },
      React.createElement("path", { d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" })
    ),
    React.createElement("svg", { style: { position: "absolute", bottom: "35%", left: "25%", zIndex: 2, opacity: 0.1 }, width: "25", height: "25", viewBox: "0 0 24 24", fill: "#C4A882" },
      React.createElement("path", { d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" })
    ),
    React.createElement("svg", { style: { position: "absolute", top: "45%", right: "12%", zIndex: 2, opacity: 0.08 }, width: "35", height: "35", viewBox: "0 0 24 24", fill: "#A8C5A0" },
      React.createElement("path", { d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" })
    ),
    React.createElement("svg", { style: { position: "absolute", bottom: "20%", right: "30%", zIndex: 2, opacity: 0.1 }, width: "20", height: "20", viewBox: "0 0 24 24", fill: "#C4A882" },
      React.createElement("path", { d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" })
    ),

    // Illustration gauche - Couple senior qui jardine
    React.createElement("div", { style: styles.illuLeft },
      React.createElement("svg", { width: "220", height: "250", viewBox: "0 0 220 250", fill: "none" },
        // Sol / herbe
        React.createElement("ellipse", { cx: "110", cy: "235", rx: "100", ry: "12", fill: "#4A7C59", opacity: "0.3" }),
        // Pot de fleur
        React.createElement("rect", { x: "95", y: "180", width: "30", height: "35", rx: "3", fill: "#C4713A" }),
        React.createElement("rect", { x: "90", y: "175", width: "40", height: "8", rx: "2", fill: "#D4814A" }),
        // Plante
        React.createElement("line", { x1: "110", y1: "175", x2: "110", y2: "130", stroke: "#4A7C59", strokeWidth: "3" }),
        React.createElement("ellipse", { cx: "100", cy: "140", rx: "12", ry: "18", fill: "#5A8C69", transform: "rotate(-20 100 140)" }),
        React.createElement("ellipse", { cx: "120", cy: "135", rx: "12", ry: "18", fill: "#4A7C59", transform: "rotate(20 120 135)" }),
        React.createElement("ellipse", { cx: "110", cy: "125", rx: "10", ry: "15", fill: "#6A9C79" }),
        // Homme senior (gauche, agenouille)
        React.createElement("circle", { cx: "55", cy: "145", r: "20", fill: "#E8D5B7" }),
        React.createElement("path", { d: "M40 135 Q45 125 55 128 Q65 125 70 135", fill: "#E0E0E0" }),
        React.createElement("circle", { cx: "49", cy: "143", r: "2", fill: "#555" }),
        React.createElement("circle", { cx: "61", cy: "143", r: "2", fill: "#555" }),
        React.createElement("path", { d: "M50 152 Q55 156 60 152", stroke: "#555", strokeWidth: "1.5", fill: "none" }),
        // Moustache
        React.createElement("path", { d: "M48 149 Q55 152 62 149", stroke: "#999", strokeWidth: "1", fill: "none" }),
        React.createElement("rect", { x: "38", y: "165", width: "35", height: "45", rx: "6", fill: "#3D6B3C" }),
        React.createElement("path", { d: "M73 185 L88 195", stroke: "#E8D5B7", strokeWidth: "5", strokeLinecap: "round" }),
        // Genoux
        React.createElement("ellipse", { cx: "50", cy: "215", rx: "12", ry: "8", fill: "#3D6B3C" }),
        React.createElement("ellipse", { cx: "65", cy: "218", rx: "10", ry: "7", fill: "#3D6B3C" }),

        // Femme senior (droite, agenouille)
        React.createElement("circle", { cx: "165", cy: "148", r: "18", fill: "#F0DCC8" }),
        React.createElement("path", { d: "M150 138 Q155 125 165 130 Q175 125 180 138", fill: "#E8E8E8" }),
        React.createElement("ellipse", { cx: "165", cy: "128", rx: "14", ry: "8", fill: "#E8E8E8" }),
        React.createElement("circle", { cx: "160", cy: "146", r: "2", fill: "#555" }),
        React.createElement("circle", { cx: "170", cy: "146", r: "2", fill: "#555" }),
        React.createElement("path", { d: "M161 155 Q165 158 169 155", stroke: "#555", strokeWidth: "1.5", fill: "none" }),
        React.createElement("rect", { x: "150", y: "166", width: "32", height: "42", rx: "6", fill: "#D4814A" }),
        React.createElement("path", { d: "M150 185 L135 195", stroke: "#F0DCC8", strokeWidth: "5", strokeLinecap: "round" }),
        React.createElement("ellipse", { cx: "155", cy: "215", rx: "10", ry: "7", fill: "#D4814A" }),
        React.createElement("ellipse", { cx: "170", cy: "218", rx: "10", ry: "7", fill: "#D4814A" }),

        // Coeurs
        React.createElement("path", { d: "M40 120 C40 115, 48 110, 48 118 C48 110, 56 115, 56 120 C56 128, 48 134, 48 134 C48 134, 40 128, 40 120Z", fill: "#E65100", opacity: "0.25" }),
        React.createElement("path", { d: "M170 110 C170 107, 175 104, 175 109 C175 104, 180 107, 180 110 C180 115, 175 118, 175 118 C175 118, 170 115, 170 110Z", fill: "#E65100", opacity: "0.2" })
      )
    ),

    // Illustration droite - Famille
    React.createElement("div", { style: styles.illuRight },
      React.createElement("svg", { width: "240", height: "250", viewBox: "0 0 240 250", fill: "none" },
        // Sol
        React.createElement("ellipse", { cx: "120", cy: "240", rx: "110", ry: "12", fill: "#C4A882", opacity: "0.2" }),

        // Pere (grand, au centre-gauche)
        React.createElement("circle", { cx: "80", cy: "120", r: "20", fill: "#DEB887" }),
        React.createElement("path", { d: "M65 110 Q70 100 80 105 Q90 100 95 110", fill: "#5A3E28" }),
        React.createElement("circle", { cx: "74", cy: "118", r: "2", fill: "#555" }),
        React.createElement("circle", { cx: "86", cy: "118", r: "2", fill: "#555" }),
        React.createElement("path", { d: "M76 127 Q80 131 84 127", stroke: "#555", strokeWidth: "1.5", fill: "none" }),
        React.createElement("rect", { x: "64", y: "140", width: "34", height: "55", rx: "6", fill: "#D4814A" }),
        React.createElement("rect", { x: "62", y: "195", width: "14", height: "35", rx: "4", fill: "#4A6B8A" }),
        React.createElement("rect", { x: "86", y: "195", width: "14", height: "35", rx: "4", fill: "#4A6B8A" }),

        // Mere (droite du pere)
        React.createElement("circle", { cx: "140", cy: "125", r: "18", fill: "#F0DCC8" }),
        React.createElement("path", { d: "M125 115 Q130 100 140 108 Q150 100 155 115", fill: "#5A3E28" }),
        React.createElement("path", { d: "M122 118 Q125 130 128 118", fill: "#5A3E28" }),
        React.createElement("path", { d: "M152 118 Q155 130 158 118", fill: "#5A3E28" }),
        React.createElement("circle", { cx: "134", cy: "123", r: "2", fill: "#555" }),
        React.createElement("circle", { cx: "146", cy: "123", r: "2", fill: "#555" }),
        React.createElement("path", { d: "M136 132 Q140 136 144 132", stroke: "#555", strokeWidth: "1.5", fill: "none" }),
        React.createElement("rect", { x: "126", y: "143", width: "30", height: "50", rx: "6", fill: "#5A8C69" }),
        React.createElement("rect", { x: "124", y: "193", width: "12", height: "35", rx: "4", fill: "#4A6B8A" }),
        React.createElement("rect", { x: "148", y: "193", width: "12", height: "35", rx: "4", fill: "#4A6B8A" }),

        // Grand-pere (tout a droite)
        React.createElement("circle", { cx: "195", cy: "122", r: "19", fill: "#E8D5B7" }),
        React.createElement("path", { d: "M180 112 Q185 102 195 108 Q205 102 210 112", fill: "#D4D4D4" }),
        React.createElement("circle", { cx: "189", cy: "120", r: "2", fill: "#555" }),
        React.createElement("circle", { cx: "201", cy: "120", r: "2", fill: "#555" }),
        React.createElement("path", { d: "M191 129 Q195 133 199 129", stroke: "#555", strokeWidth: "1.5", fill: "none" }),
        React.createElement("rect", { x: "179", y: "141", width: "34", height: "52", rx: "6", fill: "#6B8EB5" }),
        React.createElement("rect", { x: "177", y: "193", width: "14", height: "35", rx: "4", fill: "#4A5568" }),
        React.createElement("rect", { x: "199", y: "193", width: "14", height: "35", rx: "4", fill: "#4A5568" }),

        // Enfant (devant, au centre)
        React.createElement("circle", { cx: "110", cy: "165", r: "14", fill: "#F5E6D3" }),
        React.createElement("path", { d: "M100 158 Q105 150 110 155 Q115 150 120 158", fill: "#5A3E28" }),
        React.createElement("circle", { cx: "106", cy: "163", r: "1.5", fill: "#555" }),
        React.createElement("circle", { cx: "114", cy: "163", r: "1.5", fill: "#555" }),
        React.createElement("path", { d: "M107 170 Q110 174 113 170", stroke: "#555", strokeWidth: "1.5", fill: "none" }),
        React.createElement("rect", { x: "100", y: "179", width: "22", height: "32", rx: "5", fill: "#E8C840" }),
        React.createElement("rect", { x: "98", y: "211", width: "10", height: "22", rx: "3", fill: "#4A6B8A" }),
        React.createElement("rect", { x: "114", y: "211", width: "10", height: "22", rx: "3", fill: "#4A6B8A" }),

        // Mains qui se tiennent
        React.createElement("path", { d: "M98 165 Q90 160 82 165", stroke: "#E8D5B7", strokeWidth: "3", fill: "none", strokeLinecap: "round" }),
        React.createElement("path", { d: "M122 165 Q130 160 138 165", stroke: "#E8D5B7", strokeWidth: "3", fill: "none", strokeLinecap: "round" }),
        React.createElement("path", { d: "M160 165 Q170 160 179 165", stroke: "#E8D5B7", strokeWidth: "3", fill: "none", strokeLinecap: "round" }),

        // Coeur
        React.createElement("path", { d: "M100 95 C100 90, 108 85, 108 93 C108 85, 116 90, 116 95 C116 103, 108 109, 108 109 C108 109, 100 103, 100 95Z", fill: "#E65100", opacity: "0.2" })
      )
    ),

    // Main content
    React.createElement("div", { style: styles.content },

      // Logo
      React.createElement("img", { src: "/logo.png", alt: "Vivalien", style: styles.logo }),

      // Title
      React.createElement("h1", { style: styles.title }, "Vivalien"),

      // Slogan
      React.createElement("p", { style: styles.slogan }, "Vivre ensemble, en toute securite"),

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
    overflow: "hidden",
    background: "#F0EBE0"
  },
  bgLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "45%",
    height: "55%",
    background: "linear-gradient(180deg, #4A7C59 0%, rgba(74,124,89,0.4) 50%, transparent 100%)",
    zIndex: 0
  },
  bgRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "45%",
    height: "55%",
    background: "linear-gradient(180deg, #D4A060 0%, rgba(212,160,96,0.3) 50%, transparent 100%)",
    zIndex: 0
  },
  bgBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "55%",
    background: "linear-gradient(180deg, transparent 0%, #EDE7DA 40%, #E8E2D5 100%)",
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
  logo: {
    width: 100,
    height: "auto",
    marginBottom: 8,
    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))"
  },
  title: {
    fontSize: 48,
    fontWeight: 800,
    color: "#2E7D32",
    margin: "0 0 4px",
    letterSpacing: -1
  },
  slogan: {
    fontSize: 18,
    color: "#555",
    margin: "0 0 20px",
    fontWeight: 500,
    fontStyle: "italic"
  },
  badge: {
    display: "flex",
    alignItems: "center",
    padding: "6px 18px",
    background: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    color: "#5A8C69",
    letterSpacing: 2,
    marginBottom: 12,
    border: "1px solid rgba(90,140,105,0.2)"
  },
  formCard: {
    width: "100%",
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: 20,
    padding: "32px 28px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
    border: "1px solid rgba(196,168,130,0.3)"
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
    background: "rgba(255,255,255,0.9)",
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
    color: "#888"
  },
  illuLeft: {
    position: "absolute",
    bottom: "3%",
    left: "2%",
    zIndex: 5,
    opacity: 0.85
  },
  illuRight: {
    position: "absolute",
    bottom: "3%",
    right: "1%",
    zIndex: 5,
    opacity: 0.85
  }
};
