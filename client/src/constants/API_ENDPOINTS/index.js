const API_ENDPOINTS = {
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  LOG_WITH_JWT: 'auth/loginWithJWT',
  GET_ALL_USERS: 'auth/getAllUsers',
  CREATE_DATASET: 'dataset/create',
  UPDATE_DATASET: 'dataset/update',
  UPDATE_TAGS_DATASET: 'dataset/updateTags',
  GET_ALL_DATASETS: 'dataset/all',
  GET_DATASET_BY_CREATE_ID: 'dataset/me',
  GET_DATASET_ME_INVITE: 'dataset/invite',
  GET_DATASET_BY_ID: 'dataset',
  DELETE_DATASET: 'dataset/delete',
  CREATE_MULTIPLE_IMAGES: 'image/createMultipleImages',
  UPDATE_ANNOTATION: 'image/updateAnnotation',
  DELETE_IMAGE: 'image/delete',
  DETECT_IMAGE: 'detect/image',
  DETECT_HISTORY_BY_ID: `detect/history`,
  DELETE_DETECT_HISTORY: `detect/history`,
};

export default API_ENDPOINTS;
