import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {AuthContext} from '../context/AuthContext';
import {ThemeContext} from '../context/ThemeContext';

export default function HomeClassCard({style, subject, today}) {
  const {t} = useTranslation();
  const {userData} = useContext(AuthContext);
  const {isDarkMode, toggleTheme} = useContext(ThemeContext);

  const [status, setStatus] = useState('green');
  const [showCard, setShowCard] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);

  const lectureToday = subject.lectures.find(
    lecture => Number(lecture.day) === today,
  );

  useEffect(() => {
    if (!lectureToday) {
      setShowCard(false);
      return;
    }

    const interval = setInterval(() => {
      const [startHour, startMinute] = lectureToday.start
        .split(':')
        .map(Number);
      const [endHour, endMinute] = lectureToday.end.split(':').map(Number);

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
        clearInterval(interval);
        return;
      }

      if (diffSeconds <= 60 && diffSeconds >= 0) {
        setStatus('red');
        setTimeLeft('NOW');
      } else if (diffMinutes <= 10 && diffMinutes >= 1) {
        setStatus('red');
        setTimeLeft(`${diffMinutes} min`);
      } else if (diffSeconds < 0) {
        setShowCard(false);
        clearInterval(interval);
      } else {
        setStatus('green');
        setTimeLeft(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!showCard) return null;

  const infoSectionWidth =
    status === 'red' ? 260 : status === 'green' ? 315 : 260;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.infoSection, {width: infoSectionWidth}]}>
        <Text style={styles.courseName}>{subject.name}</Text>
        <View style={styles.detailsSection}>
          <Text style={styles.courseDetails}>{subject.code}</Text>
          <Text style={styles.courseDetails}>{subject.section}</Text>
          <Text style={styles.courseDetails}>
            {lectureToday.start} - {lectureToday.end}
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
    width: '83%',
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
    width: '22%',
  },
  greenStatus: {
    backgroundColor: '#4CAF50',
    width: '5%',
  },
  courseName: {
    fontSize: 17,
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
    fontSize: 13,
    color: 'white',
    fontWeight: 'bold',
  },
});
