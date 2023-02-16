import CryptoJS from "crypto-js";
export const Encrypter = (keyValue) => {
  console.log(keyValue);
  const encryptText = CryptoJS.AES.encrypt(
    keyValue,
    process.env.REACT_APP_SECRET_KEY
  ).toString();
  console.log(encryptText);
  console.log(Decrypter(encryptText));
  return encryptText;
};

export const Decrypter = (keyValue) => {
  const bytes = CryptoJS.AES.decrypt(
    keyValue,
    process.env.REACT_APP_SECRET_KEY
  );
  return bytes.toString(CryptoJS.enc.Utf8);
};
