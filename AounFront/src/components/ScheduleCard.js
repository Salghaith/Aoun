import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ScheduleCard = ({schedule, index}) => {
  const allLectures = schedule.flatMap(section => section.lectures);

  const toMinutes = t => {
    const [hm, period] = t.split(/(?=[AP]M)/);
    let [h, m] = hm.split(':').map(Number);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  const toHourFormat = mins => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const period = h >= 12 ? 'pm' : 'am';
    const hour = h % 12 || 12;
    const paddedMin = m.toString().padStart(2, '0');
    return `${hour}:${paddedMin}${period}`;
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

  const offDays = days.filter(d => !allLectures.some(l => l.day === d));
  const longestBreak = breaks.length > 0 ? Math.max(...breaks) : 0;

  const startTime = Math.min(...allLectures.map(l => toMinutes(l.startTime)));
  const endTime = Math.max(...allLectures.map(l => toMinutes(l.endTime)));

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Schedule {index + 1}</Text>
      <View style={styles.row}>
        <Icon name="bed" size={12} />
        <Text style={styles.label}>Off Days</Text>
        <Text>{offDays.length}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="coffee" size={12} />
        <Text style={styles.label}>Breaks</Text>
        <Text>{breaks.length}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="clock" size={12} solid />
        <Text style={styles.label}>Longest break</Text>
        <Text>{Math.floor(longestBreak / 60)}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="calendar-day" size={12} />
        <Text style={styles.label}>Day Begins</Text>
        <Text>{toHourFormat(startTime)}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="calendar-day" size={12} />
        <Text style={styles.label}>Day Ends</Text>
        <Text>{toHourFormat(endTime)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '45%',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    overflow: 'hidden',
  },
  cardTitle: {
    backgroundColor: '#131417',
    color: '#FFF',
    fontWeight: 'bold',
    paddingVertical: 6,
    fontSize: 14,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  label: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
});

export default ScheduleCard;
