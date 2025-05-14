import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useTranslation} from 'react-i18next';

const SearchBar = ({ value, onChangeText }) => {
  const {t} = useTranslation();
  return (
    <View style={styles.searchContainer}>
      <Feather name="search" size={20} color="#FFFFFF" style={styles.icon} />
      <TextInput
        placeholder={t('Search Task Here')}
        placeholderTextColor="#888888"
        style={styles.input}
        value={value} // Bind value from props
        onChangeText={onChangeText} // Handle text change
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131417',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 42,
    marginLeft: 37,
    marginRight: 37,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SearchBar;
