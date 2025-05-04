import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const FinalDetailsModal = ({ isVisible, onClose = () => {}, onSave = () => {} }) => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [endTimePickerVisible, setEndTimePickerVisible] = useState(false);

  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB');
  };

  const handleSave = () => {
    onSave({
      date: date ? formatDate(date) : '',
      startTime: startTime ? formatTime(startTime) : '',
      endTime: endTime ? formatTime(endTime) : '',
    });
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Final Exam Details</Text>

          {/* Date Picker */}
          <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.inputBox}>
            <Text style={styles.inputText}>{date ? formatDate(date) : 'Pick a date'}</Text>
          </TouchableOpacity>

          {/* Time Row */}
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => setStartTimePickerVisible(true)}
              style={[styles.halfInputBox, { marginRight: 8 }]}
            >
              <Text style={styles.inputText}>{startTime ? formatTime(startTime) : 'Start time'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setEndTimePickerVisible(true)}
              style={styles.halfInputBox}
            >
              <Text style={styles.inputText}>{endTime ? formatTime(endTime) : 'End time'}</Text>
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[styles.button, styles.saveButton]}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker Modals */}
          <DateTimePickerModal
            isVisible={datePickerVisible}
            mode="date"
            onConfirm={(val) => {
              setDate(val);
              setDatePickerVisible(false);
            }}
            onCancel={() => setDatePickerVisible(false)}
          />

          <DateTimePickerModal
            isVisible={startTimePickerVisible}
            mode="time"
            onConfirm={(val) => {
              setStartTime(val);
              setStartTimePickerVisible(false);
            }}
            onCancel={() => setStartTimePickerVisible(false)}
          />

          <DateTimePickerModal
            isVisible={endTimePickerVisible}
            mode="time"
            onConfirm={(val) => {
              setEndTime(val);
              setEndTimePickerVisible(false);
            }}
            onCancel={() => setEndTimePickerVisible(false)}
          />
        </View>
      </View>
    </Modal>
  );
};

export default FinalDetailsModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1C2128',
    borderRadius: 16,
    padding: 24,
    width: '85%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#fff',
  },
  inputBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#131417',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#131417',
  },
  inputText: {
    fontSize: 14,
    color: '#FFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  halfInputBox: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#131417',
    borderRadius: 8,
    backgroundColor: '#131417',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#888',
  },
  saveButton: {
    backgroundColor: '#131417',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
