import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import CanvasModel from '../../models/Canvas';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  if (method === 'GET') {
    const { userId } = req.query;

    try {
      const canvases = await CanvasModel.find({ user: userId })
        .populate('user')
        .exec();
      return res.status(200).json({ success: true, data: canvases });
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  }

  if (method === 'POST') {
    try {
      const canvas = new CanvasModel(req.body);
      await canvas.save();
      return res.status(201).json({ success: true, data: canvas });
    } catch (error) {
      console.log('Error saving canvas: ', error);
      return res.status(400).json({ success: false });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
}
