import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * 단일 문서 조회
 */
export const getDocumentById = async (collectionName, docId) => {
  if (!collectionName || !docId) return null;
  const snapshot = await getDoc(doc(db, collectionName, docId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

/**
 * 조건부 컬렉션 문서 목록 조회
 */
export const queryDocuments = async (
  collectionName,
  conditions = [],
  orderByField = "",
  orderByDirection = "asc",
  limitNumber = 0
) => {
  let q = collection(db, collectionName);

  if (Array.isArray(conditions) && conditions.length > 0) {
    conditions.forEach((condition) => {
      if (condition) {
        q = query(q, condition);
      }
    });
  }

  if (orderByField) {
    q = query(q, orderBy(orderByField, orderByDirection));
  }

  if (limitNumber > 0) {
    q = query(q, limit(limitNumber));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

/**
 * 신규 문서 추가 (자동 ID 발급)
 */
export const createDocument = async (collectionName, data) => {
  const docRef = await addDoc(collection(db, collectionName), data);
  return { ...data, id: docRef.id };
};

/**
 * 특정 문서 병합 저장 (setDoc with merge)
 */
export const mergeDocumentById = async (collectionName, docId, data) => {
  await setDoc(doc(db, collectionName, docId), data, { merge: true });
  return { ...data, id: docId };
};

/**
 * 특정 문서 업데이트 (updateDoc)
 */
export const updateDocumentById = async (collectionName, docId, data) => {
  await updateDoc(doc(db, collectionName, docId), data);
  return { ...data, id: docId };
};

/**
 * 특정 문서 삭제
 */
export const deleteDocumentById = async (collectionName, docId) => {
  await deleteDoc(doc(db, collectionName, docId));
  return true;
};
