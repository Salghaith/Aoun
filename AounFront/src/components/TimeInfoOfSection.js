import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

const TimeInfoOfSection = ({
  day,
  startTime,
  endTime,
  isDropdownOpen,
  onToggleDropdown,
  onSelectDay,
  onSelectStartTime,
  onSelectEndTime,
}) => {
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const formatTime = date => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  };

  return (
    <View style={styles.lectureRow}>
      {/* Day Section */}
      <View style={styles.dayContainer}>
        <TouchableOpacity onPress={onToggleDropdown}>
          <View style={styles.Icon}>
            <Icon
              name="calendar-day"
              size={18}
              style={{marginRight: 5, marginTop: 5}}
            />
            <Text style={styles.lectureDay}>{day}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.underline} />

        {isDropdownOpen && (
          <View style={styles.dropdown}>
            {days.map((d, index) => (
              <TouchableOpacity key={index} onPress={() => onSelectDay(d)}>
                <Text style={styles.dropdownItem}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Start Time */}
      <TouchableOpacity
        style={styles.Icon}
        onPress={() => setStartPickerVisible(true)}>
        <Ionicons name="time" size={18} />
        <Text style={styles.lectureTime}>{startTime}</Text>
      </TouchableOpacity>

      {/* End Time */}
      <TouchableOpacity
        style={styles.Icon}
        onPress={() => setEndPickerVisible(true)}>
        <Ionicons name="time" size={18} />
        <Text style={styles.lectureTime}>{endTime}</Text>
      </TouchableOpacity>

      {/* Modals */}
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="time"
        onConfirm={date => {
          onSelectStartTime(formatTime(date));
          setStartPickerVisible(false);
        }}
        onCancel={() => setStartPickerVisible(false)}
      />
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="time"
        onConfirm={date => {
          onSelectEndTime(formatTime(date));
          setEndPickerVisible(false);
        }}
        onCancel={() => setEndPickerVisible(false)}
      />
    </View>
  );
};

export default TimeInfoOfSection;

const styles = StyleSheet.create({
  lectureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayContainer: {
    width: '33%',
    position: 'relative',
  },
  Icon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  underline: {
    height: 1,
    backgroundColor: '#C7C7C7',
    marginTop: 4,
    width: '100%',
  },
  lectureDay: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    marginTop: 5,
  },
  lectureTime: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    marginLeft: 8,
  },
  dropdown: {
    position: 'absolute',
    top: 30,
    left: 0,
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 5,
    paddingVertical: 6,
    zIndex: 100,
    width: '110%',
  },
  dropdownItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#000',
  },
});
