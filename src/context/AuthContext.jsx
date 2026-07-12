import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { COLLECTIONS } from "../constants/collections";

const AuthContext = createContext();

// Custom hook to consume auth context anywhere in the app
export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null); // Firebase Auth user object
    const [userProfile, setUserProfile] = useState(null); // Firestore users/{uid} document
    const [loading, setLoading] = useState(true);

    // Fetch extra profile info (role, department, etc.) from Firestore
    async function fetchUserProfile(uid) {
        const userRef = doc(db, COLLECTIONS.USERS, uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            setUserProfile({ uid, ...userSnap.data() });
        } else {
            setUserProfile(null);
        }
    }

    // Sign up new user + create Firestore profile doc
    async function signup(name, email, password) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });

        await setDoc(doc(db, COLLECTIONS.USERS, result.user.uid), {
            uid: result.user.uid,
            name,
            email,
            role: "employee", // default role — can be changed later by admin
            departmentId: null,
            status: "active",
            photo: "",
            createdAt: serverTimestamp(),
        });

        return result;
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        setUserProfile(null);
        return signOut(auth);
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                await fetchUserProfile(user.uid);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe; // cleanup listener on unmount
    }, []);

    const value = {
        currentUser,
        userProfile,
        loading,
        signup,
        login,
        logout,
        resetPassword,
    };

    // Don't render app until we know auth state — avoids flicker/redirect bugs
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}