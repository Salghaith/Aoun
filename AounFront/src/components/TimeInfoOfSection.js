import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
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

  const parseTimeTo24 = t => {
    const match = t.match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
    if (!match) return [0, 0];
    let [_, hour, min, ampm] = match;
    hour = parseInt(hour, 10);
    min = parseInt(min, 10);
    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    return [hour, min];
  };

  const formatTime = date => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  };

  const parseToDate = timeStr => {
    const [hm, period] = timeStr.split(/(?=[AP]M)/);
    const [h, m] = hm.split(':').map(Number);
    const date = new Date();
    date.setHours(
      period === 'PM' && h !== 12
        ? h + 12
        : h === 12 && period === 'AM'
        ? 0
        : h,
    );
    date.setMinutes(m);
    date.setSeconds(0);
    return date;
  };

  const minStart = new Date();
  minStart.setHours(8, 0, 0);

  const maxStart = new Date();
  maxStart.setHours(19, 0, 0); // 7:00 PM

  const minEnd = new Date();
  minEnd.setHours(8, 30, 0);

  const maxEnd = new Date();
  maxEnd.setHours(20, 0, 0); // 8:00 PM

  const currentStart = parseToDate(startTime);

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
            <ScrollView>
              {days.map((d, index) => (
                <TouchableOpacity key={index} onPress={() => onSelectDay(d)}>
                  <Text style={styles.dropdownItem}>{d}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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

      {/* Time Pickers */}
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="time"
        onConfirm={date => {
          const selectedStart = new Date(date);
          const selectedStartStr = formatTime(selectedStart);

          const [startHour, startMinute] = [
            selectedStart.getHours(),
            selectedStart.getMinutes(),
          ];

          // Minimum: 8:00 AM, Maximum: 7:00 PM
          if (startHour < 8 || startHour > 19) {
            alert('Start time must be between 8:00 AM and 7:00 PM');
            setStartPickerVisible(false);
            return;
          }

          // Auto-fix end time if it’s invalid
          const [endHour, endMin] = parseTimeTo24(endTime);
          const endTotal = endHour * 60 + endMin;
          const startTotal = startHour * 60 + startMinute;

          if (endTotal <= startTotal) {
            const autoEnd = new Date(selectedStart.getTime() + 5 * 60 * 1000); // add 5 min
            const autoEndStr = formatTime(autoEnd);
            onSelectEndTime(autoEndStr);
          }

          onSelectStartTime(selectedStartStr);
          setStartPickerVisible(false);
        }}
        onCancel={() => setStartPickerVisible(false)}
        minimumDate={minStart}
        maximumDate={maxStart}
        minuteInterval={5}
      />

      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="time"
        onConfirm={date => {
          const selected = parseToDate(formatTime(date));
          const selectedStr = formatTime(date);

          if (selected <= currentStart) {
            alert('End time must be after start time.');
          } else if (selectedStr === startTime) {
            alert('Start and end times cannot be the same.');
          } else {
            onSelectEndTime(selectedStr);
          }
          setEndPickerVisible(false);
        }}
        onCancel={() => setEndPickerVisible(false)}
        minimumDate={currentStart > minEnd ? currentStart : minEnd}
        maximumDate={maxEnd}
        minuteInterval={5}
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
    zIndex: 100,
    width: '110%',
    maxHeight: 180, // 🟢 adjust height to fit screen and scrolling
  },

  dropdownItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#000',
  },
});
