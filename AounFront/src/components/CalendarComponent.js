import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';

const CalendarComponent = ({onDateSelect}) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const getLocalDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Ensures two digits
    const day = String(today.getDate()).padStart(2, '0'); // Ensures two digits

    return `${year}-${month}-${day}`;
  };
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  const handleDayPress = day => {
    setSelectedDate(day.dateString);
    if (onDateSelect) {
      onDateSelect(day.dateString);
    }
  };

  return (
    <View style={styles.calendarContainer}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [getLocalDate()]: {selected: true, selectedColor: '#131417'}, // Highlight today
          [selectedDate]: {selected: true, selectedColor: '#FFA500'}, // Highlight selected date in orange
        }}
        theme={{
          calendarBackground: '#1C2128',
          textSectionTitleColor: '#FFFFFF',
          selectedDayBackgroundColor: '#131417', // Today’s highlight
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: '#FFA500', // Today’s text color
          dayTextColor: '#FFFFFF',
          textDisabledColor: '#888888',
          monthTextColor: '#FFFFFF',
          arrowColor: '#FFFFFF',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    marginTop: 30, // Space under search bar
    marginLeft: 37,
    marginRight: 37,
    borderRadius: 12,
    overflow: 'hidden', // Ensures the rounded corners work
  },
});

export default CalendarComponent;
