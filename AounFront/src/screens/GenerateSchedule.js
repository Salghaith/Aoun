import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SubjectCard from '../components/SubjectCard';
import {useSubjects} from '../context/SubjectContext';

const GenerateSchedule = ({navigation}) => {
  const {t} = useTranslation();
  const {subjects, loading, fetchSubjectsFromFirebase, toggleSubjectSelection} =
    useSubjects();

  const hasSelectedSubject = subjects.some(sub => sub.isSelected);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchSubjectsFromFirebase();
    });
    return unsubscribe;
  }, [navigation, fetchSubjectsFromFirebase]);

  const handleToggle = async (id, currentState) => {
    try {
      await toggleSubjectSelection(id, currentState);
    } catch (error) {
      console.error('Error updating subject toggle:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('Schedule Generation')}</Text>

      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.ButtonTouchOpa}
          onPress={() => navigation.navigate('MyScheduleScreen')}>
          <Text style={styles.buttonText}>{t('My Schedule')}</Text>
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
          <Text style={styles.buttonText}>{t('Add subject manually')}</Text>
          <Icon
            name="plus-circle"
            size={16}
            color="#FFFFFF"
            style={styles.IconAddSub}
          />
        </TouchableOpacity>
      </View>

      {subjects.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {t('No subjects added yet. Please add one to begin.')}
          </Text>
        </View>
      ) : (
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
              onPress={() =>
                navigation.navigate('AddSubjectManually', {subject: item})
              }
            />
          )}
        />
      )}

      <TouchableOpacity
        style={[styles.generateButton, {opacity: hasSelectedSubject ? 1 : 0.4}]}
        onPress={() => {
          if (hasSelectedSubject) {
            navigation.navigate('ScheduleFilter');
          }
        }}
        disabled={!hasSelectedSubject}>
        <Text style={styles.generateButtonText}>{t('Generate Schedule')}</Text>
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
    marginHorizontal: '10%',
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  IconCloud: {
    // marginLeft: 30,
  },
  IconAddSub: {
    // marginLeft: 10,
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
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 7,
  },
  cardContainer: {
    paddingHorizontal: 6,
    paddingBottom: 10,
  },
  cardRow: {
    justifyContent: 'flex-start',
    marginBottom: 9,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 32,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 80,
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
