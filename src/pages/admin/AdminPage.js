import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Header, Tabs, Card, Stat, Message, Loading } from "../../components/UI";
import { COLORS, FORMULAS, btnStyle, inputStyle } from "../../utils/constants";
import { exportToCSV } from "../../utils/helpers";
import { adminCreateUser } from "../../services/auth";
import * as FS from "../../services/firestore";

// ============ REPORT CARD ============
function ReportCard({ proof, users }) {
  var co = users.find(function(u) { return u.id === proof.companionId; });
  var fa = users.find(function(u) { return u.id === proof.familyId; });
  var [expanded, setExpanded] = useState(false);

  return React.createElement("div", { style: { background: "#FFF", borderRadius: 16, padding: 0, marginBottom: 14, border: "1px solid " + COLORS.brd, overflow: "hidden" } },
    React.createElement("div", { onClick: function() { setExpanded(!expanded); }, style: { padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: expanded ? COLORS.greenL : "#FFF" } },
      React.createElement("div", null,
        React.createElement("div", { style: { fontWeight: 700, fontSize: 15, color: COLORS.txt } }, (fa ? fa.seniorName : "--") + " \u2014 " + proof.date),
        React.createElement("div", { style: { fontSize: 12, color: COLORS.sub, marginTop: 2 } }, "Compagnon : " + (co ? co.name : "--") + "  \u2022  " + (proof.checkIn ? proof.checkIn.time : "") + " - " + (proof.checkOut ? proof.checkOut.time : "")),
        proof.observations && React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" } },
          React.createElement("span", { style: { padding: "2px 8px", borderRadius: 12, fontSize: 11, background: COLORS.greenL, color: COLORS.green } }, proof.observations.mood),
          React.createElement("span", { style: { padding: "2px 8px", borderRadius: 12, fontSize: 11, background: COLORS.bg, color: COLORS.sub } }, proof.observations.physical),
          proof.observations.alerts && proof.observations.alerts.length > 0 && React.createElement("span", { style: { padding: "2px 8px", borderRadius: 12, fontSize: 11, background: COLORS.warnL, color: COLORS.warn } }, "\u26a0\ufe0f " + proof.observations.alerts.length + " alerte(s)"),
          proof.photos && proof.photos.length > 0 && React.createElement("span", { style: { padding: "2px 8px", borderRadius: 12, fontSize: 11, background: COLORS.blueL, color: COLORS.blue } }, "\ud83d\udcf8 " + proof.photos.length + " photo(s)")
        )
      ),
      React.createElement("span", { style: { fontSize: 20, color: COLORS.sub, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0)" } }, "\u25bc")
    ),
    expanded && React.createElement("div", { style: { padding: "0 20px 20px", borderTop: "1px solid " + COLORS.brd } },
      React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16, fontSize: 12 } },
        React.createElement("div", { style: { padding: 12, background: COLORS.bg, borderRadius: 10 } },
          React.createElement("div", { style: { color: COLORS.sub, fontSize: 10, textTransform: "uppercase" } }, "ARRIVEE"),
          React.createElement("div", { style: { fontWeight: 700, fontSize: 18, color: COLORS.green } }, proof.checkIn ? proof.checkIn.time : "--"),
          React.createElement("div", { style: { fontSize: 10, color: COLORS.sub } }, "\ud83d\udccd " + (proof.checkIn ? proof.checkIn.lat.toFixed(4) + ", " + proof.checkIn.lng.toFixed(4) : "--"))
        ),
        React.createElement("div", { style: { padding: 12, background: COLORS.bg, borderRadius: 10 } },
          React.createElement("div", { style: { color: COLORS.sub, fontSize: 10, textTransform: "uppercase" } }, "DEPART"),
          React.createElement("div", { style: { fontWeight: 700, fontSize: 18, color: COLORS.green } }, proof.checkOut ? proof.checkOut.time : "--"),
          React.createElement("div", { style: { fontSize: 10, color: COLORS.sub } }, "\ud83d\udccd " + (proof.checkOut ? proof.checkOut.lat.toFixed(4) + ", " + proof.checkOut.lng.toFixed(4) : "--"))
        )
      ),
      proof.observations && React.createElement("div", { style: { marginTop: 12, padding: 14, background: COLORS.bg, borderRadius: 10 } },
        React.createElement("div", { style: { fontSize: 12, fontWeight: 600, marginBottom: 8 } }, "Observations"),
        React.createElement("div", { style: { fontSize: 13, marginBottom: 8 } }, React.createElement("span", { style: { color: COLORS.sub } }, "Humeur : "), React.createElement("strong", null, proof.observations.mood), " \u2014 ", React.createElement("span", { style: { color: COLORS.sub } }, "Forme : "), React.createElement("strong", null, proof.observations.physical)),
        proof.observations.notes && React.createElement("div", { style: { fontSize: 13, padding: 10, background: "#FFF", borderRadius: 8, border: "1px solid " + COLORS.brd, lineHeight: 1.5 } }, proof.observations.notes),
        proof.observations.alerts && proof.observations.alerts.length > 0 && React.createElement("div", { style: { marginTop: 8 } }, proof.observations.alerts.map(function(a, i) { return React.createElement("div", { key: i, style: { padding: "6px 10px", background: COLORS.warnL, borderRadius: 8, fontSize: 12, color: COLORS.warn, fontWeight: 600, marginBottom: 4 } }, "\u26a0\ufe0f " + a); }))
      ),
      proof.photos && proof.photos.length > 0 && React.createElement("div", { style: { marginTop: 12 } },
        React.createElement("div", { style: { fontSize: 12, fontWeight: 600, marginBottom: 8 } }, "\ud83d\udcf8 Photos (" + proof.photos.length + ")"),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 } }, proof.photos.map(function(url, i) { return React.createElement("a", { key: i, href: url, target: "_blank", rel: "noopener noreferrer" }, React.createElement("img", { src: url, alt: "Photo", style: { width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 8, border: "1px solid " + COLORS.brd } })); }))
      ),
      React.createElement("div", { style: { marginTop: 12, fontSize: 12, color: COLORS.sub } }, "Validation : " + (proof.validationType === "signature" ? "\u270d\ufe0f Signature" : "\ud83d\udc46 Bouton"))
    )
  );
}

