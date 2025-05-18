import {useContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {removeData} from '../utils/storageUtils';
import {AuthContext} from '../context/AuthContext';

export const useLogout = () => {
  const {updateUserData} = useContext(AuthContext);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleLogout = async () => {
    setLoading(true); // Set loading to true when logout starts
    try {
      await removeData('userData');
      await removeData('tasks');
      await removeData('savedSchedule');
      await removeData('subjects');
      await auth().signOut();
      await updateUserData(null);
    } catch (error) {
      console.error('Logout Error:', error);
    } finally {
      setLoading(false); // Set loading to false when logout completes
    }
  };

  return {handleLogout, LogoutLoading:loading}; // Return loading state
};
