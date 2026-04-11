import React from "react";
import { COLORS, btnStyle } from "../utils/constants";

// ============ HEADER ============
export function Header({ title, sub, color, colorD, onLogout }) {
  return (
    <div style={{ background: `linear-gradient(135deg, ${color} 0%, ${colorD} 100%)`, padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h1 style={{ margin: 0, color: "#FFF", fontSize: 20, fontWeight: 800 }}>{title}</h1>
        <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,.7)", fontSize: 13 }}>{sub}</p>
      </div>
      <button onClick={onLogout} style={{ ...btnStyle, background: "rgba(255,255,255,.15)", color: "#FFF", padding: "8px 16px", fontSize: 12 }}>
        Déconnexion
      </button>
    </div>
  );
}

// ============ TABS ============
export function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ padding: "10px 24px", display: "flex", gap: 4, background: "#FFF", borderBottom: `1px solid ${COLORS.brd}`, overflowX: "auto" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          ...btnStyle, background: active === t.id ? (t.color || COLORS.green) : "transparent",
          color: active === t.id ? "#FFF" : COLORS.txt, padding: "8px 14px", fontSize: 12.5,
          borderRadius: 8, position: "relative", whiteSpace: "nowrap"
        }}>
          {t.icon} {t.label}
          {t.badge > 0 && <Badge n={t.badge} />}
        </button>
      ))}
    </div>
  );
}

// ============ CARD ============
export function Card({ children, style: extraStyle, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "#FFF", borderRadius: 14, padding: 20, marginBottom: 10,
      border: `1px solid ${COLORS.brd}`, ...extraStyle
    }}>
      {children}
    </div>
  );
}

