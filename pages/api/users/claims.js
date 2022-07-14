import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

const ENCRYPTION_CODE = process.env.ENCRYPTION_CODE;
if (!ENCRYPTION_CODE) {
  throw Error("Please define ENCRYPTION_CODE env variable");
}

export default async function handler(req, res) {
  // get the http-only cookie if there is one:
  let cookiesJSON = req.cookies;

  if (!cookiesJSON.authToken) {
    res.status(401).end(); // return null if the cookie does not exist
    return;
  }

  try {
    const token = jwt.verify(cookiesJSON.authToken, ENCRYPTION_CODE);

    // get all s3ObjectData documents claimed by this user:
    const client = await clientPromise;
    const claims = await client
      .db()
      .collection("s3ObjectData")
      .aggregate([
        { claimedBy: new ObjectId(token._id) },
        { $addField: { _id: { $toString: "$_id" } } },
      ])
      .toArray();

    // lol why did i think that would be complicated?

    res.json(claims);
  } catch (err) {
    res.status(401).end(); // return 401 and null payload if the token has been tampered with
  }
}

// NOTE: I realized after coding this that I pass the _id as a query from the frontend,
// so it is entirely unnesesccary to parse the cookie for the user id.

// however, im going to keep this code here how it is because it is a good starting point for a more
// robust user system with passwords.
