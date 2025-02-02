import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import BackButton from '../components/BackButton';

const ProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Profile</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/ProfilePng.png')}
          style={styles.image}
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
  backButtonContainer: {
    position: 'absolute',
    top: 14,
    left: 34,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: '600',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  image: {
    width: 105,
    height: 105,
    borderRadius: 52.5, // Circular image
  },
});

export default ProfileScreen;