import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

const CalendarScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Title */}
      <Text style={styles.title}>Schedule Generation</Text>

      {/* Retrieve subject Buttons */}
      <View style={styles.buttonView}>
        <TouchableOpacity style={styles.ButtonTouchOpa}>
          <Text style={styles.buttonText}>Retrieve subject</Text>
          <Icon
            name="cloud-download-alt"
            size={16}
            color="#FFFFFF"
            style={styles.IconCloud}
          />
        </TouchableOpacity>

        {/* Add Subject Manually Button */}
        <TouchableOpacity
          style={styles.ButtonTouchOpa}
          onPress={() => navigation.navigate('AddSubjectManually')}>
          <Text style={styles.buttonText}>Add subject manually</Text>
          <Icon
            name="plus-circle"
            size={16}
            color="#FFFFFF"
            style={styles.IconAddSub}
          />
        </TouchableOpacity>
      </View>

      {/* Placeholder for middle content */}
      <View style={styles.middlePlaceholder}>
        {/* Future content goes here */}
      </View>

      {/* Generate Schedule Button */}
      <TouchableOpacity style={styles.generateButton}>
        <Text style={styles.generateButtonText}>Generate Schedule</Text>
      </TouchableOpacity>

      
    </SafeAreaView>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2128',
  },
  title: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 35,
    marginLeft: 25,
  },
  IconCloud: {
    marginLeft: 30,
  },
  IconAddSub: {
    marginLeft: 10,
  },
  buttonView: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  ButtonTouchOpa: {
    backgroundColor: '#131417',
    width: 175,
    height: 37,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    paddingLeft: 12,
  },
  middlePlaceholder: {
    flex: 1,
    marginVertical: 20,
  },
  generateButton: {
    backgroundColor: '#131417',
    paddingVertical: 19,
    borderRadius: 11,
    alignItems: 'center',
    marginBottom: 55,
    width: '70%',
    alignSelf: 'center',
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
