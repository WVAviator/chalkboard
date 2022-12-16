import mongoose from 'mongoose';

export interface CanvasData {
  title: string;
  user: string;
  components: {
    type: string;
    props: any;
    data: any;
  }[];
}

const canvasSchema = new mongoose.Schema<CanvasData>({
  title: {
    type: String,
    required: true,
  },
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  // },
  // TODO: Add above code for user field once user model is working
  user: String,
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
});

const CanvasModel =
  (mongoose.models.Canvas as mongoose.Model<CanvasData>) ||
  mongoose.model('Canvas', canvasSchema);

export default CanvasModel;
