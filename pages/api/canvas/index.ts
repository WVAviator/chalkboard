import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dbConnect from '../../../lib/dbConnect';
import CanvasModel from '../../../models/Canvas';
import UserModel from '../../../models/User';

interface ChalkboardFile {
  id: string;
  title: string;
  lastModified: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Checking for established session...');
  const session = await getSession({ req });
  if (!session) {
    console.log('Session not found.');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { method } = req;

  await dbConnect();

  if (method === 'GET') {
    console.log(
      'Attempting to retrieve all canvases for user: ' + session.user.email
    );
    const canvases = await CanvasModel.find({
      userEmail: session.user.email,
    });

    const formattedData: ChalkboardFile[] = canvases.map((canvas) => {
      return {
        id: canvas._id.toString(),
        title: canvas.title,
        lastModified: canvas.updatedAt,
      } as ChalkboardFile;
    });

    console.log(
      'Found ' +
        formattedData.length +
        ' canvases for user: ' +
        session.user.email
    );

    return res.status(200).json({ success: true, data: formattedData });
  }

  if (method === 'POST') {
    const saveData = { ...req.body, userEmail: session.user.email };

    console.log(
      'Attempting to create new canvas for user: ' + session.user.email
    );

    try {
      const canvas = new CanvasModel(saveData);
      await canvas.save();
      return res.status(201).json({ success: true, data: canvas });
    } catch (error) {
      console.log('Error saving canvas: ', error);
      return res.status(400).json({ success: false });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
}
