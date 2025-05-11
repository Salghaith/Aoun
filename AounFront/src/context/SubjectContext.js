import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const SubjectContext = createContext();

export const useSubjects = () => {
  const context = useContext(SubjectContext);
  if (!context) {
    throw new Error('useSubjects must be used within a SubjectProvider');
  }
  return context;
};

export const SubjectProvider = ({children}) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load subjects from AsyncStorage on initial mount
  useEffect(() => {
    loadSubjectsFromStorage();
  }, []);

  const loadSubjectsFromStorage = async () => {
    try {
      const storedSubjects = await AsyncStorage.getItem('subjects');
      if (storedSubjects) {
        setSubjects(JSON.parse(storedSubjects));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading subjects from storage:', error);
      setLoading(false);
    }
  };

  const fetchSubjectsFromFirebase = async () => {
    const user = auth().currentUser;
    if (!user) return;

    try {
      const snapshot = await firestore()
        .collection('subjects')
        .where('userId', '==', user.uid)
        .orderBy('createdAt', 'asc')
        .get();

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isSelected: doc.data().isSelected || false,
      }));

      // Update all three layers
      setSubjects(data);
      await AsyncStorage.setItem('subjects', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error fetching subjects from Firebase:', error);
      throw error;
    }
  };

  const updateSubject = async (id, updates) => {
    try {
      // Update Firebase
      await firestore().collection('subjects').doc(id).update(updates);

      // Update local state
      setSubjects(prevSubjects => {
        const updatedSubjects = prevSubjects.map(subject =>
          subject.id === id ? {...subject, ...updates} : subject,
        );
        // Update AsyncStorage
        AsyncStorage.setItem('subjects', JSON.stringify(updatedSubjects));
        return updatedSubjects;
      });
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  };

  const addSubject = async subjectData => {
    const user = auth().currentUser;
    if (!user) return;

    try {
      // Add to Firebase
      const docRef = await firestore()
        .collection('subjects')
        .add({
          ...subjectData,
          userId: user.uid,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      const newSubject = {
        id: docRef.id,
        ...subjectData,
        userId: user.uid,
        createdAt: new Date(),
      };

      // Update local state
      setSubjects(prevSubjects => {
        const updatedSubjects = [...prevSubjects, newSubject];
        // Update AsyncStorage
        AsyncStorage.setItem('subjects', JSON.stringify(updatedSubjects));
        return updatedSubjects;
      });

      return newSubject;
    } catch (error) {
      console.error('Error adding subject:', error);
      throw error;
    }
  };

  const deleteSubject = async id => {
    try {
      // Delete from Firebase
      await firestore().collection('subjects').doc(id).delete();

      // Update local state
      setSubjects(prevSubjects => {
        const updatedSubjects = prevSubjects.filter(
          subject => subject.id !== id,
        );
        // Update AsyncStorage
        AsyncStorage.setItem('subjects', JSON.stringify(updatedSubjects));
        return updatedSubjects;
      });
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
  };

  const toggleSubjectSelection = async (id, currentState) => {
    return updateSubject(id, {isSelected: !currentState});
  };

  const value = {
    subjects,
    loading,
    fetchSubjectsFromFirebase,
    updateSubject,
    addSubject,
    deleteSubject,
    toggleSubjectSelection,
  };

  return (
    <SubjectContext.Provider value={value}>{children}</SubjectContext.Provider>
  );
};
