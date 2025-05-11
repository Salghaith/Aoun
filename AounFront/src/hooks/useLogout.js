import {useContext} from 'react';
import auth from '@react-native-firebase/auth';
import {removeData} from '../utils/storageUtils';
import {AuthContext} from '../context/AuthContext';

export const useLogout = () => {
  const {updateUserData} = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await removeData('userData');
      await removeData('tasks');
      await removeData('savedSchedule');
      await removeData('subjects');
      await auth().signOut();
      await updateUserData(null);
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return {handleLogout};
};
