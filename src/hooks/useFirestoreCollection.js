import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, limit as fbLimit } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";


export function useFirestoreCollection(collectionName, options = {}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let q = collection(db, collectionName);

        if (options.orderByField) {
            q = query(
                q,
                orderBy(options.orderByField, options.orderDirection || "desc")
            );
        }
        if (options.limit) {
            q = query(q, fbLimit(options.limit));
        }

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            },
            (err) => {
                console.error(`Firestore subscription error for "${collectionName}":`, err);
                setError(err);
                setLoading(false);
            }
        );

        return unsubscribe;
        
    }, [collectionName, options.orderByField, options.orderDirection, options.limit]);

    return { data, loading, error };
}