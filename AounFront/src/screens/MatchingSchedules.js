import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, SafeAreaView} from 'react-native';
import BackButton from '../components/BackButton';
import ScheduleCard from '../components/ScheduleCard';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MatchingSchedules = ({route, navigation}) => {
  const {filters} = route.params;
  const [validSchedules, setValidSchedules] = useState([]);

  useEffect(() => {
    const generateSchedules = async () => {
      const user = auth().currentUser;
      if (!user) return;

      const snapshot = await firestore()
        .collection('subjects')
        .where('userId', '==', user.uid) // ✅ scoped to this user
        .get();

      const allSubjects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const selectedSubjects = allSubjects.filter(subj => subj.isSelected);

      // ✅ Prevent generating if no subjects are selected
      if (selectedSubjects.length === 0) {
        setValidSchedules([]); // empty result
        return;
      }

      const combinations = getCombinations(
        selectedSubjects.map(s => Object.entries(s.sections || {})),
      );

      const valid = combinations.filter(schedule => isValid(schedule, filters));
      setValidSchedules(valid);
    };

    generateSchedules();
  }, [filters]);

  const getCombinations = sectionLists => {
    if (sectionLists.length === 0) return [[]];
    const [first, ...rest] = sectionLists;
    const restCombinations = getCombinations(rest);
    return first.flatMap(([sectionNum, data]) =>
      restCombinations.map(comb => [...comb, {sectionNum, ...data}]),
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

    // ✅ 1. No overlapping lectures
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
          return false; // overlap
        }
      }
    }

    // ✅ 2. No lectures on off days (unless 'None' or 'Any' is selected)
    if (offDays && !offDays.includes('None') && !offDays.includes('Any')) {
      for (let section of schedule) {
        for (let lec of section.lectures) {
          if (offDays.includes(lec.day)) return false;
        }
      }
    }

    // ✅ 3. All lectures within study hours
    const minStart = startHour * 60;
    const maxEnd = endHour * 60;
    for (let lec of allLectures) {
      const start = toMinutes(lec.startTime);
      const end = toMinutes(lec.endTime);
      if (start < minStart || end > maxEnd) {
        return false;
      }
    }

    // ✅ 4. No break between two lectures exceeds maxBreak (in minutes)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    for (let day of days) {
      const lectures = allLectures
        .filter(l => l.day === day)
        .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

      for (let i = 1; i < lectures.length; i++) {
        const prevEnd = toMinutes(lectures[i - 1].endTime);
        const nextStart = toMinutes(lectures[i].startTime);
        const breakLength = nextStart - prevEnd;
        if (breakLength > maxBreak * 60) {
          return false;
        }
      }
    }

    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Schedule</Text>
      </View>
      <Text style={styles.subText}>
        Number of schedules created: {validSchedules.length}
      </Text>

      {validSchedules.length === 0 && (
        <Text style={[styles.subText, {textAlign: 'center', marginTop: 20}]}>
          No matching schedules found.
        </Text>
      )}

      <FlatList
        data={validSchedules}
        renderItem={({item, index}) => (
          <ScheduleCard schedule={item} index={index}/>
        )}
        keyExtractor={(_, idx) => idx.toString()}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'flex-start', marginLeft: 5}}
        contentContainerStyle={{paddingBottom: 100, paddingTop: 10}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2128',
    paddingHorizontal: 12,
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
});

export default MatchingSchedules;
