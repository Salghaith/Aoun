import {useState, useContext} from 'react';
import {Alert} from 'react-native';
import {auth, db} from '../config/firebaseConfig';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {doc, getDoc} from 'firebase/firestore';
import {validateInputs} from '../utils/validationUtils';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';

export const useLogin = () => {
  const navigation = useNavigation();
  const {updateUserData} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email, password, rememberMe) => {
    if (!validateInputs({email, password})) return;

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const username = userDoc.exists() ? userDoc.data().username : 'Unknown';
      const userEmail = userDoc.exists() ? userDoc.data().email : email;

      const userObject = {
        userId: user.uid,
        username,
        email: userEmail,
        userToken: await user.getIdToken(),
        rememberMe,
      };

      await updateUserData(userObject);

      Alert.alert('Success', 'Login successful!'); //Remove after testing
      navigation.navigate('Profile');
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {handleLogin, loading};
};
