import DatasetModel from '../models/Dataset.model';
import { error, success } from '../utils/Response';

const DatasetController = {
  createDataset: async (req, res) => {
    try {
      const { name, description, createBy, status, publicPermission, invites, images } = req.body;
      const newDataset = new DatasetModel({
        name,
        description,
        createBy,
        status,
        publicPermission,
        invites,
        images,
      });
      await newDataset.save();
      return success(res, newDataset, 'Create dataset successfully');
    } catch (err) {
      return error(res, err, 'Error when create dataset');
    }
  },
  updateDataset: async (req, res) => {
    const { _id } = req.body;
    const Dataset = {};
    Object.entries(req.body).forEach(([key, value]) => {
      switch (key) {
        case '_id':
          break;
        default: {
          Dataset[key] = value;
        }
      }
    });
    try {
      const UpdateDataset = await DatasetModel.findByIdAndUpdate(_id, Dataset, { new: true })
        .populate('createBy')
        .populate('invites')
        .populate('images');
      return success(res, UpdateDataset, 'Update dataset successfully');
    } catch (err) {
      return error(res, err, 'Error when update dataset');
    }
  },
  getAllDataset: async (req, res) => {
    try {
      const Datasets = await DatasetModel.find().populate('createBy').populate('invites').populate('images');
      return success(res, Datasets, 'Get all dataset successfully');
    } catch (err) {
      return error(res, err, 'Error when get all dataset');
    }
  },
  getDatasetById: async (req, res) => {
    try {
      const { datasetId } = req.params;
      const Dataset = await DatasetModel.findById(datasetId)
        .populate('createBy')
        .populate('invites')
        .populate('images');
      return success(res, Dataset, 'Get dataset successfully');
    } catch (err) {
      return error(res, err, 'Error when get all dataset');
    }
  },
  getDatasetWithPermissions: async (req, res) => {
    try {
      const { userId } = req.params;
      const myDatasets = await DatasetModel.find({ createBy: userId })
        .populate('createBy')
        .populate('invites')
        .populate('images');
      const sharedDatasets = await DatasetModel.find({ invites: userId })
        .populate('createBy')
        .populate('invites')
        .populate('images');
      const Datasets = { myDatasets: myDatasets, sharedDatasets: sharedDatasets };
      return success(res, Datasets, 'Get dataset successfully');
    } catch (err) {
      return error(res, err, 'Error when get all dataset');
    }
  },
  getPublicDataset: async (req, res) => {
    try {
      const Datasets = await DatasetModel.find({ status: 'Public' })
        .populate('createBy')
        .populate('invites')
        .populate('images');
      return success(res, Datasets, 'Get public dataset successfully');
    } catch (err) {
      return error(res, err, 'Error when get all dataset');
    }
  },
  dropDataset: async (req, res) => {
    try {
      const { datasetId } = req.params;
      const Dataset = await DatasetModel.findByIdAndDelete(datasetId);
      return success(res, Dataset, 'Delete dataset successfully');
    } catch (err) {
      return error(res, err, 'Error when delete dataset');
    }
  },
};

export default DatasetController;
