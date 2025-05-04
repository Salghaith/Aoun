import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {AuthContext} from '../context/AuthContext';
import {ThemeContext} from '../context/ThemeContext';

const HomeToDoCard = ({ task }) => {
    let allowedTitle = task.title;
  if (task.title.length > 40) {
    allowedTitle = task.title.slice(0, 40) + '...';
  }
  return (
    <View style={[styles.card]}>
      <View style={styles.taskNameContainer}>
        <Text style={styles.taskName}>{allowedTitle}</Text>
      </View>
      <View style={styles.dateTimeContainer}>
        <View style={styles.dateSection}>
          <View
            style={[
              styles.importanceCircle,
              {
                backgroundColor:
                  task.priority === 'high'
                    ? '#E53835'
                    : task.priority === 'medium'
                    ? '#007AFF'
                    : 'green',
              },
            ]}
          />
          <Text style={styles.dateText}>{task.date}</Text>
        </View>
        <Text style={[styles.dateText, {marginLeft: 16}]}>
          {task.startTime} - {task.endTime}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 140,
    borderRadius: 18,
    backgroundColor: '#131417',
    padding: 15,
  },
  importanceCircle: {
    width: 12,
    height: 12,
    borderRadius: 5,
    marginRight: 5,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#828282',
    fontWeight: 'medium',
    fontSize: 13,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  taskNameContainer: {
    marginTop: 15,
  },
  dateTimeContainer: {
    position: 'absolute',
    bottom: 10,
    left: 12,
  },
});
export default HomeToDoCard;
