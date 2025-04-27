import React, {createContext, useState} from 'react';
import {storeData} from '../utils/storageUtils';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userData, setUserData] = useState(null);

  const updateUserData = async updatedUser => {
    if (updatedUser) {
      const newUserData = {...userData, ...updatedUser};
      setUserData(newUserData);
      await storeData('userData', newUserData);
    } else {
      setUserData(null);
    }
  };

  return (
    <AuthContext.Provider value={{userData, updateUserData}}>
      {children}
    </AuthContext.Provider>
  );
};
