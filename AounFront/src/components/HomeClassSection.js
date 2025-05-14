import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import HomeClassCard from './HomeClassCard';

export default function HomeClassSection({style, schedule}) {
  const {t} = useTranslation();
  const [noClasses, setNoClasses] = useState(false);

  const DAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const todayNum = new Date().getDay();
  const today = DAYS[todayNum];

  const parseTime = timeStr => {
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return {hours: 0, minutes: 0}; // fallback

    let [_, hourStr, minuteStr, period] = match;
    let hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);

    if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;

    return {hours, minutes};
  };

  const todaySubjects = schedule.filter(subject =>
    subject.lectures.some(lecture => lecture.day === today),
  );

  const sortedSubjects = todaySubjects.sort((a, b) => {
    const lectureA = a.lectures.find(lec => lec.day === today);
    const lectureB = b.lectures.find(lec => lec.day === today);

    if (!lectureA || !lectureB) return 0;

    const {hours: hourA, minutes: minA} = parseTime(lectureA.startTime);
    const {hours: hourB, minutes: minB} = parseTime(lectureB.startTime);

    return hourA * 60 + minA - (hourB * 60 + minB);
  });

  if (noClasses)
    return <Text style={styles.text}>{t('No classes left today')}</Text>;

  return (
    <View style={[style, styles.container]}>
      {sortedSubjects.length > 0 ? (
        sortedSubjects.map(subject => (
          <HomeClassCard
            key={subject.subjectCode + subject.sectionNum}
            subject={subject}
            today={today}
            setNoClasses={setNoClasses}
          />
        ))
      ) : (
        <Text style={styles.text}>{t('No classes today')}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    marginVertical: 20,
    color: 'white',
    fontSize: 22,
    marginHorizontal: '24%',
  },
  container: {
    width: '100%',
  },
});
