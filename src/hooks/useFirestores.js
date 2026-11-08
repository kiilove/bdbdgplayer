import { useState, useCallback } from "react";
import {
  getDocumentById,
  queryDocuments,
  createDocument,
  updateDocumentById,
  deleteDocumentById,
} from "../services/firestoreService";

export function useFirestoreQuery() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDocuments = useCallback(
    async (
      collectionName,
      conditions = [],
      orderByField = "",
      orderByDirection = "asc",
      limitNumber = 0
    ) => {
      try {
        setLoading(true);
        const documents = await queryDocuments(
          collectionName,
          conditions,
          orderByField,
          orderByDirection,
          limitNumber
        );
        setData(documents);
        return documents;
      } catch (err) {
        setError(err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, error, getDocuments };
}

export function useFirestoreGetDocument(collectionName) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDocument = useCallback(
    async (docId) => {
      try {
        setLoading(true);
        const docData = await getDocumentById(collectionName, docId);
        if (docData) {
          setData(docData);
          return docData;
        }
        setError({ message: "Document does not exist" });
        setData(null);
        return null;
      } catch (err) {
        setError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  return { data, loading, error, getDocument };
}

export function useFirestoreAddData(collectionName) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addData = useCallback(
    async (newData) => {
      try {
        setLoading(true);
        const addedData = await createDocument(collectionName, newData);
        setData(addedData);
        return addedData;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  return { data, loading, error, addData };
}

export function useFirestoreUpdateData(collectionName) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateData = useCallback(
    async (id, newData, callback) => {
      try {
        setLoading(true);
        const updatedData = await updateDocumentById(
          collectionName,
          id,
          newData
        );
        setData(updatedData);
        if (callback) callback();
        return updatedData;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  return { data, loading, error, updateData };
}

export function useFirestoreDeleteData(collectionName) {
  const [data, setData] = useState(null);

  const deleteData = useCallback(
    async (id) => {
      try {
        await deleteDocumentById(collectionName, id);
        setData(id);
        return true;
      } catch {
        return false;
      }
    },
    [collectionName]
  );

  return { data, deleteData };
}
