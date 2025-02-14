import {useState, useContext} from 'react';
import {Alert} from 'react-native';
import {auth, db} from '../config/firebaseConfig';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {setDoc, doc} from 'firebase/firestore';
import {validateInputs} from '../utils/validationUtils';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';

export const useSignup = () => {
  const navigation = useNavigation();
  const {updateUserData} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (username, email, password, rememberMe) => {
    if (!validateInputs({username, email, password})) return;

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
      });

      const userObject = {
        userId: user.uid,
        username,
        email,
        userToken: await user.getIdToken(),
        rememberMe,
      };

      await updateUserData(userObject);
      Alert.alert('Success', 'Account created successfully!'); //Remove after testing
      navigation.navigate('Profile');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return {handleSignup, loading};
};
