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

  const { method } = req;

  if (method === 'GET') {
    console.log('Attempting to retrieve canvas with id: ' + canvasId);
    const canvas = await CanvasModel.findById(canvasId);
    if (canvas.userEmail !== session.user.email) {
      console.log(
        `Canvas found but unable to verify user. Canvas user: ${canvas.userEmail}, current user: ${session.user.email}`
      );
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log('Successfully retrieved canvas.');
    return res.status(200).json({ success: true, data: canvas });
  }

  if (method === 'PATCH') {
    const saveData = { ...req.body, userEmail: session.user.email };
    console.log('Attempting to update canvas with id: ' + canvasId);

    try {
      const canvas = await CanvasModel.findById(canvasId);
      if (canvas.userEmail !== session.user.email) {
        console.log(
          'Canvas found but unable to verify user. Canvas user: ' +
            canvas.userEmail +
            ', current user: ' +
            session.user.email
        );
        return res.status(401).json({ message: 'Unauthorized' });
      }

      canvas.title = saveData.title;
      canvas.set({ components: saveData.components });
      canvas.updatedAt = new Date();

      await canvas.save({});

      return res.status(200).json({ success: true, data: canvas });
    } catch (error) {
      console.log('Error updating canvas: ', error);
      return res.status(400).json({ success: false });
    }
  }

  if (method === 'DELETE') {
    console.log('Attempting to delete canvas with id: ' + canvasId);
    try {
      const canvas = await CanvasModel.findById(canvasId);
      if (canvas.userEmail !== session.user.email) {
        console.log(
          'Canvas found but unable to verify user. Canvas user: ' +
            canvas.userEmail +
            ', current user: ' +
            session.user.email
        );
        return res.status(401).json({ message: 'Unauthorized' });
      }
      await canvas.delete();
      return res.status(200).json({ success: true });
    } catch (error) {
      console.log('Error deleting canvas: ', error);
      return res.status(400).json({ success: false });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
}
