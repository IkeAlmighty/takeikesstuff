import jwt from "jsonwebtoken";

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

    // TODO: interate over s3ObjectData collection and gather all items
    // that have been claimed by the user loggedin to this session.

    res.end();
  } catch (err) {
    res.status(401).end(); // return 401 and null payload if the token has been tampered with
  }
}
