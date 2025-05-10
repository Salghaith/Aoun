import React, {useState, useContext, useEffect} from 'react';
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
import Dialog from 'react-native-dialog';
import BackButton from '../components/BackButton';
import LectureBlock from '../components/resultedSchedule/LectureBlock';
import ScheduleHeader from '../components/resultedSchedule/ScheduleHeader';
import {AuthContext} from '../context/AuthContext';
import {importSchedule} from '../services/calendarService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HOURS = Array.from({length: 13}, (_, i) => `${8 + i}:00`);
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const COLUMN_WIDTH = 60;

const MyScheduleScreen = ({navigation}) => {
  const [schedule, setSchedule] = useState([]);
    const { userData } = useContext(AuthContext);
    
  const [visible, setVisible] = useState(false);
  const [LMSPass, setLMSPass] = useState('');

  const loadSavedSchedule = async () => {
    try {
      const savedSchedule = await AsyncStorage.getItem('schedule');
      if (savedSchedule) {
        setSchedule(JSON.parse(savedSchedule));
        console.log('✅ Schedule loaded from local storage');
      } else {
        console.log('⚠️ No saved schedule found in local storage');
      }
    } catch (error) {
      console.error('❌ Failed to load schedule from local storage:', error);
    }
  };

  useEffect(() => {
    loadSavedSchedule();
  }, [visible]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>My Schedule</Text>
        <TouchableOpacity
          style={styles.saveIcon}
          onPress={() => setVisible(true)}>
          <Icon name="calendar-plus" size={20} color="#FFF" solid />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveIcon}>
          <Icon name="calendar-times" size={20} color="#FFF" solid />
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
              section.lectures
                .filter(lec => lec.day && lec.startTime && lec.endTime)
                .map((lec, lecIdx) => (
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
        <Dialog.Container visible={visible}>
          <Dialog.Title>Enter Your LMS Password</Dialog.Title>
          <Dialog.Input
            onChangeText={setLMSPass}
            value={LMSPass}
            secureTextEntry
          />
          <Dialog.Button label="Cancel" onPress={() => setVisible(false)} />
          <Dialog.Button
            label="Import"
            onPress={async () => {
              try {
                await importSchedule(
                  userData.userId,
                  userData.email.split('@')[0],
                  LMSPass,
                );
                Alert.alert('✅ Success', 'Schedule Imported.');
              } catch (error) {
                console.error('❌ Sync error:', error);
                Alert.alert('❌ Error', 'Failed to import schedule.');
              } finally {
                setVisible(false);
              }
            }}
          />
        </Dialog.Container>
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

export default MyScheduleScreen;
