import {useState, useContext} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import {isValidKSU, validateInputs} from '../utils/validationUtils';
import {loginErrorHandler} from '../utils/errorHandler';

export const useLogin = () => {
  const navigation = useNavigation();
  const {updateUserData} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (email, password, rememberMe) => {
    const KSU_Email = isValidKSU(email);
    if (KSU_Email) email = KSU_Email;

    const validate = validateInputs({email, password});
    if (validate) return setError(loginErrorHandler(validate));

    setLoading(true);

    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      //Fetch user document
      const userDoc = await firestore().collection('users').doc(user.uid).get();
      const userData = userDoc.exists ? userDoc.data() : {};

      const userObject = {
        userId: user.uid,
        username: userData.username || 'Unknown',
        email: userData.email || email,
        userToken: await user.getIdToken(),
        rememberMe,
        isKSU: userData.isKSU || false,
      };

      await updateUserData(userObject);

      navigation.navigate('Tasks');
    } catch (error) {
      setError(loginErrorHandler(error.code));
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {handleLogin, loading, error};
};
