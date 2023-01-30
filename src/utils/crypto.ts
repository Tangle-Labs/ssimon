import cryptoJs from "crypto-js";

export const encryptWithAES = (text: string, password: string) => {
  return cryptoJs.AES.encrypt(text, password).toString();
};

export const decryptWithAES = (cipher: string, password: string) => {
  const bytes = cryptoJs.AES.decrypt(cipher, password);
  const originalText = bytes.toString(cryptoJs.enc.Utf8);
  return originalText;
};
