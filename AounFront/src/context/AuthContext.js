import React, {createContext, useState} from 'react';
import {storeData} from '../utils/storageUtils';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userData, setUserData] = useState();

  //Function to update user data globally
  const updateUserData = async updatedUser => {
    const newUserData = {...userData, ...updatedUser};
    setUserData(newUserData);
    await storeData('userData', newUserData);
  };

  return (
    <AuthContext.Provider value={{userData, updateUserData}}>
      {children}
    </AuthContext.Provider>
  );
};
