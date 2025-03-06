import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

export const saveTask = async (task, userId) => {
  try {
    // Save task locally
    const existingTasks = await AsyncStorage.getItem('tasks');
    const tasks = existingTasks ? JSON.parse(existingTasks) : [];

    tasks.push(task);
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));

    // Sync with Firestore in the background
    syncTaskToFirestore(task, userId);
  } catch (error) {
    console.error('Error saving task locally:', error);
  }
};

// Sync Task to Firestore
const syncTaskToFirestore = async (task, userId) => {
  try {
    const taskRef = await firestore()
      .collection('tasks')
      .add({...task, userId});
    console.log('✅ Task saved in Firestore:', taskRef.id);
  } catch (error) {
    console.error('❌ Error syncing task to Firestore:', error);
  }
};

export const getTasks = async userId => {
  try {
    // Get local tasks
    const localTasks = await AsyncStorage.getItem('tasks');
    let tasks = localTasks ? JSON.parse(localTasks) : [];

    // Get tasks from Firestore
    const snapshot = await firestore()
      .collection('tasks')
      .where('userId', '==', userId)
      .get();

    const firestoreTasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Merge tasks, ensuring no duplicates
    const taskMap = new Map();

    // Add local tasks first
    tasks.forEach(task => taskMap.set(task.id, task));

    // Add Firestore tasks (overwrite if same ID exists)
    firestoreTasks.forEach(task => taskMap.set(task.id, task));

    return Array.from(taskMap.values()); // Return unique tasks
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const updateTask = async (taskId, updatedTask) => {
  try {
    // Update in Local Storage
    const existingTasks = await AsyncStorage.getItem('tasks');
    let tasks = existingTasks ? JSON.parse(existingTasks) : [];

    // Update the task locally
    tasks = tasks.map(task =>
      task.id === taskId ? {...task, ...updatedTask} : task,
    );
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));

    // Find Firestore Task ID (If It Exists)
    const snapshot = await firestore()
      .collection('tasks')
      .where('id', '==', taskId)
      .get();

    if (!snapshot.empty) {
      const firestoreTaskId = snapshot.docs[0].id; // Get Firestore ID
      await firestore()
        .collection('tasks')
        .doc(firestoreTaskId)
        .update(updatedTask);
    } else {
      console.log('Task not found in Firestore, skipping update.');
    }
  } catch (error) {
    console.error('❌ Error updating task:', error);
  }
};

export const deleteTask = async taskId => {
  try {
    // Remove from Local Storage
    const existingTasks = await AsyncStorage.getItem('tasks');
    let tasks = existingTasks ? JSON.parse(existingTasks) : [];

    tasks = tasks.filter(task => task.id !== taskId);
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));

    // Find Firestore Task ID (If It Exists)
    const snapshot = await firestore()
      .collection('tasks')
      .where('id', '==', taskId) // Find matching task
      .get();

    if (!snapshot.empty) {
      const firestoreTaskId = snapshot.docs[0].id; // Get Firestore ID
      await firestore().collection('tasks').doc(firestoreTaskId).delete();
    } else {
      console.log('Task not found in Firestore, skipping delete.');
    }
  } catch (error) {
    console.error('❌ Error deleting task:', error);
  }
};
