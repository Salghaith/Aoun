import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MINUTES_PER_HOUR = 60;
const HOUR_HEIGHT = 60; // height in pixels for one hour slot
const COLUMN_WIDTH = 60;

const dayToColumnIndex = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
};

const LectureBlock = ({lecture, sectionNumber, subjectCode}) => {
  const {day, startTime, endTime} = lecture;

  const toMinutes = time => {
    const [hourStr, ampm] = time.split(/(?=[AP]M)/);
    let [h, m] = hourStr.split(':').map(Number);
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  const startOffset = start - 480; // from 8:00 AM
  const height = ((end - start) / MINUTES_PER_HOUR) * HOUR_HEIGHT;
  const top = (startOffset / MINUTES_PER_HOUR) * HOUR_HEIGHT;
  const left = dayToColumnIndex[day] * COLUMN_WIDTH;

  return (
    <View style={[styles.block, {top, left, height}]}>
      {subjectCode && <Text style={styles.code}>{subjectCode}</Text>}
      <View style={styles.separator} />
      <Text style={styles.section}>{sectionNumber}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    position: 'absolute',
    width: COLUMN_WIDTH - 5,
    backgroundColor: '#0F0F0F',
    borderRadius: 12,
    alignItems: 'center',
    paddingTop: 4,
  },
  code: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
  separator: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    marginVertical: 2,
  },
  section: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default LectureBlock;
