/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Button, Col, Modal, Row, Segmented, Space, Typography, notification } from 'antd';
import { CTDropdown, CTInput } from 'components/CTComponents';
import { AuthContext } from 'contexts/Auth.context';
import { LoginModalContext } from 'contexts/LoginModal.context';
import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from 'react';
import { BiLogInCircle, BiUser, BiUserCircle, BiUserPlus } from 'react-icons/bi';
import { MdKey, MdOutlineMail, MdPhoneIphone } from 'react-icons/md';
import { Link } from 'react-router-dom';
import AuthAPI from 'utils/api/Auth.api';
import illustrationsLogin from '../../assets/illustrationsLogin.svg';
import illustrationsRG from '../../assets/illustrationsRG.svg';

const { Title, Text } = Typography;

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

const loginForm = {
  email: '',
  password: '',
};
const registerForm = {
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

export default function Navbar() {
  const { loginModal, setLoginModal } = useContext(LoginModalContext);
  const { auth, setAuth } = useContext(AuthContext);
  const HandleModalLogin = (mode) => {
    setLoginModal({
      isOpen: true,
      mode,
    });
  };

  const handleLogout = () => {
    setAuth({
      _id: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      role: '',
      token: '',
    });
    Cookies.remove('token');
    notification.info({
      message: 'Logout Account!',
      duration: 1,
    });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const NOT_LOGIN = [
    {
      key: '1',
      label: (
        <Text className='text-green-900 text-base' onClick={() => HandleModalLogin('Account Login')}>
          Account Login
        </Text>
      ),
      icon: <BiLogInCircle className='text-green-900' size={20} />,
    },
    {
      key: '2',
      label: (
        <Text className='text-green-900 text-base' onClick={() => HandleModalLogin('Register Account')}>
          Register Account
        </Text>
      ),
      icon: <BiUserPlus className='text-green-900' size={20} />,
    },
  ];

  const USER_LOGIN = [
    {
      key: '1',
      label: <Text className='text-green-900 text-base'>User Profile</Text>,
      icon: <BiUserCircle className='text-green-900' size={20} />,
    },
    {
      key: '2',
      label: (
        <Text className='text-green-900 text-base' onClick={handleLogout}>
          Logout
        </Text>
      ),
      icon: <BiLogInCircle className='text-green-900' size={20} />,
    },
  ];

  const ADMIN_OPTIONS = [
    {
      key: '1',
      label: (
        <Text className='text-green-900 text-base' onClick={() => HandleModalLogin('Professional Account')}>
          Professional Account
        </Text>
      ),
      icon: <BiUserCircle className='text-green-900' size={20} />,
    },
    {
      key: '2',
      label: (
        <Text className='text-green-900 text-base' onClick={handleLogout}>
          Logout
        </Text>
      ),
      icon: <BiLogInCircle className='text-green-900' size={20} />,
    },
  ];

  const detectOption = () => {
    if (!auth._id) return NOT_LOGIN;
    if (auth.role === 'admin') {
      return ADMIN_OPTIONS;
    } else {
      return USER_LOGIN;
    }
  };
  return (
    <Row className='absolute w-9/12 h-20 flex items-center justify-between top-0 left-1/2 -translate-x-1/2 z-10'>
      <Link to='/'>
        <Title>I/A</Title>
      </Link>
      <Space size={120} className='items-end'>
        <CTDropdown items={detectOption()}>
          <Avatar
            className={`cursor-pointer flex justify-center items-center ${auth._id ? 'bg-green-600' : 'bg-gray-300'}`}
            size={45}
            icon={!auth._id ? <BiUser size={30} /> : null}
          >
            {auth._id ? auth.fullName.split(' ').at(-1).charAt(0) : null}
          </Avatar>
        </CTDropdown>
      </Space>
      <ModalLogin
        open={loginModal.isOpen}
        modalState={loginModal}
        setModalState={setLoginModal}
        auth={auth}
        setAuth={setAuth}
      />
    </Row>
  );
}

const ModalLogin = ({ open, modalState, setModalState, setAuth }) => {
  const [validate, setValidate] = useState({ filed: '', message: '' });
  const [loading, setLoading] = useState(false);
  const HandleCancelModalLogin = () => {
    setModalState({
      isOpen: false,
      mode: 'Account Login',
    });
  };

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (modalState.isOpen) {
          if (modalState.mode === 'Account Login') {
            handleSubmit('login');
          } else {
            handleSubmit('register');
          }
        }
      }
    });
    return () => {
      document.removeEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (modalState.isOpen) {
            if (modalState.mode === 'Account Login') {
              handleSubmit('login');
            } else {
              handleSubmit('register');
            }
          }
        }
      });
    };
  }, [modalState]);

  const handleOnChangeLogin = (value, type) => {
    if (validate.filed !== '') {
      setValidate({ filed: '', message: '' });
    }
    switch (type) {
      case 'email':
        loginForm.email = value;
        break;
      case 'password':
        loginForm.password = value;
        break;
      default:
        break;
    }
  };
  const handleOnChangeRegister = (value, type) => {
    if (validate.filed !== '') {
      setValidate({ filed: '', message: '' });
    }
    switch (type) {
      case 'fullName':
        registerForm.fullName = value;
        break;
      case 'email':
        registerForm.email = value;
        break;
      case 'phoneNumber':
        registerForm.phoneNumber = value;
        break;
      case 'password':
        registerForm.password = value;
        break;
      case 'confirmPassword':
        registerForm.confirmPassword = value;
        break;
      default:
        break;
    }
  };
  const handleSubmit = async (type) => {
    switch (type) {
      case 'login': {
        for (const [key, value] of Object.entries(loginForm)) {
          if (value === '') {
            setValidate({ filed: key, message: 'This field is required' });
            return;
          }
          if (key === 'email' && !isValidEmail(value)) {
            setValidate({ filed: key, message: 'Invalid email' });
            return;
          }
        }
        setLoading(true);
        const res = await AuthAPI.login(loginForm);
        if (res?.success) {
          notification.success({
            message: 'Login success',
            description: `Welcome back ${res.data.fullName}!`,
            duration: 2,
            placement: 'topRight',
          });
          setAuth({
            _id: res.data._id,
            fullName: res.data.fullName,
            email: res.data.email,
            phoneNumber: res.data.phoneNumber,
            role: res.data.role,
            token: res.data.token,
          });
          Cookies.set('token', res.data.token, { expires: 7 });
          setModalState({ isOpen: false, mode: 'Account Login' });
        } else {
          notification.error({
            message: 'Login failed',
            description: 'Email or password is incorrect',
            duration: 2,
            placement: 'topRight',
          });
        }
        setLoading(false);
        break;
      }
      case 'register': {
        for (const [key, value] of Object.entries(registerForm)) {
          if (value === '') {
            setValidate({ filed: key, message: 'This field is required' });
            return;
          }
          if (key === 'password' && value.length < 6) {
            setValidate({ filed: key, message: 'Password must be at least 6 characters' });
            return;
          }
          if (key === 'confirmPassword' && value !== registerForm.password) {
            setValidate({ filed: key, message: 'Confirm password not match' });
            return;
          }
          if (key === 'email' && !isValidEmail(value)) {
            setValidate({ filed: key, message: 'Invalid email' });
            return;
          }
        }
        setLoading(true);
        const res = await AuthAPI.register(registerForm);
        if (res?.success) {
          notification.success({
            message: 'Register success',
            description: 'You can login now!',
            duration: 2,
            placement: 'topRight',
          });
          setModalState({ isOpen: true, mode: 'Account Login' });
        } else {
          notification.error({
            message: 'Register failed',
            description: res?.message,
            duration: 2,
            placement: 'topRight',
          });
        }
        setLoading(false);
        break;
      }

      case 'registerPro': {
        for (const [key, value] of Object.entries(registerForm)) {
          if (value === '') {
            setValidate({ filed: key, message: 'This field is required' });
            return;
          }
          if (key === 'password' && value.length < 6) {
            setValidate({ filed: key, message: 'Password must be at least 6 characters' });
            return;
          }
          if (key === 'confirmPassword' && value !== registerForm.password) {
            setValidate({ filed: key, message: 'Confirm password not match' });
            return;
          }
          if (key === 'email' && !isValidEmail(value)) {
            setValidate({ filed: key, message: 'Invalid email' });
            return;
          }
        }
        setLoading(true);
        registerForm.role = 'professional';
        const res = await AuthAPI.register(registerForm);
        if (res?.success) {
          notification.success({
            message: 'Register success',
            description: 'You can login now!',
            duration: 2,
            placement: 'topRight',
          });
          // setModalState({ isOpen: true, mode: 'Account Login' });
        } else {
          notification.error({
            message: 'Register failed',
            description: res?.message,
            duration: 2,
            placement: 'topRight',
          });
        }
        setLoading(false);
        break;
      }

      default:
        break;
    }
  };
  return (
    <Modal
      title={<Text className='text-2xl'>{modalState.mode}</Text>}
      open={open}
      width='800px'
      onCancel={HandleCancelModalLogin}
      footer={[]}
    >
      <Row className='w-full h-full'>
        <Col span={10} className='flex items-center justify-start'>
          {modalState.mode === 'Account Login' ? (
            <img className='h-64 w-64' src={illustrationsLogin} alt='illustrationsLogin' />
          ) : (
            <img className='h-64 w-64' src={illustrationsRG} alt='illustrationsRG' />
          )}
        </Col>
        <Col span={14}>
          <div className='mt-3 w-full'>
            {!modalState.mode === 'Professional Account' && (
              <Segmented
                block
                options={['Account Login', 'Register Account']}
                value={modalState.mode}
                onChange={(value) => setModalState({ ...modalState, mode: value })}
              />
            )}
            {modalState.mode === 'Account Login' ? (
              <div className='w-full mt-3'>
                <div>
                  <CTInput
                    addonBefore={<MdOutlineMail size={20} className='text-gray-500' />}
                    className='w-full my-4'
                    title='Email'
                    onChange={(value) => handleOnChangeLogin(value, 'email')}
                  />
                  <CTInput
                    addonBefore={<MdKey size={20} className='text-gray-500' />}
                    type='password'
                    className='w-full my-4'
                    title='Password'
                    onChange={(value) => handleOnChangeLogin(value, 'password')}
                  />
                  <Text className='w-full block text-center text-red-700 text-base'>{validate.message}</Text>
                  <Button
                    size='large'
                    className='w-full bg-blue-600'
                    type='primary'
                    onClick={() => handleSubmit('login')}
                  >
                    Login
                  </Button>
                  <Text className='text-right block w-full cursor-pointer mt-1'>Forgot password?</Text>
                </div>
              </div>
            ) : (
              <Row>
                <div className='w-full'>
                  <div>
                    <CTInput
                      addonBefore={<MdOutlineMail size={20} className='text-gray-500' />}
                      className='w-full my-4'
                      title='Email'
                      error={validate.filed === 'email'}
                      onChange={(value) => handleOnChangeRegister(value, 'email')}
                    />
                    <Space size='small' className='w-full'>
                      <CTInput
                        addonBefore={<BiUserCircle size={20} className='text-gray-500' />}
                        title='Full Name'
                        error={validate.filed === 'fullName'}
                        className='w-full'
                        onChange={(value) => handleOnChangeRegister(value, 'fullName')}
                      />
                      <CTInput
                        addonBefore={<MdPhoneIphone size={20} className='text-gray-500' />}
                        title='Phone Number'
                        error={validate.filed === 'phoneNumber'}
                        className='w-full'
                        onChange={(value) => handleOnChangeRegister(value, 'phoneNumber')}
                      />
                    </Space>
                    <CTInput
                      addonBefore={<MdKey size={20} className='text-gray-500' />}
                      type='password'
                      className='w-full my-4'
                      title='Password'
                      error={validate.filed === 'password'}
                      onChange={(value) => handleOnChangeRegister(value, 'password')}
                    />
                    <CTInput
                      addonBefore={<MdKey size={20} className='text-gray-500' />}
                      type='password'
                      className='w-full my-4'
                      title='Confirm Password'
                      error={validate.filed === 'confirmPassword'}
                      onChange={(value) => handleOnChangeRegister(value, 'confirmPassword')}
                    />
                    <Text className='w-full block text-center text-red-700 text-base'>{validate.message}</Text>
                    <Button
                      size='large'
                      className='w-full text-white bg-green-600 hover:bg-green-500'
                      type=''
                      loading={loading}
                      onClick={() =>
                        handleSubmit(modalState.mode === 'Professional Account' ? 'registerPro' : 'register')
                      }
                    >
                      Register
                    </Button>
                    {!modalState.mode === 'Professional Account' && (
                      <Text
                        className='text-right block w-full cursor-pointer mt-1 text-gray-500'
                        onClick={() => setModalState({ ...modalState, mode: 'Account Login' })}
                      >
                        Already have an account?
                      </Text>
                    )}
                  </div>
                </div>
              </Row>
            )}
          </div>
        </Col>
      </Row>
    </Modal>
  );
};
