import { NextApiRequest, NextApiResponse } from 'next';
import getSessionUser from '../../../lib/getSessionUser';
import CanvasModel from '../../../models/Canvas';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { canvasId } = req.query;
  if (!canvasId) {
    console.log('Canvas id is missing somehow.');
    return res.status(400).json({ message: 'Bad request' });
  }

  const sessionUser = await getSessionUser(req);

  const { method } = req;

  if (method === 'GET') {
    console.log('Attempting to retrieve canvas with id: ' + canvasId);
    const canvas = await CanvasModel.findById(canvasId);
    if (canvas.userId !== sessionUser.id) {
      console.log(
        `Canvas found but unable to verify user. Canvas user: ${canvas.userId}, current user: ${sessionUser.id}`
      );
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log('Successfully retrieved canvas.');
    return res.status(200).json({ success: true, data: canvas });
  }

  if (method === 'PATCH') {
    const saveData = { ...req.body, userId: sessionUser.id };
    console.log('Attempting to update canvas with id: ' + canvasId);

    try {
      const canvas = await CanvasModel.findById(canvasId);
      if (canvas.userId !== sessionUser.id) {
        console.log(
          'Canvas found but unable to verify user. Canvas user: ' +
            canvas.userId +
            ', current user: ' +
            sessionUser.id
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
      if (canvas.userId !== sessionUser.id) {
        console.log(
          'Canvas found but unable to verify user. Canvas user: ' +
            canvas.userId +
            ', current user: ' +
            sessionUser.id
        );
        return res.status(401).json({ message: 'Unauthorized' });
      }
      await canvas.delete();

      sessionUser.accountLimits.canvas.current -= 1;

      if (sessionUser.accountLimits.canvas.current < 0) {
        sessionUser.accountLimits.canvas.current = 0;
      }

      await sessionUser.save();

      return res.status(200).json({ success: true });
    } catch (error) {
      console.log('Error deleting canvas: ', error);
      return res.status(400).json({ success: false });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
}
