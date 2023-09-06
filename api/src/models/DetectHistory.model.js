import mongoose from 'mongoose';
import Schema from '../utils/MongoDB';

const DetectHistorySchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Auth',
    },
    originalImage: {
      type: String,
    },
    resultImage: {
      type: String,
    },
    modelUsed: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'DetectHistory',
  },
);
const DetectHistoryModel = mongoose.model('DetectHistory', DetectHistorySchema);
export default DetectHistoryModel;
