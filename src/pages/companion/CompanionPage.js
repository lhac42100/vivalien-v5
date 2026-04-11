import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Header, Tabs, Card, Loading, SignaturePad, ObservationForm } from "../../components/UI";
import { COLORS, btnStyle } from "../../utils/constants";
import { getGeoLocation, getNow } from "../../utils/helpers";
import * as FS from "../../services/firestore";

export default function CompanionPage() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("today");
  const [state, setState] = useState("idle");
  const [visits, setVisits] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeVisit, setActiveVisit] = useState(null);
  const [checkInData, setCheckInData] = useState(null);
  const [observations, setObservations] = useState(null);
  const [signMode, setSignMode] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [v, p, u] = await Promise.all([
        FS.getVisits({ companionId: user.id }),
        FS.getVisitProofs({ companionId: user.id }),
        FS.getAllUsers()
      ]);
      setVisits(v); setProofs(p); setUsers(u);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const today = visits.filter(v => v.status === "scheduled" || v.status === "in_progress");
  const history = visits.filter(v => v.status === "completed");
  const getFam = (id) => users.find(u => u.id === id);

  const handleCheckIn = async (visit) => {
    const pos = await getGeoLocation();
    const time = getNow();
    const data = { lat: pos.lat, lng: pos.lng, time, timestamp: new Date().toISOString() };
    setCheckInData(data);
    setActiveVisit(visit);
    await FS.updateVisit(visit.id, { status: "in_progress" });
    await FS.createNotification({ familyId: visit.familyId, type: "start", message: "La visite vient de commencer", time });
    setState("active");
    visit.status = "in_progress";
  };

  const handleObsSave = (data) => {
    setObservations(data);
    setState("signing");
  };

  const handleFinish = async (validationType, signatureData) => {
    const pos = await getGeoLocation();
    const time = getNow();
    const checkOutData = { lat: pos.lat, lng: pos.lng, time, timestamp: new Date().toISOString() };

    await FS.createVisitProof({
      visitId: activeVisit.id,
      companionId: user.id,
      familyId: activeVisit.familyId,
      date: activeVisit.date,
      checkIn: checkInData,
      checkOut: checkOutData,
      validationType,
      signatureData: signatureData || null,
      observations
    });

    await FS.updateVisit(activeVisit.id, { status: "completed" });
    await FS.createNotification({ familyId: activeVisit.familyId, type: "done", message: "Visite terminée. Compte-rendu disponible.", time });

    if (observations?.alerts?.length > 0) {
      const fam = getFam(activeVisit.familyId);
      await FS.createAlert({
        type: "companion_alert",
        message: `Alerte pour ${fam?.seniorName} : ${observations.alerts.join(", ")}`,
        date: activeVisit.date, time
      });
    }

    setState("done");
  };

  const reset = () => {
    setState("idle"); setActiveVisit(null); setCheckInData(null); setObservations(null); setSignMode(null); setTab("today"); load();
  };

  const tabList = [
    { id: "today", icon: "📅", label: "Aujourd'hui", color: COLORS.green },
    { id: "history", icon: "📜", label: "Historique", color: COLORS.green }
  ];

  if (loading) return <><Header title="Vivalien" sub={`Bonjour ${user.name}`} color={COLORS.green} colorD={COLORS.greenD} onLogout={logout} /><Loading /></>;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans',sans-serif" }}>
      <Header title="Vivalien" sub={`Bonjour ${user.name}`} color={COLORS.green} colorD={COLORS.greenD} onLogout={logout} />
      {state === "idle" && <Tabs tabs={tabList} active={tab} onChange={setTab} />}

      <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>

        {/* IDLE - TODAY */}
        {state === "idle" && tab === "today" && <>
          <h2 style={{ margin: "0 0 16px", color: COLORS.greenD, fontSize: 18 }}>Visites du jour</h2>
          {today.length === 0 ? <Card style={{ textAlign: "center", padding: 40, color: COLORS.sub }}>Aucune visite prévue</Card>
            : today.map(v => {
              const fa = getFam(v.familyId);
              return (
                <Card key={v.id} style={{ border: `2px solid ${COLORS.greenM}` }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{fa?.seniorName}</div>
                  <div style={{ fontSize: 13, color: COLORS.sub, margin: "6px 0 14px" }}>📍 {fa?.seniorAddress}<br />🕐 {v.time} — {v.duration}h — {v.formula}</div>
                  <button onClick={() => handleCheckIn(v)} style={{ ...btnStyle, background: COLORS.green, color: "#FFF", width: "100%", padding: 14, fontSize: 15 }}>📍 Démarrer la visite</button>
                </Card>
              );
            })}
        </>}

        {/* IDLE - HISTORY */}
        {state === "idle" && tab === "history" && <>
          <h2 style={{ margin: "0 0 16px", color: COLORS.greenD, fontSize: 18 }}>Historique ({history.length})</h2>
          {history.map(v => {
            const fa = getFam(v.familyId);
            const proof = proofs.find(p => p.visitId === v.id);
            return (
              <Card key={v.id} style={{ opacity: .85 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div><div style={{ fontWeight: 600, fontSize: 14 }}>{fa?.seniorName}</div><div style={{ fontSize: 12, color: COLORS.sub }}>{v.date} — {v.duration}h</div></div>
                  <span style={{ fontSize: 11, color: COLORS.success, fontWeight: 600 }}>✅ Terminée</span>
                </div>
                {proof?.observations && <div style={{ marginTop: 8, padding: 8, background: COLORS.bg, borderRadius: 8, fontSize: 12 }}>
                  {proof.observations.mood} — {proof.observations.physical}
                  {proof.observations.alerts?.length > 0 && <span style={{ marginLeft: 8, color: COLORS.warn }}>⚠️ {proof.observations.alerts.length} alerte(s)</span>}
                </div>}
              </Card>
            );
          })}
        </>}

        {/* ACTIVE */}
        {state === "active" && activeVisit && <>
          <Card style={{ border: `2px solid ${COLORS.green}`, background: `linear-gradient(135deg, ${COLORS.greenL}, #FFF)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.success, animation: "pulse 2s infinite" }} />
              <span style={{ fontWeight: 700, color: COLORS.greenD, fontSize: 16 }}>Visite en cours</span>
            </div>
            <div style={{ fontSize: 14, color: COLORS.sub }}>{getFam(activeVisit.familyId)?.seniorName}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <span style={{ padding: "6px 12px", background: "#FFF", borderRadius: 8, fontSize: 12 }}>📍 Arrivée : {checkInData?.time}</span>
              <span style={{ padding: "6px 12px", background: "#FFF", borderRadius: 8, fontSize: 12 }}>🌍 {checkInData?.lat?.toFixed(4)}, {checkInData?.lng?.toFixed(4)}</span>
            </div>
          </Card>
          <Card>
            <h3 style={{ margin: "0 0 10px", fontSize: 15 }}>Pendant la visite</h3>
            {["📸 Prendre des photos", "📹 Lancer l'appel vidéo", "📝 Rédiger le compte-rendu"].map(a =>
              <div key={a} style={{ padding: "10px 14px", background: COLORS.greenL, borderRadius: 10, fontSize: 13, marginBottom: 6 }}>{a}</div>
            )}
          </Card>
          <button onClick={() => setState("obs")} style={{ ...btnStyle, background: COLORS.orange, color: "#FFF", width: "100%", padding: 16, fontSize: 15 }}>Terminer la visite →</button>
        </>}

        {/* OBSERVATIONS */}
        {state === "obs" && <ObservationForm seniorName={getFam(activeVisit.familyId)?.seniorName} onSave={handleObsSave} />}

        {/* SIGNING */}
        {state === "signing" && <>
          <h2 style={{ margin: "0 0 16px", color: COLORS.greenD, fontSize: 18 }}>Validation</h2>
          {!signMode && <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => setSignMode("sig")} style={{ ...btnStyle, background: "#FFF", border: `2px solid ${COLORS.greenM}`, color: COLORS.greenD, padding: 20, textAlign: "left", borderRadius: 16 }}>
              <div style={{ fontSize: 18 }}>✍️ Signature digitale</div>
              <div style={{ fontSize: 12, color: COLORS.sub, fontWeight: 400, marginTop: 4 }}>Le senior signe sur l'écran</div>
            </button>
            <button onClick={() => setSignMode("btn")} style={{ ...btnStyle, background: "#FFF", border: `2px solid ${COLORS.greenM}`, color: COLORS.greenD, padding: 20, textAlign: "left", borderRadius: 16 }}>
              <div style={{ fontSize: 18 }}>👆 Bouton de validation</div>
              <div style={{ fontSize: 12, color: COLORS.sub, fontWeight: 400, marginTop: 4 }}>Le senior appuie sur un bouton</div>
            </button>
          </div>}
          {signMode === "sig" && <SignaturePad onSave={d => handleFinish("signature", d)} onCancel={() => setSignMode(null)} />}
          {signMode === "btn" && <div style={{ background: "#FFF", borderRadius: 16, padding: 24, textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,.12)" }}>
            <h3 style={{ margin: "0 0 8px" }}>Validation simplifiée</h3>
            <p style={{ color: COLORS.sub, fontSize: 13, marginBottom: 20 }}>Le senior appuie sur le bouton</p>
            <button onClick={() => handleFinish("button", null)} style={{ ...btnStyle, background: COLORS.green, color: "#FFF", padding: "20px 40px", fontSize: 18, borderRadius: 16, width: "100%" }}>
              Je confirme — {getFam(activeVisit.familyId)?.seniorName}
            </button>
          </div>}
        </>}

        {/* DONE */}
        {state === "done" && <Card style={{ border: `2px solid ${COLORS.success}`, textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <h2 style={{ margin: "0 0 8px", color: COLORS.success }}>Visite terminée !</h2>
          <p style={{ color: COLORS.sub, marginBottom: 16 }}>Preuve enregistrée, famille notifiée.</p>
          <button onClick={reset} style={{ ...btnStyle, background: COLORS.green, color: "#FFF", width: "100%", padding: 14 }}>Retour</button>
        </Card>}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}
