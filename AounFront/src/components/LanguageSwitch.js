import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
const LanguageSwitch = ({onPress, language}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.switchButton}>
      <Text style={styles.text}>
        {language === 'en' ? 'العربية' : 'English'}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  switchButton: {
    marginTop: 20,
    backgroundColor: '#131417',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
});
export default LanguageSwitch;