// ============ EDIT USER MODAL ============
function EditUserModal({ userData, companions, onSave, onCancel }) {
  var [form, setForm] = useState({
    name: userData.name || "",
    seniorName: userData.seniorName || "",
    seniorAddress: userData.seniorAddress || "",
    formulaId: userData.formulaId || "essentiel",
    companionId: userData.companionId || ""
  });

  return React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 } },
    React.createElement("div", { style: { background: "#FFF", borderRadius: 20, padding: 28, width: "100%", maxWidth: 500, maxHeight: "90vh", overflow: "auto" } },
      React.createElement("h3", { style: { margin: "0 0 20px", color: COLORS.purpleD, fontSize: 18 } }, "Modifier : " + userData.name),

      React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } },
        React.createElement("div", null,
          React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Nom"),
          React.createElement("input", { value: form.name, onChange: function(e) { setForm({ ...form, name: e.target.value }); }, style: inputStyle })
        ),
        userData.role === "family" && React.createElement(React.Fragment, null,
          React.createElement("div", null,
            React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Nom du senior"),
            React.createElement("input", { value: form.seniorName, onChange: function(e) { setForm({ ...form, seniorName: e.target.value }); }, style: inputStyle })
          ),
          React.createElement("div", null,
            React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Adresse senior"),
            React.createElement("input", { value: form.seniorAddress, onChange: function(e) { setForm({ ...form, seniorAddress: e.target.value }); }, style: inputStyle })
          ),
          React.createElement("div", null,
            React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Formule"),
            React.createElement("select", { value: form.formulaId, onChange: function(e) { setForm({ ...form, formulaId: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } },
              FORMULAS.map(function(f) { return React.createElement("option", { key: f.id, value: f.id }, f.name + " - " + f.frequency); })
            )
          ),
          React.createElement("div", null,
            React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Compagnon attitre"),
            React.createElement("select", { value: form.companionId, onChange: function(e) { setForm({ ...form, companionId: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } },
              React.createElement("option", { value: "" }, "-- Aucun --"),
              companions.map(function(c) { return React.createElement("option", { key: c.id, value: c.id }, c.name); })
            )
          )
        )
      ),

      React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" } },
        React.createElement("button", { onClick: onCancel, style: { ...btnStyle, background: "#F3F2EF", color: COLORS.txt, fontSize: 13 } }, "Annuler"),
        React.createElement("button", { onClick: function() { onSave(form); }, style: { ...btnStyle, background: COLORS.purple, color: "#FFF", fontSize: 13 } }, "Enregistrer")
      )
    )
  );
}

