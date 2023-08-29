const API_ENDPOINTS = {
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  LOG_WITH_JWT: 'auth/loginWithJWT',
  GET_ALL_USERS: 'auth/getAllUsers',
  CREATE_DATASET: 'dataset/create',
  UPDATE_DATASET: 'dataset/update',
  GET_ALL_DATASETS: 'dataset/all',
  GET_DATASET_BY_CREATE_ID: 'dataset/me',
  GET_DATASET_ME_INVITE: 'dataset/invite',
  GET_DATASET_BY_ID: 'dataset',
  DELETE_DATASET: 'dataset/delete',
  CREATE_MULTIPLE_IMAGES: 'image/createMultipleImages',
  UPDATE_ANNOTATION: 'image/updateAnnotation',
  DELETE_IMAGE: 'image/delete',
};

export default API_ENDPOINTS;
