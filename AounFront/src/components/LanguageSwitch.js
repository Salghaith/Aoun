import React from 'react';
import {TouchableOpacity, StyleSheet, View, Image} from 'react-native';

const LanguageSwitch = ({onPress, language}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.switchContainer}>
      <View style={styles.switchContent}>
        <Image
          source={language === 'en' ? require('../assets/images/arabic-flag.png') : require('../assets/images/english-flag.png')}
          style={styles.flagIcon}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    marginTop: 0, // Ensures proper spacing in multiple pages
  },
  switchContent: {
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center',
  },
  flagIcon: {
    width: 40,
    height: 25,
    borderRadius: 4,
  },
});

export default LanguageSwitch;
