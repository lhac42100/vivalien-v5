import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Header, Tabs, Card, Stat, Loading } from "../../components/UI";
import { COLORS, FORMULAS, MOODS } from "../../utils/constants";
import * as FS from "../../services/firestore";

export default function FamilyPage() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("dash");
  const [visits, setVisits] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [v, p, i, n, u] = await Promise.all([
        FS.getVisits({ familyId: user.id }),
        FS.getVisitProofs({ familyId: user.id }),
        FS.getInvoices({ familyId: user.id }),
        FS.getNotifications(user.id),
        FS.getAllUsers()
      ]);
      setVisits(v); setProofs(p); setInvoices(i); setNotifs(n); setUsers(u);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const formula = FORMULAS.find(f => f.id === user.formulaId);
  const companion = users.find(u => u.id === user.companionId);
  const unread = notifs.filter(n => !n.read).length;

  const markRead = async () => {
    for (const n of notifs.filter(n => !n.read)) {
      await FS.markNotificationRead(n.id);
    }
    load();
  };

  const tabList = [
    { id: "dash", icon: "📊", label: "Suivi", color: COLORS.blue },
    { id: "proofs", icon: "✅", label: "Preuves", color: COLORS.blue },
    { id: "history", icon: "📜", label: "Historique", color: COLORS.blue },
    { id: "invoices", icon: "💰", label: "Factures", color: COLORS.blue },
    { id: "notifs", icon: "🔔", label: "Notifs", color: COLORS.blue, badge: unread }
  ];

  if (loading) return <><Header title="Vivalien" sub={`Suivi de ${user.seniorName}`} color={COLORS.blue} colorD={COLORS.blueD} onLogout={logout} /><Loading /></>;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans',sans-serif" }}>
      <Header title="Vivalien" sub={`Suivi de ${user.seniorName}`} color={COLORS.blue} colorD={COLORS.blueD} onLogout={logout} />
      <Tabs tabs={tabList} active={tab} onChange={t => { setTab(t); if (t === "notifs") markRead(); }} />

      <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>

        {/* DASHBOARD */}
        {tab === "dash" && <>
          <Card style={{ border: `2px solid ${COLORS.blueM}`, background: `linear-gradient(135deg, ${COLORS.blueL}, #FFF)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: COLORS.sub, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Formule active</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.blueD, marginTop: 4 }}>{formula?.name || "—"}</div>
                <div style={{ fontSize: 13, color: COLORS.sub }}>{formula?.frequency} — {formula?.visit3h}€/visite</div>
              </div>
              <div style={{ fontSize: 36 }}>📋</div>
            </div>
            {companion && <div style={{ marginTop: 10, padding: "8px 12px", background: "#FFF", borderRadius: 8, fontSize: 13 }}>🤝 Compagnon : <strong>{companion.name}</strong></div>}
          </Card>

          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <Stat icon="✅" value={visits.filter(v => v.status === "completed").length} label="Visites faites" color={COLORS.success} />
            <Stat icon="📅" value={visits.filter(v => v.status === "scheduled").length} label="À venir" color={COLORS.blue} />
            <Stat icon="📋" value={proofs.length} label="Preuves" color={COLORS.green} />
          </div>

          {/* Mood trend */}
          {proofs.length > 0 && <Card>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, color: COLORS.blueD }}>Tendance humeur</h3>
            <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 60 }}>
              {proofs.slice(0, 10).map((p, i) => {
                const moodIdx = MOODS.indexOf(p.observations?.mood);
                const h = moodIdx >= 0 ? [60, 48, 32, 20, 10][moodIdx] : 30;
                const colors = [COLORS.success, COLORS.green, "#FCD34D", COLORS.orange, COLORS.danger];
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: "100%", height: h, background: colors[moodIdx] || COLORS.brd, borderRadius: "6px 6px 0 0" }} />
                    <div style={{ fontSize: 9, color: COLORS.sub }}>{p.date?.slice(5)}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.sub, marginTop: 8 }}>
              <span>😢 Inquiétant</span><span>😊 Très bien</span>
            </div>
          </Card>}

          {/* In progress */}
          {visits.filter(v => v.status === "in_progress").map(v => (
            <Card key={v.id} style={{ border: `2px solid ${COLORS.blue}`, background: `linear-gradient(135deg, ${COLORS.blueL}, #FFF)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.success, animation: "pulse 2s infinite" }} />
                <span style={{ fontWeight: 700, color: COLORS.blueD }}>Visite en cours</span>
              </div>
              <div style={{ fontSize: 13, color: COLORS.sub, marginTop: 6 }}>{companion?.name} est avec {user.seniorName}</div>
            </Card>
          ))}

          <h3 style={{ margin: "16px 0 10px", fontSize: 15, color: COLORS.blueD }}>Prochaines visites</h3>
          {visits.filter(v => v.status === "scheduled").map(v => (
            <Card key={v.id} style={{ padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontWeight: 600, fontSize: 14 }}>{v.date}</div><div style={{ fontSize: 12, color: COLORS.sub }}>{v.time} — {v.duration}h</div></div>
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: COLORS.blueL, color: COLORS.blueD }}>{v.formula}</span>
            </Card>
          ))}
        </>}

        {/* PROOFS */}
        {tab === "proofs" && <>
          <h2 style={{ margin: "0 0 16px", color: COLORS.blueD, fontSize: 18 }}>Preuves de visite</h2>
          {proofs.length === 0 ? <Card style={{ textAlign: "center", padding: 40, color: COLORS.sub }}>Aucune preuve encore</Card>
            : proofs.map(p => {
              const co = users.find(u => u.id === p.companionId);
              return (
                <Card key={p.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <div><div style={{ fontWeight: 600, fontSize: 14 }}>{p.date}</div><div style={{ fontSize: 12, color: COLORS.sub }}>Compagnon : {co?.name}</div></div>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: COLORS.successL, color: COLORS.success }}>✅ Vérifiée</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                    <div style={{ padding: 10, background: COLORS.bg, borderRadius: 8 }}><div style={{ color: COLORS.sub, fontSize: 10 }}>ARRIVÉE</div><div style={{ fontWeight: 700, fontSize: 16, color: COLORS.blue }}>{p.checkIn?.time}</div><div style={{ fontSize: 10, color: COLORS.sub }}>📍 Vérifiée</div></div>
                    <div style={{ padding: 10, background: COLORS.bg, borderRadius: 8 }}><div style={{ color: COLORS.sub, fontSize: 10 }}>DÉPART</div><div style={{ fontWeight: 700, fontSize: 16, color: COLORS.blue }}>{p.checkOut?.time}</div><div style={{ fontSize: 10, color: COLORS.sub }}>📍 Vérifiée</div></div>
                  </div>
                  {p.observations && <div style={{ marginTop: 8, padding: 10, background: COLORS.bg, borderRadius: 8, fontSize: 12 }}>
                    <div><strong>Humeur :</strong> {p.observations.mood}</div>
                    <div><strong>Forme :</strong> {p.observations.physical}</div>
                    {p.observations.notes && <div style={{ marginTop: 4, color: COLORS.sub, fontStyle: "italic" }}>{p.observations.notes}</div>}
                    {p.observations.alerts?.length > 0 && <div style={{ marginTop: 6 }}>{p.observations.alerts.map((a, i) => <span key={i} style={{ padding: "2px 8px", background: COLORS.warnL, color: COLORS.warn, borderRadius: 12, fontSize: 11, fontWeight: 600, marginRight: 4 }}>⚠️ {a}</span>)}</div>}
                  </div>}
                  <div style={{ marginTop: 8, fontSize: 12, color: COLORS.sub }}>Validation : {p.validationType === "signature" ? "✍️ Signature" : "👆 Bouton"}</div>
                </Card>
              );
            })}
        </>}

        {/* HISTORY */}
        {tab === "history" && <>
          <h2 style={{ margin: "0 0 16px", color: COLORS.blueD, fontSize: 18 }}>Historique ({visits.length})</h2>
          {visits.map(v => (
            <Card key={v.id} style={{ padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontWeight: 600, fontSize: 14 }}>{v.date} — {v.time}</div><div style={{ fontSize: 12, color: COLORS.sub }}>{v.duration}h — {v.formula}</div></div>
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: v.status === "completed" ? COLORS.successL : v.status === "in_progress" ? COLORS.orangeL : "#F3F2EF", color: v.status === "completed" ? COLORS.success : v.status === "in_progress" ? COLORS.orange : COLORS.sub }}>
                {v.status === "completed" ? "Terminée" : v.status === "in_progress" ? "En cours" : "Planifiée"}
              </span>
            </Card>
          ))}
        </>}

        {/* INVOICES */}
        {tab === "invoices" && <>
          <h2 style={{ margin: "0 0 16px", color: COLORS.blueD, fontSize: 18 }}>Mes factures</h2>
          {invoices.map(inv => (
            <Card key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Facture {inv.month}</div>
                <div style={{ fontSize: 12, color: COLORS.sub }}>{inv.formula} — {inv.visits} visites</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.blueD }}>{inv.amount}€</div>
                <div style={{ fontSize: 11, color: COLORS.success, fontWeight: 600 }}>{inv.afterCI}€ après CI 50%</div>
                <span style={{ padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: inv.status === "paid" ? COLORS.successL : COLORS.warnL, color: inv.status === "paid" ? COLORS.success : COLORS.warn }}>{inv.status === "paid" ? "Payée" : "En attente"}</span>
              </div>
            </Card>
          ))}
        </>}

        {/* NOTIFS */}
        {tab === "notifs" && <>
          <h2 style={{ margin: "0 0 16px", color: COLORS.blueD, fontSize: 18 }}>Notifications</h2>
          {notifs.length === 0 ? <Card style={{ textAlign: "center", padding: 40, color: COLORS.sub }}>Aucune notification</Card>
            : notifs.map(n => (
              <Card key={n.id} style={{ borderLeft: n.read ? undefined : `4px solid ${COLORS.blue}`, padding: "12px 18px" }}>
                <div style={{ fontWeight: n.read ? 400 : 600, fontSize: 13 }}>{n.type === "start" ? "🟢" : "✅"} {n.message}</div>
                <div style={{ fontSize: 11, color: COLORS.sub, marginTop: 4 }}>{n.time}</div>
              </Card>
            ))}
        </>}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}
