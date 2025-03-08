import {useState, useContext} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {isValidKSU, validateInputs} from '../utils/validationUtils';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import {SignupErrorHandler} from '../utils/errorHandler';

export const useSignup = () => {
  const navigation = useNavigation();
  const {updateUserData} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (
    username,
    email,
    password,
    rememberMe,
    KSUStudent,
  ) => {
    if (KSUStudent) {
      const KSU_Email = isValidKSU(email);
      if (KSU_Email) email = KSU_Email;
    }
    const validate = validateInputs({username, email, password});
    if (validate) return setError(SignupErrorHandler(validate));

    setLoading(true);

    try {
      // Create user in Firebase Authentication
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      // Save user data in Firestore
      await firestore().collection('users').doc(user.uid).set({
        username,
        email: email.toLowerCase().trim(),
        createdAt: firestore.FieldValue.serverTimestamp(),
        isKSU: KSUStudent,
      });

      // Prepare user object
      const userObject = {
        userId: user.uid,
        username,
        email,
        userToken: await user.getIdToken(),
        rememberMe,
        isKSU: KSUStudent,
      };

      await updateUserData(userObject);
      navigation.navigate('Profile');
    } catch (error) {
      setError(SignupErrorHandler(error.code));
    } finally {
      setLoading(false);
    }
  };

  return {handleSignup, loading, error};
};
