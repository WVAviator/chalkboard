import aws from 'aws-sdk';
import crypto from 'crypto';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4',
});

export const generateUploadURL = async () => {
  const randomKey = crypto.randomBytes(16).toString('hex');

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: randomKey,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise('putObject', params);

  return uploadURL;
};
