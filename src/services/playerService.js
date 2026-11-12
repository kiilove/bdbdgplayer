import { where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import {
  queryDocuments,
  createDocument,
  mergeDocumentById,
} from "./firestoreService";

const createStorageFileName = (filename, prefix = "P") => {
  const currentTime = Date.now();
  const ext = filename.includes(".") ? filename.split(".").pop() : "jpg";
  return `${String(prefix).toUpperCase()}${currentTime}.${ext}`;
};

/**
 * 선수 프로필 객체를 일관된 스키마로 정규화 (playerUid 보장)
 */
const normalizePlayerProfile = (doc, fallbackUid = "", fallbackEmail = "") => {
  if (!doc) return null;
  const resolvedUid = doc.playerUid || doc.pUid || fallbackUid || "";
  return {
    ...doc,
    playerUid: resolvedUid,
    pEmail: doc.pEmail || fallbackEmail || "",
  };
};

/**
 * playerUid(또는 보조 이메일)로 선수 프로필 조회 (players_pool)
 */
export const fetchPlayerByUid = async (playerUid, fallbackEmail = "") => {
  if (!playerUid) return null;

  const docs = await queryDocuments("players_pool", [
    where("playerUid", "==", playerUid),
  ]);
  if (docs && docs.length > 0) {
    return normalizePlayerProfile(docs[0], playerUid, fallbackEmail);
  }

  // 레거시 데이터 호환: pUid 필드로 저장된 문서 조회
  const legacyDocs = await queryDocuments("players_pool", [
    where("pUid", "==", playerUid),
  ]);
  if (legacyDocs && legacyDocs.length > 0) {
    return normalizePlayerProfile(legacyDocs[0], playerUid, fallbackEmail);
  }

  // 보조 조회: Firebase Auth에는 계정이 있으나 UID 매핑이 누락된 경우 이메일로 조회
  if (fallbackEmail) {
    const emailDocs = await queryDocuments("players_pool", [
      where("pEmail", "==", fallbackEmail.trim()),
    ]);
    if (emailDocs && emailDocs.length > 0) {
      return normalizePlayerProfile(emailDocs[0], playerUid, fallbackEmail);
    }
  }

  return null;
};

/**
 * players_pool 내 이메일 중복 여부 확인
 * (Firebase 이메일 열거 보호 정책으로 fetchSignInMethodsForEmail이 빈 배열을 반환하는 문제 보완)
 */
export const checkPlayerEmailInPool = async (email) => {
  const trimmed = (email || "").trim();
  if (!trimmed) return false;
  const docs = await queryDocuments("players_pool", [
    where("pEmail", "==", trimmed),
  ]);
  return Boolean(docs && docs.length > 0);
};

/**
 * 신규 선수 회원 프로필 생성 (players_pool)
 * - Firestore 필드명(pName, pEmail, pTel, pGender, gender, license, playerUid) 100% 유지
 */
export const createPlayerProfile = async ({
  pName,
  pEmail,
  pTel,
  pGender,
  license,
  playerUid,
}) => {
  return await createDocument("players_pool", {
    pName: pName.trim(),
    pEmail: pEmail.trim(),
    pTel,
    pGender,
    gender: pGender,
    license,
    playerUid,
  });
};

/**
 * 선수 프로필 병합 저장 (players_pool)
 */
export const savePlayerProfile = async (docId, updatedProfile) => {
  if (!docId) {
    return await createDocument("players_pool", updatedProfile);
  }
  return await mergeDocumentById("players_pool", docId, updatedProfile);
};

/**
 * 선수 프로필 사진 업로드 및 players_pool 반영
 */
export const uploadPlayerAvatar = async (playerInfo, file) => {
  const uid = playerInfo?.playerUid || playerInfo?.pUid || playerInfo?.id;
  if (!file || !uid) {
    throw new Error("업로드에 필요한 선수 정보가 부족합니다.");
  }

  const filename = createStorageFileName(file.name, "P");
  const storageRef = ref(storage, `images/player/${uid}/${filename}`);
  const uploadTask = await uploadBytesResumable(storageRef, file);
  const downloadURL = await getDownloadURL(uploadTask.ref);

  const updatedProfile = {
    ...playerInfo,
    playerUid: playerInfo?.playerUid || uid,
    pPic: downloadURL,
  };
  const savedDoc = await savePlayerProfile(playerInfo?.id, updatedProfile);
  return savedDoc?.id ? { ...updatedProfile, id: savedDoc.id } : updatedProfile;
};

/**
 * 실명 및 전화번호로 가입된 이메일 목록 조회 (아이디 찾기용)
 */
export const findPlayerEmailsByNameAndPhone = async (name, phone) => {
  const trimmedName = (name || "").trim();
  const cleanPhone = (phone || "").replace(/[^0-9]/g, "");
  if (!trimmedName || !cleanPhone) return [];

  const docs = await queryDocuments("players_pool", [
    where("pName", "==", trimmedName),
  ]);

  const matched = [];
  docs.forEach((data) => {
    const playerPhone = (data.pTel || "").replace(/[^0-9]/g, "");
    if (playerPhone === cleanPhone && data.pEmail) {
      if (!matched.includes(data.pEmail)) {
        matched.push(data.pEmail);
      }
    }
  });

  return matched;
};
