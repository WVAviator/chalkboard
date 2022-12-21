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

      console.debug('Savedata: ', saveData.components[1].data);

      canvas.title = saveData.title;
      canvas.components = saveData.components;
      canvas.updatedAt = new Date();

      // Mark each component as modified so that the nested changes are saved
      saveData.components.forEach(
        (component: { data?: any; props?: any }, index: number) => {
          if (component.data) {
            canvas.components[index].$set({ data: component.data });
          }
          if (component.props) {
            canvas.components[index].$set({ props: component.props });
          }
        }
      );
      canvas.markModified('components');
      await canvas.save();

      canvas.markModified('components');
      await canvas.save();

      return res.status(200).json({ success: true, data: canvas });
    } catch (error) {
      console.log('Error updating canvas: ', error);
      return res.status(400).json({ success: false });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
}
