import {
    collection,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { COLLECTIONS } from "../constants/collections";
import { logActivity } from "./activityLogService";

const allocationsRef = collection(db, COLLECTIONS.ALLOCATIONS);

export async function allocateAsset(data, actorId) {
    
    
    const docRef = await addDoc(allocationsRef, {
        assetId: data.assetId,
        employeeId: data.employeeId,
        allocatedDate: Timestamp.fromDate(new Date(data.allocatedDate)),
        expectedReturn: data.expectedReturn ? Timestamp.fromDate(new Date(data.expectedReturn)) : null,
        status: "active",
        createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, COLLECTIONS.ASSETS, data.assetId), {
        status: "allocated",
        allocatedTo: data.employeeId,
    });

    await logActivity(actorId, `Allocated asset to employee`);
    return docRef;
}

export async function returnAsset(allocation, actorId) {
    await updateDoc(doc(db, COLLECTIONS.ALLOCATIONS, allocation.id), {
        status: "returned",
        returnedDate: serverTimestamp(),
    });

    await updateDoc(doc(db, COLLECTIONS.ASSETS, allocation.assetId), {
        status: "available",
        allocatedTo: null,
    });

    await logActivity(actorId, `Returned asset from allocation`);
}