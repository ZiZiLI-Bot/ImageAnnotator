import API_ENDPOINTS from 'constants/API_ENDPOINTS';
import AxiosClient from '.';

const ImageAPI = {
  createMultipleImages: async (data) => {
    return await AxiosClient.post(API_ENDPOINTS.CREATE_MULTIPLE_IMAGES, { data });
  },
  updateAnnotation: async (data) => {
    return await AxiosClient.post(API_ENDPOINTS.UPDATE_ANNOTATION, data);
  },
  deleteImage: async (data) => {
    return await AxiosClient.delete(API_ENDPOINTS.DELETE_IMAGE, { data });
  },
};

export default ImageAPI;
