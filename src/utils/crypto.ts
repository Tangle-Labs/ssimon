import * as crypto from "crypto";

const algorithm = "aes-256-ctr";
const iv = crypto.randomBytes(16);

/**
 * Encrypt plaintext to iv and hash
 *
 * @param {string} text - plaintext to encrypt
 * @param {string} password - ciphertext to encrypt credentials with
 * @returns
 */
export const encrypt = (text: string, password: string) => {
  const key = crypto
    .createHash("sha256")
    .update(String(password))
    .digest("base64")
    .substring(0, 32);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

/**
 * Decrypt the iv and content to plaintext
 *
 * @param {{ iv: string, content: string }} hash - plaintext to encrypt
 * @param {string} password - ciphertext to encrypt credentials with
 * @returns
 */
export const decrypt = (
  hash: { iv: string; content: string },
  password: string
) => {
  const key = crypto
    .createHash("sha256")
    .update(String(password))
    .digest("base64")
    .substring(0, 32);
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(hash.iv, "hex")
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
};
