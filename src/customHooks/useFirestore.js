import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const useFirestore = (collectionName) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const documents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(documents);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
    //console.log(data);
    return () => unsubscribe();
  }, [collectionName]);

  const addDocument = async (documentData) => {
    try {
      await addDoc(collection(db, collectionName), documentData);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const updateDocument = async (documentId, documentData) => {
    try {
      const documentRef = doc(db, collectionName, documentId);
      await updateDoc(documentRef, documentData);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      const documentRef = doc(db, collectionName, documentId);
      await deleteDoc(documentRef);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const getDocument = async (documentId) => {
    console.log(documentId);
    try {
      const documentRef = doc(db, collectionName, documentId);
      const documentSnapshot = await getDoc(documentRef);
      console.log(documentSnapshot.id);
      setSelectedDoc({ id: documentSnapshot.id, ...documentSnapshot.data() });
      setLoading(false);
    } catch (error) {
      console.error("Error getting document: ", error);
    }
  };

  const searchDocuments = async (
    field,
    operator,
    value,
    orderByField,
    orderByDirection
  ) => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, collectionName),
          where(field, operator, value),
          orderBy(orderByField, orderByDirection)
        )
      );
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSearchData(documents);
    } catch (error) {
      console.error("Error searching documents: ", error);
    }
  };

  return {
    loading,
    error,
    data,
    searchData,
    selectedDoc,
    addDocument,
    updateDocument,
    deleteDocument,
    searchDocuments,
    getDocument,
  };
};

export default useFirestore;
