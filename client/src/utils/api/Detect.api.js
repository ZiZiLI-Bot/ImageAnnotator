import AxiosClient from '.';
import API_ENDPOINTS from 'constants/API_ENDPOINTS';

const DetectAPI = {
  detect: async (data) => {
    console.log(data);
    return await AxiosClient.post(API_ENDPOINTS.DETECT_IMAGE, data);
  },
  getHistoryById: async (id) => {
    return await AxiosClient.get(API_ENDPOINTS.DETECT_HISTORY_BY_ID + `/${id}`);
  },
  deleteHistoryById: async (id) => {
    return await AxiosClient.delete(API_ENDPOINTS.DELETE_DETECT_HISTORY + `/${id}`);
  },
};

export default DetectAPI;
