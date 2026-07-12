import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { COLLECTIONS } from "../constants/collections";

// Central helper — every service across the app calls this to record activity
export async function logActivity(userId, action) {
    try {
        await addDoc(collection(db, COLLECTIONS.ACTIVITY_LOGS), {
            userId: userId || "system",
            action,
            date: serverTimestamp(),
        });
    } catch (err) {
        // Activity logging should never block the primary action
        console.error("Failed to log activity:", err);
    }
}