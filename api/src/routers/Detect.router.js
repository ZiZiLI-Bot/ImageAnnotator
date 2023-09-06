import express from 'express';
import DetectController from '../controllers/Detect.controller';
const DetectRouter = express.Router();

DetectRouter.post('/image', DetectController.detectImage);

export default DetectRouter;
