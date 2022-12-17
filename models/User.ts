import mongoose from 'mongoose';

export interface UserData {
  githubId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt?: Date;
}

const userSchema = new mongoose.Schema<UserData>({
  githubId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<UserData>) ||
  mongoose.model('User', userSchema);

export default UserModel;
