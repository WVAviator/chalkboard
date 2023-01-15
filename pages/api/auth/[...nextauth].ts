import NextAuth, { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb';
import dbConnect from '../../../lib/dbConnect';
import UserModel from '../../../models/User';

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  events: {
    createUser: async (message) => {
      await dbConnect();
      const userProfile = await UserModel.findOne({
        _id: message.user.id,
      });
      await userProfile.save();
    },
  },
};
export default NextAuth(authOptions);