// ============ STAT ============
export function Stat({ icon, value, label, color }) {
  return (
    <div style={{ background: "#FFF", borderRadius: 14, padding: 16, textAlign: "center", border: `1px solid ${COLORS.brd}`, flex: 1, minWidth: 80 }}>
      <div style={{ fontSize: 20, marginBottom: 2 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: color || COLORS.green }}>{value}</div>
      <div style={{ fontSize: 10.5, color: COLORS.sub, marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ============ BADGE ============
export function Badge({ n }) {
  if (!n) return null;
  return (
    <span style={{
      background: COLORS.danger, color: "#FFF", borderRadius: "50%", width: 18, height: 18,
      display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10,
      fontWeight: 700, position: "absolute", top: -5, right: -5
    }}>{n}</span>
  );
}

// ============ MESSAGE ============
export function Message({ text, type = "success" }) {
  if (!text) return null;
  const isOk = type === "success";
  return (
    <div style={{
      margin: "12px 24px 0", padding: "10px 16px", borderRadius: 10, fontSize: 13,
      background: isOk ? COLORS.successL : COLORS.dangerL,
      color: isOk ? COLORS.success : COLORS.danger
    }}>{text}</div>
  );
}

// ============ LOADING ============
export function Loading() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
      <div style={{ width: 40, height: 40, border: `4px solid ${COLORS.brd}`, borderTop: `4px solid ${COLORS.green}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ============ SIGNATURE PAD ============
export function SignaturePad({ onSave, onCancel }) {
  const ref = React.useRef(null);
  const [drawing, setDrawing] = React.useState(false);
  const [hasDrawn, setHasDrawn] = React.useState(false);

  React.useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.width = c.offsetWidth * 2;
    c.height = c.offsetHeight * 2;
    const ctx = c.getContext("2d");
    ctx.scale(2, 2);
    ctx.strokeStyle = "#2D2A26";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPos = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  };

  const start = (e) => { e.preventDefault(); setDrawing(true); setHasDrawn(true); const ctx = ref.current.getContext("2d"); const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const move = (e) => { if (!drawing) return; e.preventDefault(); const ctx = ref.current.getContext("2d"); const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
  const stop = () => setDrawing(false);
  const clear = () => { ref.current.getContext("2d").clearRect(0, 0, ref.current.width, ref.current.height); setHasDrawn(false); };

  return (
    <div style={{ background: "#FFF", borderRadius: 16, padding: 24, boxShadow: "0 8px 32px rgba(0,0,0,.12)" }}>
      <h3 style={{ margin: "0 0 8px", color: COLORS.txt }}>Signature du senior</h3>
      <p style={{ margin: "0 0 16px", color: COLORS.sub, fontSize: 13 }}>Le senior signe avec le doigt ci-dessous</p>
      <canvas ref={ref} style={{ width: "100%", height: 160, border: `2px dashed ${COLORS.brd}`, borderRadius: 12, touchAction: "none", cursor: "crosshair", background: "#FEFEFE" }}
        onMouseDown={start} onMouseMove={move} onMouseUp={stop} onMouseLeave={stop}
        onTouchStart={start} onTouchMove={move} onTouchEnd={stop} />
      <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{ ...btnStyle, background: "#F3F2EF", color: COLORS.txt }}>Annuler</button>
        <button onClick={clear} style={{ ...btnStyle, background: COLORS.dangerL, color: COLORS.danger }}>Effacer</button>
        <button onClick={() => hasDrawn && onSave(ref.current.toDataURL())} style={{ ...btnStyle, background: COLORS.green, color: "#FFF", opacity: hasDrawn ? 1 : 0.4 }}>Valider</button>
      </div>
    </div>
  );
}

// ============ OBSERVATION FORM ============
export function ObservationForm({ seniorName, onSave }) {
  const MOODS = ["😊 Très bien", "🙂 Bien", "😐 Neutre", "😟 Préoccupant", "😢 Inquiétant"];
  const PHYSICAL = ["💪 En forme", "🚶 Correct", "🦯 Fatigué", "⚠️ Fragilisé"];
  const [mood, setMood] = React.useState(MOODS[1]);
  const [phys, setPhys] = React.useState(PHYSICAL[1]);
  const [notes, setNotes] = React.useState("");
  const [alertText, setAlertText] = React.useState("");
  const [alerts, setAlerts] = React.useState([]);

  const addAlert = () => { if (alertText.trim()) { setAlerts([...alerts, alertText.trim()]); setAlertText(""); } };

  const inputS = { width: "100%", padding: "10px 14px", border: `2px solid ${COLORS.brd}`, borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box", marginTop: 4, outline: "none" };

  return (
    <div style={{ background: "#FFF", borderRadius: 16, padding: 24, border: `1px solid ${COLORS.brd}`, marginBottom: 16 }}>
      <h3 style={{ margin: "0 0 16px", color: COLORS.txt, fontSize: 16 }}>Observations — {seniorName}</h3>

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.sub }}>Humeur</label>
        <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
          {MOODS.map(m => <button key={m} onClick={() => setMood(m)} style={{ ...btnStyle, padding: "8px 12px", fontSize: 13, background: mood === m ? COLORS.greenL : "#F3F2EF", color: mood === m ? COLORS.green : COLORS.txt, border: mood === m ? `2px solid ${COLORS.green}` : "2px solid transparent" }}>{m}</button>)}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.sub }}>Forme physique</label>
        <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
          {PHYSICAL.map(p => <button key={p} onClick={() => setPhys(p)} style={{ ...btnStyle, padding: "8px 12px", fontSize: 13, background: phys === p ? COLORS.greenL : "#F3F2EF", color: phys === p ? COLORS.green : COLORS.txt, border: phys === p ? `2px solid ${COLORS.green}` : "2px solid transparent" }}>{p}</button>)}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.sub }}>Notes de visite</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Comment s'est passée la visite ?" style={{ ...inputS, resize: "vertical" }} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.sub }}>Alertes (optionnel)</label>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <input value={alertText} onChange={e => setAlertText(e.target.value)} placeholder="Ex: Léger manque d'appétit" style={{ ...inputS, flex: 1 }} onKeyDown={e => e.key === "Enter" && addAlert()} />
          <button onClick={addAlert} style={{ ...btnStyle, background: COLORS.warnL, color: COLORS.warn, padding: "8px 16px", marginTop: 4 }}>+</button>
        </div>
        {alerts.length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
          {alerts.map((a, i) => <span key={i} style={{ padding: "4px 10px", background: COLORS.warnL, color: COLORS.warn, borderRadius: 20, fontSize: 12, fontWeight: 600 }}>⚠️ {a} <span style={{ cursor: "pointer", marginLeft: 4 }} onClick={() => setAlerts(alerts.filter((_, j) => j !== i))}>✕</span></span>)}
        </div>}
      </div>

      <button onClick={() => onSave({ mood, physical: phys, notes, alerts })} style={{ ...btnStyle, background: COLORS.green, color: "#FFF", width: "100%", padding: 14 }}>
        Enregistrer les observations
      </button>
    </div>
  );
}
