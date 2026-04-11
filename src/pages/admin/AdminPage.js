import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Header, Tabs, Card, Stat, Message, Loading } from "../../components/UI";
import { COLORS, FORMULAS, btnStyle, inputStyle } from "../../utils/constants";
import { exportToCSV } from "../../utils/helpers";
import { adminCreateUser } from "../../services/auth";
import * as FS from "../../services/firestore";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("dash");
  const [users, setUsers] = useState([]);
  const [visits, setVisits] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: "", type: "success" });
  const [showCreate, setShowCreate] = useState(false);
  const [nu, setNu] = useState({ name: "", email: "", password: "", role: "companion", seniorName: "", seniorAddress: "", formulaId: "essentiel", companionId: "" });

  const load = async () => {
    setLoading(true);
    try {
      const [u, v, p, i, a] = await Promise.all([
        FS.getAllUsers(), FS.getAllVisits(), FS.getAllVisitProofs(), FS.getAllInvoices(), FS.getAlerts()
      ]);
      setUsers(u); setVisits(v); setProofs(p); setInvoices(i); setAlerts(a);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const flash = (text, type = "success") => { setMsg({ text, type }); setTimeout(() => setMsg({ text: "", type: "success" }), 3000); };

  const createUser = async () => {
    if (!nu.name || !nu.email || !nu.password) { flash("Tous les champs requis", "error"); return; }
    try {
      await adminCreateUser(nu.email, nu.password, nu);
      setNu({ name: "", email: "", password: "", role: "companion", seniorName: "", seniorAddress: "", formulaId: "essentiel", companionId: "" });
      setShowCreate(false);
      flash("✅ Utilisateur créé !");
      await load();
    } catch (e) { flash(e.message, "error"); }
  };

  const handleDeleteUser = async (uid) => {
    if (uid === user.id) return;
    try { await FS.deleteUser(uid); flash("Utilisateur supprimé"); await load(); }
    catch (e) { flash(e.message, "error"); }
  };

  const handleExport = () => {
    let csv = "Date,Senior,Compagnon,Durée,Formule,Statut,Arrivée,Départ,Humeur,Forme\n";
    visits.forEach(v => {
      const fam = users.find(u => u.id === v.familyId);
      const comp = users.find(u => u.id === v.companionId);
      const proof = proofs.find(p => p.visitId === v.id);
      csv += `${v.date},${fam?.seniorName || ""},${comp?.name || ""},${v.duration}h,${v.formula},${v.status},${proof?.checkIn?.time || ""},${proof?.checkOut?.time || ""},${proof?.observations?.mood || ""},${proof?.observations?.physical || ""}\n`;
    });
    exportToCSV(csv, "vivalien_export.csv");
  };

  const companions = users.filter(u => u.role === "companion");
  const families = users.filter(u => u.role === "family");
  const totalCA = invoices.reduce((a, i) => a + (i.amount || 0), 0);
  const pendingCA = invoices.filter(i => i.status === "pending").reduce((a, i) => a + (i.amount || 0), 0);
  const completedVisits = visits.filter(v => v.status === "completed").length;
  const scheduledVisits = visits.filter(v => v.status === "scheduled").length;
  const unreadAlerts = alerts.filter(a => !a.read).length;

  const tabList = [
    { id: "dash", icon: "📊", label: "Dashboard", color: COLORS.purple },
    { id: "users", icon: "👥", label: "Utilisateurs", color: COLORS.purple },
    { id: "visits", icon: "📋", label: "Visites", color: COLORS.purple },
    { id: "proofs", icon: "✅", label: "Preuves", color: COLORS.purple },
    { id: "invoices", icon: "💰", label: "Facturation", color: COLORS.purple },
    { id: "alerts", icon: "🚨", label: "Alertes", color: COLORS.purple, badge: unreadAlerts }
  ];

  if (loading) return <><Header title="Vivalien Admin" sub={`Bonjour ${user.name}`} color={COLORS.purple} colorD={COLORS.purpleD} onLogout={logout} /><Loading /></>;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans',sans-serif" }}>
      <Header title="Vivalien Admin" sub={`Bonjour ${user.name}`} color={COLORS.purple} colorD={COLORS.purpleD} onLogout={logout} />
      <Tabs tabs={tabList} active={tab} onChange={setTab} />
      <Message text={msg.text} type={msg.type} />

      <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>

        {/* DASHBOARD */}
        {tab === "dash" && <>
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <Stat icon="💰" value={`${totalCA}€`} label="CA total" color={COLORS.purple} />
            <Stat icon="⏳" value={`${pendingCA}€`} label="En attente" color={COLORS.warn} />
            <Stat icon="✅" value={completedVisits} label="Visites faites" color={COLORS.success} />
            <Stat icon="📅" value={scheduledVisits} label="Planifiées" color={COLORS.blue} />
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <Stat icon="🤝" value={companions.length} label="Compagnons" color={COLORS.green} />
            <Stat icon="👨‍👩‍👧" value={families.length} label="Familles" color={COLORS.blue} />
            <Stat icon="📊" value={completedVisits > 0 ? (totalCA / completedVisits).toFixed(0) + "€" : "—"} label="CA/visite" color={COLORS.purple} />
            <Stat icon="📈" value={companions.length > 0 ? (completedVisits / companions.length).toFixed(1) : "—"} label="Visites/comp." color={COLORS.orange} />
          </div>
          <Card>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, color: COLORS.purpleD }}>Taux de remplissage</h3>
            {companions.map(co => {
              const n = visits.filter(v => v.companionId === co.id && v.status === "completed").length;
              const pct = Math.round(n / 40 * 100);
              return (
                <div key={co.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{co.name}</span>
                    <span style={{ color: COLORS.sub }}>{n}/40 ({pct}%)</span>
                  </div>
                  <div style={{ height: 8, background: COLORS.brd, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: pct > 75 ? COLORS.success : pct > 40 ? COLORS.warn : COLORS.danger, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </Card>
          <button onClick={handleExport} style={{ ...btnStyle, background: COLORS.purple, color: "#FFF", width: "100%", marginTop: 8 }}>📥 Exporter (CSV)</button>
        </>}

        {/* USERS */}
        {tab === "users" && <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ margin: 0, color: COLORS.purpleD, fontSize: 18 }}>Utilisateurs ({users.length})</h2>
            <button onClick={() => setShowCreate(!showCreate)} style={{ ...btnStyle, background: COLORS.purple, color: "#FFF", fontSize: 13 }}>+ Créer</button>
          </div>
          {showCreate && <Card style={{ border: `2px solid ${COLORS.purpleM}` }}>
            <h3 style={{ margin: "0 0 14px", color: COLORS.purpleD, fontSize: 15 }}>Nouvel utilisateur</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><label style={{ fontSize: 11, fontWeight: 600, color: COLORS.sub }}>Nom</label><input value={nu.name} onChange={e => setNu({ ...nu, name: e.target.value })} style={inputStyle} placeholder="Marie Dupont" /></div>
              <div><label style={{ fontSize: 11, fontWeight: 600, color: COLORS.sub }}>Email</label><input value={nu.email} onChange={e => setNu({ ...nu, email: e.target.value })} style={inputStyle} placeholder="marie@vivalien.fr" /></div>
              <div><label style={{ fontSize: 11, fontWeight: 600, color: COLORS.sub }}>Mot de passe</label><input value={nu.password} onChange={e => setNu({ ...nu, password: e.target.value })} type="password" style={inputStyle} /></div>
              <div><label style={{ fontSize: 11, fontWeight: 600, color: COLORS.sub }}>Rôle</label><select value={nu.role} onChange={e => setNu({ ...nu, role: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}><option value="companion">Compagnon</option><option value="family">Famille</option></select></div>
              {nu.role === "family" && <>
                <div><label style={{ fontSize: 11, fontWeight: 600, color: COLORS.sub }}>Nom du senior</label><input value={nu.seniorName} onChange={e => setNu({ ...nu, seniorName: e.target.value })} style={inputStyle} /></div>
                <div><label style={{ fontSize: 11, fontWeight: 600, color: COLORS.sub }}>Adresse senior</label><input value={nu.seniorAddress} onChange={e => setNu({ ...nu, seniorAddress: e.target.value })} style={inputStyle} /></div>
                <div><label style={{ fontSize: 11, fontWeight: 600, color: COLORS.sub }}>Formule</label><select value={nu.formulaId} onChange={e => setNu({ ...nu, formulaId: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>{FORMULAS.map(f => <option key={f.id} value={f.id}>{f.name} — {f.frequency}</option>)}</select></div>
                <div><label style={{ fontSize: 11, fontWeight: 600, color: COLORS.sub }}>Compagnon</label><select value={nu.companionId} onChange={e => setNu({ ...nu, companionId: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}><option value="">— Choisir —</option>{companions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              </>}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
              <button onClick={() => setShowCreate(false)} style={{ ...btnStyle, background: "#F3F2EF", color: COLORS.txt, fontSize: 13 }}>Annuler</button>
              <button onClick={createUser} style={{ ...btnStyle, background: COLORS.purple, color: "#FFF", fontSize: 13 }}>Créer</button>
            </div>
          </Card>}
          {users.map(u => (
            <Card key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, background: u.role === "admin" ? COLORS.purpleL : u.role === "companion" ? COLORS.greenL : COLORS.blueL }}>
                  {u.role === "admin" ? "👑" : u.role === "companion" ? "🤝" : "👨‍👩‍👧"}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.sub }}>{u.email}{u.seniorName ? ` — ${u.seniorName}` : ""}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: u.role === "admin" ? COLORS.purpleL : u.role === "companion" ? COLORS.greenL : COLORS.blueL, color: u.role === "admin" ? COLORS.purpleD : u.role === "companion" ? COLORS.greenD : COLORS.blueD }}>
                  {u.role === "admin" ? "Admin" : u.role === "companion" ? "Compagnon" : "Famille"}
                </span>
                {u.id !== user.id && <button onClick={() => handleDeleteUser(u.id)} style={{ ...btnStyle, background: COLORS.dangerL, color: COLORS.danger, padding: "4px 10px", fontSize: 11 }}>Suppr.</button>}
              </div>
            </Card>
          ))}
        </>}

        {/* VISITS */}
        {tab === "visits" && <>
          <h2 style={{ margin: "0 0 16px", color: COLORS.purpleD, fontSize: 18 }}>Visites ({visits.length})</h2>
          {visits.map(v => {
            const co = users.find(u => u.id === v.companionId), fa = users.find(u => u.id === v.familyId);
            return (
              <Card key={v.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{fa?.seniorName || "—"}</div>
                  <div style={{ fontSize: 12, color: COLORS.sub }}>{v.date} à {v.time} — {v.duration}h — {co?.name} — {v.formula}</div>
                </div>
                <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: v.status === "completed" ? COLORS.successL : v.status === "in_progress" ? COLORS.orangeL : "#F3F2EF", color: v.status === "completed" ? COLORS.success : v.status === "in_progress" ? COLORS.orange : COLORS.sub }}>
                  {v.status === "completed" ? "Terminée" : v.status === "in_progress" ? "En cours" : "Planifiée"}
                </span>
              </Card>
            );
          })}
        </>}

        {/* PROOFS */}
        {tab === "proofs" && <>
          <h2 style={{ margin: "0 0 16px", color: COLORS.purpleD, fontSize: 18 }}>Preuves ({proofs.length})</h2>
          {proofs.map(p => {
            const co = users.find(u => u.id === p.companionId), fa = users.find(u => u.id === p.familyId);
            return (
              <Card key={p.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div><div style={{ fontWeight: 600, fontSize: 14 }}>{fa?.seniorName} — {p.date}</div><div style={{ fontSize: 12, color: COLORS.sub }}>Compagnon : {co?.name}</div></div>
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: COLORS.successL, color: COLORS.success }}>✅ Vérifiée</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                  <div style={{ padding: 10, background: COLORS.bg, borderRadius: 8 }}><div style={{ color: COLORS.sub, fontSize: 10 }}>ARRIVÉE</div><div style={{ fontWeight: 700, fontSize: 16, color: COLORS.green }}>{p.checkIn?.time}</div><div style={{ fontSize: 10, color: COLORS.sub }}>📍 {p.checkIn?.lat?.toFixed(4)}, {p.checkIn?.lng?.toFixed(4)}</div></div>
                  <div style={{ padding: 10, background: COLORS.bg, borderRadius: 8 }}><div style={{ color: COLORS.sub, fontSize: 10 }}>DÉPART</div><div style={{ fontWeight: 700, fontSize: 16, color: COLORS.green }}>{p.checkOut?.time}</div><div style={{ fontSize: 10, color: COLORS.sub }}>📍 {p.checkOut?.lat?.toFixed(4)}, {p.checkOut?.lng?.toFixed(4)}</div></div>
                </div>
                {p.observations && <div style={{ marginTop: 8, padding: 10, background: COLORS.bg, borderRadius: 8, fontSize: 12 }}>
                  <strong>Humeur :</strong> {p.observations.mood} — <strong>Forme :</strong> {p.observations.physical}
                  {p.observations.notes && <div style={{ marginTop: 4, color: COLORS.sub }}>{p.observations.notes}</div>}
                  {p.observations.alerts?.length > 0 && <div style={{ marginTop: 4 }}>{p.observations.alerts.map((a, i) => <span key={i} style={{ padding: "2px 8px", background: COLORS.warnL, color: COLORS.warn, borderRadius: 12, fontSize: 11, fontWeight: 600, marginRight: 4 }}>⚠️ {a}</span>)}</div>}
                </div>}
              </Card>
            );
          })}
        </>}

        {/* INVOICES */}
        {tab === "invoices" && <>
          <h2 style={{ margin: "0 0 16px", color: COLORS.purpleD, fontSize: 18 }}>Facturation</h2>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <Stat icon="💰" value={`${totalCA}€`} label="CA total" color={COLORS.purple} />
            <Stat icon="✅" value={`${invoices.filter(i => i.status === "paid").reduce((a, i) => a + i.amount, 0)}€`} label="Encaissé" color={COLORS.success} />
            <Stat icon="⏳" value={`${pendingCA}€`} label="En attente" color={COLORS.warn} />
          </div>
          {invoices.map(inv => {
            const fa = users.find(u => u.id === inv.familyId);
            return (
              <Card key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{fa?.seniorName} — {inv.month}</div>
                  <div style={{ fontSize: 12, color: COLORS.sub }}>{inv.formula} — {inv.visits} visites</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.purpleD }}>{inv.amount}€</div>
                  <div style={{ fontSize: 11, color: COLORS.success }}>{inv.afterCI}€ après CI</div>
                  <span style={{ padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: inv.status === "paid" ? COLORS.successL : COLORS.warnL, color: inv.status === "paid" ? COLORS.success : COLORS.warn }}>{inv.status === "paid" ? "Payée" : "En attente"}</span>
                </div>
              </Card>
            );
          })}
        </>}

        {/* ALERTS */}
        {tab === "alerts" && <>
          <h2 style={{ margin: "0 0 16px", color: COLORS.purpleD, fontSize: 18 }}>Alertes</h2>
          {alerts.map(a => (
            <Card key={a.id} style={{ borderLeft: `4px solid ${a.read ? COLORS.brd : COLORS.danger}`, cursor: "pointer" }} onClick={() => { FS.markAlertRead(a.id); load(); }}>
              <div style={{ fontWeight: a.read ? 400 : 600, fontSize: 13 }}>🚨 {a.message}</div>
              <div style={{ fontSize: 11, color: COLORS.sub, marginTop: 4 }}>{a.date} à {a.time}</div>
            </Card>
          ))}
          {proofs.filter(p => p.observations?.alerts?.length > 0).length > 0 && <>
            <h3 style={{ margin: "20px 0 10px", fontSize: 15, color: COLORS.warn }}>⚠️ Alertes compagnons</h3>
            {proofs.filter(p => p.observations?.alerts?.length > 0).map(p => {
              const fa = users.find(u => u.id === p.familyId);
              return (
                <Card key={p.id} style={{ borderLeft: `4px solid ${COLORS.warn}` }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{fa?.seniorName} — {p.date}</div>
                  {p.observations.alerts.map((a, i) => <div key={i} style={{ fontSize: 12, color: COLORS.warn, marginTop: 4 }}>⚠️ {a}</div>)}
                </Card>
              );
            })}
          </>}
        </>}
      </div>
    </div>
  );
}
