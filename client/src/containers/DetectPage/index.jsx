/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Drawer, Image, Row, Segmented, Space, Typography, notification } from 'antd';
import { CTUpload } from 'components/CTComponents';
import { AuthContext } from 'contexts/Auth.context';
import dayjs from 'dayjs';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { BiChevronsRight } from 'react-icons/bi';
import { FcAddImage, FcFlashOn, FcMindMap, FcPrevious } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import DetectAPI from 'utils/api/Detect.api';
import UPLOAD_API from 'utils/api/Upload.api';

const { Text } = Typography;

const history = [
  {
    name: 'YOLOv5',
    date: Date.now(),
  },
  {
    name: 'YOLOv8',
    date: Date.now(),
  },
];

const options = [
  {
    label: (
      <div className='flex space-x-2 items-center mt-1 px-5'>
        <FcMindMap className='inline' size={22} />
        <Text className='text-lg font-bold'>YOLOv5</Text>
      </div>
    ),
    value: 'yolov5',
  },
  {
    label: (
      <div className='flex space-x-2 items-center mt-1 px-5'>
        <FcFlashOn className='inline' size={22} />
        <Text className='text-lg font-bold'>YOLOv8</Text>
      </div>
    ),
    value: 'yolov8',
  },
];

export default function DetectPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [FullView, setFullView] = useState(localStorage.getItem('fullView') === 'true');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [model, setModel] = useState('yolov8');
  const [image, setImage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageName, setImageName] = useState('');
  const [imageDetect, setImageDetect] = useState(null);

  useEffect(() => {
    localStorage.setItem('fullView', FullView);
  }, [FullView, auth]);

  const handleLoadImage = async (file, originFile) => {
    setImage(file);
    const undiscoveredImage = {
      url: file[0].url,
      isDiscovered: false,
    };
    setImageDetect(undiscoveredImage);
    setLoading(true);
    const formData = new FormData();
    formData.append('file', originFile[0]);
    const uploadImage = await UPLOAD_API.UploadFile(formData);
    if (uploadImage.success) {
      setImageName(uploadImage?.data[0].url.split('/').at(-1));
      console.log(uploadImage);
      setLoading(false);
    } else {
      setLoading(false);
      notification.error({ message: 'Upload image failed!' });
    }
  };

  const handleReset = () => {
    setImage(null);
    setImageDetect(null);
    setImageName('');
  };

  const handleDetect = async () => {
    setLoading(true);
    const detectImage = await DetectAPI.detect({
      image_name: imageName,
      uid: auth._id,
      model: model === 'yolov8' ? 'YOLOv8_best.onnx' : 'YOLOv5_best.onnx',
    });
    if (detectImage.success) {
      console.log(detectImage);
      setImageDetect({
        url: detectImage?.data.resultImage,
        isDiscovered: true,
      });
      notification.success({ message: 'Detect image successfully!' });
    } else {
      notification.error({ message: 'Detect image failed!' });
    }
    setLoading(false);
  };

  return (
    <div className='pt-20 h-screen'>
      <Row className='h-full w-full rounded-md relative'>
        <Col span={FullView ? 0 : 4} className='h-full w-full rounded-md'>
          {!FullView && <MenuContainer setFullView={setFullView} />}
        </Col>
        <Col span={FullView ? 24 : 20} className='bg-slate-50 w-full h-full rounded-lg'>
          <Text className='text-5xl font-bold text-gray-300 absolute top-24 left-1/2 -translate-x-1/2 select-none'>
            Detect components
          </Text>
          <div className='absolute -top-10 left-1/2 -translate-x-1/2 z-20'>
            {/* <Segmented defaultValue={model} size='large' options={options} onChange={(value) => setModel(value)} /> */}
          </div>
          {image ? (
            <Row style={{ height: '85vh' }}>
              <Col span={11} className='flex flex-col items-center justify-center'>
                <img crossOrigin='anonymous' className='w-3/4 rounded-md' src={image[0].url} alt='Image' />
                <Button className='mt-1' onClick={() => setVisible(true)}>
                  Preview
                </Button>
                <Image
                  width={200}
                  style={{
                    display: 'none',
                  }}
                  preview={{
                    visible,
                    src: image[0].url,
                    onVisibleChange: (value) => {
                      setVisible(value);
                    },
                  }}
                />
              </Col>
              <Col span={2} className='flex flex-col items-center justify-center'>
                <BiChevronsRight size={40} className='animationBounce' />
              </Col>
              <Col span={11} className='flex flex-col items-center justify-center relative'>
                {imageDetect.isDiscovered ? (
                  <>
                    <div className={`w-3/4 rounded-md overflow-hidden`}>
                      <Image src={imageDetect.url} crossOrigin='anonymous' width='100%' height='100%' />
                    </div>
                    <Button type='' className='text-white mt-1 bg-green-500 hover:bg-green-600'>
                      Download
                    </Button>
                  </>
                ) : (
                  <>
                    <img
                      className={`w-3/4 rounded-md ${!imageDetect.isDiscovered && 'grayscale'}`}
                      crossOrigin='anonymous'
                      src={imageDetect.url}
                      alt='Image'
                    />
                    <Button
                      size='large'
                      type=''
                      onClick={handleDetect}
                      className='text-white mt-1 bg-blue-500 hover:bg-blue-600 transition-colors'
                    >
                      Detect
                    </Button>
                  </>
                )}
              </Col>
            </Row>
          ) : (
            <div className='w-full flex items-center justify-center' style={{ height: '85vh' }}>
              <div className='w-1/3 h-40'>
                <CTUpload
                  accept={['image/png', 'image/jpeg', 'image/jpg', 'image/webp']}
                  onChange={(file, originFile) => handleLoadImage(file, originFile)}
                  multiple={false}
                  className='w-full h-full hover:border-blue-600'
                >
                  <div className='w-full h-full flex items-center justify-center my-3'>
                    <FcAddImage size={40} className='group-hover:scale-125 transition-all' />
                  </div>
                  <Text className='text-sm block text-center group-hover:text-blue-600 transition-colors'>
                    Upload your image
                  </Text>
                  <Text className='text-sm block text-center text-gray-400'>
                    One state only support single image with format: png, jpg, jpeg, webp
                  </Text>
                </CTUpload>
              </div>
            </div>
          )}
          {FullView && (
            <>
              <Button className='absolute top-1 left-1' size='large' onClick={() => setFullView(false)}>
                <FcPrevious className='rotate-180' size={18} />
              </Button>
              <div
                onClick={() => setOpenDrawer(true)}
                className='absolute left-0 top-1/2 -translate-y-1/2 px-1 py-2 bg-gray-300 cursor-pointer rounded-r-md'
              >
                <BiChevronsRight size={20} />
              </div>
              <Drawer closable={false} placement='left' onClose={() => setOpenDrawer(false)} open={openDrawer}>
                <MenuContainer setFullView={setFullView} FullView={FullView} reset={() => handleReset()} />
              </Drawer>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}

const MenuContainer = ({ setFullView, FullView, reset }) => {
  return (
    <>
      <div className='flex space-x-2 px-3 mb-4'>
        <Button className='flex-1' type='dashed' size='large' onClick={() => reset()}>
          New state
        </Button>
        {!FullView && (
          <Button size='large' onClick={() => setFullView(true)}>
            <FcPrevious size={18} />
          </Button>
        )}
      </div>
      <Text className='text-xl block font-bold ml-3'>History</Text>
      <Space direction='vertical' className='w-full mt-4'>
        {history.map((item, index) => (
          <div
            key={index}
            className='group w-full flex items-center justify-between h-16 px-3 rounded-md cursor-pointer hover:bg-gray-200 transition-colors'
          >
            <div>
              <Text className='text-base block'>{dayjs(item.date).format('hh[h]:m[m] DD/MM/YYYY')}</Text>
              <Text className='text-base block'>{item.name}</Text>
            </div>
            <Text className='text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity'>View</Text>
          </div>
        ))}
      </Space>
    </>
  );
};
