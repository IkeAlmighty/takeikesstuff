import clientPromise from "../../../lib/mongodb";

//FIXME: rewrite as post request b/c this is not best practice
export default async function hander(req, res) {
  const { key, label } = req.query;

  const client = await clientPromise;

  await client
    .db()
    .collection("s3ObjectData")
    .updateOne(
      { _id: key },
      { $set: { _id: key, label, key } },
      { upsert: true }
    );

  res.end();
}
