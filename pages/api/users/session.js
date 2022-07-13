// returns the userId if the session exists, 401 if not:
import jwt from "jsonwebtoken";

const ENCRYPTION_CODE = process.env.ENCRYPTION_CODE;

if (!ENCRYPTION_CODE) throw new Error("ENCRYPTION_CODE is undefined");

export default function handler(req, res) {
  const authToken = req.cookies.authToken;

  if (authToken) {
    // get the user id:
    try {
      const session = jwt.verify(authToken, ENCRYPTION_CODE);
      res.json(session);
    } catch (err) {
      // if the jwt has been tampered with, taketh away
      console.log(err);
      res.status(401);
    }
  } else {
    res.status(401).end();
  }
}
