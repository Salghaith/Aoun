import React, {useContext, useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  LogBox,
  Pressable,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../context/ThemeContext';
import SearchBar from '../components/SearchBar';
import CalendarComponent from '../components/CalendarComponent';
import TaskItem from '../components/TaskItem';
import EditTask from '../components/EditTask';
import {AuthContext} from '../context/AuthContext';
import {TaskContext} from '../context/TaskContext';

import {updateTask, deleteTask} from '../services/taskService';
import {
  cancelNotification,
  scheduleNotification,
} from '../services/notificationService';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

const Tasks = ({navigation}) => {
  const {t} = useTranslation();
  const {isDarkMode} = useContext(ThemeContext);
  const {userData} = useContext(AuthContext);
  const {tasks, setTasks, refreshTasks, loading} = useContext(TaskContext);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [completedTasks, setCompletedTasks] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(false);

  // Filter tasks by selected date
  const filteredTasks = tasks.filter(task => task.date === selectedDate);

  const searchResults = tasks.filter(
    task =>
      searchTerm &&
      ((task.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (task.description?.toLowerCase() || '').includes(
          searchTerm.toLowerCase(),
        ) ||
        (task.date || '').includes(searchTerm)),
  );

  // Handlers
  const toggleTaskCompletion = async task => {
    const updatedTask = {...task, completed: !task.completed};

    setTasks(prevTasks =>
      prevTasks.map(t => (t.id === task.id ? updatedTask : t)),
    );

    await updateTask(task.id, updatedTask);
  };

  const handleTaskEdit = task => {
    setEditTask(task);
  };

  const handleSaveTask = async updatedTask => {
    cancelNotification(updatedTask.id);
    scheduleNotification(updatedTask);
    await updateTask(updatedTask.id, updatedTask);
    setTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === updatedTask.id ? {...t, ...updatedTask} : t,
      ),
    );
    setEditTask(null);
  };

  const handleDeleteTask = async taskId => {
    setDeletingTask(true);
    try {
      cancelNotification(taskId);
      await deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      setEditTask(null);
    } finally {
      setDeletingTask(false);
    }
  };

  const backgroundColor = isDarkMode ? '#1C2128' : '#F5F5F5';
  const textColor = isDarkMode ? '#FFFFFF' : '#1C2128';

  const tasksCountText = t('You have got {{count}} tasks today to complete', {
    count: filteredTasks.length,
  });

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const tasksHeaderLabel = isToday
    ? t("Today's Tasks")
    : `${selectedDate} ${t('Tasks')}`;

  return (
    <SafeAreaView style={[styles.container, {backgroundColor}]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText, {color: textColor}]}>
            {tasksCountText}
          </Text>
          <Feather name="edit-2" size={22} color="#FFA500" />
        </View>

        {/* Search */}
        <SearchBar value={searchTerm} onChangeText={setSearchTerm} />

        {/* If searching, show searchResults */}
        {searchTerm !== '' && (
          <View style={styles.searchResultsContainer}>
            {searchResults.map(item => (
              <Pressable
                key={item.id}
                style={({pressed}) => [
                  styles.searchResultItem,
                  pressed && {transform: [{scale: 0.95}]},
                ]}
                onPress={() => handleTaskEdit(item)}>
                <Text style={styles.searchResultText}>{item.title}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Calendar */}
        <CalendarComponent onDateSelect={date => setSelectedDate(date)} />

        {/* Tasks Header */}
        <View style={styles.tasksHeader}>
          <Text style={[styles.sectionTitle, {color: textColor}]}>
            {tasksHeaderLabel}
          </Text>

          <Pressable
            onPress={() => navigation.navigate('CreateTask')}
            style={({pressed}) => [
              styles.addButton,
              pressed && {transform: [{scale: 0.9}]},
            ]}>
            <Feather name="plus" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Task list */}
        <View style={styles.tasksSection}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <Pressable
                key={task.id}
                onPress={() => handleTaskEdit(task)}
                style={({pressed}) => [
                  pressed && {transform: [{scale: 0.97}]},
                ]}>
                <TaskItem
                  title={task.title}
                  date={task.date}
                  priority={task.priority}
                  startTime={task.startTime}
                  endTime={task.endTime}
                  isCompleted={task.completed}
                  onToggleComplete={() =>
                    toggleTaskCompletion(task, completedTasks[task.id])
                  }
                />
              </Pressable>
            ))
          ) : (
            <Text style={[styles.noTaskText, {color: textColor}]}>
              {t('No tasks for this date.')}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Edit task modal */}
      {editTask && (
        <EditTask
          visible={!!editTask}
          task={editTask}
          onClose={() => setEditTask(null)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          deletingTask={deletingTask}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 70,
  },
  titleContainer: {
    marginTop: 40,
    marginHorizontal: 37,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    maxWidth: '80%',
  },
  searchResultsContainer: {
    marginHorizontal: 37,
  },
  searchResultItem: {
    backgroundColor: '#1C2128',
    padding: 10,
    marginTop: 5,
    borderRadius: 8,
  },
  searchResultText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 37,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#131417',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginRight: 37,
  },
  tasksSection: {
    marginTop: 20,
    marginHorizontal: 37,
  },
  noTaskText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Tasks;
