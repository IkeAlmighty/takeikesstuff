import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

const ENCRYPTION_CODE = process.env.ENCRYPTION_CODE;

if (!ENCRYPTION_CODE) throw new Error("ENCRYPTION_CODE is undefined");

export default async function handler(req, res) {
  const { objectKey } = req.query; // s3 object key to add to claim

  // parse the _id from the current session:
  const cookiesJSON = req.cookies;
  try {
    // get the user _id
    const { _id } = jwt.verify(cookiesJSON.authToken, ENCRYPTION_CODE);
    const client = await clientPromise;

    const mongoUpdateClaimed = await client
      .db()
      .collection("s3ObjectData")
      .updateOne(
        { _id: objectKey },
        { $set: { claimedBy: ObjectId(_id), key: objectKey } },
        { upsert: true }
      );

    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
}
