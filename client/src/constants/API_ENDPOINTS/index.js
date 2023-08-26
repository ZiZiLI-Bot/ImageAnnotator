const API_ENDPOINTS = {
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  LOG_WITH_JWT: 'auth/loginWithJWT',
  GET_ALL_USERS: 'auth/getAllUsers',
  CREATE_DATASET: 'dataset/create',
  UPDATE_DATASET: 'dataset/update',
  GET_ALL_DATASETS: 'dataset/all',
  GET_DATASET_WITH_ID: 'dataset/permissions',
  GET_DATASET_WITH_DATASET_ID: 'dataset/datasetId',
  DELETE_DATASET: 'dataset/delete',
  GET_PUBLIC_DATASETS: 'dataset/public',
  CREATE_MULTIPLE_IMAGES: 'image/createMultipleImages',
  UPDATE_ANNOTATION: 'image/updateAnnotation',
};

export default API_ENDPOINTS;
