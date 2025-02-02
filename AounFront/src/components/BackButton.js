import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const BackButton = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon name="chevron-small-left" size={35} color="white" />
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
    marginLeft: 34,
    marginTop: 14,
  },
});

export default BackButton;
