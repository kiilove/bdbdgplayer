import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

const useFirestoreSearch = (
  collectionName,
  conditions = [],
  orderByField = "",
  orderByDirection = "asc",
  limitNumber = 0
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let q = query(collection(db, collectionName));
  if (conditions.length > 0) {
    q = query(q, ...conditions);
  }
  if (orderByField) {
    q = query(q, orderBy(orderByField, orderByDirection));
  }
  if (limitNumber > 0) {
    q = query(q, limit(limitNumber));
  }

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(q);
        const newData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (isMounted) {
          if (newData.length !== data.length) {
            setData(newData);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setError(error);
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [
    collectionName,
    conditions,
    orderByField,
    orderByDirection,
    limitNumber,
    data,
  ]);

  return { data, loading, error };
};

export default useFirestoreSearch;
