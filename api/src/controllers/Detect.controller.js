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
      resolve(data);
    });
    processDetect.stderr.on('data', (data) => {
      reject(data);
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
      console.log(result.toString());
      const { uri_out, status } = JSON.parse(result.toString());
      if (status) {
        const newDetect = new DetectHistoryModel({
          createdBy: uid,
          originalImage: `${process.env.HOST_NAME}/file/${image_name}`,
          resultImage: `${process.env.HOST_NAME}/file/${uri_out}`,
          modelUsed: model === 'YOLOv8_best.onnx' ? 'yolov8' : 'yolov5',
        });
        await newDetect.save();
        return success(res, newDetect, 'Detect image successfully');
      }
    } catch (err) {
      console.log(err.toString());
      return error(res, err.toString(), 'Error while detecting image');
    }
  },
};

export default DetectController;
