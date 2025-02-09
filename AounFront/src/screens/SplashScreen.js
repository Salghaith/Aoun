import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator, StyleSheet, Image} from 'react-native';
import {getData, storeData, clearStorage} from '../utils/storageUtils';
import {auth} from '../config/firebaseConfig';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const checkUserSession = async () => {
      const rememberMe = await getData('rememberMe');

      if (rememberMe) {
        auth.onAuthStateChanged(async user => {
          if (user) {
            try {
              //Refresh token before it expires
              const newToken = await user.getIdToken(true);
              await storeData('userToken', newToken);

              navigation.navigate('Profile');
            } catch (error) {
              console.error('Error refreshing token:', error);
              await clearStorage();
              navigation.replace('Home');
            }
          } else {
            await clearStorage();
            navigation.navigate('Home');
          }
        });
      } else {
        await clearStorage();
        navigation.navigate('Home');
      }
    };

    checkUserSession();
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
