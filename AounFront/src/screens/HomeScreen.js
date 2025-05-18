import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  I18nManager,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {AuthContext} from '../context/AuthContext';
import {useSchedule} from '../context/ScheduleContext';
import Icon from 'react-native-vector-icons/AntDesign';
import HomeClassSection from '../components/HomeClassSection';
import {ScrollView} from 'react-native-gesture-handler';
import HomeToDoSection from '../components/HomeToDoSection';

const HomeScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {userData} = useContext(AuthContext);
  const {schedule} = useSchedule();
  const iconColor = 'white';
  const [currentWisdomIndex, setCurrentWisdomIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // After fade out, update text and fade in
        setCurrentWisdomIndex(prev => (prev + 1) % wisdoms.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const wisdoms = [
    t("Don't forget to check your tasks for today. Keep making progress!"),
    t('One step at a time is still progress.'),
    t('Stay consistent, not perfect.'),
    t('Focus on what you can control.'),
    t('Done is better than perfect.'),
    t('Small actions compound into big results.'),
    t('Discipline beats motivation.'),
    t('Start now. Fix later.'),
    t('If it’s important, schedule it.'),
    t('You won’t always be motivated — be consistent.'),
    t('Progress over perfection. Always.'),
    t('You can’t improve what you don’t measure.'),
    t('Success is just structured repetition.'),
    t('Do something today your future self will thank you for.'),
    t("Excuses don't get results."),
    t('You’re not behind. You’re just getting started.'),
  ];
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('Good morning');
    if (hour < 18) return t('Good afternoon');
    return t('Good evening');
  };
  // console.log(schedule);
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: '#1C2128'}]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {getGreeting()}, {userData.username}
          </Text>
        </View>
        <TouchableOpacity
          style={{width: I18nManager.isRTL ? null : '100%'}}
          onPress={() => navigation.navigate('Tasks')}>
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
        </TouchableOpacity>
        <View style={styles.wisdomContainer}>
          <Animated.Text style={[styles.wisdomText, {opacity: fadeAnim}]}>
            {t('Hi')} {userData.username}, {t(wisdoms[currentWisdomIndex])}
          </Animated.Text>
        </View>

        <TouchableOpacity
          style={styles.createTaskContainer}
          onPress={() => navigation.navigate('CreateTask')}>
          <Text style={styles.createTaskText}>{t('Create Task')}</Text>
          <View style={styles.circle}>
            <Icon
              name={I18nManager.isRTL ? 'arrowleft' : 'arrowright'}
              size={22}
              color="white"
            />
          </View>
        </TouchableOpacity>
        <View>
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
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-around',
    marginTop: 32,
    alignSelf: 'center',
    width: '89%',
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
    minWidth: '89%',
    maxWidth: '89%',
    marginTop: 13,
    backgroundColor: '#131417',
    padding: 16,
    borderRadius: 12,
    alignSelf: 'center',
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
    marginBottom: 20,
  },
  createTaskText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: I18nManager.isRTL ? 0 : 95,
    marginLeft: I18nManager.isRTL ? 95 : 0,
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
    alignSelf: 'center',
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
