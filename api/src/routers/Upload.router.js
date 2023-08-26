import express from 'express';
import UploadController from '../controllers/Upload.controller';

const UploadRouter = express.Router();

UploadRouter.post('/', UploadController.uploadMultipleFiles);
UploadRouter.post('/drop', UploadController.dropFile);

export default UploadRouter;
