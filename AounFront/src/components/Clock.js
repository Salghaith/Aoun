import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Clock = ({ visible, onClose, onConfirm, initialTime }) => {
  const [hour, setHour] = useState(initialTime.getHours());
  const [minute, setMinute] = useState(initialTime.getMinutes());

  const adjustHour = (increment) => {
    setHour((prevHour) => (increment ? (prevHour + 1) % 24 : (prevHour - 1 + 24) % 24));
  };

  const adjustMinute = (increment) => {
    setMinute((prevMinute) => (increment ? (prevMinute + 5) % 60 : (prevMinute - 5 + 60) % 60));
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.clockContainer}>
          <Text style={styles.title}>Select Time</Text>
          <View style={styles.timeSelector}>
            <View style={styles.timeColumn}>
              <TouchableOpacity onPress={() => adjustHour(true)}>
                <Icon name="chevron-up" size={30} color="white" />
              </TouchableOpacity>
              <Text style={styles.timeText}>{hour.toString().padStart(2, '0')}</Text>
              <TouchableOpacity onPress={() => adjustHour(false)}>
                <Icon name="chevron-down" size={30} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.timeText}>:</Text>
            <View style={styles.timeColumn}>
              <TouchableOpacity onPress={() => adjustMinute(true)}>
                <Icon name="chevron-up" size={30} color="white" />
              </TouchableOpacity>
              <Text style={styles.timeText}>{minute.toString().padStart(2, '0')}</Text>
              <TouchableOpacity onPress={() => adjustMinute(false)}>
                <Icon name="chevron-down" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onConfirm(new Date().setHours(hour, minute))} style={styles.confirmButton}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockContainer: {
    backgroundColor: '#131417',
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeColumn: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#B02626',
    borderRadius: 10,
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#0084FF',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Clock;