import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {useTranslation} from 'react-i18next';
import BackButton from '../components/BackButton';
import InputField from '../components/InputField';
import LoginButton from '../components/LoginButton';

const ForgetPassScreen = ({navigation}) => {
  const {t} = useTranslation();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
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
          onPress={() => {}}
          style={{marginTop: 30}}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#1C2128', flex: 1},
  backButton: {
    marginLeft: 34,
    marginTop: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: 'white',
    marginLeft: 34,
    marginTop: 53,
    width: 250,
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
