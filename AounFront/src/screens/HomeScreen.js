import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import i18n, {switchLanguage} from '../i18n';
import LoginButton from '../components/LoginButton';
import LanguageSwitch from '../components/LanguageSwitch';

const HomeScreen = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.switcher}>
        <LanguageSwitch
          onPress={() => switchLanguage()}
          language={i18n.language}
        />
      </View>
      <Image
        source={require('../assets/images/aoun-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>{t('Welcome to \nAoun')}</Text>
      <View style={styles.buttonsSection}>
        <LoginButton
          title={t('Log in')}
          onPress={() => navigation.navigate('Login')}
        />
        <LoginButton
          title={t('Sign up')}
          onPress={() => navigation.navigate('Signup')}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.guestButton}>{t('Continue as Guest')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C2128',
    flex: 1,
    alignItems: 'center',
  },
  switcher: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  logo: {
    marginTop: 40,
    marginBottom: 35,
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 40,
    color: '#FFFFFF',
    textAlign: 'center',
    height: 100,
  },
  buttonsSection: {
    height: 197,
    marginTop: 100,

    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guestButton: {
    color: 'white',
    opacity: 0.7,
    fontSize: 16,
    fontWeight: '500',
  },
});
export default HomeScreen;
