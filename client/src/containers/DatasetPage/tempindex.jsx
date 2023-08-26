/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Collapse, ColorPicker, Empty, Row, Space, Typography, notification } from 'antd';
import { CTInput } from 'components/CTComponents';
import ImageAnnotator from 'components/ImageAnnotator';
import { AuthContext } from 'contexts/Auth.context';
import dayjs from 'dayjs';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DatasetAPI from 'utils/api/Dataset.api';
import ImageAPI from 'utils/api/Image.api';

const { Text, Title } = Typography;

 function DatasetPage() {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataset, setDataset] = useState();
  const [permission, setPermission] = useState();
  const [activeKeyForAccordion, setActiveKeyForAccordion] = useState();
  const [listImage, setListImage] = useState([]);
  const [imagesActive, setImagesActive] = useState();
  const [idImageActive, setIdImageActive] = useState();
  const [itemsBoundingBox, setItemsBoundingBox] = useState([]);
  const [items, setItems] = useState([]);
  useEffect(() => {
    setImagesActive(listImage.find((item) => item._id === imagesActive?._id));
    setItemsBoundingBox(imagesActive?.annotations);
    if (imagesActive?.annotations > 0) {
      imagesActive?.annotations.map((boundingBox, idx) => {
        setItems([
          ...items,
          {
            key: boundingBox._id,
            label: <Text className='text-xs'>{boundingBox.tagName}</Text>,
            children: (
              <Space direction='vertical' className='w-full'>
                <CTInput
                  className='w-full'
                  placeholder='TagName'
                  defaultValue={boundingBox.tagName}
                  onChange={(value) => handleChangeListBoundingBox(value, idx, 'tagName')}
                />
                <CTInput
                  className='w-full'
                  placeholder='Code'
                  defaultValue={boundingBox.code}
                  onChange={(value) => handleChangeListBoundingBox(value, idx, 'code')}
                />
                <CTInput
                  className='w-full'
                  placeholder='Description'
                  defaultValue={boundingBox.description}
                  onChange={(value) => handleChangeListBoundingBox(value, idx, 'description')}
                />
                <CTInput
                  className='w-full'
                  placeholder='Origin'
                  defaultValue={boundingBox.origin}
                  onChange={(value) => handleChangeListBoundingBox(value, idx, 'origin')}
                />
                <Space>
                  <Text className='text-base'>Color:</Text>
                  <ColorPicker
                    defaultValue={boundingBox.color}
                    showText
                    onChangeComplete={(value) => handleChangeListBoundingBox(value, idx, 'color')}
                  />
                </Space>
              </Space>
            ),
          },
        ]);
      });
    }
  }, [idImageActive, refresh]);

  useLayoutEffect(() => {
    const fetchDataset = async () => {
      setLoading(true);
      const res = await DatasetAPI.getDatasetById(id);
      if (res?.success) {
        setDataset(res.data);
        setListImage(res.data?.images);
        setImagesActive(res.data?.images[0]);
        setIdImageActive(res.data?.images[0]?._id);
        setItemsBoundingBox(res.data?.images[0]?.annotations);
        if (
          res.data.createBy._id === auth?._id ||
          res.data.invites.includes(auth?._id) ||
          (res.data.status === 'Public' && res.data.publicPermission === 'Edit')
        ) {
          setPermission('Edit');
        } else {
          setPermission('View');
        }
      }
      setLoading(false);
    };
    fetchDataset();
  }, [auth, refresh]);

  const handleDrawBox = (box) => {
    console.log(box);
    setItemsBoundingBox(box);
    const items = box.map((boundingBox, idx) => {
      return {
        key: boundingBox.id,
        label: <Text className='text-xs'>{boundingBox.tagName}</Text>,
        children: (
          <Space direction='vertical' className='w-full'>
            <CTInput
              className='w-full'
              placeholder='TagName'
              defaultValue={boundingBox.tagName}
              onChange={(value) => handleChangeListBoundingBox(value, idx, 'tagName')}
            />
            <CTInput
              className='w-full'
              placeholder='Code'
              defaultValue={boundingBox.code}
              onChange={(value) => handleChangeListBoundingBox(value, idx, 'code')}
            />
            <CTInput
              className='w-full'
              placeholder='Description'
              defaultValue={boundingBox.description}
              onChange={(value) => handleChangeListBoundingBox(value, idx, 'description')}
            />
            <CTInput
              className='w-full'
              placeholder='Origin'
              defaultValue={boundingBox.origin}
              onChange={(value) => handleChangeListBoundingBox(value, idx, 'origin')}
            />
            <Space>
              <Text className='text-base'>Color:</Text>
              <ColorPicker
                defaultValue={boundingBox.color}
                showText
                onChangeComplete={(value) => handleChangeListBoundingBox(value, idx, 'color')}
              />
            </Space>
          </Space>
        ),
      };
    });
    setItems(items);
    setActiveKeyForAccordion(box.at(-1).id);
  };

  const handleChangeListBoundingBox = (value, idx, filed) => {
    setItemsBoundingBox((pre) => {
      const newList = [...pre];
      newList[idx][filed] = value;
      return newList;
    });
  };

  const updateAnnotation = async () => {
    const data = {
      _id: idImageActive,
      annotations: itemsBoundingBox,
    };
    const res = await ImageAPI.updateAnnotation(data);
    if (res?.success) {
      console.log(res.data);
      notification.success({
        message: 'Update annotation success',
      });
      setRefresh(!refresh);
    }
  };

  return (
    <div className='pt-16'>
      {loading ? (
        <div>Loading...</div>
      ) : (
        dataset && (
          <div className='w-full mt-4'>
            <Row>
              <Col span={4} className='px-2' style={{ height: '85vh' }}>
                <Title level={3} className='block text-center'>
                  {dataset.name}
                </Title>
                <Text className='text-gray-500 text-md block'>Create by: {dataset.createBy.fullName}</Text>
                <Text className='text-gray-500 text-md block'>
                  Last update: {dayjs(dataset.updateAt).format('HH[h]-mm[m] DD/MM/YYYY')}
                </Text>
                <Text className='text-gray-500 text-md block'>Permission: {permission}</Text>
                <Text className='mt-5 block'>Tags:</Text>
                {itemsBoundingBox.length > 0 ? (
                  <>
                    <div className='overflow-auto' style={{ maxHeight: 400 }}>
                      <Collapse
                        accordion
                        activeKey={activeKeyForAccordion}
                        onChange={(value) => setActiveKeyForAccordion(value[0])}
                        items={items}
                      />
                    </div>
                    <Button onClick={updateAnnotation} className='mt-5'>
                      Update
                    </Button>
                  </>
                ) : (
                  <Empty />
                )}
              </Col>
              <Col
                span={19}
                className='bg-gray-300 w-full rounded-md relative overflow-hidden'
                style={{ height: '85vh' }}
              >
                {imagesActive && (
                  <ImageAnnotator
                    ListBoundingBox={itemsBoundingBox}
                    setListBoundingBox={setItemsBoundingBox}
                    drawBox={(box) => handleDrawBox(box)}
                    src={imagesActive?.url}
                    activeKey={activeKeyForAccordion}
                    auth={auth}
                    idImage={idImageActive}
                  />
                )}
              </Col>
              <Col span={1} className='bg-white'></Col>
            </Row>
          </div>
        )
      )}
    </div>
  );
}
