import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
const LoginScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Log in page</Text>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {backgroundColor: '#1C2128', flex: 1},
});
export default LoginScreen;
