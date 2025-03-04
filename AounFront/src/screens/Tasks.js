import React, { useContext, useState, useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';

import { ThemeContext } from '../context/ThemeContext';
import BottomNav from '../components/BottomNav';
import SearchBar from '../components/SearchBar';
import CalendarComponent from '../components/CalendarComponent';
import TaskItem from '../components/TaskItem';
import EditTask from '../components/EditTask';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

const Tasks = ({ navigation, route }) => {
  // 1) i18n + theme
  const { t } = useTranslation();
  const { isDarkMode } = useContext(ThemeContext);

  // 2) State
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [completedTasks, setCompletedTasks] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [editTask, setEditTask] = useState(null);

  // 3) Sample tasks
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'AI Research Paper Submission',
      description: '',
      date: '2025-03-03',
      priority: 'high',
      startTime: '10:00',
      endTime: '11:00',
    },
    {
      id: 2,
      title: 'React Native Debugging',
      description: '',
      date: '2025-03-03',
      priority: 'medium',
      startTime: '14:00',
      endTime: '15:30',
    },
    {
      id: 3,
      title: 'Consulting Interview Prep',
      description: '',
      date: '2025-03-04',
      priority: 'low',
      startTime: '09:00',
      endTime: '10:00',
    },
    {
      id: 4,
      title: 'Sprint Review Meeting',
      description: '',
      date: '2025-03-04',
      priority: 'high',
      startTime: '11:00',
      endTime: '12:00',
    },
    {
      id: 5,
      title: 'Database Optimization',
      description: '',
      date: '2025-03-04',
      priority: 'medium',
      startTime: '13:45',
      endTime: '15:00',
    },
    {
      id: 6,
      title: 'Project Kickoff Meeting',
      description: 'Discuss project scope and milestones',
      date: '2025-03-05',
      priority: 'high',
      startTime: '10:00',
      endTime: '11:00',
    },
    {
      id: 7,
      title: 'UX Design Review',
      description: 'Review wireframes with the design team',
      date: '2025-03-05',
      priority: 'medium',
      startTime: '14:00',
      endTime: '15:30',
    },
    {
      id: 8,
      title: 'Doctor’s Appointment',
      description: 'Routine check-up',
      date: '2025-03-07',
      priority: 'low',
      startTime: '09:00',
      endTime: '09:30',
    },
    {
      id: 9,
      title: 'Team Stand-Up',
      description: 'Daily progress update',
      date: '2025-03-08',
      priority: 'medium',
      startTime: '09:30',
      endTime: '09:45',
    },
    {
      id: 10,
      title: 'Grocery Shopping',
      description: 'Buy fruits, veggies, and snacks for the week',
      date: '2025-03-10',
      priority: 'low',
      startTime: '18:00',
      endTime: '18:45',
    },
    {
      id: 11,
      title: 'Sprint Planning',
      description: 'Plan tasks for the upcoming sprint',
      date: '2025-03-10',
      priority: 'high',
      startTime: '11:00',
      endTime: '12:30',
    },
    {
      id: 12,
      title: 'Gym Session',
      description: 'Leg day workout',
      date: '2025-03-02',
      priority: 'medium',
      startTime: '17:30',
      endTime: '18:30',
    },
    {
      id: 13,
      title: 'Family Video Call',
      description: 'Catch up with family',
      date: '2025-03-11',
      priority: 'low',
      startTime: '16:00',
      endTime: '16:30',
    },
  ]);

  // 4) On mount: check for newTask from CreateTask
  useEffect(() => {
    if (route.params?.newTask) {
      const incomingTask = route.params.newTask;
      const newId = Date.now();
      setTasks((prevTasks) => [...prevTasks, { id: newId, ...incomingTask }]);
      navigation.setParams({ newTask: undefined });
    }
  }, [route.params?.newTask, navigation, route.params]);

  // 5) Filter tasks by selected date
  const filteredTasks = tasks.filter((task) => task.date === selectedDate);

  // 6) Searching
  const searchResults = tasks.filter(
    (task) =>
      searchTerm &&
      (
        (task.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (task.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (task.date || '').includes(searchTerm)
      )
  );

  // 7) Handlers
  const toggleTaskCompletion = (taskId) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleTaskEdit = (task) => {
    setEditTask(task);
  };

  const handleSaveTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t))
    );
    setEditTask(null);
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
    setEditTask(null);
  };

  const backgroundColor = isDarkMode ? '#1C2128' : '#F5F5F5';
  const textColor       = isDarkMode ? '#FFFFFF' : '#1C2128';

  const tasksCountText = t('You have got {{count}} tasks today to complete', {
    count: filteredTasks.length,
  });

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const tasksHeaderLabel = isToday
    ? t("Today's Tasks")
    : `${selectedDate} ${t('Tasks')}`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        {/* Title line */}
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText, { color: textColor }]}>
            {tasksCountText}
          </Text>
          {/* Example icon; no onPress */}
          <Feather name="edit-2" size={22} color="#FFA500" />
        </View>

        {/* Search */}
        <SearchBar value={searchTerm} onChangeText={setSearchTerm} />

        {/* If searching, show searchResults */}
        {searchTerm !== '' && (
          <View style={styles.searchResultsContainer}>
            {searchResults.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.searchResultItem,
                  pressed && { transform: [{ scale: 0.95 }] },
                ]}
                onPress={() => handleTaskEdit(item)}
              >
                <Text style={styles.searchResultText}>{item.title}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Calendar */}
        <CalendarComponent onDateSelect={(date) => setSelectedDate(date)} />

        {/* Tasks Header */}
        <View style={styles.tasksHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            {tasksHeaderLabel}
          </Text>

          {/* Add button with scale effect */}
          <Pressable
            onPress={() => navigation.navigate('CreateTask')}
            style={({ pressed }) => [
              styles.addButton,
              pressed && { transform: [{ scale: 0.9 }] },
            ]}
          >
            <Feather name="plus" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Task list */}
        <View style={styles.tasksSection}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Pressable
                key={task.id}
                onPress={() => handleTaskEdit(task)}
                style={({ pressed }) => [
                  pressed && { transform: [{ scale: 0.97 }] },
                ]}
              >
                <TaskItem
                  title={task.title}
                  date={task.date}
                  priority={task.priority}
                  startTime={task.startTime}
                  endTime={task.endTime}
                  isCompleted={completedTasks[task.id] || false}
                  onToggleComplete={() => toggleTaskCompletion(task.id)}
                />
              </Pressable>
            ))
          ) : (
            <Text style={[styles.noTaskText, { color: textColor }]}>
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
        />
      )}

      {/* Bottom navigation */}
      <BottomNav />
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
    shadowOffset: { width: 0, height: 3 },
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
