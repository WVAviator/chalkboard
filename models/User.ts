import mongoose from 'mongoose';

export interface UserData {
  name: string;
  email: string;
  image?: string | null;
  emailVerified?: Date | null;
  accountLimits?: {
    canvas: {
      current: number;
      max: number;
    };
    images: {
      current: number;
      max: number;
    };
  };
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
    accountLimits: {
      canvas: {
        current: {
          type: Number,
          default: 0,
        },
        max: {
          type: Number,
          default: 5,
        },
      },
      images: {
        current: {
          type: Number,
          default: 0,
        },
        max: {
          type: Number,
          default: 15,
        },
      },
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
