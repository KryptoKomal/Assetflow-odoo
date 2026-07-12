import {
<<<<<<< HEAD
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
=======
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
>>>>>>> a2fb0a831ab8e1e36a016395108ef1d61589b50c
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { COLLECTIONS } from "../constants/collections";
import { logActivity } from "./activityLogService";

const usersRef = collection(db, COLLECTIONS.USERS);

<<<<<<< HEAD



export async function createEmployee(data, actorId) {
    const docRef = await addDoc(usersRef, {
        name: data.name,
        email: data.email,
        role: data.role,
        departmentId: data.departmentId || null,
        status: data.status || "active",
        photo: "",
        uid: null, 
        createdAt: serverTimestamp(),
    });
    await logActivity(actorId, `Added employee "${data.name}"`);
    return docRef;
}

export async function updateEmployee(id, data, actorId) {
    const ref = doc(db, COLLECTIONS.USERS, id);
    await updateDoc(ref, {
        name: data.name,
        email: data.email,
        role: data.role,
        departmentId: data.departmentId || null,
        status: data.status,
    });
    await logActivity(actorId, `Updated employee "${data.name}"`);
}

export async function deleteEmployee(id, name, actorId) {
    await deleteDoc(doc(db, COLLECTIONS.USERS, id));
    await logActivity(actorId, `Removed employee "${name}"`);
=======
// Creates a directory-only employee profile (no login account).
// If the person needs to log in themselves, they sign up separately —
// an admin can later link that auth account to this profile by editing the doc's uid.
export async function createEmployee(data, actorId) {
  const docRef = await addDoc(usersRef, {
    name: data.name,
    email: data.email,
    role: data.role,
    departmentId: data.departmentId || null,
    status: data.status || "active",
    photo: "",
    uid: null, // linked later once they have a real Firebase Auth account
    createdAt: serverTimestamp(),
  });
  await logActivity(actorId, `Added employee "${data.name}"`);
  return docRef;
}

export async function updateEmployee(id, data, actorId) {
  const ref = doc(db, COLLECTIONS.USERS, id);
  await updateDoc(ref, {
    name: data.name,
    email: data.email,
    role: data.role,
    departmentId: data.departmentId || null,
    status: data.status,
  });
  await logActivity(actorId, `Updated employee "${data.name}"`);
}

export async function deleteEmployee(id, name, actorId) {
  await deleteDoc(doc(db, COLLECTIONS.USERS, id));
  await logActivity(actorId, `Removed employee "${name}"`);
>>>>>>> a2fb0a831ab8e1e36a016395108ef1d61589b50c
}