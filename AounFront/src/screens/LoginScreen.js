import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import BackButton from '../components/BackButton';
import InputField from '../components/InputField';
import LoginButton from '../components/LoginButton';
import {useLogin} from '../hooks/useLogin';

const LoginScreen = ({navigation}) => {
  const {t} = useTranslation();

  const {handleLogin, loading} = useLogin();

  const [email, setEmail] = useState(''); //Need to check, if it the Input is just number=>KSU ID add "@student...."
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <BackButton onPress={() => navigation.navigate('Home')} />

      <Text style={styles.title}>{t('Login Your Account')}</Text>

      <View style={styles.formContainer}>
        <InputField
          type="email"
          title={t('Enter Your Email or KSU ID')}
          icon="mail"
          style={styles.InputField}
          onChangeText={setEmail}
        />

        <InputField
          type="password"
          title={t('Enter Your Password')}
          icon="lock"
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgetPass')}
          style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>{t('Forgot Password?')}</Text>
        </TouchableOpacity>
        <View style={styles.loginButton}>
          {loading ? (
            <ActivityIndicator size="large" color={'white'} />
          ) : (
            <LoginButton
              title={t('Login')}
              onPress={() => {
                handleLogin(email, password, rememberMe);
              }}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={styles.signupContainer}>
          <Text style={styles.signupText}>
            <Text style={styles.signupTextDim}>
              {t('Create New Account?')}{' '}
            </Text>
            <Text style={styles.signupLink}>{t('Sign up')}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#1C2128', flex: 1},
  formContainer: {
    alignItems: 'center',
    paddingTop: 50,
  },
  InputField: {
    marginBottom: 30,
  },
  title: {
    fontSize: 38,
    fontWeight: '600',
    color: 'white',
    marginLeft: 34,
    marginTop: 53,
    width: 190,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: 34,
    marginTop: 12,
  },
  forgotPasswordText: {
    color: 'white',
    opacity: 0.7,
    fontSize: 14,
  },
  loginButton: {
    marginTop: 40,
  },
  signupContainer: {
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
