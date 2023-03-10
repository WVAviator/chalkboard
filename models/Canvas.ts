import mongoose from 'mongoose';

export interface CanvasData {
  title: string;
  userId: string;
  components: {
    type: string;
    props: any;
    data: any;
    id: string;
  }[];
  updatedAt: Date;
}

const canvasSchema = new mongoose.Schema<CanvasData>(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    components: [
      {
        type: {
          type: String,
          required: true,
        },
        props: mongoose.Schema.Types.Mixed,
        data: mongoose.Schema.Types.Mixed,
        id: {
          type: String,
          required: true,
        },
      },
    ],
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

const CanvasModel =
  (mongoose.models.Canvas as mongoose.Model<CanvasData>) ||
  mongoose.model('Canvas', canvasSchema);

export default CanvasModel;
