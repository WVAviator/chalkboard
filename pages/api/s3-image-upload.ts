import { NextApiRequest, NextApiResponse } from 'next';
import { generateUploadURL } from '../../lib/s3';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(403).json({ message: 'Method not allowed' });
  }

  const url = await generateUploadURL();
  res.status(200).send({ url });
}
