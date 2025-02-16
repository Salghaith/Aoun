import {useState, useContext} from 'react';
import {Platform} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import axios from 'axios';
import {validateInputs} from '../utils/validationUtils';
import {getData} from '../utils/storageUtils';
import {UpdateProfileErrorHandler} from '../utils/errorHandler';

export const useUpdateProfile = () => {
  const {updateUserData} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateUserProfile = async (newUsername, newEmail) => {
    const validate = validateInputs({username: newUsername, email: newEmail});
    if (validate) {
      setError(UpdateProfileErrorHandler(validate));
      return; //IDK this doesn't work
    }

    setLoading(true);
    const baseURL =
      Platform.OS == 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';

    try {
      const user = await getData('userData');
      if (!user.userId) return setError('Failed fetching the user ID');
      const response = await axios.put(`${baseURL}/api/update-profile`, {
        userId: user.userId,
        newUsername,
        newEmail,
      });

      if (response.data.success) {
        await updateUserData({username: newUsername, email: newEmail});
        setError('');
        setSuccess('Profile updated successfully!');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 'An unexpected error occurred.',
      );
    } finally {
      setLoading(false);
      // navigation.replace('EditProfile');
    }
  };

  return {updateUserProfile, loading, error, success};
};
