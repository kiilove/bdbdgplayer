import CryptoJS from "crypto-js";

export const Encrypt = (plaintext) => {
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const ciphertext = CryptoJS.AES.encrypt(plaintext, secretKey).toString();

  return ciphertext;
};

export const Decrypt = (ciphertext) => {
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);

  const plaintext = bytes.toString(CryptoJS.enc.Utf8);

  return plaintext;
};
