import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ScheduleHeader = ({schedule}) => {
  const allLectures = schedule
    .flatMap(s => s.lectures)
    .filter(l => l.day && l.startTime && l.endTime);

  const toMinutes = time => {
    const [hourStr, ampm] = time.split(/(?=[AP]M)/);
    let [h, m] = hourStr.split(':').map(Number);
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  const toHourFormat = mins => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    const paddedMin = m.toString().padStart(2, '0');
    return `${hour}:${paddedMin} ${period}`;
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const breaks = [];

  days.forEach(day => {
    const dayLectures = allLectures
      .filter(l => l.day === day)
      .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

    for (let i = 1; i < dayLectures.length; i++) {
      const prevEnd = toMinutes(dayLectures[i - 1].endTime);
      const nextStart = toMinutes(dayLectures[i].startTime);
      breaks.push(nextStart - prevEnd);
    }
  });

  const offDays = days.filter(day => !allLectures.some(l => l.day === day));
  const longestBreak = breaks.length > 0 ? Math.max(...breaks) : 0;
  const startTime = Math.min(...allLectures.map(l => toMinutes(l.startTime)));
  const endTime = Math.max(...allLectures.map(l => toMinutes(l.endTime)));

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        <Text style={styles.iconText}>
          <Icon name="calendar" size={14} /> {toHourFormat(startTime)}
        </Text>
        <Text style={styles.iconText}>
          <Icon name="calendar" size={14} /> {toHourFormat(endTime)}
        </Text>
        <Text style={styles.iconText}>
          <Icon name="coffee" size={14} /> {breaks.length}
        </Text>
        <Text style={styles.iconText}>
          <Icon name="clock" size={14} /> {Math.floor(longestBreak / 60)}
        </Text>
        <Text style={styles.iconText}>
          <Icon name="bed" size={14} /> {offDays.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#131417',
    padding: 10,
    borderRadius: 12,
    width: '98%',
    marginVertical: 14,
  },
  iconText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default ScheduleHeader;
