import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TimeInfoOfSection = () => {
  return (
    <View style={styles.lectureRow}>
      <View style={styles.dropdownBox}>
        <View style={styles.Icon}>
          <Icon name="calendar-day" size={18} style={{marginRight: 5}} />
          <Text style={styles.lectureText}>Day</Text>
        </View>
        <View style={styles.underline} />
      </View>
      <View style={styles.Icon}>
        <Ionicons name="time" size={18} />
        <Text style={styles.lectureText}>8:00AM</Text>
      </View>
      <View style={styles.Icon}>
        <Ionicons name="time" size={18} />
        <Text style={styles.lectureText}>8:50AM</Text>
      </View>
    </View>
  );
};

export default TimeInfoOfSection;

const styles = StyleSheet.create({
  Icon: {
    display: 'flex',
    flexDirection: 'row',
  },
  lectureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  dropdownBox: {
    alignItems: 'flex-start',
    marginRight: 10,
  },
  underline: {
    height: 1,
    width: 50,
    backgroundColor: '#C7C7C7',
    marginTop: 4,
  },
  lectureText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
});
