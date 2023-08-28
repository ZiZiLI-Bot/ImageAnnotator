/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Empty,
  Image,
  Modal,
  Row,
  Space,
  Tooltip,
  Typography,
  notification,
} from 'antd';
import { CTDropdown, CTInput, CTUpload } from 'components/CTComponents';
import { AuthContext } from 'contexts/Auth.context';
import { LoginModalContext } from 'contexts/LoginModal.context';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { FcAddDatabase, FcAddImage, FcFullTrash, FcInternal, FcSettings, FcUpload } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import AuthAPI from 'utils/api/Auth.api';
import DatasetAPI from 'utils/api/Dataset.api';
import ImageAPI from 'utils/api/Image.api';
import UPLOAD_API from 'utils/api/Upload.api';
import styles from './HomePage.module.css';

const { Text, Title } = Typography;

let initDatasetForm = {
  name: '',
  description: '',
  images: [],
  invites: [],
};

export default function HomePage() {
  const [refresh, setRefresh] = useState(false);
  const [openCreateDataset, setOpenCreateDataset] = useState({ isOpen: false, mode: '' });
  const { auth } = useContext(AuthContext);
  const { setLoginModal } = useContext(LoginModalContext);
  const [loading, setLoading] = useState(false);
  const [MyDataset, setMyDataset] = useState([]);
  // const [PrivateDataset, setPrivateDataset] = useState([]);
  const [SelectDataset, setSelectDataset] = useState({});
  const [openDownloadDataset, setOpenDownloadDataset] = useState({ isOpen: false, mode: '' });

  const handleDropDataset = async (item) => {
    const dropDataset = async () => {
      if (item._id) {
        const res = await DatasetAPI.dropDataset(item._id);
        if (res.success) {
          notification.success({
            message: 'Drop dataset successfully',
          });
          setRefresh((prev) => !prev);
          Modal.destroyAll();
        }
      }
    };
    Modal.confirm({
      title: 'Do you want to drop this dataset?',
      content: 'This action cannot be undone',
      footer: (
        <div className='flex justify-end'>
          <Button type='' className='mt-4 mr-4' onClick={() => Modal.destroyAll()}>
            Cancel
          </Button>
          <Button type='' className='bg-red-600 hover:bg-red-500 text-white mt-4' danger onClick={dropDataset}>
            Drop
          </Button>
        </div>
      ),
    });
  };

  const ItemsMyDataset = [
    {
      key: '1',
      label: (
        <Text
          className='text-green-600 text-md'
          onClick={() => setOpenDownloadDataset({ isOpen: true, mode: 'download' })}
        >
          Downloads json
        </Text>
      ),
    },
    {
      key: '2',
      label: <Text className='text-yellow-600 text-md'>Edit info dataset</Text>,
    },
    {
      key: '3',
      label: (
        <Text className='text-red-600 text-md' onClick={() => handleDropDataset(SelectDataset)}>
          Drop dataset
        </Text>
      ),
    },
  ];

  const ItemsDataset = [
    {
      key: '1',
      label: (
        <Text
          className='text-green-600 text-md'
          onClick={() => setOpenDownloadDataset({ isOpen: true, mode: 'download' })}
        >
          Downloads json
        </Text>
      ),
    },
  ];

  useEffect(() => {
    const fetchDataset = async () => {
      setLoading(true);
      if (auth?._id) {
        const MyDataset = await DatasetAPI.getAllDatasets();
        if (MyDataset?.success) {
          setMyDataset(MyDataset?.data);
        }
      }
      setLoading(false);
    };
    fetchDataset();
  }, [refresh, auth]);

  const handleOpenCreateDataset = (value, mode) => {
    if (!auth._id) {
      notification.warning({
        message: 'You need to login to create dataset',
      });
      setLoginModal({ isOpen: true, mode: 'Account Login' });
    } else {
      setOpenCreateDataset({ isOpen: value, mode });
    }
  };

  return (
    <div className='relative w-full'>
      <span className={styles.main_Background} />
      <div className='py-20 container mx-auto px-16 z-10'>
        {auth?.role !== 'user' && (
          <Row className={`${styles.CreateDataset} hover:border-blue-800`}>
            <Col
              span={11}
              className='flex items-center justify-center flex-col group'
              onClick={() => handleOpenCreateDataset(true, 'create')}
            >
              <FcAddDatabase size={40} className='group-hover:scale-110 transition-all' />
              <Text className='text-xl group-hover:text-blue-800'>Create your new dataset</Text>
              <Text className='text-gray-400 mt-1'>
                {!auth._id ? 'You can an account to create dataset' : 'Click area to create your new dataset'}
              </Text>
            </Col>
            <Col span={2} className='w-full flex justify-center'>
              <Divider>Or</Divider>
            </Col>
            <Col
              span={11}
              className='flex items-center justify-center flex-col group'
              onClick={() => handleOpenCreateDataset(true, 'import')}
            >
              <FcUpload size={40} className='group-hover:scale-110 transition-all' />
              <Text className='text-xl group-hover:text-green-800'>Import dataset</Text>
              <Text className='text-gray-400 mt-1'>
                {!auth._id ? 'You can an account to create dataset' : 'Click area to import your dataset'}
              </Text>
            </Col>
          </Row>
        )}

        <Title className='mt-8' level={2}>
          Datasets:
        </Title>
        {!loading ? (
          <>
            {auth._id ? (
              <div>
                {MyDataset.length > 0 ? (
                  <Space wrap size='large'>
                    {MyDataset?.map((dataset) => (
                      <Card
                        key={dataset._id}
                        title={
                          <Space size='small'>
                            <Text className='text-blue-500 text-lg'>{dataset.name}</Text>
                            <CTDropdown items={ItemsMyDataset} useSelect={dataset} setSelect={setSelectDataset}>
                              <FcSettings cursor='pointer' />
                            </CTDropdown>
                            <Tooltip title='Download shuffle dataset'>
                              <FcInternal
                                size={20}
                                cursor='pointer'
                                onClick={() => {
                                  setOpenDownloadDataset({ isOpen: true, mode: 'shuffleDownload' });
                                  setSelectDataset(dataset);
                                }}
                              />
                            </Tooltip>
                          </Space>
                        }
                        extra={
                          <Link to={`/dataset/${dataset._id}`}>
                            <Button type='' size='small' className='text-white bg-green-600 hover:bg-green-500'>
                              Edit
                            </Button>
                          </Link>
                        }
                        className='w-64 bg-slate-50'
                      >
                        <Text className='block text-gray-500 text-base'>Create by: {dataset.createBy.fullName}</Text>
                        <Text className='block text-gray-500 text-base'>
                          Create at: {dayjs(dataset.createAt).format('DD/MM/YYYY')}
                        </Text>
                        <Text className='block text-gray-500 text-base'>Items: {dataset.images.length} images</Text>
                      </Card>
                    ))}
                  </Space>
                ) : (
                  <div className='flex items-center justify-center'>
                    <Empty description='No dataset here yet!' />
                  </div>
                )}
              </div>
            ) : (
              <div className='flex items-center justify-center'>
                <Empty description='You need login to view or create dataset!' />
              </div>
            )}
          </>
        ) : (
          <>
            <div className='flex items-center justify-center'>
              <Empty description='Loading...' />
            </div>
          </>
        )}
      </div>
      <ModalCreateDataset
        open={openCreateDataset}
        setModalState={setOpenCreateDataset}
        loading={loading}
        setLoading={setLoading}
        auth={auth}
        setRefresh={setRefresh}
      />
      <ModalDownloadDataset
        open={openDownloadDataset}
        setModalState={setOpenDownloadDataset}
        dataset={SelectDataset}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
}

const ModalDownloadDataset = ({ open, setModalState, loading, setLoading, dataset }) => {
  const HandleDownloadDataset = async () => {
    const fileName = dataset?.name + dataset._id + '.json';
    const jsonString = JSON.stringify(dataset);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Modal
      footer={[
        <Button key='Cancer' type='default' danger>
          Cancer
        </Button>,
      ]}
      title={
        open.mode === 'download' ? `Download Dataset: ${dataset?.name}` : `Download Shuffle Dataset: ${dataset?.name}`
      }
      open={open.isOpen}
      onCancel={() => setModalState(false)}
    >
      <div className='flex flex-col space-y-2'>
        <Text className='text-base'>You can download this json file:</Text>
        <Button onClick={HandleDownloadDataset} className='text-white bg-green-700 hover:bg-green-600' type=''>
          Download Json
        </Button>
        {open.mode === 'download' && (
          <>
            <Text className='text-base block'>Or you can view online:</Text>
            <Link target='_blank' to={`${import.meta.env.VITE_API_URL}/dataset/datasetId/${dataset._id}`}>
              <Text code>{`${import.meta.env.VITE_API_URL}/dataset/datasetId/${dataset._id}`}</Text>
            </Link>
          </>
        )}
      </div>
    </Modal>
  );
};

const ModalCreateDataset = ({ setModalState, open, loading, setLoading, auth, setRefresh }) => {
  const [formDataset, setFormDataset] = useState(initDatasetForm);
  const [imagesList, setImagesList] = useState([]);
  const [rawFileList, setRawFileList] = useState([]);
  const [ListUsers, setListUsers] = useState([]);
  const [listInvites, setListInvites] = useState([]);
  const [agree, setAgree] = useState(false);
  const [validate, setValidate] = useState({ filed: '', message: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      if (auth._id) {
        setLoading(true);
        const res = await AuthAPI.getAllUsers(auth._id);
        if (res?.success) {
          const listUsers = res.data.map((user) => ({ label: user.fullName, value: `${user.fullName}-${user._id}` }));
          setListUsers(listUsers);
          setLoading(false);
        }
      }
    };
    fetchUsers();
  }, [auth]);

  const handleUploadFile = (file, rawFile) => {
    setRawFileList([...rawFileList, ...rawFile]);
    setImagesList([...imagesList, ...file]);
  };
  const HandleDropImage = (item) => {
    const newImagesList = imagesList.filter((image) => image.uid !== item.uid);
    const newRawFileList = rawFileList.filter((file) => file.name !== item.name);
    setImagesList(newImagesList);
    setRawFileList(newRawFileList);
  };
  const HandleSubmit = async () => {
    console.log(formDataset);
    for (let [key, value] of Object.entries(formDataset)) {
      if (key === 'description') continue;
      if (key === 'images') continue;
      if (key === 'invites') continue;
      if (value === '') {
        setValidate({ filed: key, message: 'Filed is required' });
        return;
      }
    }
    setLoading(true);
    if (rawFileList.length > 0) {
      //Create dataset empty
      const createDataset = await DatasetAPI.createDataset({ ...formDataset, createBy: auth._id });
      console.log(createDataset);
      if (createDataset?.success) {
        const formData = new FormData();
        for (let i = 0; i < rawFileList.length; i++) {
          formData.append('file', rawFileList[i]);
        }
        //Upload files
        const URLImages = await UPLOAD_API.UploadFile(formData);
        if (URLImages?.success) {
          const dataImages = URLImages?.data.map((item) => ({
            name: item?.name,
            url: item?.url,
            dataset: createDataset?.data?._id,
          }));
          console.log(dataImages);
          //Create images
          const createImages = await ImageAPI.createMultipleImages(dataImages);
          console.log(createImages);
          if (createImages?.success) {
            const ListIdImages = createImages?.data.map((item) => item._id);
            //Update dataset with images after uploaded
            const updateDataset = await DatasetAPI.updateDataset(createDataset?.data?._id, ListIdImages);
            console.log(updateDataset);
            if (updateDataset?.success) {
              setLoading(false);
              setModalState(false);
              notification.success({
                message: 'Create dataset successfully',
              });
              setFormDataset(initDatasetForm);
              setRefresh((prev) => !prev);
            }
          }
        }
      }
    } else {
      const createDataset = await DatasetAPI.createDataset({ ...formDataset, createBy: auth._id });
      if (createDataset?.success) {
        setLoading(false);
        setModalState(false);
        notification.success({
          message: 'Create dataset successfully',
        });
        handleClearForm();
      }
    }
  };

  const handleClearForm = () => {
    setFormDataset(initDatasetForm);
    setImagesList([]);
    setRawFileList([]);
    // setStatusNewDataset('Private');
    setAgree(false);
  };

  const HandleOnChangeCreate = (filed, value) => {
    if (validate.filed !== '') setValidate({ filed: '', message: '' });
    switch (filed) {
      case 'invites': {
        setListInvites(value);
        const listInvites = value.map((item) => item.split('-')[1]);
        setFormDataset({ ...formDataset, [filed]: listInvites });
        break;
      }
      default: {
        setFormDataset({ ...formDataset, [filed]: value });
        break;
      }
    }
  };

  if (open.mode === 'create') {
    return (
      <Modal
        title='Create new dataset'
        footer={[
          <Button
            disabled={!agree}
            key='submit'
            type='primary'
            loading={loading}
            onClick={HandleSubmit}
            className='bg-blue-600'
          >
            Create
          </Button>,
        ]}
        open={open.isOpen}
        onOk={HandleSubmit}
        confirmLoading={loading}
        onCancel={() => setModalState(false)}
      >
        <CTUpload
          accept='image/*'
          className='w-full h-32 hover:border-blue-600'
          onChange={(file, formData) => handleUploadFile(file, formData)}
        >
          <div className='w-full h-full flex items-center justify-center my-3'>
            <FcAddImage size={40} className='group-hover:scale-125 transition-all' />
          </div>
          <Text className='text-sm block text-center group-hover:text-blue-600'>
            Only images format is supported, please do not choose any other format
          </Text>
          <Text className='text-sm block text-center text-gray-400'>
            Click or drag images to this area to start create dataset
          </Text>
        </CTUpload>
        {imagesList.length > 0 && (
          <div
            style={{ maxHeight: 210, overflow: 'auto' }}
            className='border border-dotted border-gray-600 rounded-md p-4 mt-2 bg-slate-100'
          >
            <Image.PreviewGroup>
              <div className='flex flex-wrap'>
                {imagesList.map((image) => (
                  <>
                    <Image key={image.uid} src={image.url} width={80} height={80} className='rounded-sm' />
                    <FcFullTrash
                      onClick={() => HandleDropImage(image)}
                      className='hover:bg-gray-200 cursor-pointer -translate-x-6 mt-1 rounded-sm'
                      size={20}
                    />
                  </>
                ))}
              </div>
            </Image.PreviewGroup>
          </div>
        )}
        <Row className='mt-4'>
          <Col span={12}>
            <CTInput
              title='Dataset Name'
              error={validate.filed === 'name'}
              className='px-1 py-1'
              value={formDataset.name}
              onChange={(value) => HandleOnChangeCreate('name', value)}
            />
          </Col>
          <Col span={12}>
            <CTInput
              title='Dataset Description'
              className='px-1 py-1'
              error={validate.filed === 'description'}
              value={formDataset.description}
              onChange={(value) => HandleOnChangeCreate('description', value)}
            />
          </Col>
          <Col span={24}>
            <CTInput
              className='w-full px-1 py-1'
              mode='select'
              selectMode='multiple'
              selectOptions={ListUsers}
              loading={loading}
              title='Invite users'
              value={listInvites}
              onChange={(value) => HandleOnChangeCreate('invites', value)}
            />
          </Col>
        </Row>
        <Text className='text-md text-red-600 block'>{validate.message}</Text>
        <Checkbox className='mt-2' checked={agree} onChange={(e) => setAgree(e.target.checked)}>
          <Text className='text-md text-gray-500'>I understand the rights to share data with the website</Text>
        </Checkbox>
      </Modal>
    );
  } else {
    return (
      <Modal
        title='Import dataset'
        footer={[
          <Button
            disabled={!agree}
            key='submit'
            type='primary'
            loading={loading}
            onClick={HandleSubmit}
            className='bg-blue-600'
          >
            Import
          </Button>,
        ]}
        open={open.isOpen}
        onOk={HandleSubmit}
        confirmLoading={loading}
        onCancel={() => setModalState(false)}
      >
        <CTUpload
          accept='*'
          className='w-full h-32 hover:border-blue-600'
          onChange={(file, formData) => handleUploadFile(file, formData)}
        >
          <div className='w-full h-full flex items-center justify-center my-3'>
            <FcUpload size={40} className='group-hover:scale-125 transition-all' />
          </div>
          <Text className='text-sm block text-center group-hover:text-blue-600'>Upload file dataset</Text>
          <Text className='text-sm block text-center text-gray-400'>
            Click or drag file to this area to import dataset
          </Text>
        </CTUpload>
      </Modal>
    );
  }
};
