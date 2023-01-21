import { NextApiRequest } from 'next';
import SessionModel from '../models/Session';
import UserModel from '../models/User';
import dbConnect from './dbConnect';

const getSessionUser = async (req: NextApiRequest) => {
  await dbConnect();

  const sessionToken =
    req.cookies['next-auth.session-token'] ||
    req.cookies['__Secure-next-auth.session-token'];
  if (!sessionToken) {
    console.log('No session token found in cookies.');
    console.log('Available cookies:', req.cookies);
    return null;
  }
  try {
    const session = await SessionModel.findOne({ sessionToken });
    if (!session) {
      console.log('No session found for token.');
      return null;
    }

    const user = await UserModel.findOne({ _id: session.userId });
    if (!user) {
      console.log('No user found for session.');
      return null;
    }

    console.log('Session user found.', user);
    return user;
  } catch (error) {
    console.log('Error getting session user.');
    console.log(error);
    return null;
  }
};

export default getSessionUser;
