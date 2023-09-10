import * as child from 'child_process';
import path from 'path';
import DetectHistoryModel from '../models/DetectHistory.model';
import { error, success } from '../utils/Response';
import * as dotenv from 'dotenv';
dotenv.config();

const runProcess = async (originalImage, model, absolutePath) => {
  const processDetect = child.spawn('python', [
    path.join(global.__basedir, 'services/Detect.service.py'),
    originalImage,
    model,
    absolutePath,
  ]);
  return new Promise((resolve, reject) => {
    processDetect.stdout.on('data', (data) => {
      const res = [];
      res.push(data.toString());
      resolve(res);
    });
    processDetect.stderr.on('data', (data) => {
      const err = [];
      err.push(data.toString());
      reject(err);
      console.log(err);
    });
  });
};

const DetectController = {
  detectImage: async (req, res) => {
    const { image_name, uid, model } = req.body;
    const absolutePath = global.__basedir;
    console.log('absolutePath:', absolutePath);
    const modelPath = path.join(absolutePath, `assets/models/${model}`);
    console.log('modelPath:', modelPath);
    try {
      const result = await runProcess(image_name, modelPath, absolutePath);
      console.log('result:', result);
      const { uri_out, status, count } = JSON.parse(result[0]);
      if (status) {
        const newDetect = new DetectHistoryModel({
          createdBy: uid,
          originalImage: `${process.env.HOST_NAME}/file/${image_name}`,
          resultImage: `${process.env.HOST_NAME}/file/${uri_out}`,
          detectCount: count,
          modelUsed: model,
        });
        await newDetect.save();
        return success(res, newDetect, 'Detect image successfully');
      }
    } catch (err) {
      return error(res, err, 'Error while detecting image');
    }
  },
  getHistoryByUserId: async (req, res) => {
    const { uid } = req.params;
    try {
      const history = await DetectHistoryModel.find({ createdBy: uid }).sort({ createdAt: -1 }).populate('createdBy');
      return success(res, history, 'Get history successfully');
    } catch (err) {
      return error(res, err, 'Error while getting history');
    }
  },
  deleteHistoryById: async (req, res) => {
    const { id } = req.params;
    try {
      const history = await DetectHistoryModel.findByIdAndDelete(id);
      return success(res, history, 'Delete history successfully');
    } catch (err) {
      return error(res, err, 'Error while deleting history');
    }
  },
};

export default DetectController;
