import {useContext} from 'react';
import {Alert} from 'react-native';
import {auth} from '../config/firebaseConfig';
import {removeData} from '../utils/storageUtils';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';

export const useLogout = () => {
  const navigation = useNavigation();
  const {updateUserData} = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await removeData('userData');
      await auth.signOut();
      await updateUserData(null);
      Alert.alert('Success', 'Logged out successfully!'); //Remove after testing
      navigation.navigate('Home');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return {handleLogout};
};
