import {useState, useContext} from 'react';
import {auth, db} from '../config/firebaseConfig';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {setDoc, doc} from 'firebase/firestore';
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        username,
        email: email.toLowerCase().trim(),
        createdAt: new Date(),
        isKSU: KSUStudent,
      });

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
