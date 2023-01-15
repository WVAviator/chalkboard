import mongoose, { ObjectId } from 'mongoose';

export interface SessionData {
  sessionToken: string;
  userId: ObjectId;
  expires: Date;
}

const sessionSchema = new mongoose.Schema<SessionData>(
  {
    sessionToken: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    collection: 'sessions',
  }
);

const SessionModel =
  (mongoose.models.Session as mongoose.Model<SessionData>) ||
  mongoose.model('Session', sessionSchema);

export default SessionModel;
