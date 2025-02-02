import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Feather';
const InputField = ({title, icon ,secureTextEntry }) => {
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Icon name={icon} size={25} color="#817D7D" />
      </View>
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={title}
        placeholderTextColor="#817D7D"
        secureTextEntry= {secureTextEntry}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 334,
    height: 65,
    backgroundColor: '#F5F5F5',
    borderRadius: 13,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 30, //Should be removed
  },
  icon: {
    marginLeft: 23,
    marginRight: 20,
  },
  textInput: {
    fontSize: 16,
    fontWeight: 500,
  },
});
export default InputField;
