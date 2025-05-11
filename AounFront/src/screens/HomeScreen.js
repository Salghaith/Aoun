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
import {AuthContext} from '../context/AuthContext';
import {ThemeContext} from '../context/ThemeContext';
import {useSchedule} from '../context/ScheduleContext';
import Icon from 'react-native-vector-icons/AntDesign';
import HomeClassSection from '../components/HomeClassSection';
import {ScrollView} from 'react-native-gesture-handler';
import HomeToDoSection from '../components/HomeToDoSection';

const HomeScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {userData} = useContext(AuthContext);
  const {isDarkMode, toggleTheme} = useContext(ThemeContext);
  const {schedule} = useSchedule();
  const iconColor = isDarkMode ? 'white' : 'black';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('Good morning');
    if (hour < 18) return t('Good afternoon');
    return t('Good evening');
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#1C2128' : '#F5F5F5'},
      ]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {getGreeting()}, {userData.username}
          </Text>
        </View>
        <View style={styles.weekContainer}>
          {Array.from({length: 7}, (_, i) => {
            const day = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
            day.setDate(day.getDate() + i);

            return (
              <View
                style={[styles.dayBox, i == 3 && styles.selectedDay]}
                key={i}>
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
            {t('Hi')} {userData.username},{' '}
            {t(
              "don't forget to check your tasks for today. Keep making progress!",
            )}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.createTaskContainer}
          onPress={() => navigation.navigate('CreateTask')}>
          <Text style={styles.createTaskText}>{t('Create Task')}</Text>
          <View style={styles.circle}>
            <Icon name="arrowright" size={22} color="white" />
          </View>
        </TouchableOpacity>
        <View style={styles.classesContainer}>
          <Text style={styles.classesHeader}>{t('Up Coming Classes')}</Text>
        </View>
        <View style={styles.classesContainer}>
          {schedule && schedule.length > 0 ? (
            <HomeClassSection schedule={schedule} />
          ) : (
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                marginTop: 20,
                marginBottom: 20,
                marginLeft: '24%',
                textAlign: 'center',
              }}>
              {t('No schedule found.')}
            </Text>
          )}
        </View>
        <View>
          <Text style={styles.classesHeader}>{t('To Do')}</Text>
          <HomeToDoSection />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    direction: I18nManager.isRTL ? 'rtl' : 'ltr',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 70,
    width: '100%',
  },
  headerContainer: {
    width: 256,
    height: 80,
    marginTop: 15,
    marginHorizontal: '5%',
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
    // paddingHorizontal: 20,
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
    width: '89%',
    backgroundColor: '#131417',
    borderRadius: 20,
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    alignSelf: 'center',
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
    marginHorizontal: '3%',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  classesSection: {
    marginTop: 25,
    // alignSelf: 'center',
    width: '100%',
  },
});

export default HomeScreen;
