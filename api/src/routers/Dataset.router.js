import express from 'express';
import DatasetController from '../controllers/Dataset.controller';
const DatasetRouter = express.Router();

DatasetRouter.get('/all', DatasetController.getAllDataset);
DatasetRouter.get('/invite/:userId', DatasetController.getDatasetMeInvite);
DatasetRouter.get('/me/:userId', DatasetController.getDatasetByCreateId);
DatasetRouter.get('/:datasetId', DatasetController.getDatasetById);
DatasetRouter.post('/create', DatasetController.createDataset);
DatasetRouter.post('/updateTags', DatasetController.updateTagsDataset);
DatasetRouter.put('/update', DatasetController.updateDataset);
DatasetRouter.delete('/delete/:datasetId', DatasetController.dropDataset);

export default DatasetRouter;
