import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import SubjectCard from '../components/SubjectCard';

const GenerateSchedule = ({navigation}) => {
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
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

      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchSubjects);
    return unsubscribe;
  }, [navigation]);

  const handleToggle = async (id, currentState) => {
    try {
      await firestore().collection('subjects').doc(id).update({
        isSelected: !currentState,
      });
      setSubjects(prev =>
        prev.map(sub =>
          sub.id === id ? {...sub, isSelected: !currentState} : sub,
        ),
      );
    } catch (error) {
      console.error('Error updating subject toggle:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Schedule Generation</Text>

      <View style={styles.buttonView}>
        <TouchableOpacity style={styles.ButtonTouchOpa} onPress={fetchSubjects}>
          <Text style={styles.buttonText}>Retrieve subject</Text>
          <Icon
            name="cloud-download-alt"
            size={16}
            color="#FFFFFF"
            style={styles.IconCloud}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ButtonTouchOpa}
          onPress={() => navigation.navigate('AddSubjectManually')}>
          <Text style={styles.buttonText}>Add subject manually</Text>
          <Icon
            name="plus-circle"
            size={16}
            color="#FFFFFF"
            style={styles.IconAddSub}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        key={'3cols'}
        data={subjects}
        keyExtractor={item => item.id}
        numColumns={3}
        columnWrapperStyle={styles.cardRow}
        contentContainerStyle={styles.cardContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <SubjectCard
            name={item.name}
            code={item.code}
            sections={Object.keys(item.sections || {}).length}
            isEnabled={item.isSelected}
            onToggle={() => handleToggle(item.id, item.isSelected)}
          />
        )}
      />

      <TouchableOpacity
        style={styles.generateButton}
        onPress={() => navigation.navigate('ScheduleFilter')}>
        <Text style={styles.generateButtonText}>Generate Schedule</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default GenerateSchedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2128',
  },
  title: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 35,
    marginLeft: 25,
  },
  IconCloud: {
    marginLeft: 30,
  },
  IconAddSub: {
    marginLeft: 10,
  },
  buttonView: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  ButtonTouchOpa: {
    backgroundColor: '#131417',
    width: 175,
    height: 37,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    paddingLeft: 12,
  },
  cardContainer: {
    paddingHorizontal: 6,
    paddingBottom: 10,
  },
  cardRow: {
    justifyContent: 'flex-start',
    marginBottom: 9,
  },
  generateButton: {
    backgroundColor: '#131417',
    paddingVertical: 19,
    borderRadius: 11,
    alignItems: 'center',
    marginBottom: 55,
    marginTop: 10,
    width: '70%',
    alignSelf: 'center',
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
