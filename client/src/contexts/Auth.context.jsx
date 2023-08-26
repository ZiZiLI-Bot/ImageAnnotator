import { createContext, useState } from 'react';

const AuthContext = createContext();
const initValue = {
  _id: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  token: '',
};

function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState(initValue);
  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthContextProvider };
