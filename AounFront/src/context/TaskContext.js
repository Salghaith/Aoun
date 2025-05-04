import React, {createContext, useState, useEffect} from 'react';
import {getTasks} from '../services/taskService';

export const TaskContext = createContext();

export const TaskProvider = ({children, userId}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (userId) {
        setLoading(true);
        const fetchedTasks = await getTasks(userId);
        setTasks(fetchedTasks);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  const refreshTasks = async () => {
    if (userId) {
      const fetchedTasks = await getTasks(userId);
      setTasks(fetchedTasks);
    }
  };

  return (
    <TaskContext.Provider value={{tasks, setTasks, refreshTasks, loading}}>
      {children}
    </TaskContext.Provider>
  );
};
