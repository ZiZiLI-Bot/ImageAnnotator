import AxiosClient from '.';
import API_ENDPOINTS from 'constants/API_ENDPOINTS';

const DetectAPI = {
  detect: async (data) => {
    console.log(data);
    return await AxiosClient.post(API_ENDPOINTS.DETECT_IMAGE, data);
  },
};

export default DetectAPI;
