import AWS from "aws-sdk";

export default async (req, res) => {
  const { key } = req.query;

  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION,
  });

  const url = s3.getSignedUrl("getObject", {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  res.status(200).send(url);
};
