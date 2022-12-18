import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import CanvasModel from '../../../models/Canvas';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    console.log('Session not found.');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { canvasId } = req.query;
  if (!canvasId) {
    console.log('Canvas id is missing somehow.');
    return res.status(400).json({ message: 'Bad request' });
  }

  console.log('Attempting to retrieve canvas with id: ' + canvasId);
  const canvas = await CanvasModel.findById(canvasId);
  if (canvas.userEmail !== session.user.email) {
    console.log(
      `Canvas found but unable to verify user. Canvas user: ${canvas.userEmail}, current user: ${session.user.email}`
    );
    return res.status(401).json({ message: 'Unauthorized' });
  }
  console.log('Canvas found: ' + canvas);
  return res.status(200).json({ success: true, data: canvas });
}
