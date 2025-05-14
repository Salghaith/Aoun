import React, {useContext} from 'react';
import {View, Text, StyleSheet, I18nManager} from 'react-native';
import {useTranslation} from 'react-i18next';
import {TaskContext} from '../context/TaskContext';
import HomeToDoCard from './HomeToDoCard';

const HomeToDoSection = ({style}) => {
  const {t} = useTranslation();
  const {tasks} = useContext(TaskContext);

  const filteredTasks = tasks.filter(task => {
    if (task.completed) return false;
    return true;
  });

  return (
    <View
      style={[
        styles.cardContainer,
        filteredTasks.length <= 1
          ? styles.justifyContentStartProp
          : styles.justifyContentSpaceProp,
      ]}>
      {filteredTasks.length > 0 ? (
        filteredTasks.map(task => <HomeToDoCard key={task.id} task={task} />)
      ) : (
        <Text style={styles.noTaskText}>{t('No upcoming tasks!')}</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // gap: '8%',
    // width: '100%',
    marginTop: 15,
  },
  noTaskText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    marginLeft: I18nManager.isRTL ? 0 : '27%',
    marginRight: I18nManager.isRTL ? '30%' : 0,
  },
  justifyContentStartProp: {
    justifyContent: 'flex-start',
  },
  justifyContentSpaceProp: {
    justifyContent: 'space-evenly',
  },
});
export default HomeToDoSection;
