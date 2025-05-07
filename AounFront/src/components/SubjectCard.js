import React from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SubjectCard = ({name, code, sections, isEnabled, onToggle}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.topSection}>
        <Text style={styles.subjectName} numberOfLines={3} ellipsizeMode="tail">
          {name}
        </Text>
      </View>

      <View style={styles.middleSection}>
        <Text style={styles.subjectCode}>{code ? `#${code}` : 'No code'}</Text>
        <View style={styles.divider} />

        <View style={styles.sectionRow}>
          <Ionicons
            name="people"
            size={16}
            color="#000"
            style={styles.peopleIcon}
          />
          <Text style={styles.sectionText}>{sections}</Text>
        </View>

        <View style={styles.divider} />

        <Switch
          trackColor={{false: '#ccc', true: '#000'}}
          thumbColor="#fff"
          ios_backgroundColor="#ccc"
          onValueChange={onToggle}
          value={isEnabled}
          style={styles.switch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    width: '29%',
    height: '89%', // Ensure uniform card height
    margin: 8,
  },
  topSection: {
    backgroundColor: '#131417',
    height: 48,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  middleSection: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    flex: 1,
    justifyContent: 'center',
  },
  subjectCode: {
    fontSize: 12,
    color: '#000',
    marginBottom: 4,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 4,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  peopleIcon: {
    marginRight: 4,
  },
  sectionText: {
    fontSize: 13,
    color: '#000',
  },
  switch: {
    transform: [{scaleX: 0.85}, {scaleY: 0.8}],
  },
});

export default SubjectCard;
