import { message } from 'antd';
import Navbar from 'components/Navbar';
import { AuthContext } from 'contexts/Auth.context';
import Cookies from 'js-cookie';
import { useContext, useLayoutEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AuthAPI from 'utils/api/Auth.api';

export default function App() {
  const { auth, setAuth } = useContext(AuthContext);
  useLayoutEffect(() => {
    if (!auth._id) {
      const token = Cookies.get('token');
      if (token) {
        const getMe = async () => {
          const res = await AuthAPI.logWithJWT(token);
          if (res?.success) {
            setAuth({
              _id: res.data._id,
              fullName: res.data.fullName,
              email: res.data.email,
              phoneNumber: res.data.phoneNumber,
              role: res.data.role,
              token: token,
            });
          } else {
            Cookies.remove('token');
            message.error('Token is invalid, please login again');
          }
        };
        getMe();
      }
    }
  }, []);
  return (
    <div className='relative'>
      <Navbar />
      <div className='w-full h-full'>
        <Outlet />
      </div>
    </div>
  );
}
