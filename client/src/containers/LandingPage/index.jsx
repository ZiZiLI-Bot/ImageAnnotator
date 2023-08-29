import { Button, Col, Row, Space, Typography, notification } from 'antd';
import { AuthContext } from 'contexts/Auth.context';
import { LoginModalContext } from 'contexts/LoginModal.context';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import illustrationsLD from '../../assets/illustrationsLD.svg';
import styles from './LandingPage.module.css';

const { Text } = Typography;

export default function LandingPage() {
  const { auth } = useContext(AuthContext);
  const { setLoginModal } = useContext(LoginModalContext);
  const navigate = useNavigate();
  const navigateToTraining = () => {
    if (!auth._id) {
      notification.warning({ message: 'You need login to continue!' });
      setLoginModal({ isOpen: true, mode: 'Account Login' });
      return;
    }
    if (auth.role === 'user') {
      notification.warning({
        message: 'You do not have permission to access training!',
        description: 'Please contact admin to get more info!',
      });
      return;
    }
    navigate('/training');
  };

  const navigateToDetect = () => {
    console.log(auth);
    if (!auth._id) {
      notification.warning({ message: 'You need login to continue!' });
      setLoginModal({ isOpen: true, mode: 'Account Login' });
      return;
    }
    navigate('/detect');
  };
  return (
    <div className={styles.main}>
      <Row className='container mx-auto px-12 pt-20 h-full'>
        <Col span={12} className='flex flex-col justify-center h-full pl-6'>
          <div style={{ maxWidth: 670 }}>
            <Text className='text-3xl font-bold block'>Image Annotator</Text>
            <Text className={styles.landingText}>Label training and detect electronic components through images.</Text>
          </div>
          <Space>
            <Button className='mt-8 bg-blue-500' type='primary' size='large' onClick={navigateToDetect}>
              Detect Component
            </Button>
            <Button className='mt-8 bg-blue-500' type='primary' size='large' onClick={navigateToTraining}>
              Label training
            </Button>
          </Space>
        </Col>
        <Col span={12} className='flex items-center justify-center'>
          <img src={illustrationsLD} alt='Illustrations Landing page' />
        </Col>
      </Row>
    </div>
  );
}
