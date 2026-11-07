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
 * playerUid로 선수 프로필 조회 (players_pool)
 */
export const fetchPlayerByUid = async (playerUid) => {
  if (!playerUid) return null;
  const docs = await queryDocuments("players_pool", [
    where("playerUid", "==", playerUid),
  ]);
  return docs && docs.length > 0 ? docs[0] : null;
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
  if (!docId) throw new Error("선수 문서 ID가 없습니다.");
  return await mergeDocumentById("players_pool", docId, updatedProfile);
};

/**
 * 선수 프로필 사진 업로드 및 players_pool 반영
 */
export const uploadPlayerAvatar = async (playerInfo, file) => {
  const uid = playerInfo?.playerUid || playerInfo?.pUid || playerInfo?.id;
  if (!file || !uid || !playerInfo?.id) {
    throw new Error("업로드에 필요한 선수 정보가 부족합니다.");
  }

  const filename = createStorageFileName(file.name, "P");
  const storageRef = ref(storage, `images/player/${uid}/${filename}`);
  const uploadTask = await uploadBytesResumable(storageRef, file);
  const downloadURL = await getDownloadURL(uploadTask.ref);

  const updatedProfile = { ...playerInfo, pPic: downloadURL };
  await savePlayerProfile(playerInfo.id, updatedProfile);
  return updatedProfile;
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
