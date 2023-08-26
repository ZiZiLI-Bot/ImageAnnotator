import { createContext, useState } from 'react';

const LoginModalContext = createContext();

function LoginModalProvider({ children }) {
  const [loginModal, setLoginModal] = useState({
    isOpen: false,
    mode: 'Account Login',
  });
  return <LoginModalContext.Provider value={{ loginModal, setLoginModal }}>{children}</LoginModalContext.Provider>;
}

export { LoginModalProvider, LoginModalContext };
