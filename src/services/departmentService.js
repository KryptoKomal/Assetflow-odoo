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

const departmentsRef = collection(db, COLLECTIONS.DEPARTMENTS);

export async function createDepartment(data, userId) {
    const docRef = await addDoc(departmentsRef, {
        name: data.name,
        headId: data.headId || null,
        parentDepartment: data.parentDepartment || null,
        status: data.status || "active",
        createdAt: serverTimestamp(),
    });
    await logActivity(userId, `Created department "${data.name}"`);
    return docRef;
}

export async function updateDepartment(id, data, userId) {
    const ref = doc(db, COLLECTIONS.DEPARTMENTS, id);
    await updateDoc(ref, {
        name: data.name,
        headId: data.headId || null,
        parentDepartment: data.parentDepartment || null,
        status: data.status,
    });
    await logActivity(userId, `Updated department "${data.name}"`);
}

export async function deleteDepartment(id, name, userId) {
    await deleteDoc(doc(db, COLLECTIONS.DEPARTMENTS, id));
    await logActivity(userId, `Deleted department "${name}"`);
}