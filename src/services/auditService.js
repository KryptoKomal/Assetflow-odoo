import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { COLLECTIONS } from "../constants/collections";
import { logActivity } from "./activityLogService";

const auditsRef = collection(db, COLLECTIONS.AUDIT_CYCLES);

export async function createAudit(data, actorId) {
    const docRef = await addDoc(auditsRef, {
        department: data.department,
        auditors: data.auditors,
        startDate: data.startDate,
        endDate: data.endDate,
        status: "in-progress",
        createdAt: serverTimestamp(),
    });
    await logActivity(actorId, `Started audit cycle for department`);
    return docRef;
}

export async function completeAudit(id, actorId) {
    await updateDoc(doc(db, COLLECTIONS.AUDIT_CYCLES, id), { status: "completed" });
    await logActivity(actorId, `Completed audit cycle`);
}