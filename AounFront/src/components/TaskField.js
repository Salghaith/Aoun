import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const TaskField = ({ placeholder, value, onChangeText, multiline = false }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        placeholder={placeholder}
        placeholderTextColor="#818181"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#131417',
    borderRadius: 14,
    padding: 10,
    marginBottom: 15,
  },
  input: {
    color: 'white',
    fontSize: 16,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default TaskField;
