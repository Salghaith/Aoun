import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const TaskItem = ({
  title,
  date,
  priority,
  startTime,
  endTime,
  isCompleted,
  onToggleComplete,
}) => {
  // Priority Colors
  const priorityColors = {
    high: '#E53835',   // Red
    medium: '#007AFF', // Blue
    low: '#0AB161',    // Green
  };

  return (
    <View style={styles.taskContainer}>
      {/* Priority Indicator Line */}
      <View
        style={[
          styles.priorityIndicator,
          { backgroundColor: priorityColors[priority] },
        ]}
      />

      {/* Task Details */}
      <View style={styles.taskContent}>
        {/* Title */}
        <Text style={styles.taskTitle}>{title}</Text>

        {/* Date (always shown) */}
        <View style={styles.dateRow}>
          <Feather name="calendar" size={16} color="#A0A0A0" />
          <Text style={styles.taskDate}>{date}</Text>
        </View>

        {/* Times (only if startTime + endTime exist) */}
        {startTime && endTime && (
          <Text style={styles.taskTime}>
            {startTime} - {endTime}
          </Text>
        )}
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
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  taskDate: {
    color: '#A0A0A0',
    fontSize: 14,
    marginLeft: 5,
  },
  taskTime: {
    color: '#A0A0A0',
    fontSize: 14,
    marginTop: 2, // a bit of spacing below date
    marginLeft: 21, 
    // 21 offsets left from the calendar icon,
    // so times line up nicely under the date text
  },
  checkCircle: {
    padding: 5,
  },
});

export default TaskItem;
