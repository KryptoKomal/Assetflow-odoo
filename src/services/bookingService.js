import { collection, addDoc, updateDoc, doc, serverTimestamp, Timestamp, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { COLLECTIONS } from "../constants/collections";
import { logActivity } from "./activityLogService";

const bookingsRef = collection(db, COLLECTIONS.BOOKINGS);

export async function checkOverlap(resourceId, start, end, excludeId = null) {
    const q = query(bookingsRef, where("resourceId", "==", resourceId));
    const snap = await getDocs(q);
    return snap.docs.some((d) => {
        if (d.id === excludeId) return false;
        const data = d.data();
        if (data.status === "cancelled") return false;
        const bStart = data.startTime.toDate();
        const bEnd = data.endTime.toDate();
        return start < bEnd && end > bStart;
    });
}

export async function createBooking(data, actorId) {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    const overlap = await checkOverlap(data.resourceId, start, end);
    if (overlap) throw new Error("OVERLAP");

    const docRef = await addDoc(bookingsRef, {
        resourceId: data.resourceId,
        employeeId: data.employeeId,
        title: data.title || "",
        startTime: Timestamp.fromDate(start),
        endTime: Timestamp.fromDate(end),
        status: "confirmed",
        createdAt: serverTimestamp(),
    });

    await logActivity(actorId, `Created booking for resource`);
    return docRef;
}

export async function cancelBooking(id, actorId) {
    await updateDoc(doc(db, COLLECTIONS.BOOKINGS, id), { status: "cancelled" });
    await logActivity(actorId, `Cancelled a booking`);
}