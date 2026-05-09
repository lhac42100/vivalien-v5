import { db, storage } from "./firebase";
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, addDoc, serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ============ PHOTOS ============
export async function uploadVisitPhoto(visitId, file) {
  var timestamp = Date.now();
  var filename = "visits/" + visitId + "/" + timestamp + "_" + file.name;
  var storageRef = ref(storage, filename);
  await uploadBytes(storageRef, file);
  var url = await getDownloadURL(storageRef);
  return url;
}

export async function uploadMultiplePhotos(visitId, files) {
  var urls = [];
  for (var i = 0; i < files.length; i++) {
    var url = await uploadVisitPhoto(visitId, files[i]);
    urls.push(url);
  }
  return urls;
}

// ============ USERS ============
export async function getUser(uid) {
  var snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getAllUsers() {
  var snap = await getDocs(collection(db, "users"));
  return snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
}

export async function createUser(uid, data) {
  await setDoc(doc(db, "users", uid), { ...data, createdAt: serverTimestamp() });
}

export async function updateUser(uid, data) {
  await updateDoc(doc(db, "users", uid), data);
}

export async function deleteUser(uid) {
  await deleteDoc(doc(db, "users", uid));
}

// ============ VISITS ============
export async function getVisits(filters) {
  var q = collection(db, "visits");
  var constraints = [];
  if (filters && filters.companionId) constraints.push(where("companionId", "==", filters.companionId));
  if (filters && filters.familyId) constraints.push(where("familyId", "==", filters.familyId));
  if (filters && filters.status) constraints.push(where("status", "==", filters.status));
  constraints.push(orderBy("date", "desc"));
  var snap = await getDocs(query(q, ...constraints));
  return snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
}

export async function getAllVisits() {
  var snap = await getDocs(query(collection(db, "visits"), orderBy("date", "desc")));
  return snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
}

export async function createVisit(data) {
  var r = await addDoc(collection(db, "visits"), { ...data, createdAt: serverTimestamp() });
  return r.id;
}

export async function updateVisit(id, data) {
  await updateDoc(doc(db, "visits", id), data);
}

// ============ VISIT PROOFS ============
export async function getVisitProofs(filters) {
  var q = collection(db, "visitProofs");
  var constraints = [];
  if (filters && filters.companionId) constraints.push(where("companionId", "==", filters.companionId));
  if (filters && filters.familyId) constraints.push(where("familyId", "==", filters.familyId));
  constraints.push(orderBy("date", "desc"));
  var snap = await getDocs(query(q, ...constraints));
  return snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
}

export async function getAllVisitProofs() {
  var snap = await getDocs(query(collection(db, "visitProofs"), orderBy("date", "desc")));
  return snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
}

export async function createVisitProof(data) {
  var r = await addDoc(collection(db, "visitProofs"), { ...data, createdAt: serverTimestamp() });
  return r.id;
}

// ============ INVOICES ============
export async function getInvoices(filters) {
  var q = collection(db, "invoices");
  var constraints = [];
  if (filters && filters.familyId) constraints.push(where("familyId", "==", filters.familyId));
  constraints.push(orderBy("date", "desc"));
  var snap = await getDocs(query(q, ...constraints));
  return snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
}

export async function getAllInvoices() {
  var snap = await getDocs(query(collection(db, "invoices"), orderBy("date", "desc")));
  return snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
}

export async function createInvoice(data) {
  var r = await addDoc(collection(db, "invoices"), { ...data, createdAt: serverTimestamp() });
  return r.id;
}

export async function updateInvoice(id, data) {
  await updateDoc(doc(db, "invoices", id), data);
}

// ============ NOTIFICATIONS ============
export async function getNotifications(familyId) {
  var snap = await getDocs(
    query(collection(db, "notifications"), where("familyId", "==", familyId), orderBy("createdAt", "desc"))
  );
  return snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
}

export async function createNotification(data) {
  await addDoc(collection(db, "notifications"), { ...data, read: false, createdAt: serverTimestamp() });
}

export async function markNotificationRead(id) {
  await updateDoc(doc(db, "notifications", id), { read: true });
}

// ============ ALERTS ============
export async function getAlerts() {
  var snap = await getDocs(query(collection(db, "alerts"), orderBy("createdAt", "desc")));
  return snap.docs.map(function(d) { return { id: d.id, ...d.data() }; });
}

export async function createAlert(data) {
  await addDoc(collection(db, "alerts"), { ...data, read: false, createdAt: serverTimestamp() });
}

export async function markAlertRead(id) {
  await updateDoc(doc(db, "alerts", id), { read: true });
}
