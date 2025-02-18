import React, { useContext, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../context/ThemeContext';
import BottomNav from '../components/BottomNav';
import SearchBar from '../components/SearchBar';
import CalendarComponent from '../components/CalendarComponent';
import TaskItem from '../components/TaskItem';

const Tasks = ({ navigation }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [completedTasks, setCompletedTasks] = useState({});

  const today = new Date().toISOString().split('T')[0];

  const tasks = [
    { id: 1, title: 'AI Research Paper Submission', date: '2025-02-15', priority: 'high' },
    { id: 2, title: 'React Native Debugging', date: '2025-02-15', priority: 'medium' },
    { id: 3, title: 'Consulting Interview Prep', date: '2025-02-16', priority: 'low' },
    { id: 4, title: 'Sprint Review Meeting', date: '2025-02-16', priority: 'high' },
    { id: 5, title: 'Database Optimization', date: '2025-02-17', priority: 'medium' },
    { id: 6, title: 'Cloud Deployment Workshop', date: '2025-02-17', priority: 'low' },
    { id: 7, title: 'User Testing Session', date: '2025-02-17', priority: 'high' },
    { id: 8, title: 'Final Project Report', date: '2025-02-18', priority: 'medium' },
    { id: 9, title: 'Backend Refactoring', date: '2025-02-19', priority: 'low' },
    { id: 10, title: 'Machine Learning Model Training', date: '2025-02-20', priority: 'high' },
    { id: 11, title: 'Frontend UI Updates', date: '2025-02-22', priority: 'medium' },
    { id: 12, title: 'Thesis Presentation', date: '2025-02-21', priority: 'high' },
    { id: 13, title: 'Software Architecture Review', date: '2025-02-21', priority: 'low' },
    { id: 14, title: 'Coding Challenge', date: '2025-02-23', priority: 'medium' },
    { id: 15, title: 'Tech Talk Preparation', date: '2025-02-25', priority: 'high' },
  ];

  const filteredTasks = tasks.filter(task => task.date === selectedDate);

  const toggleTaskCompletion = (taskId) => {
    setCompletedTasks(prevState => ({
      ...prevState,
      [taskId]: !prevState[taskId]
    }));
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#1C2128' : '#F5F5F5' },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.titleText,
              { color: isDarkMode ? '#FFFFFF' : '#1C2128' },
            ]}
          >
            You have got {filteredTasks.length} tasks{'\n'}
            today to complete {' '}
            <Feather
              name="edit-2"
              size={22}  
              color="#FFA500"
            />
          </Text>
        </View>

        {/* Search Bar */}
        <SearchBar />

        {/* Calendar Component */}
        <CalendarComponent onDateSelect={(date) => setSelectedDate(date)} />

        {/* Tasks Header (Under Calendar) */}
        <View style={styles.tasksHeader}>
          <Text style={styles.sectionTitle}>
            {selectedDate === today ? "Today's Tasks" : `${selectedDate} Tasks`}
          </Text>

          {/* Add Task Button */}
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateTask')}>
            <Feather name="plus" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Task List */}
        <View style={styles.tasksSection}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                title={task.title} 
                date={task.date} 
                priority={task.priority} 
                isCompleted={completedTasks[task.id] || false}
                onToggleComplete={() => toggleTaskCompletion(task.id)}
              />
            ))
          ) : (
            <Text style={styles.noTaskText}>No tasks for this date.</Text>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation */}
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
    marginLeft: 37, 
  },
  titleText: {
    fontSize: 25,  
    fontWeight: 'bold',
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Align title and button
    alignItems: 'center',
    marginTop: 40, // Now under the calendar
    marginHorizontal: 37, 
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#131417', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', // Same shadow effect
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  tasksSection: {
    marginTop: 20,
    marginLeft: 37,
    marginRight: 37,
  },
  noTaskText: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Tasks;
