import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import BackButton from '../components/BackButton';
import Icon from 'react-native-vector-icons/Feather';
import LanguageSwitch from '../components/LanguageSwitch';
import i18n from '../i18n';
import {useLogout} from '../hooks/useLogout';
import {AuthContext} from '../context/AuthContext';
import {use} from 'i18next';

const ProfileScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {handleLogout} = useLogout();
  const [language, setLanguage] = useState(i18n.language);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const {username, email} = useContext(AuthContext);

  const changeLanguage = lang => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(previousState => !previousState);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>{t('Profile')}</Text>
      </View>

      <View style={styles.ProfileContainer}>
        <Image
          style={styles.image}
          source={require('../assets/images/ProfilePng.png')}
        />

        <TouchableOpacity
          style={styles.usernameContainer}
          onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.username}>{username}</Text>
          <Icon
            name="chevron-right"
            size={24}
            color="white"
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        <Text style={styles.email}>{email}</Text>

        <View style={styles.languageContainer}>
          <Icon
            name="globe"
            size={28}
            color="white"
            style={styles.languageIcon}
          />
          <Text style={styles.languageText}>{t('Language')}</Text>
          <LanguageSwitch
            onPress={() => changeLanguage(language === 'en' ? 'ar' : 'en')}
            language={language}
          />
        </View>

        <View style={styles.notificationsContainer}>
          <Text style={styles.notificationsText}>{t('Notifications')}</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{false: '#767577', true: '#007BFF'}}
            thumbColor={notificationsEnabled ? '#f4f3f4' : '#f4f3f4'}
            style={styles.switch}
          />
        </View>

        <View style={styles.logoutContainer}>
          <Text style={styles.logoutText}>{t('Logout')}</Text>
          <TouchableOpacity
            onPress={() => {
              handleLogout();
            }}>
            <Icon
              name="log-out"
              size={28}
              color="white"
              style={styles.logoutIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C2128',
    flex: 1,
  },

  headerContainer: {
    flexDirection: 'row',
    alignContent: 'center',
  },

  title: {
    fontSize: 26,
    fontWeight: '600',
    color: 'white',
    marginLeft: 80,
    marginTop: 18,
  },

  ProfileContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
  },

  image: {
    alignItems: 'center',
    width: 105,
    height: 105,
    borderRadius: 52.5, // Circular image
  },

  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginLeft: 20,
  },

  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },

  arrowIcon: {
    marginLeft: 10,
    marginTop: 5,
  },

  email: {
    fontSize: 18,
    color: 'white',
    opacity: 0.5,
    marginTop: 5,
  },

  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 37,
    width: '80%',
  },

  languageIcon: {
    marginRight: 10,
    marginTop: 17,
  },

  languageText: {
    fontSize: 26,
    color: 'white',
    flex: 1,
    marginTop: 15,
    fontWeight: '500',
  },

  notificationsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 37,
    width: '80%',
  },

  notificationsText: {
    fontSize: 26,
    color: 'white',
    fontWeight: '500',
  },

  switch: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 16,
    transform: [{scaleX: 1.4}, {scaleY: 1.4}],
  },

  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 37,
    width: '80%',
  },

  logoutText: {
    fontSize: 26,
    color: 'white',
    fontWeight: '500',
  },

  logoutIcon: {},
});

export default ProfileScreen;
