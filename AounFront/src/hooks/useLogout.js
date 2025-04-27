import {useContext} from 'react';
import auth from '@react-native-firebase/auth';
import {removeData} from '../utils/storageUtils';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';

export const useLogout = () => {
  const navigation = useNavigation();
  const {updateUserData} = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await removeData('userData');
      await removeData('tasks');
      await auth().signOut();
      await updateUserData(null);
      // navigation.navigate('Welcome');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return {handleLogout};
};
