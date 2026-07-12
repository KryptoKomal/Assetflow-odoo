import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { COLLECTIONS } from "../constants/collections";


export async function logActivity(userId, action) {
    try {
        await addDoc(collection(db, COLLECTIONS.ACTIVITY_LOGS), {
            userId: userId || "system",
            action,
            date: serverTimestamp(),
        });
    } catch (err) {
        
        console.error("Failed to log activity:", err);
    }
}