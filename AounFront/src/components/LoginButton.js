import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
const LoginButton = ({title, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    width: 334,
    height: 63,
    backgroundColor: '#131417',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default LoginButton;
