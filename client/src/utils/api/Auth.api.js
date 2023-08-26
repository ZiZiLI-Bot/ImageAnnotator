import API_ENDPOINTS from 'constants/API_ENDPOINTS';
import AxiosClient from '.';

const AuthAPI = {
  login: async (data) => {
    return await AxiosClient.post(API_ENDPOINTS.LOGIN, data);
  },
  register: async (data) => {
    return await AxiosClient.post(API_ENDPOINTS.REGISTER, data);
  },
  logWithJWT: async (data) => {
    return await AxiosClient.get(API_ENDPOINTS.LOG_WITH_JWT, data);
  },
  getAllUsers: async (uid) => {
    const res = await AxiosClient.get(API_ENDPOINTS.GET_ALL_USERS);
    if (res.success) {
      const data = res?.data.filter((user) => user._id !== uid);
      return { ...res, data };
    } else {
      return res;
    }
  },
};

export default AuthAPI;
