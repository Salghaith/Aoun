import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';

import { ThemeContext } from '../context/ThemeContext';

const EditTask = ({ visible, onClose, task, onSave, onDelete }) => {
  // i18n + theme
  const { t } = useTranslation();
  const { isDarkMode } = useContext(ThemeContext);

  const [isEditing, setIsEditing] = useState(false);

  // Fields from the existing task
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [taskDescription, setTaskDescription] = useState(task.description || '');
  const [startTime, setStartTime] = useState(task.startTime || '09:00');
  const [endTime, setEndTime] = useState(task.endTime || '10:00');
  const [priority, setPriority] = useState(task.priority);
  const [date, setDate] = useState(task.date);

  // State for showing the time picker
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeType, setTimeType] = useState(null); // 'start' or 'end'

  // For dark/light
  const backgroundColor = isDarkMode ? '#131417' : '#F5F5F5';
  const containerColor = isDarkMode ? '#1C2128' : '#EAEAEA';
  const textColor = isDarkMode ? '#FFFFFF' : '#1C2128';
  const placeholderColor = '#888'; // same for both, or you can vary

  // Convert 'HH:MM' string to a Date object
  const parseTimeStringToDate = (timeStr) => {
    const [hour, minute] = timeStr.split(':').map(Number);
    const now = new Date();
    now.setHours(hour, minute, 0, 0);
    return now;
  };

  // Format a Date to "HH:MM"
  const formatTime = (dateObj) => {
    return dateObj.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // Compare times
  const isBefore = (t1, t2) => {
    // t1, t2 are "HH:MM" strings
    const d1 = parseTimeStringToDate(t1);
    const d2 = parseTimeStringToDate(t2);
    return d1.getTime() < d2.getTime();
  };

  // Show the time picker (only if we're editing)
  const handlePickTime = (which) => {
    if (!isEditing) return;
    setTimeType(which);
    setShowTimePicker(true);
  };

  // Once the user chooses a time
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newString = formatTime(selectedTime);

      if (timeType === 'start') {
        // If new start is after the old endTime, fix
        if (!isBefore(newString, endTime)) {
          setEndTime(newString);
        }
        setStartTime(newString);
      } else {
        // if chosen endTime < startTime => fix
        if (isBefore(newString, startTime)) {
          Alert.alert(
            t('Invalid Time'),
            t('End time cannot be before start time. It has been adjusted.'),
            [{ text: 'OK' }]
          );
          setEndTime(startTime);
        } else {
          setEndTime(newString);
        }
      }
    }
  };

  // Save the updates
  const handleSave = () => {
    onSave({
      id: task.id,
      title: taskTitle,
      description: taskDescription,
      startTime,
      endTime,
      priority,
      date,
    });
    setIsEditing(false);
    Alert.alert(t('Success'), t('Task updated successfully!'), [
      { text: 'OK', onPress: onClose },
    ]);
  };

  // Press events
  const stopPress = (e) => {
    e.stopPropagation();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      {/* Outside overlay: pressing here closes */}
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        {/* Window container: pressing inside does NOT close */}
        <Pressable style={[styles.modalContainer, { backgroundColor }]} onPress={stopPress}>
          {/* Header */}
          <View style={styles.header}>
            {/* Edit / Check button */}
            <Pressable
              onPress={() => setIsEditing(!isEditing)}
              style={({ pressed }) => [pressed && { transform: [{ scale: 0.95 }] }]}
            >
              <Feather
                name={isEditing ? 'check' : 'edit-2'}
                size={24}
                color={textColor}
              />
            </Pressable>

            {/* Trash button */}
            <Pressable
              onPress={() => onDelete(task.id)}
              style={({ pressed }) => [pressed && { transform: [{ scale: 0.95 }] }]}
            >
              <Feather name="trash-2" size={24} color={textColor} />
            </Pressable>
          </View>

          {/* Title */}
          <Text style={[styles.label, { color: textColor }]}>{t('Title')}</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: containerColor, color: textColor },
              !isEditing && styles.disabledInput,
            ]}
            value={taskTitle}
            onChangeText={setTaskTitle}
            placeholder={t('Title')}
            placeholderTextColor={placeholderColor}
            editable={isEditing}
          />

          {/* Description */}
          <Text style={[styles.label, { color: textColor }]}>{t('Description')}</Text>
          <TextInput
            style={[
              styles.input,
              styles.descriptionInput,
              { backgroundColor: containerColor, color: textColor },
              !isEditing && styles.disabledInput,
            ]}
            value={taskDescription}
            onChangeText={setTaskDescription}
            placeholder={t('Description')}
            placeholderTextColor={placeholderColor}
            multiline
            editable={isEditing}
          />

          {/* Date */}
          <Text style={[styles.label, { color: textColor }]}>{t('Date')}</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: containerColor, color: textColor },
              !isEditing && styles.disabledInput,
            ]}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={placeholderColor}
            editable={isEditing}
          />

          {/* Time selection */}
          <View style={styles.timeContainer}>
            {/* Start Time */}
            <View style={styles.timeColumn}>
              <Text style={[styles.label, { color: textColor }]}>{t('Start Time')}</Text>
              <Pressable
                disabled={!isEditing}
                onPress={() => handlePickTime('start')}
                style={({ pressed }) => [
                  styles.timeBox,
                  { backgroundColor: containerColor },
                  pressed && { transform: [{ scale: 0.95 }] },
                ]}
              >
                <Feather name="clock" size={18} color={textColor} />
                <Text style={[styles.timeText, { color: textColor }]}>
                  {startTime}
                </Text>
              </Pressable>
            </View>

            {/* End Time */}
            <View style={styles.timeColumn}>
              <Text style={[styles.label, { color: textColor }]}>{t('End Time')}</Text>
              <Pressable
                disabled={!isEditing}
                onPress={() => handlePickTime('end')}
                style={({ pressed }) => [
                  styles.timeBox,
                  { backgroundColor: containerColor },
                  pressed && { transform: [{ scale: 0.95 }] },
                ]}
              >
                <Feather name="clock" size={18} color={textColor} />
                <Text style={[styles.timeText, { color: textColor }]}>
                  {endTime}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Priority */}
          <Text style={[styles.label, { color: textColor }]}>{t('Priority')}</Text>
          <View style={styles.priorityContainer}>
            {['high', 'medium', 'low'].map((level) => (
              <Pressable
                key={level}
                onPress={() => {
                  if (isEditing) setPriority(level);
                }}
                style={({ pressed }) => [
                  styles.priorityButton,
                  { borderColor: textColor },
                  priority === level && styles.selectedPriority[level],
                  pressed && { transform: [{ scale: 0.95 }] },
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
                    priority === level ? { color: '#FFF' } : { color: '#888' },
                  ]}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Save Button (only while editing) */}
          {isEditing && (
            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                pressed && { transform: [{ scale: 0.95 }] },
              ]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>{t('Save')}</Text>
            </Pressable>
          )}
        </Pressable>
      </Pressable>

      {/* Time picker modal */}
      {showTimePicker && (
        <Modal transparent animationType="slide" visible={showTimePicker}>
          <View style={styles.pickerModalContainer}>
            <DateTimePicker
              value={
                timeType === 'start'
                  ? parseTimeStringToDate(startTime)
                  : parseTimeStringToDate(endTime)
              }
              mode="time"
              display="clock"
              is24Hour={true}
              onChange={handleTimeChange}
            />
          </View>
        </Modal>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    borderRadius: 12,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    opacity: 0.8,
  },
  input: {
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  disabledInput: {
    // you can style it differently if read-only
    opacity: 0.7,
  },
  descriptionInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  timeColumn: {
    flex: 1,
    marginRight: 10,
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 16,
    marginLeft: 5,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  priorityButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
  },
  selectedPriority: {
    high: { backgroundColor: '#E53835', borderColor: '#E53835' },
    medium: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
    low: { backgroundColor: '#0AB161', borderColor: '#0AB161' },
  },
  priorityText: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  pickerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000AA',
    padding: 10,
  },
});

export default EditTask;
