import React, {useState} from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import IDcard from 'react-native-vector-icons/AntDesign';

const InputField = ({title, icon, type, style, value, placeholder, editable = true, onChangeText}) => {
  const [secureText, setSecureText] = useState(type === 'password');

  return (
    <View style={[styles.container, style]}>
      {type === 'id' ? ( //If type is KSU ID, show id card, otherwise show {icon}
        <IDcard name="idcard" size={25} color="#817D7D" style={styles.icon} />
      ) : (
        <Icon name={icon} size={25} color="#817D7D" style={styles.icon} />
      )}
      <TextInput
        style={[styles.textInput, !editable && styles.readOnlyTextInput]} // Style for read-only state
        autoCapitalize="none"
        autoCorrect={false}
        numberOfLines={1}
        scrollEnabled
        placeholder={placeholder || title} // Use placeholder or title
        placeholderTextColor="#817D7D"
        secureTextEntry={secureText}
        maxLength={45}  //must be maintained when validation.
        value={value}
        editable={editable} // Make text input editable or read-only
        onChangeText={onChangeText} // Handle text change
      />
      {type === 'password' && editable && ( // Show eye icon only when editable
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
    fontWeight: '500',
    height: "100%",
    width: '75%',
    color: '#000', // Default text color
  },
  readOnlyTextInput: {
    color: '#817D7D', // Text color for read-only state
  },
  eyeIcon: {
    position: 'absolute', //This approach because of RTL problem, when RTL work, this should be maintained.
    right: 30,
  },
});

export default InputField;