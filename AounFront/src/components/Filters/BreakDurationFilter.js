import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useTranslation} from 'react-i18next';

const BreakDurationFilter = ({maxBreak, setMaxBreak}) => {
  const {t} = useTranslation();
  const formatLabel = value => `${value} ${t('Hour')}${value === 1 ? '' : t('s')}`;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>{t('Maximum Break Duration')}</Text>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="clock" solid size={14} color="black" />
          <Text style={styles.cardHeaderText}>{t('Longest break duration')}</Text>
        </View>

        <View style={styles.sliderRow}>
          <Text style={styles.label}>{formatLabel(maxBreak)}</Text>
          <View style={{marginRight: 50}}>
            <MultiSlider
              values={[maxBreak]}
              min={1}
              max={8}
              step={1}
              sliderLength={200}
              onValuesChange={values => setMaxBreak(values[0])}
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
          </View>
        </View>
      </View>
    </View>
  );
};

export default BreakDurationFilter;

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
  label: {
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
  },
});
