import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

export default function HomeClassCard({style, subject, today, setNoClasses}) {
  const {t} = useTranslation();

  const [status, setStatus] = useState('green');
  const [showCard, setShowCard] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);

  const lectureToday = subject.lectures.find(lecture => lecture.day === today);
  const parseTime = timeStr => {
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) {
      throw new Error(`Invalid time format: ${timeStr}`);
    }

    let [_, hourStr, minuteStr, period] = match;
    let hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);

    if (period.toUpperCase() === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }

    return {hours, minutes};
  };

  useEffect(() => {
    if (!lectureToday) {
      setShowCard(false);
      return;
    }

    let timeoutId;

    const checkTime = () => {
      const {hours: startHour, minutes: startMinute} = parseTime(
        lectureToday.startTime,
      );
      const {hours: endHour, minutes: endMinute} = parseTime(
        lectureToday.endTime,
      );

      const now = new Date();
      const startTime = new Date();
      const endTime = new Date();

      startTime.setHours(startHour, startMinute, 0, 0);
      endTime.setHours(endHour, endMinute, 0, 0);

      const diffMs = startTime.getTime() - now.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);

      if (now > endTime) {
        setShowCard(false);
        return;
      }

      if (diffSeconds <= 60 && diffSeconds >= 0) {
        setStatus('red');
        setTimeLeft('NOW');
        timeoutId = setTimeout(checkTime, 10000);
      } else if (diffMinutes <= 10 && diffMinutes >= 1) {
        setStatus('red');
        setTimeLeft(`${diffMinutes} min`);
        timeoutId = setTimeout(checkTime, 60000);
      } else if (diffSeconds < 0) {
        setShowCard(false);
      } else {
        setStatus('green');
        setTimeLeft(null);
        timeoutId = setTimeout(checkTime, 5 * 60 * 1000);
      }
    };

    checkTime();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // if (!showCard) {
  //   return null;
  // }
  useEffect(() => {
    if (!showCard && typeof setNoClasses === 'function') {
      setNoClasses(true);
    }
  }, [showCard]);

  const infoSectionWidth =
    status === 'red' ? '74%' : status === 'green' ? '87%' : '74%';
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.infoSection, {width: infoSectionWidth}]}>
        <Text style={styles.courseName}>{subject.subjectName}</Text>
        <View style={styles.detailsSection}>
          <Text style={styles.courseDetails}>{subject.subjectCode}</Text>
          <Text style={styles.courseDetails}>{subject.sectionNum}</Text>
          <Text style={styles.courseDetails}>
            {lectureToday.startTime} - {lectureToday.endTime}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.statusSection,
          status === 'red' ? styles.redStatus : styles.greenStatus,
        ]}>
        {timeLeft && <Text style={styles.courseName}>{timeLeft}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 66,
    width: '100%',
    marginBottom: 25,
  },
  infoSection: {
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    backgroundColor: '#131417',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  statusSection: {
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redStatus: {
    backgroundColor: '#E53835',
    width: '19%',
  },
  greenStatus: {
    backgroundColor: '#4CAF50',
    width: '6%',
  },
  courseName: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: 220,
  },
  courseDetails: {
    fontSize: 11,
    color: 'white',
    fontWeight: 'bold',
  },
});
