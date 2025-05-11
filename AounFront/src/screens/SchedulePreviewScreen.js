import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import BackButton from '../components/BackButton';
import LectureBlock from '../components/resultedSchedule/LectureBlock';
import ScheduleHeader from '../components/resultedSchedule/ScheduleHeader';

const HOURS = Array.from({length: 13}, (_, i) => `${8 + i}:00`);
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const COLUMN_WIDTH = 60;

const SchedulePreviewScreen = ({route, navigation}) => {
  const {t} = useTranslation();
  const {schedule, index} = route.params;

  const handleSaveSchedule = async () => {
    const user = auth().currentUser;
    if (!user) {
      Alert.alert('Error', 'User not logged in.');
      return;
    }

    try {
      // Check if there's already a saved schedule
      const savedSchedule = await AsyncStorage.getItem('savedSchedule');
      if (savedSchedule) {
        Alert.alert(
          t('Warning'),
          t(
            'You already have a saved schedule. Please delete it first before saving a new one.',
          ),
        );
        return;
      }

      // Save the new schedule
      const newSchedule = {
        schedule,
        createdAt: new Date().toISOString(),
        userId: user.uid,
      };

      await AsyncStorage.setItem('savedSchedule', JSON.stringify(newSchedule));
      Alert.alert(t('Success'), t('Schedule saved successfully.'));
    } catch (err) {
      console.error('Error saving schedule:', err);
      Alert.alert(t('Error'), t('Failed to save schedule.'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>
          {t('Schedule')} {index + 1}
        </Text>
        <TouchableOpacity onPress={handleSaveSchedule} style={styles.saveIcon}>
          <Icon name="save" size={20} color="#FFF" solid />
        </TouchableOpacity>
      </View>

      <ScheduleHeader schedule={schedule} />

      <ScrollView contentContainerStyle={styles.gridContainer}>
        <View style={styles.dayRow}>
          {DAYS.map(day => (
            <View style={styles.dayCell} key={day}>
              <Text style={styles.dayText}>{day.slice(0, 3)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bodyGrid}>
          <View style={styles.timeColumn}>
            {HOURS.map(h => (
              <Text key={h} style={styles.timeText}>
                {h}
              </Text>
            ))}
          </View>

          <View style={styles.lectureGrid}>
            {HOURS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.hourLine,
                  i === 0 && {borderTopColor: '#888', borderTopWidth: 0.5},
                ]}
              />
            ))}
            {schedule.flatMap((section, secIdx) =>
              section.lectures.map((lec, lecIdx) => (
                <LectureBlock
                  key={`${secIdx}-${lecIdx}`}
                  lecture={lec}
                  sectionNumber={section.sectionNum}
                  subjectCode={section.subjectCode}
                />
              )),
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2128',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
    marginRight: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15,
    marginRight: 15,
  },
  saveIcon: {
    marginTop: 15,
    padding: 8,
  },
  gridContainer: {
    paddingHorizontal: 10,
  },
  dayRow: {
    flexDirection: 'row',
    marginLeft: 68,
    width: COLUMN_WIDTH * 5,
    marginBottom: 10,
  },
  dayCell: {
    width: COLUMN_WIDTH,
    alignItems: 'center',
  },
  dayText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bodyGrid: {
    flexDirection: 'row',
  },
  timeColumn: {
    width: 60,
    marginRight: 8,
    marginTop: -8,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
    height: 60,
  },
  lectureGrid: {
    width: COLUMN_WIDTH * 5,
    position: 'relative',
    marginLeft: 3,
  },
  hourLine: {
    height: 60,
    borderBottomColor: '#888',
    borderBottomWidth: 0.5,
  },
});

export default SchedulePreviewScreen;
