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

import TimeInfoOfSection from './TimeInfoOfSection';

const SectionDetails = ({}) => {
  return (
    <View>
      {/* Section Number Block */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Section number</Text>
        <View style={styles.divider} />

        {/* Lecture Row 1 */}
        <TimeInfoOfSection />
      </View>

      {/* Add Lecture Button */}
      <TouchableOpacity style={styles.addLectureButton}>
        {/* TODO: Plus icon */}
        <Text style={styles.addLectureText}>Add new lecture</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SectionDetails;

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 0,
    marginHorizontal: 34,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#AAA',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#AAA',
    marginBottom: 12,
  },
  addLectureButton: {
    backgroundColor: '#131417',
    paddingVertical: 4,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
    marginHorizontal: 34,
  },
  addLectureText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
