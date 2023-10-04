import axios from 'axios';
import { parse, stringify } from 'qs';
import Cookies from 'js-cookie';

const AxiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'content-type': 'application/json',
  },
  paramsSerializer: {
    encode: parse,
    serialize: stringify,
  },
});

AxiosClient.interceptors.request.use((config) => {
  if (Cookies.get('token')) {
    config.headers = {
      Authorization: `Bearer ${Cookies.get('token')}`,
    };
  }
  return config;
});

AxiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    console.error(error.response);
    return error.response;
  },
);
export default AxiosClient;
