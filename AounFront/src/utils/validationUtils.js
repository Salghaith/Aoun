import {Alert} from 'react-native';

export const validateInputs = ({username, email, password}) => {
  if (username !== undefined && !username.trim()) {
    // Alert.alert('Error', 'Username is required.');
    return 'Username is required.';
  }

  if (email !== undefined) {
    if (!email) {
      // Alert.alert('Error', 'Email is required.');
      return 'Email is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // Alert.alert('Error', 'Invalid email format.');
      return 'auth/invalid-email';
    }
  }

  if (password !== undefined && password.length < 6) {
    // Alert.alert('Error', 'Password must be at least 6 characters.');
    return 'Password must be at least 6 characters.';
  }

  return null; //this means VALID INPUT
};
