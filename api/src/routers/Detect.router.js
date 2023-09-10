import express from 'express';
import DetectController from '../controllers/Detect.controller';
const DetectRouter = express.Router();

DetectRouter.post('/image', DetectController.detectImage);
DetectRouter.get('/history/:uid', DetectController.getHistoryByUserId);
DetectRouter.delete('/history/:id', DetectController.deleteHistoryById);

export default DetectRouter;
