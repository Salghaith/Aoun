/* eslint-disable react-native/no-inline-styles */
import React , { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView , TouchableOpacity} from 'react-native';
import { useTranslation } from 'react-i18next';
import BackButton from '../components/BackButton';
import InputField from '../components/InputField';
import LoginButton from '../components/LoginButton';
import Icon from 'react-native-vector-icons/Feather';

const LoginScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [secureText, setSecureText] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButton}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>
      <Text style={styles.title}>{t('Login Your Account')}</Text>
      <View style={{alignSelf: 'center', marginTop: 50}}>
        <InputField title={t('Enter Your Email')} icon="mail"  />
      </View>
      <View style={{alignSelf: 'center'}}>
        <InputField
          title={t('Enter Your Password')}
          icon="lock"
          secureTextEntry={secureText}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setSecureText(!secureText)}
        >
          <Icon name={secureText ? 'eye-off' : 'eye'} size={24} color="#817D7D" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('ForgetPass')} style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>{t('Forgot Password?')}</Text>
      </TouchableOpacity>
      <View style={styles.registerButtonContainer}>
        <LoginButton title={t('Register')} onPress={() => {}} />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.signupContainer}>
        <Text style={styles.signupText}><Text style={styles.signupTextDim}>{t('Create New Account?')} </Text><Text style={styles.signupLink}>{t('Sign up')}</Text></Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#1C2128', flex: 1 },
  backButton: {
    marginLeft: 34,
    marginTop: 14,
  },
  title: {
    fontSize: 38,
    fontWeight: '600',
    color: 'white',
    marginLeft: 34,
    marginTop: 53,
    width: 190,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    marginTop: 21,
    marginRight: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: 34,
    marginTop: -18,
  },
  forgotPasswordText: {
    color: 'white',
    opacity: 0.7,
    fontSize: 14,
  },
  registerButtonContainer: {
    alignSelf: 'center',
    marginTop: 40,
  },
  signupContainer: {
    alignSelf: 'center',
    marginTop: 10,
  },
  signupText: {
    fontSize: 16,
  },
  signupTextDim: {
    color: 'white',
    opacity: 0.7,
  },
  signupLink: {
    color: 'white',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
