import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {AuthContext} from '../context/AuthContext';
import {ThemeContext} from '../context/ThemeContext';
import HomeClassCard from './HomeClassCard';

export default function HomeClassSection({style, schedule}) {
  const {t} = useTranslation();
  const {userData} = useContext(AuthContext);
  const {isDarkMode, toggleTheme} = useContext(ThemeContext);
  const [noClasses, setNoClasses] = useState(false);

  const today = new Date().getDay()+1;


  const todaySubjects = schedule.filter(subject =>
    subject.lectures.some(lecture => Number(lecture.day) === today),
  );


  const sortedSubjects = todaySubjects.sort((a, b) => {
    const lectureA = a.lectures.find(lec => Number(lec.day) === today);
    const lectureB = b.lectures.find(lec => Number(lec.day) === today);

    if (!lectureA || !lectureB) return 0;

    const [startHourA, startMinuteA] = lectureA.start.split(':').map(Number);
    const [startHourB, startMinuteB] = lectureB.start.split(':').map(Number);

    if (startHourA !== startHourB) {
      return startHourA - startHourB;
    }
    return startMinuteA - startMinuteB;
  });

  if (noClasses)
    return <Text style={styles.text}>{t('No classes left today')}</Text>;

  return (
    <View style={[style]}>
      {sortedSubjects.length > 0 ? (
        sortedSubjects.map(subject => (
          <HomeClassCard
            key={subject.code}
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
    marginTop: 20,
    color: 'white',
    fontSize: 22,
  },
});
