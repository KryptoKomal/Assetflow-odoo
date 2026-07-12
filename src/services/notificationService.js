import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { COLLECTIONS } from "../constants/collections";

export async function pushNotification(userId, title, message) {
    await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
        userId, title, message, read: false, createdAt: serverTimestamp(),
    });
}

export async function markAsRead(id) {
    await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id), { read: true });
}