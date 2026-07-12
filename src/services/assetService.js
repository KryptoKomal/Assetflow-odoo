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
import { uploadFile, deleteFile } from "./storageService";

const assetsRef = collection(db, COLLECTIONS.ASSETS);



export function generateAssetTag() {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `AST-${rand}`;
}

export async function createAsset(data, photoFile, actorId) {
    let photoUrl = "";
    let photoPath = "";

    if (photoFile) {
        const uploaded = await uploadFile(photoFile, "assets");
        photoUrl = uploaded.url;
        photoPath = uploaded.path;
    }

    const docRef = await addDoc(assetsRef, {
        assetTag: data.assetTag,
        assetName: data.assetName,
        categoryId: data.categoryId,
        serialNumber: data.serialNumber || "",
        status: data.status || "available",
        condition: data.condition || "good",
        location: data.location || "",
        shared: Boolean(data.shared),
        allocatedTo: null,
        photo: photoUrl,
        photoPath,
        documents: [],
        createdAt: serverTimestamp(),
    });

    await logActivity(actorId, `Registered asset "${data.assetName}" (${data.assetTag})`);
    return docRef;
}

export async function updateAsset(id, data, photoFile, existingPhotoPath, actorId) {
    const ref = doc(db, COLLECTIONS.ASSETS, id);
    const updatePayload = {
        assetName: data.assetName,
        categoryId: data.categoryId,
        serialNumber: data.serialNumber || "",
        status: data.status,
        condition: data.condition,
        location: data.location || "",
        shared: Boolean(data.shared),
    };

    if (photoFile) {
        
        if (existingPhotoPath) await deleteFile(existingPhotoPath);
        const uploaded = await uploadFile(photoFile, "assets");
        updatePayload.photo = uploaded.url;
        updatePayload.photoPath = uploaded.path;
    }

    await updateDoc(ref, updatePayload);
    await logActivity(actorId, `Updated asset "${data.assetName}"`);
}

export async function deleteAsset(id, name, photoPath, actorId) {
    if (photoPath) await deleteFile(photoPath);
    await deleteDoc(doc(db, COLLECTIONS.ASSETS, id));
    await logActivity(actorId, `Deleted asset "${name}"`);
}