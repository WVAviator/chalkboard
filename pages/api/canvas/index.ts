import { NextApiRequest, NextApiResponse } from 'next';
import getSessionUser from '../../../lib/getSessionUser';
import CanvasModel from '../../../models/Canvas';

interface ChalkboardFile {
  id: string;
  title: string;
  lastModified: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sessionUser = await getSessionUser(req);
  if (!sessionUser) {
    console.log('Session not found.', sessionUser);
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { method } = req;

  if (method === 'GET') {
    console.log(
      'Attempting to retrieve all canvases for user: ' + sessionUser.id
    );
    const canvases = await CanvasModel.find({
      userId: sessionUser.id,
    });

    const formattedData: ChalkboardFile[] = canvases.map((canvas) => {
      return {
        id: canvas._id.toString(),
        title: canvas.title,
        lastModified: canvas.updatedAt,
      } as ChalkboardFile;
    });

    console.log(
      'Found ' + formattedData.length + ' canvases for user: ' + sessionUser.id
    );

    return res.status(200).json({ success: true, data: formattedData });
  }

  if (method === 'POST') {
    if (
      sessionUser.accountLimits.canvas.current >=
      sessionUser.accountLimits.canvas.max
    ) {
      console.log('User has reached canvas limit.');
      return res
        .status(403)
        .json({ message: 'Unable to save, canvas limit reached.', success: false });
    }

    const saveData = { ...req.body, userId: sessionUser.id };

    console.log('Attempting to create new canvas for user: ' + sessionUser.id);

    try {
      const canvas = new CanvasModel(saveData);
      await canvas.save();

      sessionUser.accountLimits.canvas.current += 1;
      await sessionUser.save();

      return res.status(201).json({ success: true, data: canvas });
    } catch (error) {
      console.log('Error saving canvas: ', error);
      return res.status(400).json({ success: false });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
}
