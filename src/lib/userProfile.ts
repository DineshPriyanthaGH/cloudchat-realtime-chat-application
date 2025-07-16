import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";

export async function saveUserProfile(user: User) {
  if (!user) return;
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    displayName: user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || "",
  }, { merge: true });
} 