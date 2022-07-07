import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;

  const allData = await client
    .db()
    .collection("s3ObjectData")
    .find({})
    .toArray();

  res.json(allData);
}
