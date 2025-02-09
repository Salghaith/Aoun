import {useState, useContext} from 'react';
import {Alert} from 'react-native';
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

    try {
      const userId = await getData('userId');
      if (!userId) return Alert.alert('Error', 'Failed fetching the user ID');
      const response = await axios.put(
        'http://localhost:3000/api/update-profile',
        {
          userId,
          newUsername,
          newEmail,
        },
      );

      if (response.data.success) {
        updateUserData(newUsername, newEmail);
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
