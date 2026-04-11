import { db } from "./firebase";
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, addDoc, serverTimestamp, Timestamp
} from "firebase/firestore";

// ============ USERS ============
export async function getUser(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getAllUsers() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
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
export async function getVisits(filters = {}) {
  let q = collection(db, "visits");
  const constraints = [];
  if (filters.companionId) constraints.push(where("companionId", "==", filters.companionId));
  if (filters.familyId) constraints.push(where("familyId", "==", filters.familyId));
  if (filters.status) constraints.push(where("status", "==", filters.status));
  constraints.push(orderBy("date", "desc"));
  const snap = await getDocs(query(q, ...constraints));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAllVisits() {
  const snap = await getDocs(query(collection(db, "visits"), orderBy("date", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createVisit(data) {
  const ref = await addDoc(collection(db, "visits"), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateVisit(id, data) {
  await updateDoc(doc(db, "visits", id), data);
}

// ============ VISIT PROOFS ============
export async function getVisitProofs(filters = {}) {
  let q = collection(db, "visitProofs");
  const constraints = [];
  if (filters.companionId) constraints.push(where("companionId", "==", filters.companionId));
  if (filters.familyId) constraints.push(where("familyId", "==", filters.familyId));
  constraints.push(orderBy("date", "desc"));
  const snap = await getDocs(query(q, ...constraints));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAllVisitProofs() {
  const snap = await getDocs(query(collection(db, "visitProofs"), orderBy("date", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createVisitProof(data) {
  const ref = await addDoc(collection(db, "visitProofs"), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

// ============ INVOICES ============
export async function getInvoices(filters = {}) {
  let q = collection(db, "invoices");
  const constraints = [];
  if (filters.familyId) constraints.push(where("familyId", "==", filters.familyId));
  constraints.push(orderBy("date", "desc"));
  const snap = await getDocs(query(q, ...constraints));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAllInvoices() {
  const snap = await getDocs(query(collection(db, "invoices"), orderBy("date", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createInvoice(data) {
  const ref = await addDoc(collection(db, "invoices"), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateInvoice(id, data) {
  await updateDoc(doc(db, "invoices", id), data);
}

// ============ NOTIFICATIONS ============
export async function getNotifications(familyId) {
  const snap = await getDocs(
    query(collection(db, "notifications"), where("familyId", "==", familyId), orderBy("createdAt", "desc"))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createNotification(data) {
  await addDoc(collection(db, "notifications"), { ...data, read: false, createdAt: serverTimestamp() });
}

export async function markNotificationRead(id) {
  await updateDoc(doc(db, "notifications", id), { read: true });
}

// ============ ALERTS (admin) ============
export async function getAlerts() {
  const snap = await getDocs(query(collection(db, "alerts"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createAlert(data) {
  await addDoc(collection(db, "alerts"), { ...data, read: false, createdAt: serverTimestamp() });
}

export async function markAlertRead(id) {
  await updateDoc(doc(db, "alerts", id), { read: true });
}
