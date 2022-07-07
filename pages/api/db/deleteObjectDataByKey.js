import clientPromise from "../../../lib/mongodb";

//FIXME: rewrite as post request b/c this is not best practice
export default async function handler(req, res) {
  const { key } = req.query;

  const client = await clientPromise;
  await client.db().collection("s3ObjectData").deleteOne({ _id: key });

  res.end();
}
