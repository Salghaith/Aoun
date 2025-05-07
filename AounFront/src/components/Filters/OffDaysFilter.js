import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const shortToFull = {
  Sun: 'Sunday',
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
};

const displayDays = ['None', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Any'];

const OffDaysFilter = ({offDays, setOffDays}) => {
  const toggleDay = day => {
    if (day === 'None') {
      setOffDays(['None']);
    } else if (day === 'Any') {
      setOffDays(['Any']);
    } else {
      const fullDay = shortToFull[day];
      const updated = offDays.includes(fullDay)
        ? offDays.filter(d => d !== fullDay)
        : [...offDays.filter(d => d !== 'None' && d !== 'Any'), fullDay];

      if (updated.length === 0) {
        setOffDays(['None']);
      } else {
        setOffDays(updated);
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Off Days</Text>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="bed" color="black" size={14} />
          <Text style={styles.cardHeaderText}> Choose your off days</Text>
        </View>
        <View style={styles.daysRow}>
          {displayDays.map(day => {
            const isSelected =
              day === 'None' || day === 'Any'
                ? offDays.includes(day)
                : offDays.includes(shortToFull[day]);

            return (
              <Pressable
                key={day}
                style={[styles.dayCircle, isSelected && styles.dayCircleActive]}
                onPress={() => toggleDay(day)}>
                {isSelected ? (
                  <Icon name="check-circle" solid size={22} color="#000" />
                ) : (
                  <Text style={styles.dayText}>{day}</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default OffDaysFilter;

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
  daysRow: {
    flexDirection: 'row',
  },
  dayCircle: {
    width: 35,
    height: 35,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  dayCircleActive: {
    backgroundColor: '#fff',
  },
  dayText: {
    fontSize: 11,
    color: '#000',
  },
});
