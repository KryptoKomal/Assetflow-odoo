import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { COLLECTIONS } from "../constants/collections";
import { logActivity } from "./activityLogService";

const usersRef = collection(db, COLLECTIONS.USERS);




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
}