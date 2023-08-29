/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Col,
  Collapse,
  ColorPicker,
  Drawer,
  Empty,
  Image,
  Row,
  Segmented,
  Space,
  Spin,
  Tooltip,
  Typography,
  message,
} from 'antd';
import { CTCustomObject, CTInput, CTUpload } from 'components/CTComponents';
import ImageAnnotator from 'components/ImageAnnotator';
import { AuthContext } from 'contexts/Auth.context';
import dayjs from 'dayjs';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { BiPointer, BiPurchaseTag, BiSolidChevronsLeft, BiTrash, BiZoomIn } from 'react-icons/bi';
import { FcAddImage, FcFullTrash } from 'react-icons/fc';
import { useParams } from 'react-router-dom';
import DatasetAPI from 'utils/api/Dataset.api';
import ImageAPI from 'utils/api/Image.api';
import UPLOAD_API from 'utils/api/Upload.api';

const { Text } = Typography;

const modeOptions = [
  {
    label: 'Add Tags',
    value: 'addTags',
    icon: <BiPurchaseTag className='inline' />,
  },
  {
    label: 'Select tag',
    value: 'selectTag',
    icon: <BiPointer className='inline' />,
  },
  {
    label: 'Zoom',
    value: 'zoom',
    icon: <BiZoomIn className='inline' />,
  },
];

