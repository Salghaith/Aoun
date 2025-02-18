import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const SearchBar = () => {
  return (
    <View style={styles.searchContainer}>
      <Feather name="search" size={20} color="#FFFFFF" style={styles.icon} />
      <TextInput
        placeholder="Search Task Here"
        placeholderTextColor="#888888"
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131417', // Set background color
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 42, // Space below title
    marginLeft: 37, // Align with title
    marginRight: 37, // Added right margin
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF', // Text color
    fontSize: 16,
  },
});

export default SearchBar;
