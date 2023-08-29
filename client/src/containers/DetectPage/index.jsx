/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Drawer, Image, Row, Segmented, Space, Typography } from 'antd';
import { CTUpload } from 'components/CTComponents';
import { AuthContext } from 'contexts/Auth.context';
import dayjs from 'dayjs';
import { useContext, useLayoutEffect, useState } from 'react';
import { BiChevronsRight } from 'react-icons/bi';
import { FcAddImage, FcFlashOn, FcMindMap, FcPrevious } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const history = [
  {
    name: 'YOLOv6',
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
        <Text className='text-lg font-bold'>YOLOv6</Text>
      </div>
    ),
    value: 'yolov6',
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
  const [model, setModel] = useState('yolov6');
  const [image, setImage] = useState(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (!auth._id) {
      navigate('/');
    }
    localStorage.setItem('fullView', FullView);
  }, [FullView, auth]);

  const handleLoadImage = (file, formData) => {

    setImage(file);
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
            <Segmented defaultValue={model} size='large' options={options} onChange={(value) => setModel(value)} />
          </div>
          {image ? (
            <Row style={{ height: '85vh' }}>
              <Col span={11} className='flex flex-col items-center justify-center'>
                <img className='w-3/4 rounded-md' src={image[0].url} alt='Image' />
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
              <Col span={11} className='flex items-center justify-center relative'>
                <Button
                  size='large'
                  type=''
                  className='absolute text-white left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 bg-blue-500 hover:bg-blue-600 transition-colors'
                >
                  Detect
                </Button>
                <img className='w-3/4 rounded-md grayscale' src={image[0].url} alt='Image' />
              </Col>
            </Row>
          ) : (
            <div className='w-full flex items-center justify-center' style={{ height: '85vh' }}>
              <div className='w-1/3 h-40'>
                <CTUpload
                  accept={['image/png', 'image/jpeg', 'image/jpg', 'image/webp']}
                  onChange={(file, formData) => handleLoadImage(file, formData)}
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
                <MenuContainer setFullView={setFullView} FullView={FullView} />
              </Drawer>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}

const MenuContainer = ({ setFullView, FullView }) => {
  return (
    <>
      <div className='flex space-x-2 px-3 mb-4'>
        <Button className='flex-1' type='dashed' size='large'>
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
