/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator, StyleSheet, Image} from 'react-native';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Home'); // Replace to prevent back button going to splash
    }, 2000); // 2 seconds delay
  }, );

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
