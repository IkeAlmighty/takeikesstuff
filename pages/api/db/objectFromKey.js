import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const { key } = req.query;

  const client = await clientPromise;

  const object = await client
    .db()
    .collection("s3ObjectData")
    .findOne({ _id: key });

  if (object) {
    res.json(object);
  } else {
    res.json({ key });
  }
}
