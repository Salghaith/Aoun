import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  I18nManager,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import BackButton from '../components/BackButton';
import InputField from '../components/InputField';
import LoginButton from '../components/LoginButton';
import {auth} from '../config/firebaseConfig';
import {sendPasswordResetEmail} from 'firebase/auth';
import {validateInputs} from '../utils/validationUtils';

const ForgetPassScreen = ({navigation}) => {
  const {t} = useTranslation();
  const [email, setEmail] = useState('');

  const handlePasswordReset = () => {
    if (!validateInputs({email})) return;

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          t('Password reset email sent!'),
          t('Please check your inbox.'),
        );
        navigation.goBack();
      })
      .catch(error => {
        console.error('Password reset error: ', error);
        Alert.alert(t('Error'), error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1}}>
          <View>
            <BackButton onPress={() => navigation.goBack()} />
          </View>
          <Text style={styles.title}>{t('Reset Your Password')}</Text>
          <View style={styles.inputContainer}>
            <InputField
              title={t('Enter Your Email')}
              icon="mail"
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.buttonContainer}>
            <LoginButton
              title={t('Send Reset Link')}
              onPress={() => handlePasswordReset()}
              style={{marginTop: 30}}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C2128',
    flex: 1,
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  backButton: {
    marginLeft: 34,
    marginTop: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: 'white',
    marginHorizontal: 34,
    marginTop: 53,
    width: 250,
    textAlign: I18nManager.isRTL ? 'left' : '',
  },
  inputContainer: {
    alignSelf: 'center',
    marginTop: 50,
  },
  buttonContainer: {
    alignSelf: 'center',
  },
});

export default ForgetPassScreen;
