import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
const SignupScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Sign up page</Text>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {backgroundColor: '#1C2128', flex: 1},
});
export default SignupScreen;
