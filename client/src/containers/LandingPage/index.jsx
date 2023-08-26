import { Button, Col, Row, Typography } from 'antd';
import illustrationsLD from '../../assets/illustrationsLD.svg';
import styles from './LandingPage.module.css';
import { Link } from 'react-router-dom';

const { Text } = Typography;

export default function LandingPage() {
  return (
    <div className={styles.main}>
      <Row className='container mx-auto px-12 pt-20 h-full'>
        <Col span={12} className='flex flex-col justify-center h-full pl-6'>
          <div style={{ maxWidth: 670 }}>
            <Text className='text-3xl font-bold block'>Image Annotator</Text>
            <Text className={styles.landingText}>
              Label training for images related to electronic components, used for model YOLOv4
            </Text>
          </div>
          <div>
            <Link to='/home'>
              <Button className='mt-8 bg-blue-500' type='primary' size='large'>
                Get Started
              </Button>
            </Link>
          </div>
        </Col>
        <Col span={12} className='flex items-center justify-center'>
          <img src={illustrationsLD} alt='Illustrations Landing page' />
        </Col>
      </Row>
    </div>
  );
}
