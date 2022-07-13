import crypto from "crypto";

const alg = "aes-256-cbc";
const ENCRYPTION_CODE = process.env.ENCRYPTION_CODE;

if (!ENCRYPTION_CODE) {
  throw new Error("ENCRYPTION_CODE is undefined");
}

const key = Buffer.from(
  crypto.createHash("sha256").update(ENCRYPTION_CODE).digest("base64"),
  "base64"
);

// creates a js object containing the encrypted payload and a randomly chosen iv
// value to assist with decryption later on
export function encrypt(text, useIV = false) {
  const iv = useIV ? crypto.randomBytes(16) : Buffer.alloc(16, 1); // used to ensure uniqueness of each encryption

  const cipher = crypto.createCipheriv(alg, key, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  // return iv and encrypted content as a string seperated by a colon
  return `${iv.toString()}:${encrypted.toString("hex")}`;
}

// takes a payload created by encrypt (containing the encrypted content and an iv)
// and returns the content, decrypted.
export function decrypt(payload) {
  // parse the payload string to get the iv and content:
  const parsed = payload.split(":");

  const iv = parsed[0];
  const content = parsed[1];

  const decipher = crypto.createDecipheriv(alg, key, Buffer.from(iv, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from([content, "hex"])),
    decipher.final(),
  ]);

  return decrypted.toString();
}
