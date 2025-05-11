import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {AuthContext} from '../context/AuthContext';
import {ThemeContext} from '../context/ThemeContext';
import {TaskContext} from '../context/TaskContext';
import HomeToDoCard from './HomeToDoCard';

const HomeToDoSection = ({style}) => {
  const {tasks} = useContext(TaskContext);

  const filteredTasks = tasks.filter(task => {
    if (task.completed) return false;
    return true;
  });

  return (
    <View style={[styles.cardContainer]}>
      {filteredTasks.length > 0 ? (
        filteredTasks.map(task => <HomeToDoCard key={task.id} task={task} />)
      ) : (
        <Text style={styles.noTaskText}>No upcoming tasks!</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 30,
    width: '100%',
    marginTop: 15,
  },
  noTaskText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    marginLeft: '27%',
  },
});
export default HomeToDoSection;
