import React, {useState, useContext} from 'react';
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
  Alert,
  ActivityIndicator,
} from 'react-native';
import Dialog from 'react-native-dialog';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Feather';
import CalendarIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import LanguageSwitch from '../components/LanguageSwitch';
import i18n, {switchLanguage} from '../i18n';
import {useLogout} from '../hooks/useLogout';
import {AuthContext} from '../context/AuthContext';
import {useNotifications} from '../context/NotificationContext';
import {importCalendarTasks} from '../services/calendarService';
import {TaskContext} from '../context/TaskContext';

const ProfileScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {handleLogout, LogoutLoading} = useLogout();
  const {userData} = useContext(AuthContext);
  const {notificationsEnabled, toggleNotifications} = useNotifications();
  const [visible, setVisible] = useState(false);
  const [LMSPass, setLMSPass] = useState('');
  const [loading, setLoading] = useState(false);
  const {refreshTasks} = useContext(TaskContext);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: '#1C2128'}]}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <Text style={[styles.title, {color: '#F9FAFB'}]}>{t('Profile')}</Text>
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.profileContent}>
        <Image
          style={styles.image}
          source={require('../assets/images/ProfilePng.png')}
        />

        <TouchableOpacity
          style={styles.usernameContainer}
          onPress={() => navigation.navigate('EditProfile')}>
          <Text style={[styles.username, {color: '#F9FAFB'}]}>
            {userData.username}
          </Text>
          <Icon
            name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
            size={24}
            color={'#B0B0B0'}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        <Text style={[styles.email, {color: '#B1B1B1'}]}>{userData.email}</Text>

        {/* LANGUAGE SWITCH */}
        <View style={[styles.switchContainer, {backgroundColor: '#4A4F55'}]}>
          <View style={{flexDirection: 'row', gap: 10}}>
            <Icon
              name="globe"
              size={24}
              color={'#B0B0B0'}
              style={styles.sectionIcon}
            />
            <Text style={[styles.sectionText, {color: '#F9FAFB'}]}>
              {t('Language')}
            </Text>
          </View>
          <View style={styles.languageSwitcherWrapper}>
            <LanguageSwitch
              onPress={() => switchLanguage(navigation)}
              language={i18n.language}
            />
          </View>
        </View>

        {/* NOTIFICATIONS TOGGLE */}
        <View style={[styles.switchContainer, {backgroundColor: '#4A4F55'}]}>
          <View style={{flexDirection: 'row', gap: 10}}>
            <Icon
              name="bell"
              size={24}
              color={'#B0B0B0'}
              style={styles.sectionIcon}
            />
            <Text style={[styles.sectionText, {color: '#F9FAFB'}]}>
              {t('Notifications')}
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{false: '#B0B0B0', true: '#0084FF'}}
            thumbColor={notificationsEnabled ? '#FFFFFF' : '#B0B0B0'}
            style={styles.switch}
          />
        </View>

        {userData.isKSU && (
          <TouchableOpacity onPress={() => setVisible(true)}>
            <View
              style={[styles.switchContainer, {backgroundColor: '#4A4F55'}]}>
              <View style={{flexDirection: 'row', gap: 10, width: '100%'}}>
                <CalendarIcon
                  name="calendar-import"
                  size={24}
                  color={'#B0B0B0'}
                  style={styles.sectionIcon}
                />
                <Text style={[styles.sectionText, {color: '#F9FAFB'}]}>
                  {t('Import LMS Calendar')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        <Dialog.Container visible={visible}>
          <Dialog.Title>{t('Enter Your LMS Password')}</Dialog.Title>
          <Dialog.Input
            onChangeText={setLMSPass}
            value={LMSPass}
            secureTextEntry
            editable={!loading}
          />
          {loading && (
            <View style={{alignItems: 'center', marginVertical: 10}}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
          )}
          <Dialog.Button
            label={t('Cancel')}
            onPress={() => {
              if (!loading) setVisible(false);
            }}
            disabled={loading}
          />
          <Dialog.Button
            label={t('Import')}
            onPress={async () => {
              setLoading(true);
              try {
                await importCalendarTasks(
                  userData.userId,
                  userData.email.split('@')[0],
                  LMSPass,
                );
                Alert.alert(t('Success'), t('Calendar tasks synced.'));
              } catch (error) {
                const message =
                  error.response?.data?.error ||
                  error.message ||
                  'An unexpected error occurred. Please try again.';
                Alert.alert('❌ Error', message);
              } finally {
                refreshTasks();
                setLoading(false);
                setVisible(false);
              }
            }}
            disabled={loading}
          />
        </Dialog.Container>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          {LogoutLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.logoutText}>{t('Logout')}</Text>
          )}
        </TouchableOpacity>
      </View>
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
    // marginRight: 14,
  },
  sectionText: {
    fontSize: 20,
    fontWeight: '500',
    // flex: 1,
    // textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  switch: {
    transform: [{scaleX: 1.3}, {scaleY: 1.3}],
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