// ============ EDIT VISIT MODAL ============
function EditVisitModal({ visit, companions, families, onSave, onCancel }) {
  var [form, setForm] = useState({
    companionId: visit.companionId || "",
    familyId: visit.familyId || "",
    date: visit.date || "",
    time: visit.time || "09:00",
    duration: visit.duration || 3,
    formula: visit.formula || "Essentiel"
  });

  return React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 } },
    React.createElement("div", { style: { background: "#FFF", borderRadius: 20, padding: 28, width: "100%", maxWidth: 500, maxHeight: "90vh", overflow: "auto" } },
      React.createElement("h3", { style: { margin: "0 0 20px", color: COLORS.purpleD, fontSize: 18 } }, "Modifier la visite"),

      React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } },
        React.createElement("div", null,
          React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Famille / Senior"),
          React.createElement("select", { value: form.familyId, onChange: function(e) { setForm({ ...form, familyId: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } },
            React.createElement("option", { value: "" }, "-- Choisir --"),
            families.map(function(f) { return React.createElement("option", { key: f.id, value: f.id }, (f.seniorName || "") + " (" + f.name + ")"); })
          )
        ),
        React.createElement("div", null,
          React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Compagnon"),
          React.createElement("select", { value: form.companionId, onChange: function(e) { setForm({ ...form, companionId: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } },
            React.createElement("option", { value: "" }, "-- Choisir --"),
            companions.map(function(c) { return React.createElement("option", { key: c.id, value: c.id }, c.name); })
          )
        ),
        React.createElement("div", null,
          React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Date"),
          React.createElement("input", { type: "date", value: form.date, onChange: function(e) { setForm({ ...form, date: e.target.value }); }, style: inputStyle })
        ),
        React.createElement("div", null,
          React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Heure"),
          React.createElement("input", { type: "time", value: form.time, onChange: function(e) { setForm({ ...form, time: e.target.value }); }, style: inputStyle })
        ),
        React.createElement("div", null,
          React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Duree"),
          React.createElement("select", { value: form.duration, onChange: function(e) { setForm({ ...form, duration: Number(e.target.value) }); }, style: { ...inputStyle, cursor: "pointer" } },
            React.createElement("option", { value: 3 }, "3 heures"),
            React.createElement("option", { value: 4 }, "4 heures")
          )
        ),
        React.createElement("div", null,
          React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Formule"),
          React.createElement("select", { value: form.formula, onChange: function(e) { setForm({ ...form, formula: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } },
            FORMULAS.map(function(f) { return React.createElement("option", { key: f.id, value: f.name }, f.name + " - " + f.visit3h + "\u20ac"); })
          )
        )
      ),

      React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" } },
        React.createElement("button", { onClick: onCancel, style: { ...btnStyle, background: "#F3F2EF", color: COLORS.txt, fontSize: 13 } }, "Annuler"),
        React.createElement("button", { onClick: function() { onSave(form); }, style: { ...btnStyle, background: COLORS.purple, color: "#FFF", fontSize: 13 } }, "Enregistrer")
      )
    )
  );
}

// ============ MAIN ADMIN PAGE ============
export default function AdminPage() {
  var auth = useAuth();
  var user = auth.user;
  var logout = auth.logout;
  var [tab, setTab] = useState("dash");
  var [users, setUsers] = useState([]);
  var [visits, setVisits] = useState([]);
  var [proofs, setProofs] = useState([]);
  var [invoices, setInvoices] = useState([]);
  var [alerts, setAlerts] = useState([]);
  var [loading, setLoading] = useState(true);
  var [msg, setMsg] = useState({ text: "", type: "success" });
  var [showCreate, setShowCreate] = useState(false);
  var [nu, setNu] = useState({ name: "", email: "", password: "", role: "companion", seniorName: "", seniorAddress: "", formulaId: "essentiel", companionId: "" });
  var [showCreateVisit, setShowCreateVisit] = useState(false);
  var [nv, setNv] = useState({ familyId: "", companionId: "", date: "", time: "09:00", duration: 3, formula: "Essentiel" });
  var [reportFilter, setReportFilter] = useState("all");
  var [editingUser, setEditingUser] = useState(null);
  var [editingVisit, setEditingVisit] = useState(null);

  var load = async function() {
    setLoading(true);
    try {
      var results = await Promise.all([FS.getAllUsers(), FS.getAllVisits(), FS.getAllVisitProofs(), FS.getAllInvoices(), FS.getAlerts()]);
      setUsers(results[0]); setVisits(results[1]); setProofs(results[2]); setInvoices(results[3]); setAlerts(results[4]);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(function() { load(); }, []);

  var flash = function(text, type) { setMsg({ text: text, type: type || "success" }); setTimeout(function() { setMsg({ text: "", type: "success" }); }, 3000); };

  var createUser = async function() {
    if (!nu.name || !nu.email || !nu.password) { flash("Tous les champs requis", "error"); return; }
    try {
      await adminCreateUser(nu.email, nu.password, nu);
      setNu({ name: "", email: "", password: "", role: "companion", seniorName: "", seniorAddress: "", formulaId: "essentiel", companionId: "" });
      setShowCreate(false); flash("Utilisateur cree !"); await load();
    } catch (e) { flash(e.message, "error"); }
  };

  var handleDeleteUser = async function(uid) {
    if (uid === user.id) return;
    try { await FS.deleteUser(uid); flash("Utilisateur supprime"); await load(); } catch (e) { flash(e.message, "error"); }
  };

  var handleSaveUser = async function(form) {
    try {
      var data = { name: form.name };
      if (editingUser.role === "family") {
        data.seniorName = form.seniorName;
        data.seniorAddress = form.seniorAddress;
        data.formulaId = form.formulaId;
        data.companionId = form.companionId;
      }
      await FS.updateUser(editingUser.id, data);
      setEditingUser(null); flash("Utilisateur modifie !"); await load();
    } catch (e) { flash(e.message, "error"); }
  };

  var createVisit = async function() {
    if (!nv.familyId || !nv.companionId || !nv.date) { flash("Famille, compagnon et date requis", "error"); return; }
    try {
      await FS.createVisit({ familyId: nv.familyId, companionId: nv.companionId, date: nv.date, time: nv.time, duration: Number(nv.duration), formula: nv.formula, status: "scheduled" });
      setNv({ familyId: "", companionId: "", date: "", time: "09:00", duration: 3, formula: "Essentiel" });
      setShowCreateVisit(false); flash("Visite planifiee !"); await load();
    } catch (e) { flash(e.message, "error"); }
  };

  var handleSaveVisit = async function(form) {
    try {
      await FS.updateVisit(editingVisit.id, { companionId: form.companionId, familyId: form.familyId, date: form.date, time: form.time, duration: Number(form.duration), formula: form.formula });
      setEditingVisit(null); flash("Visite modifiee !"); await load();
    } catch (e) { flash(e.message, "error"); }
  };

  var handleDeleteVisit = async function(id) {
    try { await FS.updateVisit(id, { status: "cancelled" }); flash("Visite annulee"); await load(); } catch (e) { flash(e.message, "error"); }
  };

  var handleExport = function() {
    var csv = "Date,Senior,Compagnon,Duree,Formule,Statut,Arrivee,Depart,Humeur,Forme,Photos\n";
    visits.forEach(function(v) {
      var fam = users.find(function(u) { return u.id === v.familyId; });
      var comp = users.find(function(u) { return u.id === v.companionId; });
      var proof = proofs.find(function(p) { return p.visitId === v.id; });
      csv += v.date + "," + (fam && fam.seniorName ? fam.seniorName : "") + "," + (comp ? comp.name : "") + "," + v.duration + "h," + v.formula + "," + v.status + "," + (proof && proof.checkIn ? proof.checkIn.time : "") + "," + (proof && proof.checkOut ? proof.checkOut.time : "") + "," + (proof && proof.observations ? proof.observations.mood : "") + "," + (proof && proof.observations ? proof.observations.physical : "") + "," + (proof && proof.photos ? proof.photos.length : 0) + "\n";
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
  var totalPhotos = proofs.reduce(function(a, p) { return a + (p.photos ? p.photos.length : 0); }, 0);
  var filteredProofs = reportFilter === "all" ? proofs : proofs.filter(function(p) { return p.familyId === reportFilter || p.companionId === reportFilter; });

  var tabList = [
    { id: "dash", icon: "\ud83d\udcca", label: "Dashboard", color: COLORS.purple },
    { id: "users", icon: "\ud83d\udc65", label: "Utilisateurs", color: COLORS.purple },
    { id: "visits", icon: "\ud83d\udccb", label: "Visites", color: COLORS.purple },
    { id: "reports", icon: "\ud83d\udcdd", label: "Comptes-rendus", color: COLORS.purple },
    { id: "invoices", icon: "\ud83d\udcb0", label: "Facturation", color: COLORS.purple },
    { id: "alerts", icon: "\ud83d\udea8", label: "Alertes", color: COLORS.purple, badge: unreadAlerts }
  ];

  if (loading) return React.createElement(React.Fragment, null, React.createElement(Header, { title: "Vivalien Admin", sub: "Bonjour " + user.name, color: COLORS.purple, colorD: COLORS.purpleD, onLogout: logout }), React.createElement(Loading, null));

  return React.createElement("div", { style: { minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans',sans-serif" } },
    React.createElement(Header, { title: "Vivalien Admin", sub: "Bonjour " + user.name, color: COLORS.purple, colorD: COLORS.purpleD, onLogout: logout }),
    React.createElement(Tabs, { tabs: tabList, active: tab, onChange: setTab }),
    React.createElement(Message, { text: msg.text, type: msg.type }),

    // EDIT MODALS
    editingUser && React.createElement(EditUserModal, { userData: editingUser, companions: companions, onSave: handleSaveUser, onCancel: function() { setEditingUser(null); } }),
    editingVisit && React.createElement(EditVisitModal, { visit: editingVisit, companions: companions, families: families, onSave: handleSaveVisit, onCancel: function() { setEditingVisit(null); } }),

    React.createElement("div", { style: { padding: 24, maxWidth: 960, margin: "0 auto" } },

      // ======== DASHBOARD ========
      tab === "dash" && React.createElement(React.Fragment, null,
        React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" } },
          React.createElement(Stat, { icon: "\ud83d\udcb0", value: totalCA + "\u20ac", label: "CA total", color: COLORS.purple }),
          React.createElement(Stat, { icon: "\u23f3", value: pendingCA + "\u20ac", label: "En attente", color: COLORS.warn }),
          React.createElement(Stat, { icon: "\u2705", value: completedVisits, label: "Visites faites", color: COLORS.success }),
          React.createElement(Stat, { icon: "\ud83d\udcc5", value: scheduledVisits, label: "Planifiees", color: COLORS.blue })
        ),
        React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" } },
          React.createElement(Stat, { icon: "\ud83e\udd1d", value: companions.length, label: "Compagnons", color: COLORS.green }),
          React.createElement(Stat, { icon: "\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67", value: families.length, label: "Familles", color: COLORS.blue }),
          React.createElement(Stat, { icon: "\ud83d\udcf8", value: totalPhotos, label: "Photos", color: COLORS.orange }),
          React.createElement(Stat, { icon: "\ud83d\udcc8", value: companions.length > 0 ? (completedVisits / companions.length).toFixed(1) : "\u2014", label: "Visites/comp.", color: COLORS.orange })
        ),
        React.createElement(Card, null,
          React.createElement("h3", { style: { margin: "0 0 12px", fontSize: 15, color: COLORS.purpleD } }, "Taux de remplissage"),
          companions.map(function(co) {
            var n = visits.filter(function(v) { return v.companionId === co.id && v.status === "completed"; }).length;
            var pct = Math.round(n / 40 * 100);
            return React.createElement("div", { key: co.id, style: { marginBottom: 10 } },
              React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 } }, React.createElement("span", { style: { fontWeight: 600 } }, co.name), React.createElement("span", { style: { color: COLORS.sub } }, n + "/40 (" + pct + "%)")),
              React.createElement("div", { style: { height: 8, background: COLORS.brd, borderRadius: 4, overflow: "hidden" } }, React.createElement("div", { style: { height: "100%", width: Math.min(pct, 100) + "%", background: pct > 75 ? COLORS.success : pct > 40 ? COLORS.warn : COLORS.danger, borderRadius: 4 } }))
            );
          })
        ),
        React.createElement("button", { onClick: handleExport, style: { ...btnStyle, background: COLORS.purple, color: "#FFF", width: "100%", marginTop: 8 } }, "\ud83d\udce5 Exporter (CSV)")
      ),

      // ======== USERS ========
      tab === "users" && React.createElement(React.Fragment, null,
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } },
          React.createElement("h2", { style: { margin: 0, color: COLORS.purpleD, fontSize: 18 } }, "Utilisateurs (" + users.length + ")"),
          React.createElement("button", { onClick: function() { setShowCreate(!showCreate); }, style: { ...btnStyle, background: COLORS.purple, color: "#FFF", fontSize: 13 } }, "+ Creer")
        ),
        showCreate && React.createElement(Card, { style: { border: "2px solid " + COLORS.purpleM } },
          React.createElement("h3", { style: { margin: "0 0 14px", color: COLORS.purpleD, fontSize: 15 } }, "Nouvel utilisateur"),
          React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } },
            React.createElement("div", null, React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Nom"), React.createElement("input", { value: nu.name, onChange: function(e) { setNu({ ...nu, name: e.target.value }); }, style: inputStyle, placeholder: "Marie Dupont" })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Email"), React.createElement("input", { value: nu.email, onChange: function(e) { setNu({ ...nu, email: e.target.value }); }, style: inputStyle })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Mot de passe"), React.createElement("input", { value: nu.password, onChange: function(e) { setNu({ ...nu, password: e.target.value }); }, type: "password", style: inputStyle })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Role"), React.createElement("select", { value: nu.role, onChange: function(e) { setNu({ ...nu, role: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } }, React.createElement("option", { value: "companion" }, "Compagnon"), React.createElement("option", { value: "family" }, "Famille"))),
            nu.role === "family" && React.createElement(React.Fragment, null,
              React.createElement("div", null, React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Nom du senior"), React.createElement("input", { value: nu.seniorName, onChange: function(e) { setNu({ ...nu, seniorName: e.target.value }); }, style: inputStyle })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Adresse"), React.createElement("input", { value: nu.seniorAddress, onChange: function(e) { setNu({ ...nu, seniorAddress: e.target.value }); }, style: inputStyle })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Formule"), React.createElement("select", { value: nu.formulaId, onChange: function(e) { setNu({ ...nu, formulaId: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } }, FORMULAS.map(function(f) { return React.createElement("option", { key: f.id, value: f.id }, f.name + " - " + f.frequency); }))),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Compagnon"), React.createElement("select", { value: nu.companionId, onChange: function(e) { setNu({ ...nu, companionId: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } }, React.createElement("option", { value: "" }, "-- Choisir --"), companions.map(function(c) { return React.createElement("option", { key: c.id, value: c.id }, c.name); })))
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
          var assignedComp = u.companionId ? users.find(function(x) { return x.id === u.companionId; }) : null;
          return React.createElement(Card, { key: u.id, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
              React.createElement("div", { style: { width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, background: roleBg } }, roleIcon),
              React.createElement("div", null,
                React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, u.name),
                React.createElement("div", { style: { fontSize: 12, color: COLORS.sub } }, u.email + (u.seniorName ? " \u2022 " + u.seniorName : "")),
                assignedComp && React.createElement("div", { style: { fontSize: 11, color: COLORS.green } }, "\ud83e\udd1d " + assignedComp.name)
              )
            ),
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } },
              React.createElement("span", { style: { padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: roleBg, color: roleColor } }, roleLabel),
              u.id !== user.id && u.role !== "admin" && React.createElement("button", { onClick: function() { setEditingUser(u); }, style: { ...btnStyle, background: COLORS.purpleL, color: COLORS.purple, padding: "4px 10px", fontSize: 11 } }, "\u270f\ufe0f"),
              u.id !== user.id && React.createElement("button", { onClick: function() { handleDeleteUser(u.id); }, style: { ...btnStyle, background: COLORS.dangerL, color: COLORS.danger, padding: "4px 10px", fontSize: 11 } }, "\ud83d\uddd1\ufe0f")
            )
          );
        })
      ),

      // ======== VISITS ========
      tab === "visits" && React.createElement(React.Fragment, null,
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } },
          React.createElement("h2", { style: { margin: 0, color: COLORS.purpleD, fontSize: 18 } }, "Visites (" + activeVisits.length + ")"),
          React.createElement("button", { onClick: function() { setShowCreateVisit(!showCreateVisit); }, style: { ...btnStyle, background: COLORS.purple, color: "#FFF", fontSize: 13 } }, "+ Planifier")
        ),
        showCreateVisit && React.createElement(Card, { style: { border: "2px solid " + COLORS.purpleM } },
          React.createElement("h3", { style: { margin: "0 0 14px", color: COLORS.purpleD, fontSize: 15 } }, "Nouvelle visite"),
          React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } },
            React.createElement("div", null, React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Famille"), React.createElement("select", { value: nv.familyId, onChange: function(e) { setNv({ ...nv, familyId: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } }, React.createElement("option", { value: "" }, "-- Choisir --"), families.map(function(f) { return React.createElement("option", { key: f.id, value: f.id }, (f.seniorName || "") + " (" + f.name + ")"); }))),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Compagnon"), React.createElement("select", { value: nv.companionId, onChange: function(e) { setNv({ ...nv, companionId: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } }, React.createElement("option", { value: "" }, "-- Choisir --"), companions.map(function(c) { return React.createElement("option", { key: c.id, value: c.id }, c.name); }))),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Date"), React.createElement("input", { type: "date", value: nv.date, onChange: function(e) { setNv({ ...nv, date: e.target.value }); }, style: inputStyle })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Heure"), React.createElement("input", { type: "time", value: nv.time, onChange: function(e) { setNv({ ...nv, time: e.target.value }); }, style: inputStyle })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Duree"), React.createElement("select", { value: nv.duration, onChange: function(e) { setNv({ ...nv, duration: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } }, React.createElement("option", { value: 3 }, "3h"), React.createElement("option", { value: 4 }, "4h"))),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: COLORS.sub } }, "Formule"), React.createElement("select", { value: nv.formula, onChange: function(e) { setNv({ ...nv, formula: e.target.value }); }, style: { ...inputStyle, cursor: "pointer" } }, FORMULAS.map(function(f) { return React.createElement("option", { key: f.id, value: f.name }, f.name); })))
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
              React.createElement("div", { style: { fontSize: 12, color: COLORS.sub } }, v.date + " a " + v.time + " - " + v.duration + "h - " + (co ? co.name : "--") + " - " + v.formula)
            ),
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } },
              React.createElement("span", { style: { padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: statusBg, color: statusColor } }, statusLabel),
              v.status === "scheduled" && React.createElement("button", { onClick: function() { setEditingVisit(v); }, style: { ...btnStyle, background: COLORS.purpleL, color: COLORS.purple, padding: "4px 10px", fontSize: 11 } }, "\u270f\ufe0f"),
              v.status === "scheduled" && React.createElement("button", { onClick: function() { handleDeleteVisit(v.id); }, style: { ...btnStyle, background: COLORS.dangerL, color: COLORS.danger, padding: "4px 10px", fontSize: 11 } }, "\u2715")
            )
          );
        })
      ),

      // ======== REPORTS ========
      tab === "reports" && React.createElement(React.Fragment, null,
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
          React.createElement("h2", { style: { margin: 0, color: COLORS.purpleD, fontSize: 18 } }, "Comptes-rendus (" + filteredProofs.length + ")"),
          React.createElement("select", { value: reportFilter, onChange: function(e) { setReportFilter(e.target.value); }, style: { ...inputStyle, width: "auto", minWidth: 200, marginTop: 0 } },
            React.createElement("option", { value: "all" }, "Tous"),
            React.createElement("optgroup", { label: "Par senior" }, families.map(function(f) { return React.createElement("option", { key: f.id, value: f.id }, f.seniorName || f.name); })),
            React.createElement("optgroup", { label: "Par compagnon" }, companions.map(function(c) { return React.createElement("option", { key: c.id, value: c.id }, c.name); }))
          )
        ),
        React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" } },
          React.createElement(Stat, { icon: "\ud83d\udcdd", value: filteredProofs.length, label: "Rapports", color: COLORS.purple }),
          React.createElement(Stat, { icon: "\ud83d\udcf8", value: filteredProofs.reduce(function(a, p) { return a + (p.photos ? p.photos.length : 0); }, 0), label: "Photos", color: COLORS.orange }),
          React.createElement(Stat, { icon: "\u26a0\ufe0f", value: filteredProofs.filter(function(p) { return p.observations && p.observations.alerts && p.observations.alerts.length > 0; }).length, label: "Alertes", color: COLORS.warn })
        ),
        filteredProofs.length === 0 ? React.createElement(Card, { style: { textAlign: "center", padding: 40, color: COLORS.sub } }, "Aucun compte-rendu") : filteredProofs.map(function(p) { return React.createElement(ReportCard, { key: p.id, proof: p, users: users }); })
      ),

      // ======== INVOICES ========
      tab === "invoices" && React.createElement(React.Fragment, null,
        React.createElement("h2", { style: { margin: "0 0 16px", color: COLORS.purpleD, fontSize: 18 } }, "Facturation"),
        React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" } },
          React.createElement(Stat, { icon: "\ud83d\udcb0", value: totalCA + "\u20ac", label: "CA total", color: COLORS.purple }),
          React.createElement(Stat, { icon: "\u2705", value: invoices.filter(function(i) { return i.status === "paid"; }).reduce(function(a, i) { return a + i.amount; }, 0) + "\u20ac", label: "Encaisse", color: COLORS.success }),
          React.createElement(Stat, { icon: "\u23f3", value: pendingCA + "\u20ac", label: "En attente", color: COLORS.warn })
        ),
        invoices.map(function(inv) {
          var fa = users.find(function(u) { return u.id === inv.familyId; });
          return React.createElement(Card, { key: inv.id, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" } },
            React.createElement("div", null, React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, (fa ? fa.seniorName : "") + " - " + inv.month), React.createElement("div", { style: { fontSize: 12, color: COLORS.sub } }, inv.formula + " - " + inv.visits + " visites")),
            React.createElement("div", { style: { textAlign: "right" } }, React.createElement("div", { style: { fontWeight: 700, fontSize: 16, color: COLORS.purpleD } }, inv.amount + "\u20ac"), React.createElement("div", { style: { fontSize: 11, color: COLORS.success } }, inv.afterCI + "\u20ac apres CI"), React.createElement("span", { style: { padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: inv.status === "paid" ? COLORS.successL : COLORS.warnL, color: inv.status === "paid" ? COLORS.success : COLORS.warn } }, inv.status === "paid" ? "Payee" : "En attente"))
          );
        })
      ),

      // ======== ALERTS ========
      tab === "alerts" && React.createElement(React.Fragment, null,
        React.createElement("h2", { style: { margin: "0 0 16px", color: COLORS.purpleD, fontSize: 18 } }, "Alertes"),
        alerts.length === 0 ? React.createElement(Card, { style: { textAlign: "center", padding: 40, color: COLORS.sub } }, "Aucune alerte") : alerts.map(function(a) {
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
      )
    )
  );
}
