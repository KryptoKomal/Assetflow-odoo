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

const categoriesRef = collection(db, COLLECTIONS.ASSET_CATEGORIES);

export async function createCategory(data, actorId) {
    const docRef = await addDoc(categoriesRef, {
        name: data.name,
        description: data.description || "",
        warranty: Number(data.warranty) || 0, 
        createdAt: serverTimestamp(),
    });
    await logActivity(actorId, `Created asset category "${data.name}"`);
    return docRef;
}

export async function updateCategory(id, data, actorId) {
    const ref = doc(db, COLLECTIONS.ASSET_CATEGORIES, id);
    await updateDoc(ref, {
        name: data.name,
        description: data.description || "",
        warranty: Number(data.warranty) || 0,
    });
    await logActivity(actorId, `Updated asset category "${data.name}"`);
}

export async function deleteCategory(id, name, actorId) {
    await deleteDoc(doc(db, COLLECTIONS.ASSET_CATEGORIES, id));
    await logActivity(actorId, `Deleted asset category "${name}"`);
}