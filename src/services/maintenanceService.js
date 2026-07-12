import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { COLLECTIONS } from "../constants/collections";
import { logActivity } from "./activityLogService";

const maintRef = collection(db, COLLECTIONS.MAINTENANCE_REQUESTS);

export async function createMaintenanceRequest(data, actorId) {
    const docRef = await addDoc(maintRef, {
        assetId: data.assetId,
        employeeId: actorId,
        priority: data.priority,
        issue: data.issue,
        status: "pending",
        assignedTechnician: "",
        createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, COLLECTIONS.ASSETS, data.assetId), { status: "maintenance" });
    await logActivity(actorId, `Raised maintenance request`);
    return docRef;
}

export async function updateMaintenanceStatus(id, status, technician, actorId) {
    const payload = { status };
    if (technician !== undefined) payload.assignedTechnician = technician;
    await updateDoc(doc(db, COLLECTIONS.MAINTENANCE_REQUESTS, id), payload);
    await logActivity(actorId, `Updated maintenance request to "${status}"`);
}

export async function resolveMaintenance(request, actorId) {
    await updateDoc(doc(db, COLLECTIONS.MAINTENANCE_REQUESTS, request.id), { status: "resolved" });
    await updateDoc(doc(db, COLLECTIONS.ASSETS, request.assetId), { status: "available" });
    await logActivity(actorId, `Resolved maintenance request`);
}