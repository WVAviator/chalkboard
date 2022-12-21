import mongoose from 'mongoose';
import { UserData } from './User';

export interface CanvasData {
  title: string;
  // user: UserData;
  userEmail: string;
  components: {
    type: string;
    props: any;
    data: any;
    $set: any;
  }[];
  updatedAt: Date;
}

const canvasSchema = new mongoose.Schema<CanvasData>({
  title: {
    type: String,
    required: true,
  },
  userEmail: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'User',
    type: String,
    required: true,
  },
  // TODO: Add above code for user field once user model is working
  // user: String,
  components: [
    {
      type: {
        type: String,
        required: true,
      },
      props: mongoose.Schema.Types.Mixed,
      data: mongoose.Schema.Types.Mixed,
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const CanvasModel =
  (mongoose.models.Canvas as mongoose.Model<CanvasData>) ||
  mongoose.model('Canvas', canvasSchema);

export default CanvasModel;
