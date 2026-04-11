export const COLORS = {
  green: "#2E7D32", greenL: "#E8F5E9", greenM: "#C8E6C9", greenD: "#1B5E20",
  orange: "#E65100", orangeL: "#FFF3E0",
  purple: "#6B21A8", purpleL: "#F3E8FF", purpleM: "#DDD6FE", purpleD: "#581C87",
  blue: "#1565C0", blueL: "#E3F2FD", blueM: "#BBDEFB", blueD: "#0D47A1",
  bg: "#FAFAF8", card: "#FFFFFF", brd: "#E8E5E0",
  txt: "#2D2A26", sub: "#78756F",
  danger: "#DC2626", dangerL: "#FEF2F2",
  success: "#16A34A", successL: "#F0FDF4",
  warn: "#D97706", warnL: "#FFFBEB"
};

export const FORMULAS = [
  { id: "decouverte", name: "Découverte", frequency: "1ère visite", hRate: 15, visit3h: 45, visit4h: 62, monthly: null, desc: "Première visite à moitié prix" },
  { id: "essentiel", name: "Essentiel", frequency: "1x/sem", hRate: 28, visit3h: 84, visit4h: 101, monthly: 336, desc: "4 visites/mois" },
  { id: "confort", name: "Confort", frequency: "2x/sem", hRate: 26, visit3h: 78, visit4h: 95, monthly: 624, desc: "8 visites/mois" },
  { id: "serenite", name: "Sérénité", frequency: "3x/sem", hRate: 25, visit3h: 75, visit4h: 92, monthly: 900, desc: "12 visites/mois" }
];

export const MOODS = ["😊 Très bien", "🙂 Bien", "😐 Neutre", "😟 Préoccupant", "😢 Inquiétant"];
export const PHYSICAL = ["💪 En forme", "🚶 Correct", "🦯 Fatigué", "⚠️ Fragilisé"];

export const btnStyle = {
  border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "14px",
  fontWeight: "600", cursor: "pointer", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif"
};

export const inputStyle = {
  width: "100%", padding: "10px 14px", border: "2px solid #E8E5E0", borderRadius: "10px",
  fontSize: "14px", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
  marginTop: "4px", outline: "none", background: "#FFFFFF"
};
