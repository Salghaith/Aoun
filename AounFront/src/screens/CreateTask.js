import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import BackButton from '../components/BackButton';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../context/ThemeContext';
import TaskField from '../components/TaskField';
import Clock from '../components/Clock';

const CreateTask = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStartDate, setWeekStartDate] = useState(new Date());
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [clockVisible, setClockVisible] = useState(false);
  const [timeType, setTimeType] = useState('start');
  const { t } = useTranslation();
  const { isDarkMode } = useContext(ThemeContext);

  const handleWeekChange = (days) => {
    let newStartDate = new Date(weekStartDate);
    newStartDate.setDate(newStartDate.getDate() + days);
    setWeekStartDate(newStartDate);
  };

  const handleDaySelect = (day) => {
    setSelectedDate(new Date(day));
  };

  const handleTimeSelect = (newTime) => {
    if (timeType === 'start') setStartTime(new Date(newTime));
    else setEndTime(new Date(newTime));
    setClockVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1C2128' : '#F5F5F5' }]}> 
      <View style={styles.headerContainer}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.headerTitle, { color: isDarkMode ? '#F9FAFB' : '#1C2128' }]}> 
          {t('Create New Task')}
        </Text>
      </View>
      <View style={styles.calendarContainer}>
        <TouchableOpacity onPress={() => handleWeekChange(-7)}>
          <Icon name="chevron-left" size={24} color={isDarkMode ? 'white' : 'black'} />
        </TouchableOpacity>
        <Text style={[styles.calendarTitle, { color: isDarkMode ? 'white' : 'black' }]}> 
          {selectedDate.toDateString()} 
        </Text>
        <TouchableOpacity onPress={() => handleWeekChange(7)}>
          <Icon name="chevron-right" size={24} color={isDarkMode ? 'white' : 'black'} />
        </TouchableOpacity>
      </View>
      <View style={styles.weekContainer}>
        {Array.from({ length: 7 }, (_, i) => {
          let day = new Date(weekStartDate);
          day.setDate(day.getDate() + i);
          return (
            <TouchableOpacity key={i} onPress={() => handleDaySelect(day)}>
              <View style={[styles.dayBox, selectedDate.toDateString() === day.toDateString() && styles.selectedDay]}>
                <Text style={[styles.dayText, { color: isDarkMode ? 'white' : 'black' }]}>
                  {day.toDateString().split(' ')[0]}
                </Text>
                <Text style={[styles.dateText, { color: isDarkMode ? 'white' : 'black' }]}>
                  {day.getDate()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.taskFieldsContainer}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? 'white' : 'black' }]}>{t('Task')}</Text>
        <TaskField placeholder={t('Name')} value={taskName} onChangeText={setTaskName} />
        <TaskField placeholder={t('Description')} value={taskDescription} onChangeText={setTaskDescription} multiline />
      </View>
      <View style={styles.timeContainer}>
        <TouchableOpacity style={styles.timeBox} onPress={() => { setTimeType('start'); setClockVisible(true); }}>
          <Text style={[styles.timeLabel, { color: isDarkMode ? 'white' : 'black' }]}>{t('Start Time')}</Text>
          <Text style={styles.timeValue}>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.timeBox} onPress={() => { setTimeType('end'); setClockVisible(true); }}>
          <Text style={[styles.timeLabel, { color: isDarkMode ? 'white' : 'black' }]}>{t('End Time')}</Text>
          <Text style={styles.timeValue}>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
        </TouchableOpacity>
      </View>
      <Clock visible={clockVisible} onClose={() => setClockVisible(false)} onConfirm={handleTimeSelect} initialTime={timeType === 'start' ? startTime : endTime} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    borderColor: 'white',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
  },
  dateText: {
    fontSize: 16,
  },
  taskFieldsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  timeBox: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});

export default CreateTask;
