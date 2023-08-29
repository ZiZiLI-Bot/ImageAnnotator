import ImageModel from '../models/Image.model';
import DatasetModel from '../models/Dataset.model';
import { error, success } from '../utils/Response';

const ImageController = {
  createMultipleImages: async (req, res) => {
    const { data } = req.body;
    try {
      const newImages = await ImageModel.insertMany(data);
      return success(res, newImages, 'Create images successfully');
    } catch (err) {
      return error(res, err, 'Error when create images');
    }
  },
  updateAnnotation: async (req, res) => {
    const { _id, annotations } = req.body;
    try {
      const updatedImage = await ImageModel.findByIdAndUpdate(_id, { annotations }, { new: true });
      return success(res, updatedImage, 'Update annotation successfully');
    } catch (err) {
      return error(res, err, 'Error when update annotation');
    }
  },
  deleteImage: async (req, res) => {
    const { imageId, datasetId } = req.body;
    try {
      const deletedImage = await ImageModel.findByIdAndDelete(imageId);
      const dataset = await DatasetModel.findById(datasetId);
      if (dataset) {
        dataset.images = dataset.images.filter((image) => image._id !== imageId);
        await dataset.save();
      }
      return success(res, deletedImage, 'Delete image successfully');
    } catch (err) {
      return error(res, err, 'Error when delete image');
    }
  },
};
export default ImageController;
