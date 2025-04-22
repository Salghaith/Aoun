import React, {useEffect, useContext} from 'react';
import {View, Text, ActivityIndicator, StyleSheet, Image} from 'react-native';
import {getData, removeData} from '../utils/storageUtils';
import {auth} from '../config/firebaseConfig';
import i18n from '../i18n';
import {AuthContext} from '../context/AuthContext';

const SplashScreen = () => {
  const {updateUserData} = useContext(AuthContext); // ⬅️ use this to switch stack

  useEffect(() => {
    const initializeApp = async () => {
      const savedLang = await getData('userLanguage');
      if (savedLang) await i18n.changeLanguage(savedLang);

      const userData = await getData('userData');

      if (userData && userData.rememberMe) {
        auth.onAuthStateChanged(async user => {
          if (user) {
            try {
              userData.userToken = await user.getIdToken(true);
              updateUserData(userData); // ✅ trigger switch to AppStack
            } catch (error) {
              console.log('❌ Error refreshing token:', error);
              await removeData('userData');
              updateUserData(null); // ✅ stay in AuthStack
            }
          } else {
            await removeData('userData');
            updateUserData(null);
          }
        });
      } else {
        await removeData('userData');
        updateUserData(null);
      }
    };

    initializeApp();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/aoun-logo.png')}
        style={{marginTop: 160}}
      />
      <Text style={styles.text}>AOUN</Text>
      <ActivityIndicator size="large" color={'white'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1C2128',
  },
  text: {
    marginTop: 70,
    marginBottom: 50,
    fontSize: 40,
    fontWeight: '500',
    color: 'white',
  },
});

export default SplashScreen;
