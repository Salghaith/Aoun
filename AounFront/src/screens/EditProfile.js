import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  I18nManager,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import BackButton from '../components/BackButton';
import InputField from '../components/InputField';
import LoginButton from '../components/LoginButton';
import {useTranslation} from 'react-i18next';
import {AuthContext} from '../context/AuthContext';
import {useUpdateProfile} from '../hooks/useUpdateProfile';
import {ThemeContext} from '../context/ThemeContext';
import AlertCard from '../components/AlertCard';

const EditProfileScreen = ({navigation}) => {
  const {t} = useTranslation();
  const [isEditable, setIsEditable] = useState(false);
  const {userData} = useContext(AuthContext);
  const {isDarkMode} = useContext(ThemeContext);
  const [newUsername, setNewUsername] = useState(userData.username);
  const [newEmail, setNewEmail] = useState(userData.email);
  const {updateUserProfile, loading, error, success} = useUpdateProfile();

  useEffect(() => {
    if (success) {
      setIsEditable(false);
    }
  }, [success]);

  const handleEditSave = () => {
    if (isEditable) {
      updateUserProfile(newUsername, newEmail);
    } else setIsEditable(!isEditable);
  };
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: '#1C2128'}]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1}}>
          <View style={styles.headerContainer}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text
              style={[
                styles.title,
                {color: isDarkMode ? '#F9FAFB' : '#1C2128'},
              ]}>
              {t('Edit Information')}
            </Text>
          </View>

          <View style={styles.ProfileContainer}>
            <Image
              style={styles.image}
              source={require('../assets/images/ProfilePng.png')}
            />
          </View>
          <View style={styles.errorMessage}>
            {error && <AlertCard type="error" message={error} />}
            {success && <AlertCard type="success" message={success} />}
          </View>

          <View style={styles.EditContainer}>
            <InputField
              type="text"
              title={t('Full Name')}
              placeholder={newUsername}
              value={isEditable ? newUsername : ''}
              editable={isEditable}
              onChangeText={setNewUsername}
              icon="user"
              style={[
                styles.inputField,
                isDarkMode
                  ? null
                  : {
                      backgroundColor: '#F0F0F0',
                      borderColor: '#C0C0C0',
                      color: '#1C2128',
                    },
              ]}
            />
            <InputField
              type="email"
              title={t('Enter Your Email')}
              placeholder={newEmail}
              value={isEditable ? newEmail : ''}
              editable={isEditable}
              onChangeText={setNewEmail}
              icon="mail"
              style={[
                styles.inputField,
                isDarkMode
                  ? null
                  : {
                      backgroundColor: '#F0F0F0',
                      borderColor: '#C0C0C0',
                      color: '#1C2128',
                    },
              ]}
            />
            <View style={styles.loginButton}>
              {loading ? (
                <ActivityIndicator size="large" color={'white'} />
              ) : (
                <LoginButton
                  title={isEditable ? t('Save') : t('Edit')}
                  onPress={handleEditSave}
                />
              )}
            </View>
            {isEditable && (
              <View style={styles.loginButton}>
                <LoginButton
                  title={t('Reset')}
                  onPress={() => navigation.replace('EditProfile')}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
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
    alignContent: 'center',
  },

  title: {
    fontSize: 26,
    fontWeight: '600',
    marginLeft: I18nManager.isRTL ? 0 : 32,
    marginRight: I18nManager.isRTL ? 32 : 0,
    marginTop: 18,
  },

  ProfileContainer: {
    alignItems: 'center',
    marginTop: 40,
  },

  image: {
    alignItems: 'center',
    width: 105,
    height: 105,
    borderRadius: 52.5,
  },
  errorMessage: {
    minHeight: 50,
    width: 334,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },

  EditContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputField: {
    marginBottom: 25,
    borderRadius: 10,
    borderWidth: 1,
  },

  loginButton: {
    marginTop: 30,
  },
});

export default EditProfileScreen;
