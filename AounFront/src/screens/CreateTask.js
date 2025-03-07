import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Alert,
  Pressable,
  SafeAreaView,
  Platform,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Feather';

import BackButton from '../components/BackButton';
import TaskField from '../components/TaskField';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ThemeContext} from '../context/ThemeContext';
import {saveTask} from '../services/taskService';
import {AuthContext} from '../context/AuthContext';
import {scheduleNotification} from '../services/notificationService';

const CreateTask = ({navigation}) => {
  const {userData} = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStartDate, setWeekStartDate] = useState(new Date());
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [timeType, setTimeType] = useState('start');
  const [priority, setPriority] = useState('Medium'); //Default is Medium

  const {t} = useTranslation();
  const {isDarkMode} = useContext(ThemeContext);

  const isBefore = (d1, d2) => d1.getTime() < d2.getTime();

  const handleWeekChange = days => {
    const newStartDate = new Date(weekStartDate);
    newStartDate.setDate(newStartDate.getDate() + days);
    setWeekStartDate(newStartDate);
  };

  const handleDaySelect = day => {
    setSelectedDate(new Date(day));
  };

  const handleTimeChange = (event, chosenTime) => {
    setShowPicker(false);
    if (!chosenTime) return;

    if (timeType === 'start') {
      setStartTime(chosenTime);

      if (isBefore(endTime, chosenTime)) {
        setEndTime(chosenTime);
      }
    } else {
      if (isBefore(chosenTime, startTime)) {
        Alert.alert(
          t('Invalid Time'),
          t('End time cannot be before start time. It has been adjusted.'),
          [{text: 'OK'}],
        );
        setEndTime(startTime);
      } else {
        setEndTime(chosenTime);
      }
    }
  };

  const handleCreateTask = async () => {
    // Format date as YYYY-MM-DD
    const formattedDate = selectedDate.toISOString().split('T')[0];

    // Format times as "HH:MM"
    const formattedStartTime = startTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const formattedEndTime = endTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const newTask = {
      id: Date.now().toString(),
      title: taskName,
      description: taskDescription,
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      priority: priority.toLowerCase(),
      completed: false,
    };
    await saveTask(newTask, userData.userId);
    scheduleNotification(newTask);
    navigation.navigate('Tasks', {newTask});
  };

  const bgColor = isDarkMode ? '#1C2128' : '#F5F5F5';
  const textColor = isDarkMode ? '#F9FAFB' : '#1C2128';
  const iconColor = isDarkMode ? 'white' : 'black';

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: bgColor}]}>
      <View style={styles.headerContainer}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.headerTitle, {color: textColor}]}>
          {t('Create New Task')}
        </Text>
      </View>

      <View style={styles.calendarContainer}>
        <Pressable
          onPress={() => handleWeekChange(-7)}
          style={({pressed}) => [pressed && {transform: [{scale: 0.95}]}]}>
          <Icon name="chevron-left" size={24} color={iconColor} />
        </Pressable>
        <Text
          style={[
            styles.calendarTitle,
            {fontSize: 18, fontWeight: '500', color: iconColor},
          ]}>
          {selectedDate.toDateString()}
        </Text>
        <Pressable
          onPress={() => handleWeekChange(7)}
          style={({pressed}) => [pressed && {transform: [{scale: 0.95}]}]}>
          <Icon name="chevron-right" size={24} color={iconColor} />
        </Pressable>
      </View>

      <View style={styles.weekContainer}>
        {Array.from({length: 7}, (_, i) => {
          const day = new Date(weekStartDate);
          day.setDate(day.getDate() + i);

          const isSelected = selectedDate.toDateString() === day.toDateString();

          return (
            <Pressable
              key={i}
              onPress={() => handleDaySelect(day)}
              style={({pressed}) => [
                styles.dayBox,
                isSelected && styles.selectedDay,
                pressed && {transform: [{scale: 0.95}]},
              ]}>
              <Text style={[styles.dayText, {color: iconColor}]}>
                {day.toDateString().split(' ')[0]}
              </Text>
              <Text style={[styles.dateText, {color: iconColor}]}>
                {day.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.taskFieldsContainer}>
        <Text style={[styles.sectionTitle, {color: textColor}]}>
          {t('Task')}
        </Text>
        <TaskField
          placeholder={t('Name')}
          value={taskName}
          onChangeText={setTaskName}
        />
        <TaskField
          placeholder={t('Description')}
          value={taskDescription}
          onChangeText={setTaskDescription}
          multiline
        />
      </View>

      <View style={styles.timeContainer}>
        <View>
          <Text style={[styles.timeLabel, {color: textColor}]}>
            {t('Start Time')}
          </Text>
          <Pressable
            onPress={() => {
              setTimeType('start');
              setShowPicker(true);
            }}
            style={({pressed}) => [
              styles.timeBox,
              pressed && {transform: [{scale: 0.95}]},
            ]}>
            <Icon
              name="clock"
              size={26}
              color="#FFF"
              style={styles.clockIcon}
            />
            <Text style={styles.timeText}>
              {startTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </Text>
          </Pressable>
        </View>

        <View>
          <Text style={[styles.timeLabel, {color: textColor}]}>
            {t('End Time')}
          </Text>
          <Pressable
            onPress={() => {
              setTimeType('end');
              setShowPicker(true);
            }}
            style={({pressed}) => [
              styles.timeBox,
              pressed && {transform: [{scale: 0.95}]},
            ]}>
            <Icon
              name="clock"
              size={26}
              color="#FFF"
              style={styles.clockIcon}
            />
            <Text style={styles.timeText}>
              {endTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.priorityContainer}>
        <Text style={[styles.priorityLabel, {color: textColor}]}>
          {t('Priority')}
        </Text>
        <View style={styles.priorityButtonsRow}>
          <Pressable
            onPress={() => setPriority('High')}
            style={({pressed}) => [
              styles.priorityButton,
              {borderColor: '#E53835'},
              priority === 'High' && styles.prioritySelectedRed,
              pressed && {transform: [{scale: 0.95}]},
            ]}>
            <Text style={styles.priorityButtonText}>{t('High')}</Text>
          </Pressable>

          <Pressable
            onPress={() => setPriority('Medium')}
            style={({pressed}) => [
              styles.priorityButton,
              {borderColor: '#007AFF'},
              priority === 'Medium' && styles.prioritySelectedBlue,
              pressed && {transform: [{scale: 0.95}]},
            ]}>
            <Text style={styles.priorityButtonText}>{t('Medium')}</Text>
          </Pressable>

          <Pressable
            onPress={() => setPriority('Low')}
            style={({pressed}) => [
              styles.priorityButton,
              {borderColor: '#0AB161'},
              priority === 'Low' && styles.prioritySelectedGreen,
              pressed && {transform: [{scale: 0.95}]},
            ]}>
            <Text style={styles.priorityButtonText}>{t('Low')}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.createButtonContainer}>
        <Pressable
          onPress={handleCreateTask}
          style={({pressed}) => [
            styles.createButton,
            pressed && {transform: [{scale: 0.95}]},
          ]}>
          <Text style={styles.createButtonText}>{t('Create Task')}</Text>
        </Pressable>
      </View>

      {showPicker && (
        <Modal transparent animationType="slide" visible={showPicker}>
          <View style={styles.modalContainer}>
            <DateTimePicker
              value={timeType === 'start' ? startTime : endTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
              is24Hour={true}
              onChange={handleTimeChange}
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 38,
    marginRight: 'auto',
    marginTop: 15,
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
    marginTop: 60,
  },
  calendarTitle: {},
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  dayBox: {
    alignItems: 'center',
    padding: 8,
  },
  selectedDay: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 8,
  },
  dayText: {fontSize: 16},
  dateText: {fontSize: 16},
  taskFieldsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '450',
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 25,
  },
  timeLabel: {
    fontSize: 22,
    fontWeight: '450',
    marginBottom: 8,
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131417',
    padding: 6,
    borderRadius: 8,
    width: 150,
    justifyContent: 'center',
  },
  clockIcon: {marginRight: 5},
  timeText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '450',
    marginLeft: 8,
  },
  priorityContainer: {
    paddingHorizontal: 25,
    marginTop: 20,
  },
  priorityLabel: {
    fontSize: 24,
    fontWeight: '450',
  },
  priorityButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  priorityButton: {
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 4,
  },
  priorityButtonText: {
    color: '#FFFFFF',
    fontWeight: '450',
    fontSize: 16,
  },
  prioritySelectedRed: {backgroundColor: '#E53835'},
  prioritySelectedBlue: {backgroundColor: '#007AFF'},
  prioritySelectedGreen: {backgroundColor: '#0AB161'},
  createButtonContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#131417',
    borderRadius: 8,
    paddingHorizontal: 130,
    paddingVertical: 12,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000aa',
    padding: 10,
    alignItems: 'center',
  },
});

export default CreateTask;
