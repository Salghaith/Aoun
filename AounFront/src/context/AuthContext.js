import React, {createContext, useState, useEffect} from 'react';
import {getData, storeData} from '../utils/storageUtils';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      const storedUsername = await getData('username');
      const storedEmail = await getData('email');
      const storedUserId = await getData('userId');
      if (storedUsername) setUsername(storedUsername);
      if (storedEmail) setEmail(storedEmail);
      if (storedUserId) setUserId(storedUserId);
    };
    loadUserData();
  }, []);

  //Function to update user data globally
  const updateUserData = (newUsername, newEmail) => {
    setUsername(newUsername);
    setEmail(newEmail);
    storeData('username', newUsername);
    storeData('email', newEmail);
  };

  return (
    <AuthContext.Provider value={{username, email, userId, updateUserData}}>
      {children}
    </AuthContext.Provider>
  );
};
