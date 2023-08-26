import ImageModel from '../models/Image.model';
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
};
export default ImageController;
