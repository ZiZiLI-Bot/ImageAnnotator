import API_ENDPOINTS from 'constants/API_ENDPOINTS';
import AxiosClient from '.';

const DatasetAPI = {
  createDataset: async (data) => {
    return await AxiosClient.post(API_ENDPOINTS.CREATE_DATASET, data);
  },
  getAllDatasets: async () => {
    return await AxiosClient.get(API_ENDPOINTS.GET_ALL_DATASETS);
  },
  getDatasetById: async (datasetId) => {
    return await AxiosClient.get(`${API_ENDPOINTS.GET_DATASET_WITH_DATASET_ID}/${datasetId}`);
  },
  getMyDatasets: async (userId) => {
    return await AxiosClient.get(`${API_ENDPOINTS.GET_DATASET_WITH_ID}/${userId}`);
  },
  getPublicDatasets: async () => {
    return await AxiosClient.get(API_ENDPOINTS.GET_PUBLIC_DATASETS);
  },
  updateDataset: async (_id, data) => {
    return await AxiosClient.put(API_ENDPOINTS.UPDATE_DATASET, { _id, images: data });
  },
  dropDataset: async (datasetId) => {
    return await AxiosClient.delete(`${API_ENDPOINTS.DELETE_DATASET}/${datasetId}`);
  },
};

export default DatasetAPI;
