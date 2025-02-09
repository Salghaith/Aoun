import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
const LoginButton = ({title, onPress, style, fontSize = 18, disabled}) => {
  return (
    <TouchableOpacity onPress={onPress} style={style} disabled={disabled}>
      <View style={styles.button}>
        <Text style={{color: 'white', fontSize, fontWeight: 'bold'}}>
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
