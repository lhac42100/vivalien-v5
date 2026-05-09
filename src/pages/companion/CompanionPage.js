import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Header, Tabs, Card, Loading, SignaturePad, ObservationForm } from "../../components/UI";
import { COLORS, btnStyle } from "../../utils/constants";
import { getGeoLocation, getNow } from "../../utils/helpers";
import * as FS from "../../services/firestore";

function PhotoCapture({ photos, onAdd, onRemove }) {
  var fileRef = useRef(null);
  var [uploading, setUploading] = useState(false);

  var handleFiles = function(e) {
    var files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploading(true);
      var newPhotos = files.map(function(f) {
        return { file: f, preview: URL.createObjectURL(f), name: f.name };
      });
      onAdd(newPhotos);
      setUploading(false);
    }
    e.target.value = "";
  };

  return React.createElement("div", { style: { background: "#FFF", borderRadius: 16, padding: 20, border: "1px solid " + COLORS.brd, marginBottom: 16 } },
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } },
      React.createElement("h3", { style: { margin: 0, fontSize: 16, color: COLORS.txt } }, "\ud83d\udcf8 Photos de la visite"),
      React.createElement("span", { style: { fontSize: 13, color: COLORS.sub } }, photos.length + " photo(s)")
    ),

    photos.length > 0 && React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 } },
      photos.map(function(photo, i) {
        return React.createElement("div", { key: i, style: { position: "relative", borderRadius: 10, overflow: "hidden", aspectRatio: "1", background: COLORS.bg } },
          React.createElement("img", { src: photo.preview || photo.url, alt: "Photo " + (i + 1), style: { width: "100%", height: "100%", objectFit: "cover" } }),
          React.createElement("button", {
            onClick: function() { onRemove(i); },
            style: { position: "absolute", top: 4, right: 4, width: 24, height: 24, borderRadius: "50%", background: "rgba(220,38,38,0.9)", color: "#FFF", border: "none", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
          }, "\u2715")
        );
      })
    ),

    React.createElement("input", { ref: fileRef, type: "file", accept: "image/*", multiple: true, capture: "environment", onChange: handleFiles, style: { display: "none" } }),

    React.createElement("div", { style: { display: "flex", gap: 8 } },
      React.createElement("button", {
        onClick: function() { fileRef.current.setAttribute("capture", "environment"); fileRef.current.click(); },
        disabled: uploading,
        style: { ...btnStyle, flex: 1, background: COLORS.greenL, color: COLORS.green, padding: "14px 16px", fontSize: 14 }
      }, "\ud83d\udcf7 Prendre une photo"),
      React.createElement("button", {
        onClick: function() { fileRef.current.removeAttribute("capture"); fileRef.current.click(); },
        disabled: uploading,
        style: { ...btnStyle, flex: 1, background: COLORS.bg, color: COLORS.txt, padding: "14px 16px", fontSize: 14 }
      }, "\ud83d\uddbc\ufe0f Galerie")
    ),

    uploading && React.createElement("div", { style: { textAlign: "center", marginTop: 8, fontSize: 13, color: COLORS.sub } }, "Upload en cours...")
  );
}

