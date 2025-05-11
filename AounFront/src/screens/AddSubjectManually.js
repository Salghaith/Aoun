import React, {useState, useContext, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';

import {useRoute} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import BackButton from '../components/BackButton';
import {ThemeContext} from '../context/ThemeContext';
import {useTranslation} from 'react-i18next';
import SectionDetails from '../components/SectionDetails';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FinalDetailsModal from '../components/FinalDetailsModal';
import {useSubjects} from '../context/SubjectContext';

const AddSubjectManually = ({navigation}) => {
  const {t} = useTranslation();
  const {isDarkMode} = useContext(ThemeContext);
  const {addSubject, updateSubject, deleteSubject} = useSubjects();
  const textColor = isDarkMode ? '#F9FAFB' : '#1C2128';

  const route = useRoute();
  const editingSubject = route.params?.subject;

  const [subjectName, setSubjectName] = useState(editingSubject?.name || '');
  const [subjectCode, setSubjectCode] = useState(editingSubject?.code || '');
  const [sections, setSections] = useState(
    editingSubject
      ? Object.entries(editingSubject.sections || {}).map(
          ([sectionNumber, {lectures}]) => ({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
            sectionNumber,
            lectures,
          }),
        )
      : [
          {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
            sectionNumber: '',
            lectures: [
              {
                id: `${Date.now()}-${Math.random()
                  .toString(36)
                  .substring(2, 8)}`,
                day: 'Day',
                startTime: '8:00AM',
                endTime: '8:50AM',
                isDropdownOpen: false,
              },
            ],
          },
        ],
  );

  const sectionRefs = useRef({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [finalDetails, setFinalDetails] = useState(
    editingSubject?.final || null,
  );
  const handleAddSection = () => {
    const newId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    setSections(prev => [
      ...prev,
      {
        id: newId,
        sectionNumber: '',
        lectures: [
          {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
            day: 'Day',
            startTime: '8:00AM',
            endTime: '8:50AM',
            isDropdownOpen: false,
          },
        ],
      },
    ]);
  };

  const handleSaveFinalDetails = data => {
    setFinalDetails(data);
    setIsModalVisible(false);
  };

  const handleSave = async () => {
    if (!subjectName.trim()) {
      Alert.alert(t('Validation'), t('Please enter the subject name.'));
      return;
    }

    if (!subjectCode.trim()) {
      Alert.alert(t('Validation'), t('Please enter the subject code.'));
      return;
    }

    const sectionValidationResults = Object.values(sectionRefs.current)
      .map(ref => ref?.validateSection?.())
      .filter(Boolean);

    const validationErrors = sectionValidationResults.filter(
      result => !result.isValid,
    );
    if (validationErrors.length > 0) {
      Alert.alert(t('Validation'), validationErrors[0].errorMessage);
      return;
    }

    const allSectionData = Object.values(sectionRefs.current)
      .map(ref => ref?.getSectionData?.())
      .filter(Boolean);

    const hasValidSection = allSectionData.some(
      section => section.sectionNumber.trim() && section.lectures.length > 0,
    );

    if (!hasValidSection) {
      Alert.alert(
        t('Validation'),
        t('Please enter at least one valid section and lecture.'),
      );
      return;
    }

    const hasInvalidDay = allSectionData.some(section =>
      section.lectures.some(lecture => lecture.day === 'Day'),
    );
    if (hasInvalidDay) {
      Alert.alert(t('Validation'), t('Please select a day for all lectures.'));
      return;
    }

    // ✅ Check for duplicate section numbers
    const seen = new Set();
    for (const section of allSectionData) {
      const num = section.sectionNumber.trim();
      if (seen.has(num)) {
        Alert.alert(t('Validation'), t(`Section number "${num}" is duplicated.`));
        return;
      }
      seen.add(num);
    }

    // ✅ Clean & structure data
    const structuredSections = {};
    allSectionData.forEach(section => {
      structuredSections[section.sectionNumber.trim()] = {
        lectures: section.lectures.map(({day, startTime, endTime}) => ({
          day,
          startTime,
          endTime,
        })),
      };
    });

    const user = auth().currentUser;
    if (!user) {
      Alert.alert(t('Error'), t('User not logged in.'));
      return;
    }

    const subjectData = {
      name: subjectName.trim(),
      code: subjectCode.trim() || null,
      final: finalDetails || null,
      sections: structuredSections,
      createdAt: new Date().toISOString(),
      userId: user.uid,
    };

    try {
      if (editingSubject?.id) {
        await updateSubject(editingSubject.id, subjectData);
        Alert.alert(t('Success'), t('Subject updated'));
      } else {
        await addSubject(subjectData);
      }
      navigation.goBack();
    } catch (err) {
      console.error('Error saving subject:', err);
      Alert.alert(t('Error'), t('Failed to save subject'));
    }
  };

  const handleDelete = async () => {
    if (!editingSubject?.id) return;

    Alert.alert(
      t('Delete Subject'),
      t('Are you sure you want to delete this subject?'),
      [
        {text: t('Cancel'), style: 'cancel'},
        {
          text: t('Delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSubject(editingSubject.id);
              Alert.alert(t('Deleted'), t('Subject has been removed.'));
              navigation.goBack();
            } catch (err) {
              console.error('Delete error:', err);
              Alert.alert(t('Error'), t('Failed to delete subject.'));
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.headerTitle, {color: textColor}]}>
          {editingSubject ? t('Edit subject') : t('Add subject manually')}
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder={t('Subject name')}
        placeholderTextColor="#AAA"
        value={subjectName}
        onChangeText={setSubjectName}
        maxLength={40}
      />
      <TextInput
        style={styles.input}
        placeholder={t('Subject code')}
        placeholderTextColor="#AAA"
        value={subjectCode}
        onChangeText={setSubjectCode}
        maxLength={7}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setIsModalVisible(true)}>
          <FontAwesome6 name="pen" color="white" size={20} />
          <Text style={styles.buttonText}>{t('Final')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleAddSection}>
          <FontAwesome6
            name="user-plus"
            color="white"
            size={22}
            style={{marginLeft: 5}}
          />
          <Text style={styles.buttonText}>{t('Add section')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
          <FontAwesome5 name="save" color="white" size={22} solid />
          <Text style={styles.buttonText}>{t('Save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{paddingBottom: 120}}>
        {sections.map(section => (
          <View key={section.id} style={{marginBottom: 20}}>
            <SectionDetails
              ref={ref => (sectionRefs.current[section.id] = ref)}
              onDelete={() => {
                setSections(prev =>
                  prev.filter(item => item.id !== section.id),
                );
                delete sectionRefs.current[section.id];
              }}
              isDeletable={sections.length > 1}
              initialData={section}
            />
          </View>
        ))}
      </ScrollView>

      {editingSubject?.id && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>{t('Delete Subject')}</Text>
        </TouchableOpacity>
      )}

      <FinalDetailsModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveFinalDetails}
      />
    </SafeAreaView>
  );
};

export default AddSubjectManually;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2128',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 47,
    marginRight: 'auto',
    marginTop: 15,
  },
  input: {
    backgroundColor: '#131417',
    color: '#FFF',
    padding: 14,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 16,
    marginHorizontal: 34,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: -95,
    marginHorizontal: 34,
  },
  actionButton: {
    backgroundColor: '#131417',
    width: '25%',
    height: '40%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 8,
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'rgba(252, 48, 48, 0.8)',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 34,
    marginBottom: 25,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
