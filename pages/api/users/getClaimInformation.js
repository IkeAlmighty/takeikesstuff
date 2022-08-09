import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import { decrypt } from "../../../lib/crypto";
import clientPromise from "../../../lib/mongodb";

const ENCRYPTION_CODE = process.env.ENCRYPTION_CODE;

if (!ENCRYPTION_CODE) throw new Error("ENCRYPTION_CODE is undefined");

export default async function handler(req, res) {
  const authToken = req.cookies.authToken;

  if (authToken) {
    // get the user id:
    try {
      const session = jwt.verify(authToken, ENCRYPTION_CODE);

      // if the session id is an admin id,
      const client = await clientPromise;
      const isAdmin = await client
        .db()
        .collection("users")
        .findOne({ _id: new ObjectId(session._id), isAdmin: true });

      if (isAdmin) {
        // then grab all claims from all users,
        const allClaims = await client
          .db()
          .collection("s3ObjectData")
          .find({})
          .toArray();

        // and insert them into a key value map
        // of phone numbers to item id arrays
        const phoneToItemsMap = {};

        for (let i = 0; i < allClaims.length; i++) {
          const item = allClaims[i];
          if (item.claimedBy) {
            // look up who it was claimed by and decrypt their phone number:
            const claimedBy = await client
              .db()
              .collection("users")
              .findOne({ _id: item.claimedBy });

            const phone = decrypt(claimedBy.phone);

            if (!phoneToItemsMap[phone]) {
              phoneToItemsMap[phone] = [];
            }

            phoneToItemsMap[phone].push(item);
          }
        }

        // return key value map
        res.json(phoneToItemsMap);
      } else {
        res.status(401).end();
      }
    } catch (err) {
      // if the jwt has been tampered with, taketh away
      console.log(err);
      res.status(401).end();
    }
  } else {
    res.status(401).end();
  }
}
