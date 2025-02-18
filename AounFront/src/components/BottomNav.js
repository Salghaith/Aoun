import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const BottomNav = ({ activeTab }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Home */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons
          name="home-outline"
          size={28}
          color={activeTab === 'Home' ? '#FFF' : '#A0A0A0'}
        />
      </TouchableOpacity>

      {/* Placeholder for Page 2 */}
      <TouchableOpacity onPress={() => navigation.navigate('Page2')}>
        <Ionicons
          name="calendar-outline"
          size={28}
          color={activeTab === 'Page2' ? '#FFF' : '#A0A0A0'}
        />
      </TouchableOpacity>

      {/* Placeholder for Page 3 */}
      <TouchableOpacity onPress={() => navigation.navigate('Page3')}>
        <Ionicons
          name="bag-outline"
          size={28}
          color={activeTab === 'Page3' ? '#FFF' : '#A0A0A0'}
        />
      </TouchableOpacity>

      {/* Tasks */}
      <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
        <Ionicons
          name="clipboard-outline"
          size={28}
          color={activeTab === 'Tasks' ? '#FFF' : '#A0A0A0'}
        />
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Ionicons
          name="person-outline"
          size={28}
          color={activeTab === 'Profile' ? '#FFF' : '#A0A0A0'}
        />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: '#131417',
      paddingVertical: 15,
      paddingHorizontal: 30,
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
  });
  

export default BottomNav;
