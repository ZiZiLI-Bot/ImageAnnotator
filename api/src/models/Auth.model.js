import mongoose from 'mongoose';
import Schema from '../utils/MongoDB';

const AuthSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'professional', 'user'],
      default: 'user',
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'Auth',
  },
);
const AuthModel = mongoose.model('Auth', AuthSchema);
export default AuthModel;
