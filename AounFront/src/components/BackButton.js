import React from 'react';
import {TouchableOpacity, StyleSheet, I18nManager} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const BackButton = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon
        name={I18nManager.isRTL ? 'chevron-small-right' : 'chevron-small-left'}
        size={35}
        color="white"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: '#131417',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: I18nManager.isRTL ? 0 : 34,
    marginRight: I18nManager.isRTL ? 34 : 0,
    marginTop: 14,
  },
});

export default BackButton;
