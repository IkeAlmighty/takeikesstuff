import AWS from "aws-sdk";

export default async (req, res) => {
  const { limit } = req.query;

  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION,
  });

  const listObjects = () =>
    new Promise((resolve, reject) => {
      s3.listObjectsV2(
        {
          Bucket: process.env.S3_BUCKET_NAME,
          MaxKeys: limit,
        },
        (err, data) => {
          if (err) return reject(err);
          if (data) return resolve(data);
        }
      );
    });

  let data = await listObjects();
  let keys = data.Contents.map((obj) => obj.Key);
  res.status(200).json(keys);
};
