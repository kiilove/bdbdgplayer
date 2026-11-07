import CryptoJS from "crypto-js";

const DEFAULT_SECRET = "bdbdg-player-default-secret-key";

export const Encrypt = (plaintext) => {
  if (!plaintext) return "";
  const secretKey = process.env.REACT_APP_SECRET_KEY || DEFAULT_SECRET;
  return CryptoJS.AES.encrypt(String(plaintext), secretKey).toString();
};

export const Decrypt = (ciphertext) => {
  if (!ciphertext) return "";
  try {
    const secretKey = process.env.REACT_APP_SECRET_KEY || DEFAULT_SECRET;
    const bytes = CryptoJS.AES.decrypt(String(ciphertext), secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
};
