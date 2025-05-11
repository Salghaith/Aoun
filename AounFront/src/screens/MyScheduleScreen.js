import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Dialog from 'react-native-dialog';
import BackButton from '../components/BackButton';
import LectureBlock from '../components/resultedSchedule/LectureBlock';
import ScheduleHeader from '../components/resultedSchedule/ScheduleHeader';
import {AuthContext} from '../context/AuthContext';
import {useSchedule} from '../context/ScheduleContext';
import {importSchedule} from '../services/calendarService';

const HOURS = Array.from({length: 13}, (_, i) => `${8 + i}:00`);
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const COLUMN_WIDTH = 60;

const MyScheduleScreen = ({navigation}) => {
  const {userData} = useContext(AuthContext);
  const {schedule, saveSchedule, deleteSchedule} = useSchedule();
  const [visible, setVisible] = useState(false);
  const [LMSPass, setLMSPass] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteSchedule = () => {
    Alert.alert(
      'Delete Schedule',
      'Are you sure you want to delete your saved schedule?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSchedule();
              Alert.alert('Success', 'Schedule deleted successfully.');
            } catch (error) {
              console.error('Error deleting schedule:', error);
              Alert.alert('Error', 'Failed to delete schedule.');
            }
          },
        },
      ],
    );
  };

  const handleImportSchedule = async () => {
    if (!userData.isKSU) {
      Alert.alert(
        'Warning',
        'You are not allowed to import a schedule from LMS. Please generate your own schedule or register as a KSU student.',
      );
      return;
    }
    if (schedule) {
      Alert.alert(
        'Warning',
        'You already have a saved schedule. Please delete it first before importing a new one.',
      );
      return;
    }

    setVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>My Schedule</Text>
        <TouchableOpacity
          style={styles.saveIcon}
          onPress={handleImportSchedule}
          disabled={!!schedule}>
          <Icon
            name="calendar-plus"
            size={20}
            color={schedule ? '#666' : '#FFF'}
            solid
          />
        </TouchableOpacity>
        {schedule && (
          <TouchableOpacity
            style={styles.saveIcon}
            onPress={handleDeleteSchedule}>
            <Icon name="calendar-times" size={20} color="#FFF" solid />
          </TouchableOpacity>
        )}
      </View>

      {schedule ? (
        <>
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
          </ScrollView>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No schedule saved yet. Generate a schedule or import one from LMS.
          </Text>
        </View>
      )}

      <Dialog.Container visible={visible}>
        <Dialog.Title>Enter Your LMS Password</Dialog.Title>
        <Dialog.Input
          onChangeText={setLMSPass}
          value={LMSPass}
          secureTextEntry
          editable={!loading}
        />
        {loading && (
          <View style={{alignItems: 'center', marginVertical: 10}}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        )}
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            if (!loading) setVisible(false);
          }}
          disabled={loading}
        />
        <Dialog.Button
          label="Import"
          onPress={async () => {
            setLoading(true);
            try {
              const importedSchedule = await importSchedule(
                userData.userId,
                userData.email.split('@')[0],
                LMSPass,
              );
              await saveSchedule(importedSchedule);
              Alert.alert('✅ Success', 'Schedule Imported.');
            } catch (error) {
              const message =
                error.response?.data?.error ||
                error.message ||
                'An unexpected error occurred. Please try again.';
              Alert.alert('❌ Error', message);
            } finally {
              setLoading(false);
              setVisible(false);
            }
          }}
          disabled={loading}
        />
      </Dialog.Container>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default MyScheduleScreen;
