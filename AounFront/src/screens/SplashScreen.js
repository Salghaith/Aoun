import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator, StyleSheet, Image} from 'react-native';
import {getData, storeData, clearStorage} from '../utils/storageUtils';
import {auth} from '../config/firebaseConfig';
import i18n from '../i18n';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const initializeApp = async () => {
      const savedLang = await getData('userLanguage');
      if (savedLang) await i18n.changeLanguage(savedLang);

      const rememberMe = await getData('rememberMe');

      if (rememberMe) {
        auth.onAuthStateChanged(async user => {
          if (user) {
            try {
              const newToken = await user.getIdToken(true);
              await storeData('userToken', newToken);
              navigation.navigate('Profile');
            } catch (error) {
              console.error('❌ Error refreshing token:', error);
              await clearStorage();
              await storeData('userLanguage', savedLang);
              navigation.replace('Home');
            }
          } else {
            await clearStorage();
            await storeData('userLanguage', savedLang);
            navigation.navigate('Home');
          }
        });
      } else {
        await clearStorage();
        await storeData('userLanguage', savedLang);
        navigation.navigate('Home');
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
