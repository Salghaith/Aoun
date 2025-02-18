import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const TaskItem = ({ title, date, priority, isCompleted, onToggleComplete }) => {
  // Priority Colors
  const priorityColors = {
    high: '#FF4D4D', // Red
    medium: '#4D79FF', // Blue
    low: '#4CAF50', // Green
  };

  return (
    <View style={styles.taskContainer}>
      {/* Priority Indicator Line */}
      <View style={[styles.priorityIndicator, { backgroundColor: priorityColors[priority] }]} />

      {/* Task Details */}
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{title}</Text>
        <View style={styles.dateContainer}>
          <Feather name="calendar" size={16} color="#A0A0A0" />
          <Text style={styles.taskDate}>{date}</Text>
        </View>
      </View>

      {/* Check Icon */}
      <TouchableOpacity onPress={onToggleComplete} style={styles.checkCircle}>
        <Feather 
          name={isCompleted ? 'check-circle' : 'circle'} 
          size={24} 
          color={isCompleted ? '#4CAF50' : '#FFFFFF'} // Green when completed
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131417',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  priorityIndicator: {
    width: 5,
    height: '100%',
    borderTopLeftRadius: 12, 
    borderBottomLeftRadius: 12, 
    marginRight: 10,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  taskDate: {
    color: '#A0A0A0',
    fontSize: 14,
    marginLeft: 5,
  },
  checkCircle: {
    padding: 5,
  },
});

export default TaskItem;
