import {useState, useContext} from 'react';
import {Alert} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import axios from 'axios';
import {validateInputs} from '../utils/validationUtils';

export const useUpdateProfile = () => {
  const {updateUserData, userId} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const updateUserProfile = async (newUsername, newEmail) => {
    if (!validateInputs({newUsername, newEmail})) return;

    setLoading(true);
    console.log(userId);
    console.log(newUsername);
    console.log(newEmail);
    try {
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
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return {updateUserProfile, loading};
};
