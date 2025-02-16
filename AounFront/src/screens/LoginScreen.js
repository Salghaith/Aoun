import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  I18nManager,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import BackButton from '../components/BackButton';
import InputField from '../components/InputField';
import LoginButton from '../components/LoginButton';
import {useLogin} from '../hooks/useLogin';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AlertCard from '../components/AlertCard';

const LoginScreen = ({navigation}) => {
  const {t} = useTranslation();

  const {handleLogin, loading, error} = useLogin();

  const [email, setEmail] = useState(''); //Need to check, if it the Input is just number=>KSU ID add "@student...."
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <BackButton onPress={() => navigation.navigate('Home')} />

      <Text style={styles.title}>{t('Login Your Account')}</Text>
      <View style={styles.errorMessage}>
        {error && <AlertCard type="error" message={error} />}
      </View>
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
        <View style={styles.rememberSection}>
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
            <Text style={styles.rememberText}>{t('Remember me')}</Text>
            <Icon
              name={rememberMe ? 'check-box' : 'check-box-outline-blank'}
              size={20}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgetPass')}
            style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>
              {t('Forgot Password?')}
            </Text>
          </TouchableOpacity>
        </View>
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
  container: {
    backgroundColor: '#1C2128',
    flex: 1,
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  formContainer: {
    alignItems: 'center',
    // paddingTop: 50,
  },
  errorMessage: {
    minHeight: 50,
    width: 334,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
  InputField: {
    marginBottom: 30,
  },
  title: {
    fontSize: 38,
    fontWeight: '600',
    color: 'white',
    marginHorizontal: 34,
    marginTop: 53,
    width: 190,
    textAlign: I18nManager.isRTL ? 'left' : '',
  },
  rememberSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 334,
  },
  rememberText: {
    marginRight: 3,
    color: 'white',
    fontSize: 14,
  },
  forgotPassword: {
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
