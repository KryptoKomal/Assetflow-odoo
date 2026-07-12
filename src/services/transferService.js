import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { COLLECTIONS } from "../constants/collections";
import { logActivity } from "./activityLogService";

const transfersRef = collection(db, COLLECTIONS.TRANSFER_REQUESTS);

export async function createTransferRequest(data, actorId) {
    const docRef = await addDoc(transfersRef, {
        assetId: data.assetId,
        fromEmployeeId: data.fromEmployeeId,
        toEmployeeId: data.toEmployeeId,
        reason: data.reason || "",
        status: "pending",
        createdAt: serverTimestamp(),
    });
    await logActivity(actorId, `Requested asset transfer`);
    return docRef;
}

export async function approveTransfer(transfer, actorId) {
    await updateDoc(doc(db, COLLECTIONS.TRANSFER_REQUESTS, transfer.id), { status: "approved" });
    await updateDoc(doc(db, COLLECTIONS.ASSETS, transfer.assetId), { allocatedTo: transfer.toEmployeeId });
    await logActivity(actorId, `Approved asset transfer`);
}

export async function rejectTransfer(id, actorId) {
    await updateDoc(doc(db, COLLECTIONS.TRANSFER_REQUESTS, id), { status: "rejected" });
    await logActivity(actorId, `Rejected asset transfer`);
}