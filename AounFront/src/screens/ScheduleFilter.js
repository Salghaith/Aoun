import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import BackButton from '../components/BackButton';
import OffDaysFilter from '../components/Filters/OffDaysFilter';
import StudyHoursFilter from '../components/Filters/StudyHoursFilter';
import BreakDurationFilter from '../components/Filters/BreakDurationFilter';
import {useTranslation} from 'react-i18next';

const ScheduleFilter = ({navigation}) => {
  const {t} = useTranslation();
  const [offDays, setOffDays] = useState(['Any']);
  const [startHour, setStartHour] = useState(8);
  const [endHour, setEndHour] = useState(20);
  const [maxBreak, setMaxBreak] = useState(8);
  const [loading, setLoading] = useState(false);

  const handleGenerateSchedule = () => {
    setLoading(true);
    setTimeout(() => {
      const filters = {offDays, startHour, endHour, maxBreak};
      setLoading(false);
      navigation.navigate('MatchingSchedules', {filters});
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>{t('Filters')}</Text>
      </View>

      <View style={styles.filters}>
        <OffDaysFilter offDays={offDays} setOffDays={setOffDays} />
        <StudyHoursFilter
          startHour={startHour}
          endHour={endHour}
          setStartHour={setStartHour}
          setEndHour={setEndHour}
        />
        <BreakDurationFilter maxBreak={maxBreak} setMaxBreak={setMaxBreak} />
      </View>

      <TouchableOpacity
        style={styles.generateButton}
        onPress={handleGenerateSchedule}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <Text style={styles.generateButtonText}>{t('Generate Schedule')}</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ScheduleFilter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2128',
    paddingHorizontal: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 87,
    marginRight: 'auto',
    marginTop: 15,
    color: '#FFF',
  },
  filters: {
    marginHorizontal: 16,
  },
  generateButton: {
    backgroundColor: '#131417',
    paddingVertical: 19,
    borderRadius: 11,
    alignItems: 'center',
    marginBottom: 55,
    marginTop: 10,
    width: '70%',
    alignSelf: 'center',
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