export default function CompanionPage() {
  var auth = useAuth();
  var user = auth.user;
  var logout = auth.logout;
  var [state, setState] = useState("idle");
  var [tab, setTab] = useState("today");
  var [visits, setVisits] = useState([]);
  var [proofs, setProofs] = useState([]);
  var [users, setUsers] = useState([]);
  var [activeVisit, setActiveVisit] = useState(null);
  var [checkInData, setCheckInData] = useState(null);
  var [observations, setObservations] = useState(null);
  var [signMode, setSignMode] = useState(null);
  var [photos, setPhotos] = useState([]);
  var [uploadingPhotos, setUploadingPhotos] = useState(false);
  var [loading, setLoading] = useState(true);

  var load = async function() {
    setLoading(true);
    try {
      var results = await Promise.all([
        FS.getVisits({ companionId: user.id }),
        FS.getVisitProofs({ companionId: user.id }),
        FS.getAllUsers()
      ]);
      setVisits(results[0]); setProofs(results[1]); setUsers(results[2]);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(function() { load(); }, []);

  var today = visits.filter(function(v) { return v.status === "scheduled" || v.status === "in_progress"; });
  var history = visits.filter(function(v) { return v.status === "completed"; });
  var getFam = function(id) { return users.find(function(u) { return u.id === id; }); };

  var handleCheckIn = async function(visit) {
    var pos = await getGeoLocation();
    var time = getNow();
    var data = { lat: pos.lat, lng: pos.lng, time: time, timestamp: new Date().toISOString() };
    setCheckInData(data);
    setActiveVisit(visit);
    await FS.updateVisit(visit.id, { status: "in_progress" });
    await FS.createNotification({ familyId: visit.familyId, type: "start", message: "La visite vient de commencer", time: time });
    setState("active");
    visit.status = "in_progress";
  };

  var handleAddPhotos = function(newPhotos) {
    setPhotos(function(prev) { return prev.concat(newPhotos); });
  };

  var handleRemovePhoto = function(index) {
    setPhotos(function(prev) { return prev.filter(function(_, i) { return i !== index; }); });
  };

  var handleObsSave = function(data) {
    setObservations(data);
    setState("signing");
  };

  var handleFinish = async function(validationType, signatureData) {
    setUploadingPhotos(true);

    var photoUrls = [];
    if (photos.length > 0) {
      var files = photos.map(function(p) { return p.file; }).filter(Boolean);
      if (files.length > 0) {
        photoUrls = await FS.uploadMultiplePhotos(activeVisit.id, files);
      }
    }

    var pos = await getGeoLocation();
    var time = getNow();
    var checkOutData = { lat: pos.lat, lng: pos.lng, time: time, timestamp: new Date().toISOString() };

    await FS.createVisitProof({
      visitId: activeVisit.id,
      companionId: user.id,
      familyId: activeVisit.familyId,
      date: activeVisit.date,
      checkIn: checkInData,
      checkOut: checkOutData,
      validationType: validationType,
      signatureData: signatureData || null,
      observations: observations,
      photos: photoUrls
    });

    await FS.updateVisit(activeVisit.id, { status: "completed" });
    await FS.createNotification({ familyId: activeVisit.familyId, type: "done", message: "Visite terminee. Compte-rendu disponible.", time: time });

    if (observations && observations.alerts && observations.alerts.length > 0) {
      var fam = getFam(activeVisit.familyId);
      await FS.createAlert({
        type: "companion_alert",
        message: "Alerte pour " + (fam ? fam.seniorName : "") + " : " + observations.alerts.join(", "),
        date: activeVisit.date, time: time
      });
    }

    setUploadingPhotos(false);
    setState("done");
  };

  var reset = function() {
    setState("idle"); setActiveVisit(null); setCheckInData(null); setObservations(null); setSignMode(null); setPhotos([]); setTab("today"); load();
  };

  var tabList = [
    { id: "today", icon: "\ud83d\udcc5", label: "Aujourd'hui", color: COLORS.green },
    { id: "history", icon: "\ud83d\udcdc", label: "Historique", color: COLORS.green }
  ];

  if (loading) return React.createElement(React.Fragment, null,
    React.createElement(Header, { title: "Vivalien", sub: "Bonjour " + user.name, color: COLORS.green, colorD: COLORS.greenD, onLogout: logout }),
    React.createElement(Loading, null)
  );

  return React.createElement("div", { style: { minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans',sans-serif" } },
    React.createElement(Header, { title: "Vivalien", sub: "Bonjour " + user.name, color: COLORS.green, colorD: COLORS.greenD, onLogout: logout }),
    state === "idle" && React.createElement(Tabs, { tabs: tabList, active: tab, onChange: setTab }),

    React.createElement("div", { style: { padding: 24, maxWidth: 600, margin: "0 auto" } },

      // IDLE - TODAY
      state === "idle" && tab === "today" && React.createElement(React.Fragment, null,
        React.createElement("h2", { style: { margin: "0 0 16px", color: COLORS.greenD, fontSize: 18 } }, "Visites du jour"),
        today.length === 0
          ? React.createElement(Card, { style: { textAlign: "center", padding: 40, color: COLORS.sub } }, "Aucune visite prevue")
          : today.map(function(v) {
            var fa = getFam(v.familyId);
            return React.createElement(Card, { key: v.id, style: { border: "2px solid " + COLORS.greenM } },
              React.createElement("div", { style: { fontWeight: 700, fontSize: 16 } }, fa ? fa.seniorName : "--"),
              React.createElement("div", { style: { fontSize: 13, color: COLORS.sub, margin: "6px 0 14px" } }, "\ud83d\udccd " + (fa ? fa.seniorAddress : "") + "\n\ud83d\udd50 " + v.time + " \u2014 " + v.duration + "h \u2014 " + v.formula),
              React.createElement("button", { onClick: function() { handleCheckIn(v); }, style: { ...btnStyle, background: COLORS.green, color: "#FFF", width: "100%", padding: 14, fontSize: 15 } }, "\ud83d\udccd Demarrer la visite")
            );
          })
      ),

      // IDLE - HISTORY
      state === "idle" && tab === "history" && React.createElement(React.Fragment, null,
        React.createElement("h2", { style: { margin: "0 0 16px", color: COLORS.greenD, fontSize: 18 } }, "Historique (" + history.length + ")"),
        history.map(function(v) {
          var fa = getFam(v.familyId);
          var proof = proofs.find(function(p) { return p.visitId === v.id; });
          return React.createElement(Card, { key: v.id, style: { opacity: 0.85 } },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between" } },
              React.createElement("div", null,
                React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, fa ? fa.seniorName : "--"),
                React.createElement("div", { style: { fontSize: 12, color: COLORS.sub } }, v.date + " \u2014 " + v.duration + "h")
              ),
              React.createElement("span", { style: { fontSize: 11, color: COLORS.success, fontWeight: 600 } }, "\u2705 Terminee")
            ),
            proof && proof.observations && React.createElement("div", { style: { marginTop: 8, padding: 8, background: COLORS.bg, borderRadius: 8, fontSize: 12 } },
              proof.observations.mood + " \u2014 " + proof.observations.physical,
              proof.observations.alerts && proof.observations.alerts.length > 0 && React.createElement("span", { style: { marginLeft: 8, color: COLORS.warn } }, "\u26a0\ufe0f " + proof.observations.alerts.length + " alerte(s)")
            ),
            proof && proof.photos && proof.photos.length > 0 && React.createElement("div", { style: { marginTop: 8, display: "flex", gap: 4 } },
              proof.photos.slice(0, 4).map(function(url, i) {
                return React.createElement("img", { key: i, src: url, alt: "Photo", style: { width: 50, height: 50, objectFit: "cover", borderRadius: 6 } });
              }),
              proof.photos.length > 4 && React.createElement("div", { style: { width: 50, height: 50, borderRadius: 6, background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: COLORS.sub } }, "+" + (proof.photos.length - 4))
            )
          );
        })
      ),

      // ACTIVE
      state === "active" && activeVisit && React.createElement(React.Fragment, null,
        React.createElement(Card, { style: { border: "2px solid " + COLORS.green, background: "linear-gradient(135deg, " + COLORS.greenL + ", #FFF)" } },
          React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 } },
            React.createElement("div", { style: { width: 10, height: 10, borderRadius: "50%", background: COLORS.success, animation: "pulse 2s infinite" } }),
            React.createElement("span", { style: { fontWeight: 700, color: COLORS.greenD, fontSize: 16 } }, "Visite en cours")
          ),
          React.createElement("div", { style: { fontSize: 14, color: COLORS.sub } }, getFam(activeVisit.familyId) ? getFam(activeVisit.familyId).seniorName : ""),
          React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" } },
            React.createElement("span", { style: { padding: "6px 12px", background: "#FFF", borderRadius: 8, fontSize: 12 } }, "\ud83d\udccd Arrivee : " + (checkInData ? checkInData.time : "")),
            React.createElement("span", { style: { padding: "6px 12px", background: "#FFF", borderRadius: 8, fontSize: 12 } }, "\ud83c\udf0d " + (checkInData ? checkInData.lat.toFixed(4) + ", " + checkInData.lng.toFixed(4) : ""))
          )
        ),

        React.createElement(PhotoCapture, { photos: photos, onAdd: handleAddPhotos, onRemove: handleRemovePhoto }),

        React.createElement(Card, null,
          React.createElement("h3", { style: { margin: "0 0 10px", fontSize: 15 } }, "Actions"),
          React.createElement("div", { style: { padding: "10px 14px", background: COLORS.greenL, borderRadius: 10, fontSize: 13, marginBottom: 6 } }, "\ud83d\udcf9 Lancer l'appel video avec la famille"),
          React.createElement("div", { style: { padding: "10px 14px", background: COLORS.greenL, borderRadius: 10, fontSize: 13 } }, "\ud83d\udcdd Rediger le compte-rendu")
        ),

        React.createElement("button", { onClick: function() { setState("obs"); }, style: { ...btnStyle, background: COLORS.orange, color: "#FFF", width: "100%", padding: 16, fontSize: 15 } }, "Terminer la visite \u2192")
      ),

      // OBSERVATIONS
      state === "obs" && React.createElement(ObservationForm, { seniorName: getFam(activeVisit.familyId) ? getFam(activeVisit.familyId).seniorName : "", onSave: handleObsSave }),

      // SIGNING
      state === "signing" && React.createElement(React.Fragment, null,
        React.createElement("h2", { style: { margin: "0 0 16px", color: COLORS.greenD, fontSize: 18 } }, "Validation"),
        !signMode && React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
          React.createElement("button", { onClick: function() { setSignMode("sig"); }, style: { ...btnStyle, background: "#FFF", border: "2px solid " + COLORS.greenM, color: COLORS.greenD, padding: 20, textAlign: "left", borderRadius: 16 } },
            React.createElement("div", { style: { fontSize: 18 } }, "\u270d\ufe0f Signature digitale"),
            React.createElement("div", { style: { fontSize: 12, color: COLORS.sub, fontWeight: 400, marginTop: 4 } }, "Le senior signe sur l'ecran")
          ),
          React.createElement("button", { onClick: function() { setSignMode("btn"); }, style: { ...btnStyle, background: "#FFF", border: "2px solid " + COLORS.greenM, color: COLORS.greenD, padding: 20, textAlign: "left", borderRadius: 16 } },
            React.createElement("div", { style: { fontSize: 18 } }, "\ud83d\udc46 Bouton de validation"),
            React.createElement("div", { style: { fontSize: 12, color: COLORS.sub, fontWeight: 400, marginTop: 4 } }, "Le senior appuie sur un bouton")
          )
        ),
        signMode === "sig" && React.createElement(SignaturePad, { onSave: function(d) { handleFinish("signature", d); }, onCancel: function() { setSignMode(null); } }),
        signMode === "btn" && React.createElement("div", { style: { background: "#FFF", borderRadius: 16, padding: 24, textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,.12)" } },
          React.createElement("h3", { style: { margin: "0 0 8px" } }, "Validation simplifiee"),
          React.createElement("p", { style: { color: COLORS.sub, fontSize: 13, marginBottom: 20 } }, "Le senior appuie sur le bouton"),
          React.createElement("button", { onClick: function() { handleFinish("button", null); }, style: { ...btnStyle, background: COLORS.green, color: "#FFF", padding: "20px 40px", fontSize: 18, borderRadius: 16, width: "100%" } },
            "Je confirme \u2014 " + (getFam(activeVisit.familyId) ? getFam(activeVisit.familyId).seniorName : ""))
        )
      ),

      // DONE
      state === "done" && React.createElement(Card, { style: { border: "2px solid " + COLORS.success, textAlign: "center", padding: 32 } },
        React.createElement("div", { style: { fontSize: 48, marginBottom: 12 } }, "\u2705"),
        React.createElement("h2", { style: { margin: "0 0 8px", color: COLORS.success } }, "Visite terminee !"),
        React.createElement("p", { style: { color: COLORS.sub, marginBottom: 8 } }, "Preuve enregistree, famille notifiee."),
        photos.length > 0 && React.createElement("p", { style: { color: COLORS.success, fontSize: 13, marginBottom: 8 } }, "\ud83d\udcf8 " + photos.length + " photo(s) envoyee(s)"),
        React.createElement("button", { onClick: reset, style: { ...btnStyle, background: COLORS.green, color: "#FFF", width: "100%", padding: 14 } }, "Retour")
      ),

      // UPLOADING OVERLAY
      uploadingPhotos && React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 } },
        React.createElement("div", { style: { background: "#FFF", borderRadius: 20, padding: 40, textAlign: "center" } },
          React.createElement("div", { style: { width: 40, height: 40, border: "4px solid " + COLORS.brd, borderTop: "4px solid " + COLORS.green, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" } }),
          React.createElement("p", { style: { fontWeight: 600, color: COLORS.txt } }, "Envoi des photos en cours..."),
          React.createElement("p", { style: { fontSize: 13, color: COLORS.sub } }, "Veuillez patienter")
        )
      )
    ),
    React.createElement("style", null, "@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}} @keyframes spin{to{transform:rotate(360deg)}}")
  );
}
