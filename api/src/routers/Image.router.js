import express from 'express';
import ImageController from '../controllers/Image.controller';
const ImageRouter = express.Router();

ImageRouter.post('/createMultipleImages', ImageController.createMultipleImages);
ImageRouter.post('/updateAnnotation', ImageController.updateAnnotation);

export default ImageRouter;
