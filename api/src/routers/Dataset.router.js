import express from 'express';
import DatasetController from '../controllers/Dataset.controller';
const DatasetRouter = express.Router();

DatasetRouter.get('/all', DatasetController.getAllDataset);
DatasetRouter.get('/public', DatasetController.getPublicDataset);
DatasetRouter.get('/permissions/:userId', DatasetController.getDatasetWithPermissions);
DatasetRouter.get('/datasetId/:datasetId', DatasetController.getDatasetById);
DatasetRouter.post('/create', DatasetController.createDataset);
DatasetRouter.put('/update', DatasetController.updateDataset);
DatasetRouter.delete('/delete/:datasetId', DatasetController.dropDataset);

export default DatasetRouter;
