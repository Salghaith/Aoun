import React from 'react';
import {View, TouchableOpacity, StyleSheet, I18nManager} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomNav = ({activeTab}) => {
  const navigation = useNavigation();
  const iconColor = tab => (activeTab === tab ? 'white' : '#A0A0A0');
  const iconSize = 30;
  console.log('I18nManager.isRTL', I18nManager.isRTL);

  return (
    <View style={styles.container}>
      {/* Home */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons
          name="home-outline"
          size={iconSize}
          color={iconColor('Home')}
        />
      </TouchableOpacity>

      {/* Calendar */}
      <TouchableOpacity onPress={() => navigation.navigate('GenerateSchedule')}>
        <Ionicons
          name="calendar-outline"
          size={iconSize}
          color={iconColor('GenerateSchedule')}
        />
      </TouchableOpacity>

      {/* ChatBot */}
      <TouchableOpacity onPress={() => navigation.navigate('UserChat')}>
        <MaterialCommunityIcons
          name="robot-outline"
          size={iconSize}
          color={iconColor('UserChat')}
        />
      </TouchableOpacity>

      {/* Tasks */}
      <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
        <Ionicons
          name="clipboard-outline"
          size={iconSize}
          color={iconColor('Tasks')}
        />
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Ionicons
          name="person-outline"
          size={iconSize}
          color={iconColor('Profile')}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    backgroundColor: '#131417',
    paddingVertical: 20,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 80,
  },
});

export default BottomNav;
