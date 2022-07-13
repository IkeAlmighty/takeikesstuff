import { encrypt } from "../../../lib/crypto";
import clientPromise from "../../../lib/mongodb";

import jwt from "jsonwebtoken";

const ENCRYPTION_CODE = process.env.ENCRYPTION_CODE;
if (!ENCRYPTION_CODE) {
  throw new Error("ENCRYPTION_CODE is undefined");
}

export default async function handler(req, res) {
  const { phone } = req.query;

  const phoneEncrypted = encrypt(phone);

  const client = await clientPromise;
  const user = await client
    .db()
    .collection("users")
    .findOne({ phone: phoneEncrypted });

  function setAuthTokenCookie(_id) {
    // create the authToken for this session:
    const authToken = jwt.sign({ _id }, ENCRYPTION_CODE);

    // set a session cookie:
    res.setHeader(
      "Set-Cookie",
      `authToken=${authToken}; HttpOnly; Lax; Path=/;`
    );
  }

  if (!user) {
    // if the user does not exist, then create the user:
    const mongoInsertResponse = await client
      .db()
      .collection("users")
      .insertOne({ phone: phoneEncrypted });

    setAuthTokenCookie(mongoInsertResponse.insertedId.toString());

    res.status(203).end();
  } else {
    const _id = user._id.toString();
    setAuthTokenCookie(_id);
    res.status(200).end();
  }
}
