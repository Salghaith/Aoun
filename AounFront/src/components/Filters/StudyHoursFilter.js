import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useTranslation} from 'react-i18next';

const StudyHoursFilter = ({startHour, endHour, setStartHour, setEndHour}) => {
  const {t} = useTranslation();
  const handleValuesChange = values => {
    setStartHour(values[0]);
    setEndHour(values[1]);
  };

  const formatHour = h => {
    if (h < 12) return `${h} AM`;
    if (h === 12) return `12 PM`;
    return `${h - 12} PM`;
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>{t('Study hours')}</Text>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="calendar-check" size={14} solid color="black" />
          <Text style={styles.cardHeaderText}>{t('Set the day\'s time range')}</Text>
        </View>

        <View style={styles.sliderRow}>
          <Text style={styles.StartTime}>{formatHour(startHour)}</Text>
          <MultiSlider
            values={[startHour, endHour]}
            sliderLength={200}
            onValuesChange={handleValuesChange}
            min={8}
            max={20}
            step={1}
            selectedStyle={{backgroundColor: '#000'}}
            unselectedStyle={{backgroundColor: 'rgb(200, 200, 200)'}}
            trackStyle={{height: 2}}
            markerStyle={{
              height: 20,
              width: 20,
              borderRadius: 10,
              backgroundColor: '#000',
            }}
          />
          <Text style={styles.EndTime}>{formatHour(endHour)}</Text>
        </View>
      </View>
    </View>
  );
};

export default StudyHoursFilter;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 25,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  StartTime: {
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
    width: 50,
  },
  EndTime: {
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
    width: 50,
  },
});
