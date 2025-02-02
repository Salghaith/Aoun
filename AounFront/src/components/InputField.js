import React, {useState} from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import IDcard from 'react-native-vector-icons/AntDesign';

const InputField = ({title, icon, type, style}) => {
  const [secureText, setSecureText] = useState(type === 'password');

  return (
    <View style={[styles.container, style]}>
      {type === 'id' ? ( //If type is KSU ID, show id card, otherwise show {icon}
        <IDcard name="idcard" size={25} color="#817D7D" style={styles.icon} />
      ) : (
        <Icon name={icon} size={25} color="#817D7D" style={styles.icon} />
      )}
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        autoCorrect={false}
        numberOfLines={1}
        scrollEnabled
        placeholder={title}
        placeholderTextColor="#817D7D"
        secureTextEntry={secureText}
        maxLength={45}  //must be maintained when validation.
      />
      {type === 'password' && ( //If the input is password, add the eye.
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setSecureText(!secureText)}>
          <Icon
            name={secureText ? 'eye-off' : 'eye'}
            size={24}
            color="#817D7D"
          />
        </TouchableOpacity>
      )}
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
    overflow: 'scroll',
  },
  icon: {
    marginLeft: 23,
    marginRight: 20,
  },
  textInput: {
    fontSize: 16,
    fontWeight: 500,
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute', //This aproach because of RTL problem, when RTL work, this should be maintained.
    right: 30,
  },
});
export default InputField;
