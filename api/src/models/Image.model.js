import mongoose from 'mongoose';
import Schema from '../utils/MongoDB';

const ImageSchema = new Schema(
  {
    name: {
      type: String,
    },
    url: {
      type: String,
    },
    dataset: {
      type: Schema.Types.ObjectId,
      ref: 'Dataset',
    },
    annotations: [],
  },
  {
    timestamps: true,
    collection: 'Image',
  },
);
const ImageModel = mongoose.model('Image', ImageSchema);
export default ImageModel;
