import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { getUser, createUser } from "./firestore";

export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const userData = await getUser(cred.user.uid);
  if (!userData) throw new Error("Utilisateur non trouvé dans la base");
  return userData;
}

export async function logout() {
  await signOut(auth);
}

export async function adminCreateUser(email, password, userData) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await createUser(cred.user.uid, {
    email,
    name: userData.name,
    role: userData.role,
    ...(userData.role === "family" ? {
      seniorName: userData.seniorName || "",
      seniorAddress: userData.seniorAddress || "",
      seniorLat: userData.seniorLat || 0,
      seniorLng: userData.seniorLng || 0,
      formulaId: userData.formulaId || "essentiel",
      companionId: userData.companionId || ""
    } : {})
  });
  return cred.user.uid;
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userData = await getUser(firebaseUser.uid);
      callback(userData);
    } else {
      callback(null);
    }
  });
}
