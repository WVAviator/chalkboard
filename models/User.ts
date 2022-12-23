import mongoose from 'mongoose';

export interface UserData {
  name: string;
  email: string;
  image?: string | null;
  emailVerified?: Date | null;
}

const userSchema = new mongoose.Schema<UserData>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    emailVerified: {
      type: Date,
    },
  },
  {
    collection: 'users',
  }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<UserData>) ||
  mongoose.model('User', userSchema);

export default UserModel;
