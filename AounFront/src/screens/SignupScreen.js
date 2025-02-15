import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import BackButton from '../components/BackButton';
import InputField from '../components/InputField';
import {useTranslation} from 'react-i18next';
import LoginButton from '../components/LoginButton';
import {useSignup} from '../hooks/useSignup';
import AlertCard from '../components/AlertCard';

const SignupScreen = ({navigation}) => {
  const {t} = useTranslation();

  const {handleSignup, loading, error} = useSignup();

  const [KSUStudent, setKSUStudent] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [KSUID, setKSUID] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <BackButton onPress={() => navigation.navigate('Home')} />
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.title}>{t('Create Your Account')}</Text>
        {KSUStudent && (
          <Image
            source={require('../assets/images/ksu-logo.png')}
            style={{width: 25, height: 40, marginTop: 80, marginLeft: 70}}
          />
        )}
      </View>
      <View style={styles.errorMessage}>
        {error && <AlertCard type="error" message={error} />}
      </View>

      <View style={styles.formContainer}>
        <InputField
          type="username"
          title={t('Full Name')}
          icon="user"
          style={styles.InputField}
          onChangeText={setUsername}
        />
        {KSUStudent ? (
          <InputField
            type="id"
            title={t('Enter Your KSU ID')}
            icon="idcard"
            style={styles.InputField}
            onChangeText={setKSUID}
          />
        ) : (
          <InputField
            type="email"
            title={t('Enter Your Email')}
            icon="mail"
            style={styles.InputField}
            onChangeText={setEmail}
          />
        )}
        <InputField
          type="password"
          title={t('Password')}
          icon="lock"
          onChangeText={setPassword}
        />
        <View style={styles.registerButton}>
          {loading ? (
            <ActivityIndicator size="large" color={'white'} />
          ) : (
            <LoginButton
              title={t('Register')}
              onPress={() => {
                handleSignup(username, email, password, rememberMe);
              }}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.signupContainer}>
          <Text style={styles.signupText}>
            <Text style={styles.signupTextDim}>
              {t('Already Have an Account?')}{' '}
            </Text>
            <Text style={styles.signupLink}>{t('Login')}</Text>
          </Text>
        </TouchableOpacity>

        {!KSUStudent && <View style={styles.line} />}

        {!KSUStudent && (
          <LoginButton
            title={t('Continue With King Saud University ID')}
            onPress={() => setKSUStudent(!KSUStudent)}
            style={styles.KSUButton}
            fontSize={16}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {backgroundColor: '#1C2128', flex: 1},
  title: {
    fontSize: 38,
    fontWeight: '600',
    color: 'white',
    marginLeft: 34,
    marginTop: 53,
    width: 220,
  },
  errorMessage: {
    height: 50,
    width: 334,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
  formContainer: {
    alignItems: 'center',
    // paddingTop: 50,
  },
  InputField: {marginBottom: 20},
  registerButton: {
    marginTop: 25,
  },
  signupContainer: {
    marginTop: 22,
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
  line: {
    marginTop: 34,
    marginBottom: 21,
    borderWidth: 1,
    borderColor: '#C2C3CB',
    width: '100%',
    opacity: 0.3,
  },
  KSUButton: {},
});
export default SignupScreen;
