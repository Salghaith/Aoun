import React, {useContext} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import LoginButton from '../components/LoginButton';
import {ThemeContext} from '../context/ThemeContext'; // Import Theme Context

const WelcomeScreen = ({navigation}) => {
  const {isDarkMode} = useContext(ThemeContext); // Get theme state
  const {t} = useTranslation();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#1C2128' : '#F5F5F5'}, // Light Mode background update
      ]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <Image
        source={require('../assets/images/aoun-logo.png')}
        style={styles.logo}
      />
      <Text
        style={[
          styles.text,
          {color: isDarkMode ? '#FFFFFF' : '#1C2128'}, // Adjust text color
        ]}>
        {t('Welcome to \nAoun')}
      </Text>

      <View style={styles.buttonsSection}>
        <LoginButton
          title={t('Log in')}
          onPress={() => navigation.navigate('Login')}
        />
        <LoginButton
          title={t('Sign up')}
          onPress={() => navigation.navigate('Signup')}
        />

        {/* ✅ Updated "Continue as Guest" to navigate to the Tasks Page */}
        <View onPress={() => navigation.navigate('GuestChatScreen')}>
          <Text
            style={[
              styles.guestButton,
              {color: isDarkMode ? '#FFFFFF' : '#1C2128'}, // Adjust text color
            ]}></Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  logo: {
    marginTop: 40,
    marginBottom: 35,
    width: 200,
    height: 200,
  },

  text: {
    fontSize: 40,
    textAlign: 'center',
    height: 100,
    fontWeight: '500',
  },

  buttonsSection: {
    height: 197,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  guestButton: {
    opacity: 0.7,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WelcomeScreen;
