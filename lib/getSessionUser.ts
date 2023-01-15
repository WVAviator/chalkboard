import { NextApiRequest } from 'next';
import SessionModel from '../models/Session';
import UserModel from '../models/User';
import dbConnect from './dbConnect';

const getSessionUser = async (req: NextApiRequest) => {
  await dbConnect();

  const sessionToken = req.cookies['next-auth.session-token'];
  if (!sessionToken) {
    return null;
  }
  const session = await SessionModel.findOne({ sessionToken });
  if (!session) {
    return null;
  }

  const user = await UserModel.findOne({ _id: session.userId });
  if (!user) {
    return null;
  }

  return user;
};

export default getSessionUser;
