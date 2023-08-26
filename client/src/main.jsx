import router from 'constants/routers';
import { AuthContextProvider } from 'contexts/Auth.context';
import { LoginModalProvider } from 'contexts/LoginModal.context';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <AuthContextProvider>
    <LoginModalProvider>
      <RouterProvider router={router} />
    </LoginModalProvider>
  </AuthContextProvider>,
  {
    /* </React.StrictMode>, */
  },
);
