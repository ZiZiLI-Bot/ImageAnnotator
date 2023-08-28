import mongoose from 'mongoose';
import Schema from '../utils/MongoDB';

const DatasetSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    createBy: {
      type: Schema.Types.ObjectId,
      ref: 'Auth',
    },
    invites: [{ type: Schema.Types.ObjectId, ref: 'Auth' }],
    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
  },
  {
    timestamps: true,
    collection: 'Dataset',
  },
);
const DatasetModel = mongoose.model('Dataset', DatasetSchema);
export default DatasetModel;
