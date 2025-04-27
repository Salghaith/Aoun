import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  I18nManager,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {AuthContext} from '../context/AuthContext';
import {ThemeContext} from '../context/ThemeContext';
export default function HomeClassCard({style}) {
  const {t} = useTranslation();
  const {userData} = useContext(AuthContext);
  const {isDarkMode, toggleTheme} = useContext(ThemeContext);
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.infoSection]}>
        <Text>Text</Text>
      </View>
      <View style={[styles.statusSection, styles.redStatus]}></View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 66,
    width: 334,
    justifyContent: 'center',
  },
  infoSection: {
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    backgroundColor: '#131417',
    width: 260,
  },
  statusSection: {
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
  },
  redStatus: {
    backgroundColor: '#E53835',
    width: 74,
  },
  greenStatus: {
    backgroundColor: '#E53835',
    width: '5%',
  },
});
