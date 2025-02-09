import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Image, Alert} from 'react-native';
import BackButton from '../components/BackButton';
import InputField from '../components/InputField';
import LoginButton from '../components/LoginButton';
import {useTranslation} from 'react-i18next';
import {AuthContext} from '../context/AuthContext';
import {use} from 'i18next';
import {useUpdateProfile} from '../hooks/useUpdateProfile';

const EditProfileScreen = ({navigation}) => {
  const {t} = useTranslation();
  const [isEditable, setIsEditable] = useState(false);
  const {username, email} = useContext(AuthContext);
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const {updateUserProfile, loading} = useUpdateProfile();

  const handleEditSave = () => {
    if (isEditable) {
      updateUserProfile(newUsername, newEmail);
    }
    setIsEditable(!isEditable);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>{t('Edit Information')}</Text>
      </View>

      <View style={styles.ProfileContainer}>
        <Image
          style={styles.image}
          source={require('../assets/images/ProfilePng.png')}
        />
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
          style={styles.inputField}
        />
        <InputField
          type="email"
          title={t('Enter Your Email')}
          placeholder={newEmail}
          value={isEditable ? newEmail : ''}
          editable={isEditable}
          onChangeText={setNewEmail}
          icon="mail"
          style={styles.inputField}
        />

        <LoginButton
          title={isEditable ? t('Save') : t('Edit')}
          onPress={handleEditSave}
          style={styles.loginButton}
          disabled={loading}
        />
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
    marginLeft: 32,
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
    borderRadius: 52.5, // Circular image
  },

  EditContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },

  inputField: {
    marginBottom: 25, // Added space between inputs
  },

  loginButton: {
    marginTop: 30, // Added space above the login button
  },
});

export default EditProfileScreen;
