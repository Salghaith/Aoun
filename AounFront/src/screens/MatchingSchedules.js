import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import BackButton from '../components/BackButton';
import ScheduleCard from '../components/ScheduleCard';
import {useSubjects} from '../context/SubjectContext';
import {useTranslation} from 'react-i18next';

const MatchingSchedules = ({route, navigation}) => {
  const {t} = useTranslation();
  const {filters} = route.params;
  const [validSchedules, setValidSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const {subjects} = useSubjects();

  useEffect(() => {
    const generateSchedules = async () => {
      setLoading(true);

      const selectedSubjects = subjects.filter(subj => subj.isSelected);

      // Filter and map subjects to include subjectCode with each section
      const filteredSectionLists = selectedSubjects
        .map(subject => {
          const subjectCode = subject.code || 'No code';
          const entries = Object.entries(subject.sections || {});
          return entries.map(([sectionNum, data]) => ({
            sectionNum,
            ...data,
            subjectCode,
          }));
        })
        .filter(sectionList => sectionList.length > 0);

      const combinations = getCombinations(filteredSectionLists);

      console.log('Total combinations:', combinations.length);

      // Safety cap
      if (combinations.length > 100) {
        console.warn('Too many combinations. Aborting to prevent freezing.');
        setValidSchedules([]);
        setLoading(false);
        return;
      }

      const valid = combinations
        .filter(schedule => isValid(schedule, filters))
        .filter(schedule =>
          schedule.some(section => section.lectures?.length > 0),
        ); // ✅ exclude empty ones

      console.log('Valid schedules:', valid.length);

      setValidSchedules(valid);
      setLoading(false);
    };

    generateSchedules();
  }, [filters, subjects]);

  const getCombinations = sectionLists => {
    if (sectionLists.length === 0) return [[]];
    const [first, ...rest] = sectionLists;
    const restCombinations = getCombinations(rest);
    return first.flatMap(section =>
      restCombinations.map(comb => [...comb, section]),
    );
  };

  const isValid = (schedule, filters) => {
    const {offDays, startHour, endHour, maxBreak} = filters;

    const toMinutes = time => {
      const [hourStr, ampm] = time.split(/(?=[AP]M)/);
      let [h, m] = hourStr.split(':').map(Number);
      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };

    const allLectures = schedule.flatMap(section => section.lectures);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const usedDays = new Set(allLectures.map(lec => lec.day));

    // 1. No overlapping lectures
    for (let i = 0; i < allLectures.length; i++) {
      const lecA = allLectures[i];
      const startA = toMinutes(lecA.startTime);
      const endA = toMinutes(lecA.endTime);
      const dayA = lecA.day;

      for (let j = i + 1; j < allLectures.length; j++) {
        const lecB = allLectures[j];
        if (dayA !== lecB.day) continue;
        const startB = toMinutes(lecB.startTime);
        const endB = toMinutes(lecB.endTime);
        if (Math.max(startA, startB) < Math.min(endA, endB)) {
          return false;
        }
      }
    }

    // 2. Off Days logic
    if (offDays.includes('None')) {
      if (!daysOfWeek.every(day => usedDays.has(day))) return false;
    } else if (!offDays.includes('Any')) {
      for (let day of offDays) {
        if (usedDays.has(day)) return false;
      }
    }

    // 3. Study hours
    const minStart = startHour * 60;
    const maxEnd = endHour * 60;
    for (let lec of allLectures) {
      const start = toMinutes(lec.startTime);
      const end = toMinutes(lec.endTime);
      if (start < minStart || end > maxEnd) return false;
    }

    // 4. Max break duration
    for (let day of daysOfWeek) {
      const lectures = allLectures
        .filter(l => l.day === day)
        .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

      for (let i = 1; i < lectures.length; i++) {
        const prevEnd = toMinutes(lectures[i - 1].endTime);
        const nextStart = toMinutes(lectures[i].startTime);
        if (nextStart - prevEnd > maxBreak * 60) return false;
      }
    }

    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>{t('Schedule')}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFF" style={{marginTop: 30}} />
      ) : (
        <>
          <Text style={styles.subText}>
            {t('Number of schedules created')}: {validSchedules.length}
          </Text>

          {validSchedules.length === 0 && (
            <Text
              style={[styles.subText2, {textAlign: 'center', marginTop: 20}]}>
              No matching schedules found.
            </Text>
          )}

          <FlatList
            data={validSchedules}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={styles.cardWrapper}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('SchedulePreviewScreen', {
                    schedule: item,
                    index: index,
                  })
                }>
                <ScheduleCard schedule={item} index={index} />
              </TouchableOpacity>
            )}
            keyExtractor={(_, idx) => idx.toString()}
            numColumns={2}
            columnWrapperStyle={{justifyContent: 'flex-start', marginLeft: 5}}
            contentContainerStyle={{paddingBottom: 100, paddingTop: 10}}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2128',
    paddingHorizontal: 12,
  },
  cardWrapper: {
    width: '45%',
    marginVertical: 10,
    marginRight: 14,
    marginLeft: 7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 71,
    color: '#FFF',
    marginTop: 15,
  },
  subText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 36,
  },
  subText2: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 200,
  },
});

export default MatchingSchedules;
