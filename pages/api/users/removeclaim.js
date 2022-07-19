import clientPromise from "../../../lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const ENCRYPTION_CODE = process.env.ENCRYPTION_CODE;
if (!ENCRYPTION_CODE) {
  throw Error("Please define ENCRYPTION_CODE env variable");
}

export default async function handler(req, res) {
  const { _id } = JSON.parse(req.body);

  const client = await clientPromise;

  const removeClaimResponse = await client
    .db()
    .collection("s3ObjectData")
    .deleteOne({ _id });

  res.end();
}
