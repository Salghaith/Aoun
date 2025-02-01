import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import BackButton from '../components/BackButton';
const SignupScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButton}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {backgroundColor: '#1C2128', flex: 1},
  backButton: {
    marginLeft: 34,
    marginTop: 4,
  },
});
export default SignupScreen;
