import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Switch,
  I18nManager,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import BackButton from '../components/BackButton';
import Icon from 'react-native-vector-icons/Feather';
import LanguageSwitch from '../components/LanguageSwitch';
import i18n, { switchLanguage } from '../i18n';
import { useLogout } from '../hooks/useLogout';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext'; 
import BottomNav from '../components/BottomNav';

const ProfileScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { handleLogout } = useLogout();
  const { userData } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#1C2128' : '#F5F5F5' },
      ]}
    >
      {/* HEADER */}
      <View style={styles.headerContainer}>
        
        <Text
          style={[styles.title, { color: isDarkMode ? '#F9FAFB' : '#1C2128' }]}
        >
          {t('Profile')}
        </Text>
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.profileContent}>
        <Image
          style={styles.image}
          source={require('../assets/images/ProfilePng.png')}
        />

        <TouchableOpacity
          style={styles.usernameContainer}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text
            style={[
              styles.username,
              { color: isDarkMode ? '#F9FAFB' : '#1C2128' },
            ]}
          >
            {userData.username}
          </Text>
          <Icon
            name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
            size={24}
            color={isDarkMode ? '#B0B0B0' : '#4A4F55'}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        <Text
          style={[styles.email, { color: isDarkMode ? '#B1B1B1' : '#4A4F55' }]}
        >
          {userData.email}
        </Text>

        {/* LANGUAGE SWITCH */}
        <View
          style={[
            styles.switchContainer,
            { backgroundColor: isDarkMode ? '#4A4F55' : '#E0E0E0' },
          ]}
        >
          <Icon
            name="globe"
            size={24}
            color={isDarkMode ? '#B0B0B0' : '#4A4F55'}
            style={styles.sectionIcon}
          />
          <Text
            style={[
              styles.sectionText,
              { color: isDarkMode ? '#F9FAFB' : '#1C2128' },
            ]}
          >
            {t('Language')}
          </Text>
          <View style={styles.languageSwitcherWrapper}>
            <LanguageSwitch
              onPress={() => switchLanguage(navigation)}
              language={i18n.language}
            />
          </View>
        </View>

        {/* NOTIFICATIONS TOGGLE */}
        <View
          style={[
            styles.switchContainer,
            { backgroundColor: isDarkMode ? '#4A4F55' : '#E0E0E0' },
          ]}
        >
          <Icon
            name="bell"
            size={24}
            color={isDarkMode ? '#B0B0B0' : '#4A4F55'}
            style={styles.sectionIcon}
          />
          <Text
            style={[
              styles.sectionText,
              { color: isDarkMode ? '#F9FAFB' : '#1C2128' },
            ]}
          >
            {t('Notifications')}
          </Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={() => setNotificationsEnabled((prev) => !prev)}
            trackColor={{ false: '#B0B0B0', true: '#0084FF' }}
            thumbColor={notificationsEnabled ? '#FFFFFF' : '#B0B0B0'}
            style={styles.switch}
          />
        </View>

        {/* DARK MODE TOGGLE */}
        <View
          style={[
            styles.switchContainer,
            { backgroundColor: isDarkMode ? '#4A4F55' : '#E0E0E0' },
          ]}
        >
          <Icon
            name="moon"
            size={24}
            color={isDarkMode ? '#B0B0B0' : '#4A4F55'}
            style={styles.sectionIcon}
          />
          <Text
            style={[
              styles.sectionText,
              { color: isDarkMode ? '#F9FAFB' : '#1C2128' },
            ]}
          >
            {t('Dark Mode')}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#B0B0B0', true: '#0084FF' }}
            thumbColor={isDarkMode ? '#FFFFFF' : '#B0B0B0'}
            style={styles.switch}
          />
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t('Logout')}</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Ensures BottomNav does not overlap */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <BottomNav activeTab="Profile" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    justifyContent: 'space-between', // Ensures elements are aligned properly
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  profileContent: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 70, // Prevents BottomNav from overlapping content
  },
  image: {
    width: 105,
    height: 105,
    marginTop: 30,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  username: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  arrowIcon: {
    marginLeft: 10,
  },
  email: {
    fontSize: 20,
    marginTop: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginTop: 22,
    width: '85%',
  },
  sectionIcon: {
    marginRight: 14,
  },
  sectionText: {
    fontSize: 20,
    fontWeight: '500',
    flex: 1,
  },
  switch: {
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
  },
  logoutButton: {
    backgroundColor: '#B02626',
    width: '85%',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 14,
    marginTop: 30,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default ProfileScreen;
