import DatasetModel from '../models/Dataset.model';
import { error, success } from '../utils/Response';

const DatasetController = {
  createDataset: async (req, res) => {
    try {
      const { name, description, createBy, invites, images } = req.body;
      const newDataset = new DatasetModel({
        name,
        description,
        createBy,
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
  updateTagsDataset: async (req, res) => {
    const { _id, tags } = req.body;
    const dataset = DatasetModel.findById(_id);
    if (!dataset) {
      return error(res, null, 'Dataset not found');
    }
    let newTags = [];
    if (dataset.tags > 0) {
      newTags = [...dataset.tags, ...tags];
    } else {
      newTags = [...tags];
    }
    const setNewTags = new Set(newTags);
    const UpdateDataset = await DatasetModel.findByIdAndUpdate(_id, { tags: [...setNewTags] }, { new: true })
      .populate('createBy')
      .populate('invites')
      .populate('images');
    return success(res, UpdateDataset, 'Update dataset successfully');
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

  getDatasetMeInvite: async (req, res) => {
    try {
      const { userId } = req.params;
      const Datasets = await DatasetModel.find({ invites: userId })
        .populate('createBy')
        .populate('invites')
        .populate('images');
      return success(res, Datasets, 'Get dataset successfully');
    } catch (err) {
      return error(res, err, 'Error when get all dataset');
    }
  },

  getDatasetByCreateId: async (req, res) => {
    try {
      const { userId } = req.params;
      const Datasets = await DatasetModel.find({ createBy: userId })
        .populate('createBy')
        .populate('invites')
        .populate('images');
      return success(res, Datasets, 'Get dataset successfully');
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
