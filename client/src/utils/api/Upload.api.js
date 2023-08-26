import AxiosClient from '.';

const UPLOAD_API = {
  DropFile: async (fileName) => {
    const url = '/uploads/drop';
    return await AxiosClient.post(url, { fileName });
  },
  UploadFile: async (file) => {
    const url = '/uploads';
    return await AxiosClient.post(url, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default UPLOAD_API;
