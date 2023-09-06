import express from 'express';
import AuthRouter from './Auth.router';
import UploadRouter from './Upload.router';
import DatasetRouter from './Dataset.router';
import ImageRouter from './Image.router';
import DetectRouter from './Detect.router';

const Router = express.Router();

Router.use('/auth', AuthRouter);
Router.use('/uploads', UploadRouter);
Router.use('/dataset', DatasetRouter);
Router.use('/image', ImageRouter);
Router.use('/detect', DetectRouter);

export default Router;
