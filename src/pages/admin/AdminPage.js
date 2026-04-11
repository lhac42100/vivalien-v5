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

  // Create user form
  const [showCreate, setShowCreate] = useState(false);
  const [nu, setNu] = useState({ name: "", email: "", password: "", role: "companion", seniorName: "", seniorAddress: "", formulaId: "essentiel", companionId: "" });

  // Create visit form
  const [showCreateVisit, setShowCreateVisit] = useState(false);
  const [nv, setNv] = useState({ familyId: "", companionId: "", date: "", time: "09:00", duration: 3, formula: "Essentiel" });

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

  const flash = (text, type) => { setMsg({ text, type: type || "success" }); setTimeout(() => setMsg({ text: "", type: "success" }), 3000); };

  // CREATE USER
  const createUser = async () => {
    if (!nu.name || !nu.email || !nu.password) { flash("Tous les champs requis", "error"); return; }
    try {
      await adminCreateUser(nu.email, nu.password, nu);
      setNu({ name: "", email: "", password: "", role: "companion", seniorName: "", seniorAddress: "", formulaId: "essentiel", companionId: "" });
      setShowCreate(false);
      flash("Utilisateur cree !");
      await load();
    } catch (e) { flash(e.message, "error"); }
  };

  // DELETE USER
  const handleDeleteUser = async (uid) => {
    if (uid === user.id) return;
    try { await FS.deleteUser(uid); flash("Utilisateur supprime"); await load(); }
    catch (e) { flash(e.message, "error"); }
  };

  // CREATE VISIT
  const createVisit = async () => {
    if (!nv.familyId || !nv.companionId || !nv.date) { flash("Famille, compagnon et date requis", "error"); return; }
    try {
      await FS.createVisit({
        familyId: nv.familyId,
        companionId: nv.companionId,
        date: nv.date,
        time: nv.time,
        duration: Number(nv.duration),
        formula: nv.formula,
        status: "scheduled"
      });
      setNv({ familyId: "", companionId: "", date: "", time: "09:00", duration: 3, formula: "Essentiel" });
      setShowCreateVisit(false);
      flash("Visite planifiee !");
      await load();
    } catch (e) { flash(e.message, "error"); }
  };

  // DELETE VISIT
  const handleDeleteVisit = async (id) => {
    try {
      await FS.updateVisit(id, { status: "cancelled" });
      flash("Visite annulee");
      await load();
    } catch (e) { flash(e.message, "error"); }
  };

  // EXPORT
  const handleExport = () => {
    var csv = "Date,Senior,Compagnon,Duree,Formule,Statut,Arrivee,Depart,Humeur,Forme\n";
    visits.forEach(function(v) {
      var fam = users.find(function(u) { return u.id === v.familyId; });
      var comp = users.find(function(u) { return u.id === v.companionId; });
      var proof = proofs.find(function(p) { return p.visitId === v.id; });
      csv += v.date + "," + (fam && fam.seniorName ? fam.seniorName : "") + "," + (comp && comp.name ? comp.name : "") + "," + v.duration + "h," + v.formula + "," + v.status + "," + (proof && proof.checkIn ? proof.checkIn.time : "") + "," + (proof && proof.checkOut ? proof.checkOut.time : "") + "," + (proof && proof.observations ? proof.observations.mood : "") + "," + (proof && proof.observations ? proof.observations.physical : "") + "\n";
    });
    exportToCSV(csv, "vivalien_export.csv");
  };

  var companions = users.filter(function(u) { return u.role === "companion"; });
  var families = users.filter(function(u) { return u.role === "family"; });
  var totalCA = invoices.reduce(function(a, i) { return a + (i.amount || 0); }, 0);
  var pendingCA = invoices.filter(function(i) { return i.status === "pending"; }).reduce(function(a, i) { return a + (i.amount || 0); }, 0);
  var completedVisits = visits.filter(function(v) { return v.status === "completed"; }).length;
  var scheduledVisits = visits.filter(function(v) { return v.status === "scheduled"; }).length;
  var unreadAlerts = alerts.filter(function(a) { return !a.read; }).length;
  var activeVisits = visits.filter(function(v) { return v.status !== "cancelled"; });

  var tabList = [
    { id: "dash", icon: "\ud83d\udcca", label: "Dashboard", color: COLORS.purple },
    { id: "users", icon: "\ud83d\udc65", label: "Utilisateurs", color: COLORS.purple },
    { id: "visits", icon: "\ud83d\udccb", label: "Visites", color: COLORS.purple },
    { id: "proofs", icon: "\u2705", label: "Preuves", color: COLORS.purple },
    { id: "invoices", icon: "\ud83d\udcb0", label: "Facturation", color: COLORS.purple },
    { id: "alerts", icon: "\ud83d\udea8", label: "Alertes", color: COLORS.purple, badge: unreadAlerts }
  ];

  if (loading) return React.createElement(React.Fragment, null,
    React.createElement(Header, { title: "Vivalien Admin", sub: "Bonjour " + user.name, color: COLORS.purple, colorD: COLORS.purpleD, onLogout: logout }),
    React.createElement(Loading, null)
  );

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans',sans-serif" }}>
      <Header title="Vivalien Admin" sub={"Bonjour " + user.name} color={COLORS.purple} colorD={COLORS.purpleD} onLogout={logout} />
      <Tabs tabs={tabList} active={tab} onChange={setTab} />
      <Message text={msg.text} type={msg.type} />

      <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>

        {/* ======== DASHBOARD ======== */}
        {tab === "dash" && React.createElement(React.Fragment, null,
          React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" } },
            React.createElement(Stat, { icon: "\ud83d\udcb0", value: totalCA + "\u20ac", label: "CA total", color: COLORS.purple }),
            React.createElement(Stat, { icon: "\u23f3", value: pendingCA + "\u20ac", label: "En attente", color: COLORS.warn }),
            React.createElement(Stat, { icon: "\u2705", value: completedVisits, label: "Visites faites", color: COLORS.success }),
            React.createElement(Stat, { icon: "\ud83d\udcc5", value: scheduledVisits, label: "Planifiees", color: COLORS.blue })
          ),
          React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" } },
            React.createElement(Stat, { icon: "\ud83e\udd1d", value: companions.length, label: "Compagnons", color: COLORS.green }),
            React.createElement(Stat, { icon: "\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67", value: families.length, label: "Familles", color: COLORS.blue }),
            React.createElement(Stat, { icon: "\ud83d\udcca", value: completedVisits > 0 ? Math.round(totalCA / completedVisits) + "\u20ac" : "\u2014", label: "CA/visite", color: COLORS.purple }),
            React.createElement(Stat, { icon: "\ud83d\udcc8", value: companions.length > 0 ? (completedVisits / companions.length).toFixed(1) : "\u2014", label: "Visites/comp.", color: COLORS.orange })
          ),
          React.createElement(Card, null,
            React.createElement("h3", { style: { margin: "0 0 12px", fontSize: 15, color: COLORS.purpleD } }, "Taux de remplissage"),
            companions.map(function(co) {
              var n = visits.filter(function(v) { return v.companionId === co.id && v.status === "completed"; }).length;
              var pct = Math.round(n / 40 * 100);
              return React.createElement("div", { key: co.id, style: { marginBottom: 10 } },
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 } },
                  React.createElement("span", { style: { fontWeight: 600 } }, co.name),
                  React.createElement("span", { style: { color: COLORS.sub } }, n + "/40 (" + pct + "%)")
                ),
                React.createElement("div", { style: { height: 8, background: COLORS.brd, borderRadius: 4, overflow: "hidden" } },
                  React.createElement("div", { style: { height: "100%", width: Math.min(pct, 100) + "%", background: pct > 75 ? COLORS.success : pct > 40 ? COLORS.warn : COLORS.danger, borderRadius: 4 } })
                )
              );
            })
          ),
          React.createElement("button", { onClick: handleExport, style: { ...btnStyle, background: COLORS.purple, color: "#FFF", width: "100%", marginTop: 8 } }, "\ud83d\udce5 Exporter (CSV)")
        )}

        {/* ======== USERS ======== */}
        {tab === "users" && React.createElement(React.Fragment, null,
          React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } },
            React.createElement("h2", { style: { margin: 0, color: COLORS.purpleD, fontSize: 18 } }, "Utilisateurs (" + users.length + ")"),
            React.createElement("button", { onClick: function() { setShowCreate(!showCreate); }, style: { ...btnStyle, background: COLORS.purple, color: "#FFF", fontSize: 13 } }, "+ Creer")
          ),
          showCreate && React.createElement(Card, { style: { border: "2px solid " + COLORS.purpleM } },
            React.createElement("h3", { style: { margin: "0 0 14px", color: COLORS.purpleD, fontSize: 15 } }, "Nouvel utilisateur"),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } },
              React.createElement("div", null,
                React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Nom"),
                React.createElement("input", { value: nu.name, onChange: function(e) { setNu({ ...nu, name: e.target.value }); }, style: inputStyle, placeholder: "Marie Dupont" })
              ),
              React.createElement("div", null,
                React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Email"),
                React.createElement("input", { value: nu.email, onChange: function(e) { setNu({ ...nu, email: e.target.value }); }, style: inputStyle, placeholder: "marie@vivalien.fr" })
              ),
              React.createElement("div", null,
                React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Mot de passe"),
                React.createElement("input", { value: nu.password, onChange: function(e) { setNu({ ...nu, password: e.target.value }); }, type: "password", style: inputStyle })
              ),
              React.createElement("div", null,
                React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Role"),
                React.createElement("select", { value: nu.role, onChange: function(e) { setNu({ ...nu, role: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } },
                  React.createElement("option", { value: "companion" }, "Compagnon"),
                  React.createElement("option", { value: "family" }, "Famille")
                )
              ),
              nu.role === "family" && React.createElement(React.Fragment, null,
                React.createElement("div", null,
                  React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Nom du senior"),
                  React.createElement("input", { value: nu.seniorName, onChange: function(e) { setNu({ ...nu, seniorName: e.target.value }); }, style: inputStyle })
                ),
                React.createElement("div", null,
                  React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Adresse senior"),
                  React.createElement("input", { value: nu.seniorAddress, onChange: function(e) { setNu({ ...nu, seniorAddress: e.target.value }); }, style: inputStyle })
                ),
                React.createElement("div", null,
                  React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Formule"),
                  React.createElement("select", { value: nu.formulaId, onChange: function(e) { setNu({ ...nu, formulaId: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } },
                    FORMULAS.map(function(f) { return React.createElement("option", { key: f.id, value: f.id }, f.name + " - " + f.frequency); })
                  )
                ),
                React.createElement("div", null,
                  React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Compagnon"),
                  React.createElement("select", { value: nu.companionId, onChange: function(e) { setNu({ ...nu, companionId: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } },
                    React.createElement("option", { value: "" }, "-- Choisir --"),
                    companions.map(function(c) { return React.createElement("option", { key: c.id, value: c.id }, c.name); })
                  )
                )
              )
            ),
            React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" } },
              React.createElement("button", { onClick: function() { setShowCreate(false); }, style: { ...btnStyle, background: "#F3F2EF", color: COLORS.txt, fontSize: 13 } }, "Annuler"),
              React.createElement("button", { onClick: createUser, style: { ...btnStyle, background: COLORS.purple, color: "#FFF", fontSize: 13 } }, "Creer")
            )
          ),
          users.map(function(u) {
            var roleIcon = u.role === "admin" ? "\ud83d\udc51" : u.role === "companion" ? "\ud83e\udd1d" : "\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67";
            var roleBg = u.role === "admin" ? COLORS.purpleL : u.role === "companion" ? COLORS.greenL : COLORS.blueL;
            var roleColor = u.role === "admin" ? COLORS.purpleD : u.role === "companion" ? COLORS.greenD : COLORS.blueD;
            var roleLabel = u.role === "admin" ? "Admin" : u.role === "companion" ? "Compagnon" : "Famille";
            return React.createElement(Card, { key: u.id, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" } },
              React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
                React.createElement("div", { style: { width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, background: roleBg } }, roleIcon),
                React.createElement("div", null,
                  React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, u.name),
                  React.createElement("div", { style: { fontSize: 12, color: COLORS.sub } }, u.email + (u.seniorName ? " - " + u.seniorName : ""))
                )
              ),
              React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
                React.createElement("span", { style: { padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: roleBg, color: roleColor } }, roleLabel),
                u.id !== user.id && React.createElement("button", { onClick: function() { handleDeleteUser(u.id); }, style: { ...btnStyle, background: COLORS.dangerL, color: COLORS.danger, padding: "4px 10px", fontSize: 11 } }, "Suppr.")
              )
            );
          })
        )}

        {/* ======== VISITS ======== */}
        {tab === "visits" && React.createElement(React.Fragment, null,
          React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } },
            React.createElement("h2", { style: { margin: 0, color: COLORS.purpleD, fontSize: 18 } }, "Visites (" + activeVisits.length + ")"),
            React.createElement("button", { onClick: function() { setShowCreateVisit(!showCreateVisit); }, style: { ...btnStyle, background: COLORS.purple, color: "#FFF", fontSize: 13 } }, "+ Planifier une visite")
          ),

          showCreateVisit && React.createElement(Card, { style: { border: "2px solid " + COLORS.purpleM } },
            React.createElement("h3", { style: { margin: "0 0 14px", color: COLORS.purpleD, fontSize: 15 } }, "Nouvelle visite"),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } },
              React.createElement("div", null,
                React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Famille / Senior"),
                React.createElement("select", { value: nv.familyId, onChange: function(e) { setNv({ ...nv, familyId: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } },
                  React.createElement("option", { value: "" }, "-- Choisir --"),
                  families.map(function(f) { return React.createElement("option", { key: f.id, value: f.id }, f.seniorName + " (" + f.name + ")"); })
                )
              ),
              React.createElement("div", null,
                React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Compagnon"),
                React.createElement("select", { value: nv.companionId, onChange: function(e) { setNv({ ...nv, companionId: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } },
                  React.createElement("option", { value: "" }, "-- Choisir --"),
                  companions.map(function(c) { return React.createElement("option", { key: c.id, value: c.id }, c.name); })
                )
              ),
              React.createElement("div", null,
                React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Date"),
                React.createElement("input", { type: "date", value: nv.date, onChange: function(e) { setNv({ ...nv, date: e.target.value }); }, style: inputStyle })
              ),
              React.createElement("div", null,
                React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Heure"),
                React.createElement("input", { type: "time", value: nv.time, onChange: function(e) { setNv({ ...nv, time: e.target.value }); }, style: inputStyle })
              ),
              React.createElement("div", null,
                React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Duree"),
                React.createElement("select", { value: nv.duration, onChange: function(e) { setNv({ ...nv, duration: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } },
                  React.createElement("option", { value: 3 }, "3 heures"),
                  React.createElement("option", { value: 4 }, "4 heures")
                )
              ),
              React.createElement("div", null,
                React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Formule"),
                React.createElement("select", { value: nv.formula, onChange: function(e) { setNv({ ...nv, formula: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } },
                  FORMULAS.map(function(f) { return React.createElement("option", { key: f.id, value: f.name }, f.name + " - " + f.visit3h + "\u20ac"); })
                )
              )
            ),
            React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" } },
              React.createElement("button", { onClick: function() { setShowCreateVisit(false); }, style: { ...btnStyle, background: "#F3F2EF", color: COLORS.txt, fontSize: 13 } }, "Annuler"),
              React.createElement("button", { onClick: createVisit, style: { ...btnStyle, background: COLORS.purple, color: "#FFF", fontSize: 13 } }, "Planifier")
            )
          ),

          activeVisits.map(function(v) {
            var co = users.find(function(u) { return u.id === v.companionId; });
            var fa = users.find(function(u) { return u.id === v.familyId; });
            var statusBg = v.status === "completed" ? COLORS.successL : v.status === "in_progress" ? COLORS.orangeL : "#F3F2EF";
            var statusColor = v.status === "completed" ? COLORS.success : v.status === "in_progress" ? COLORS.orange : COLORS.sub;
            var statusLabel = v.status === "completed" ? "Terminee" : v.status === "in_progress" ? "En cours" : "Planifiee";
            return React.createElement(Card, { key: v.id, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" } },
              React.createElement("div", null,
                React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, fa && fa.seniorName ? fa.seniorName : "--"),
                React.createElement("div", { style: { fontSize: 12, color: COLORS.sub } }, v.date + " a " + v.time + " - " + v.duration + "h - " + (co && co.name ? co.name : "--") + " - " + v.formula)
              ),
              React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
                React.createElement("span", { style: { padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: statusBg, color: statusColor } }, statusLabel),
                v.status === "scheduled" && React.createElement("button", { onClick: function() { handleDeleteVisit(v.id); }, style: { ...btnStyle, background: COLORS.dangerL, color: COLORS.danger, padding: "4px 10px", fontSize: 11 } }, "Annuler")
              )
            );
          })
        )}

        {/* ======== PROOFS ======== */}
        {tab === "proofs" && React.createElement(React.Fragment, null,
          React.createElement("h2", { style: { margin: "0 0 16px", color: COLORS.purpleD, fontSize: 18 } }, "Preuves (" + proofs.length + ")"),
          proofs.length === 0
            ? React.createElement(Card, { style: { textAlign: "center", padding: 40, color: COLORS.sub } }, "Aucune preuve de visite")
            : proofs.map(function(p) {
              var co = users.find(function(u) { return u.id === p.companionId; });
              var fa = users.find(function(u) { return u.id === p.familyId; });
              return React.createElement(Card, { key: p.id },
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 12 } },
                  React.createElement("div", null,
                    React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, (fa ? fa.seniorName : "") + " - " + p.date),
                    React.createElement("div", { style: { fontSize: 12, color: COLORS.sub } }, "Compagnon : " + (co ? co.name : ""))
                  ),
                  React.createElement("span", { style: { padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: COLORS.successL, color: COLORS.success } }, "\u2705 Verifiee")
                ),
                React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 } },
                  React.createElement("div", { style: { padding: 10, background: COLORS.bg, borderRadius: 8 } },
                    React.createElement("div", { style: { color: COLORS.sub, fontSize: 10 } }, "ARRIVEE"),
                    React.createElement("div", { style: { fontWeight: 700, fontSize: 16, color: COLORS.green } }, p.checkIn ? p.checkIn.time : "--"),
                    React.createElement("div", { style: { fontSize: 10, color: COLORS.sub } }, "\ud83d\udccd " + (p.checkIn ? p.checkIn.lat.toFixed(4) + ", " + p.checkIn.lng.toFixed(4) : "--"))
                  ),
                  React.createElement("div", { style: { padding: 10, background: COLORS.bg, borderRadius: 8 } },
                    React.createElement("div", { style: { color: COLORS.sub, fontSize: 10 } }, "DEPART"),
                    React.createElement("div", { style: { fontWeight: 700, fontSize: 16, color: COLORS.green } }, p.checkOut ? p.checkOut.time : "--"),
                    React.createElement("div", { style: { fontSize: 10, color: COLORS.sub } }, "\ud83d\udccd " + (p.checkOut ? p.checkOut.lat.toFixed(4) + ", " + p.checkOut.lng.toFixed(4) : "--"))
                  )
                ),
                p.observations && React.createElement("div", { style: { marginTop: 8, padding: 10, background: COLORS.bg, borderRadius: 8, fontSize: 12 } },
                  React.createElement("div", null, React.createElement("strong", null, "Humeur : "), p.observations.mood, " - ", React.createElement("strong", null, "Forme : "), p.observations.physical),
                  p.observations.notes && React.createElement("div", { style: { marginTop: 4, color: COLORS.sub } }, p.observations.notes),
                  p.observations.alerts && p.observations.alerts.length > 0 && React.createElement("div", { style: { marginTop: 4 } },
                    p.observations.alerts.map(function(a, i) { return React.createElement("span", { key: i, style: { padding: "2px 8px", background: COLORS.warnL, color: COLORS.warn, borderRadius: 12, fontSize: 11, fontWeight: 600, marginRight: 4 } }, "\u26a0\ufe0f " + a); })
                  )
                )
              );
            })
        )}

        {/* ======== INVOICES ======== */}
        {tab === "invoices" && React.createElement(React.Fragment, null,
          React.createElement("h2", { style: { margin: "0 0 16px", color: COLORS.purpleD, fontSize: 18 } }, "Facturation"),
          React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" } },
            React.createElement(Stat, { icon: "\ud83d\udcb0", value: totalCA + "\u20ac", label: "CA total", color: COLORS.purple }),
            React.createElement(Stat, { icon: "\u2705", value: invoices.filter(function(i) { return i.status === "paid"; }).reduce(function(a, i) { return a + i.amount; }, 0) + "\u20ac", label: "Encaisse", color: COLORS.success }),
            React.createElement(Stat, { icon: "\u23f3", value: pendingCA + "\u20ac", label: "En attente", color: COLORS.warn })
          ),
          invoices.map(function(inv) {
            var fa = users.find(function(u) { return u.id === inv.familyId; });
            return React.createElement(Card, { key: inv.id, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" } },
              React.createElement("div", null,
                React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, (fa ? fa.seniorName : "") + " - " + inv.month),
                React.createElement("div", { style: { fontSize: 12, color: COLORS.sub } }, inv.formula + " - " + inv.visits + " visites")
              ),
              React.createElement("div", { style: { textAlign: "right" } },
                React.createElement("div", { style: { fontWeight: 700, fontSize: 16, color: COLORS.purpleD } }, inv.amount + "\u20ac"),
                React.createElement("div", { style: { fontSize: 11, color: COLORS.success } }, inv.afterCI + "\u20ac apres CI"),
                React.createElement("span", { style: { padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: inv.status === "paid" ? COLORS.successL : COLORS.warnL, color: inv.status === "paid" ? COLORS.success : COLORS.warn } }, inv.status === "paid" ? "Payee" : "En attente")
              )
            );
          })
        )}

        {/* ======== ALERTS ======== */}
        {tab === "alerts" && React.createElement(React.Fragment, null,
          React.createElement("h2", { style: { margin: "0 0 16px", color: COLORS.purpleD, fontSize: 18 } }, "Alertes"),
          alerts.length === 0
            ? React.createElement(Card, { style: { textAlign: "center", padding: 40, color: COLORS.sub } }, "Aucune alerte")
            : alerts.map(function(a) {
              return React.createElement(Card, { key: a.id, style: { borderLeft: "4px solid " + (a.read ? COLORS.brd : COLORS.danger), cursor: "pointer" }, onClick: function() { FS.markAlertRead(a.id); load(); } },
                React.createElement("div", { style: { fontWeight: a.read ? 400 : 600, fontSize: 13 } }, "\ud83d\udea8 " + a.message),
                React.createElement("div", { style: { fontSize: 11, color: COLORS.sub, marginTop: 4 } }, a.date + " a " + a.time)
              );
            }),
          proofs.filter(function(p) { return p.observations && p.observations.alerts && p.observations.alerts.length > 0; }).length > 0 && React.createElement(React.Fragment, null,
            React.createElement("h3", { style: { margin: "20px 0 10px", fontSize: 15, color: COLORS.warn } }, "\u26a0\ufe0f Alertes compagnons"),
            proofs.filter(function(p) { return p.observations && p.observations.alerts && p.observations.alerts.length > 0; }).map(function(p) {
              var fa = users.find(function(u) { return u.id === p.familyId; });
              return React.createElement(Card, { key: p.id, style: { borderLeft: "4px solid " + COLORS.warn } },
                React.createElement("div", { style: { fontWeight: 600, fontSize: 13 } }, (fa ? fa.seniorName : "") + " - " + p.date),
                p.observations.alerts.map(function(a, i) { return React.createElement("div", { key: i, style: { fontSize: 12, color: COLORS.warn, marginTop: 4 } }, "\u26a0\ufe0f " + a); })
              );
            })
          )
        )}
      </div>
    </div>
  );
}
