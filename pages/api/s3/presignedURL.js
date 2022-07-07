import AWS from "aws-sdk";

export default async (req, res) => {
  if (
    !process.env.S3_ACCESS_KEY ||
    !process.env.S3_BUCKET_NAME ||
    !process.env.S3_REGION ||
    !process.env.S3_SECRET_KEY
  ) {
    throw new Error("You must define all S3 env variables.");
  }

  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION,
  });

  // get the url and fields for amazon bucket
  const post = await s3.createPresignedPost({
    Bucket: process.env.S3_BUCKET_NAME,
    Fields: {
      key: req.query.file,
    },
    Expires: 60,
  });

  res.status(200).json(post);
};
