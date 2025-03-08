import {useState, useContext} from 'react';
import {auth, db} from '../config/firebaseConfig';
import {signInWithEmailAndPassword} from 'firebase/auth';
// import {doc, getDoc} from 'firebase/firestore';
import {isValidKSU, validateInputs} from '../utils/validationUtils';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import {loginErrorHandler} from '../utils/errorHandler';
import firestore from '@react-native-firebase/firestore';

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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const userDoc = await firestore().collection('users').doc(user.uid).get();
      const username = userDoc.exists() ? userDoc.data().username : 'Unknown';
      const userEmail = userDoc.exists() ? userDoc.data().email : email;
      const isKSU = userDoc.exists() ? userDoc.data().isKSU : false;

      const userObject = {
        userId: user.uid,
        username,
        email: userEmail,
        userToken: await user.getIdToken(),
        rememberMe,
        isKSU,
      };

      await updateUserData(userObject);

      navigation.navigate('Tasks');
    } catch (error) {
      setError(loginErrorHandler(error.code));
    } finally {
      setLoading(false);
    }
  };

  return {handleLogin, loading, error};
};