export default function DatasetPage() {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [Loading, setLoading] = useState(false);
  const [mode, setMode] = useState('addTags');
  const [Dataset, setDataset] = useState([]);
  const [ItemsAccordion, setItemsAccordion] = useState([]);
  const [AccordionKey, setAccordionKey] = useState();
  const [ImageActive, setImageActive] = useState();
  const [ItemsBoundingBox, setItemsBoundingBox] = useState([]);
  const [UploadImage, setUploadImage] = useState([]);
  const [UploadImageRaw, setUploadImageRaw] = useState([]);
  const [openDrawerSelectImage, setOpenDrawerSelectImage] = useState(false);

  const renderItemsAccordion = () => {
    const items = ItemsBoundingBox?.map((item, idx) => ({
      key: item.id,
      label: (
        <Text className='text-base' style={{ color: item.color }}>
          {item.tagName}
        </Text>
      ),
      extra: (
        <Tooltip title='Drop tag'>
          <BiTrash className='inline text-red-600' size={18} onClick={() => handleDropTag(item)} />
        </Tooltip>
      ),
      children: (
        <Space direction='vertical' className='w-full'>
          <CTInput
            className='w-full flex items-center space-x-2'
            title='TagName'
            value={item?.tagName}
            onChange={(value) => handleChangeListBoundingBox(value, idx, 'tagName')}
          />
          <CTInput
            className='w-full flex items-center space-x-2'
            title='Code'
            value={item?.code}
            onChange={(value) => handleChangeListBoundingBox(value, idx, 'code')}
          />

          <CTCustomObject
            value={item?.moreInfo}
            onChange={(value) => handleChangeListBoundingBox(value, idx, 'moreInfo')}
          />

          <ColorPicker
            value={item.color}
            showText
            onChange={(value) => handleChangeListBoundingBox(value.toHexString(), idx, 'color')}
          />
        </Space>
      ),
    }));
    setItemsAccordion(items);
  };

  const handleChangeListBoundingBox = (value, idx, filed) => {
    setItemsBoundingBox((pre) => {
      const newList = [...pre];
      newList[idx][filed] = value;
      return newList;
    });
  };

  const handleDropTag = (item) => {
    const newBondingBox = ItemsBoundingBox.filter((box) => box.id !== item.id);
    setItemsBoundingBox(newBondingBox);
  };

  useLayoutEffect(() => {
    const fetchDataset = async () => {
      setLoading(true);
      const dataset = await DatasetAPI.getDatasetById(id);
      setDataset(dataset?.data);
      if (dataset?.success) {
        setImageActive(dataset?.data?.images[0]);
        setItemsBoundingBox(dataset?.data?.images[0]?.annotations);
      }
      setLoading(false);
    };
    fetchDataset();
  }, []);

  useEffect(() => {
    if (ItemsBoundingBox) {
      renderItemsAccordion();
    }
    console.log(ItemsBoundingBox);
  }, [ItemsBoundingBox]);

  const handleDrawBox = (box) => {
    setAccordionKey(box.at(-1).id);
    setItemsBoundingBox(box);
  };

  const HandleUpdateAnnotator = async () => {
    const data = {
      _id: ImageActive._id,
      annotations: ItemsBoundingBox,
    };
    const res = await ImageAPI.updateAnnotation(data);
    if (res?.success) {
      HandleChangeImageActive(res?.data);
      const newDataset = Dataset;
      newDataset.images = newDataset.images.map((image) => {
        if (image._id === res?.data._id) {
          return res?.data;
        }
        return image;
      });
      setDataset(newDataset);
      message.success(res?.message);
    } else {
      message.error(res?.message);
    }
  };

  const HandleDropImageWhenUpload = (item) => {
    const newUploadImage = UploadImage.filter((img) => img.uid !== item.uid);
    const newUploadImageRaw = UploadImageRaw.filter((img) => img.name !== item.name);
    setUploadImage(newUploadImage);
    setUploadImageRaw(newUploadImageRaw);
  };

  const HandleUploadImage = (file, formData) => {
    setUploadImage([...UploadImage, ...file]);
    setUploadImageRaw([...UploadImageRaw, ...formData]);
  };

  const handleSummitUploadImage = async () => {
    if (UploadImageRaw.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < UploadImageRaw.length; i++) {
        formData.append('file', UploadImageRaw[i]);
      }
      const URLImages = await UPLOAD_API.UploadFile(formData);
      if (URLImages?.success) {
        const dataImages = URLImages?.data.map((item) => ({
          name: item?.name,
          url: item?.url,
          dataset: id,
        }));
        console.log(dataImages);
        //Create images
        const createImages = await ImageAPI.createMultipleImages(dataImages);
        console.log(createImages);
        if (createImages?.success) {
          const listIdCurrentImages = Dataset.images.map((item) => item._id);
          const ListIdImages = [createImages?.data.map((item) => item._id), ...listIdCurrentImages].flat();
          //Update dataset with images after uploaded
          const updateDataset = await DatasetAPI.updateDataset(id, ListIdImages);
          console.log(updateDataset);
          if (updateDataset?.success) {
            message.success({
              message: 'Update image to dataset successfully',
            });
            setTimeout(() => {
              window.location.reload();
            }, 300);
          }
        }
      }
    }
  };

  const HandleChangeImageActive = (image) => {
    setImageActive(image);
    setItemsBoundingBox(image?.annotations);
  };

  const HandleDeleteImage = async (id) => {
    const data = {
      datasetId: Dataset._id,
      imageId: id,
    };
    const res = await ImageAPI.deleteImage(data);
    if (res?.success) {
      const newDataset = Dataset;
      newDataset.images = newDataset.images.filter((image) => image._id !== id);
      setDataset(newDataset);
      HandleChangeImageActive(newDataset.images[0]);
      message.success(res?.message);
    } else {
      message.error(res?.message);
    }
  };

  return (
    <Row className='pt-20'>
      {!Loading ? (
        <>
          <Col span={5} className='mt-8 px-4'>
            <Space direction='vertical' size='small'>
              <Text className='text-base block'>Dataset: {Dataset?.name};</Text>
              <Text className='text-base block'>Create By: {Dataset?.createBy?.fullName};</Text>
              <Text className='text-base block'>
                Last Update: {dayjs(ImageActive?.updatedAt).format('hh[h]:mm[m] DD/MM/YYYY')};
              </Text>
            </Space>
            <Text className='text-base block mt-4'>Tags:</Text>
            {ItemsAccordion.length > 0 ? (
              <>
                <div className='overflow-auto relative' style={{ maxHeight: 350 }}>
                  <Collapse
                    accordion
                    activeKey={AccordionKey}
                    items={ItemsAccordion}
                    onChange={(value) => setAccordionKey(value[0])}
                  />
                </div>
                <Button
                  className='w-full text-white mt-3 bg-green-600 hover:bg-green-500'
                  type=''
                  onClick={HandleUpdateAnnotator}
                >
                  Update
                </Button>
              </>
            ) : (
              <Empty description='Tag not detected' />
            )}
          </Col>
          <Col span={19} className='w-full' style={{ height: '82vh' }}>
            <div className='w-full h-9 flex justify-between'>
              <Space>
                <Text className='text-base'>Mode: </Text>
                <Segmented onChange={(value) => setMode(value)} options={modeOptions} />
              </Space>
            </div>
            <div className='bg-slate-200 w-full h-full flex rounded-lg'>
              <div className='flex-1 rounded-lg flex items-center justify-center'>
                {ImageActive ? (
                  <ImageAnnotator
                    ListBoundingBox={ItemsBoundingBox}
                    setListBoundingBox={setItemsBoundingBox}
                    drawBox={(box) => handleDrawBox(box)}
                    src={ImageActive?.url}
                    activeKey={AccordionKey}
                    auth={auth}
                    idImage={ImageActive._id}
                    mode={mode}
                    onSelectTag={(tagId) => setAccordionKey(tagId)}
                  />
                ) : (
                  <div className='w-1/3 h-32'>
                    <CTUpload
                      accept={['image/png', 'image/jpeg', 'image/jpg', 'image/webp']}
                      multiple={true}
                      className='w-full h-full hover:border-blue-600'
                      onChange={(file, formData) => HandleUploadImage(file, formData)}
                    >
                      <div className='w-full h-full flex items-center justify-center my-3'>
                        <FcAddImage size={40} className='group-hover:scale-125 transition-all' />
                      </div>
                      <Text className='text-sm block text-center group-hover:text-blue-600 transition-colors'>
                        There are no images in this dataset
                      </Text>
                      <Text className='text-sm block text-center text-gray-400'>
                        Click or drag images to this area to start create dataset
                      </Text>
                    </CTUpload>
                    {UploadImage?.length > 0 && (
                      <>
                        <div
                          style={{ maxHeight: 300, overflow: 'auto' }}
                          className='border border-dotted border-gray-600 rounded-md p-4 mt-2 bg-slate-100'
                        >
                          <Image.PreviewGroup>
                            <div className='flex flex-wrap'>
                              {UploadImage.map((image) => (
                                <>
                                  <Image
                                    key={image.uid}
                                    src={image.url}
                                    width={80}
                                    height={80}
                                    className='rounded-sm'
                                  />
                                  <FcFullTrash
                                    onClick={() => HandleDropImageWhenUpload(image)}
                                    className='hover:bg-gray-200 cursor-pointer -translate-x-6 mt-1 rounded-sm'
                                    size={20}
                                  />
                                </>
                              ))}
                            </div>
                          </Image.PreviewGroup>
                        </div>
                        <Button
                          onClick={handleSummitUploadImage}
                          className='w-full bg-green-600 hover:bg-green-500 text-white mt-2'
                          type=''
                        >
                          Upload
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className='w-6 bg-white flex items-center'>
                <div
                  onClick={() => setOpenDrawerSelectImage(true)}
                  className='bg-slate-500 h-12 w-full rounded-l-md flex items-center justify-center cursor-pointer'
                >
                  <BiSolidChevronsLeft color='white' />
                </div>
              </div>
            </div>
            <div className='w-full h-6'>{ImageActive?.name}</div>
          </Col>
        </>
      ) : (
        <div className='w-full flex flex-col items-center justify-center' style={{ height: '80vh' }}>
          <Spin size='large' />
          <Text className='text-3xl mt-4'>Loading...</Text>
        </div>
      )}
      <Drawer
        title='Dataset Images'
        placement='right'
        closable={false}
        onClose={() => setOpenDrawerSelectImage(false)}
        open={openDrawerSelectImage}
      >
        <div className='w-full overflow-auto' style={{ height: 600 }}>
          {Dataset?.images?.map((image) => (
            <Row key={image._id} className='w-full h-32 mt-2 rounded-sm hover:bg-slate-200 transition-colors'>
              <Col span={12} className='flex flex-col items-center justify-center'>
                <Image crossOrigin='anonymous' src={image.url} width={100} height={100} />
                <Text className='text-xs block line-clamp-1'>{image.name}</Text>
              </Col>
              <Col span={12} className='flex items-center justify-center'>
                <Space direction='vertical'>
                  <Button
                    type=''
                    className='bg-red-600 hover:bg-red-500 text-white'
                    onClick={() => HandleDeleteImage(image._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    type=''
                    onClick={() => HandleChangeImageActive(image)}
                    className='bg-blue-600 hover:bg-blue-500 text-white'
                  >
                    Select
                  </Button>
                </Space>
              </Col>
            </Row>
          ))}
        </div>
        {Dataset.images?.length > 0 && (
          <>
            <CTUpload
              accept={['image/png', 'image/jpeg', 'image/jpg', 'image/webp']}
              multiple={true}
              className='w-full h-36 hover:border-blue-600 mt-2'
              onChange={(file, formData) => HandleUploadImage(file, formData)}
            >
              <div className='w-full h-full flex items-center justify-center my-3'>
                <FcAddImage size={40} className='group-hover:scale-125 transition-all' />
              </div>
              <Text className='text-sm block text-center group-hover:text-blue-600 transition-colors'>
                Add images to this dataset
              </Text>
              <Text className='text-sm block text-center text-gray-400'>
                Click or drag images to this area to add images
              </Text>
            </CTUpload>
            {UploadImage?.length > 0 && (
              <>
                <div
                  style={{ maxHeight: 300, overflow: 'auto' }}
                  className='border border-dotted border-gray-600 rounded-md p-4 mt-2 bg-slate-100'
                >
                  <Image.PreviewGroup>
                    <div className='flex flex-wrap'>
                      {UploadImage.map((image) => (
                        <>
                          <Image key={image.uid} src={image.url} width={80} height={80} className='rounded-sm' />
                          <FcFullTrash
                            onClick={() => HandleDropImageWhenUpload(image)}
                            className='hover:bg-gray-200 cursor-pointer -translate-x-6 mt-1 rounded-sm'
                            size={20}
                          />
                        </>
                      ))}
                    </div>
                  </Image.PreviewGroup>
                </div>
                <Button
                  onClick={handleSummitUploadImage}
                  className='w-full bg-green-600 hover:bg-green-500 text-white mt-2'
                  type=''
                >
                  Upload
                </Button>
              </>
            )}
          </>
        )}
      </Drawer>
    </Row>
  );
}
