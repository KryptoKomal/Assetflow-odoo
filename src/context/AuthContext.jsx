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


export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null); 
    const [userProfile, setUserProfile] = useState(null); 
    const [loading, setLoading] = useState(true);

    
    async function fetchUserProfile(uid) {
        try {
            const userRef = doc(db, COLLECTIONS.USERS, uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setUserProfile({ uid, ...userSnap.data() });
            } else {
                setUserProfile(null);
            }
        } catch (err) {
            console.error("Failed to fetch user profile:", err);
            setUserProfile(null);
        }
    }

    
    async function signup(name, email, password) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });

        await setDoc(doc(db, COLLECTIONS.USERS, result.user.uid), {
            uid: result.user.uid,
            name,
            email,
            role: "employee", 
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
            try {
                setCurrentUser(user);
                if (user) {
                    await fetchUserProfile(user.uid);
                } else {
                    setUserProfile(null);
                }
            } catch (err) {
                console.error("Error in auth state change:", err);
            } finally {
                setLoading(false);
            }
        });

        return unsubscribe; 
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

    
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}