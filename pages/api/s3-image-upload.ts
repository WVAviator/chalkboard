import { NextApiRequest, NextApiResponse } from 'next';
import getSessionUser from '../../lib/getSessionUser';
import { generateUploadURL } from '../../lib/s3';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sessionUser = await getSessionUser(req);
  if (!sessionUser) {
    console.log('Session not found.');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (
    sessionUser.accountLimits.images.current >=
    sessionUser.accountLimits.images.max
  ) {
    console.log('User has reached image limit.');
    return res.status(403).json({
      message: 'Unable to save, image limit reached.',
      success: false,
    });
  }

  const url = await generateUploadURL();

  sessionUser.accountLimits.images.current += 1;
  await sessionUser.save();

  res.status(200).send({ url });
}
