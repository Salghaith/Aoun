import {useState, useContext} from 'react';
import {Alert, Platform} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import axios from 'axios';
import {validateInputs} from '../utils/validationUtils';
import {getData} from '../utils/storageUtils';
import {useNavigation} from '@react-navigation/native';

export const useUpdateProfile = () => {
  const navigation = useNavigation();
  const {updateUserData} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const updateUserProfile = async (newUsername, newEmail) => {
    if (!validateInputs({newUsername, newEmail})) return;

    setLoading(true);
    const baseURL =
      Platform.OS == 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';

    try {
      const user = await getData('userData');
      if (!user.userId) return Alert.alert('Error', 'Failed fetching the user ID');
      const response = await axios.put(`${baseURL}/api/update-profile`, {
        userId: user.userId,
        newUsername,
        newEmail,
      });

      if (response.data.success) {
        await updateUserData({username: newUsername, email: newEmail});
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'An unexpected error occurred.',
      );
    } finally {
      setLoading(false);
      navigation.replace('EditProfile');
    }
  };

  return {updateUserProfile, loading};
};
