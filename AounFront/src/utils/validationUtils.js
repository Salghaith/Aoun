import {Alert} from 'react-native';

export const validateInputs = ({username, email, password}) => {
  if (username !== undefined && !username.trim()) {
    Alert.alert('Error', 'Username is required.');
    return false;
  }

  if (email !== undefined) {
    if (!email) {
      Alert.alert('Error', 'Email is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Invalid email format.');
      return false;
    }
  }

  if (password !== undefined && password.length < 6) {
    Alert.alert('Error', 'Password must be at least 6 characters.');
    return false;
  }

  return true;
};
