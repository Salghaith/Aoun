import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import BackButton from '../components/BackButton';
import InputField from '../components/InputField';
const SignupScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButton}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>
      <View style={{alignSelf: 'center', marginTop: 100}}>
        <InputField title="Full Name" icon="user" />
        <InputField title="Enter Your Email" icon="mail" />
        <InputField title="Password" icon="lock" />
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
