import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  I18nManager,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useLogout} from '../hooks/useLogout';
import {AuthContext} from '../context/AuthContext';
import {ThemeContext} from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/AntDesign';
import HomeClassCard from '../components/HomeClassCard';

const HomeScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {userData} = useContext(AuthContext);
  const {isDarkMode, toggleTheme} = useContext(ThemeContext);
  const iconColor = isDarkMode ? 'white' : 'black';
  const schedule = [
    //DUMMY DATA
    {
      code: 'SWE444',
      subject: 'Software development lab',
      section: '1212',
      lectures: [
        {day: '2', start: '08:00', end: '09:50'},
        {day: '4', start: '08:00', end: '09:50'},
      ],
    },
    {
      code: 'SWE485',
      subject: 'AI',
      section: '1111',
      lectures: [
        {day: '1', start: '08:00', end: '09:50'},
        {day: '3', start: '08:00', end: '09:50'},
        {day: '5', start: '08:00', end: '08:50'},
      ],
    },
    {
      code: 'SWE486',
      subject: 'Cloud',
      section: '3333',
      lectures: [
        {day: '1', start: '10:00', end: '11:50'},
        {day: '3', start: '10:00', end: '11:50'},
        {day: '5', start: '10:00', end: '11:50'},
      ],
    },
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#1C2128' : '#F5F5F5'},
      ]}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Good morning, {userData.username}</Text>
      </View>
      <View style={styles.weekContainer}>
        {Array.from({length: 7}, (_, i) => {
          //   const day = new Date(Date.now()); **orginal**
          const day = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
          day.setDate(day.getDate() + i);

          return (
            <View style={[styles.dayBox, i == 3 && styles.selectedDay]} key={i}>
              <Text style={[styles.dayText, {color: iconColor}]}>
                {day.toDateString().split(' ')[0]}
              </Text>
              <Text style={[styles.dayText, {color: iconColor}]}>
                {day.getDate()}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={styles.wisdomContainer}>
        <Text style={styles.wisdomText}>
          Hi {userData.username}, don’t forget to check your tasks for today.
          Keep making progress!
        </Text>
      </View>
      <TouchableOpacity
        style={styles.createTaskContainer}
        onPress={() => navigation.navigate('CreateTask')}>
        <Text style={styles.createTaskText}>Create Task</Text>
        <View style={styles.circle}>
          <Icon name="arrowright" size={22} color="white" />
        </View>
      </TouchableOpacity>
      <View style={styles.classesContainer}>
        <Text style={styles.classesHeader}>
          Up Coming Classes {schedule[0].code}
        </Text>
      </View>
      <HomeClassCard style={styles.classesSection} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
    alignItems: 'center',
  },
  headerContainer: {
    width: 256,
    height: 80,
    marginTop: 15,
    marginHorizontal: '10%',
    alignSelf: 'flex-start',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
    alignSelf: 'stretch',
    paddingHorizontal: 20,
  },
  dayBox: {
    alignItems: 'center',
    padding: 8,
  },
  dayText: {fontSize: 16},
  selectedDay: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 8,
  },
  wisdomContainer: {
    width: '89%',
    marginTop: 13,
    backgroundColor: '#131417',
    padding: 16,
    borderRadius: 12,
  },
  wisdomText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  createTaskContainer: {
    height: 63,
    backgroundColor: '#131417',
    borderRadius: 20,
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  createTaskText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 95,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: '#1C2128',
  },
  classesContainer: {
    marginTop: 25,
    width: '100%',
    alignItems: 'center',
  },
  classesHeader: {
    alignSelf: 'flex-start',
    marginHorizontal: 28,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  classesSection: {
    marginTop: 15,
  },
});

export default HomeScreen;
