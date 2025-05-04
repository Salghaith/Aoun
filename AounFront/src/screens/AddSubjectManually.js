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

import BackButton from '../components/BackButton';
import {ThemeContext} from '../context/ThemeContext';
import {useTranslation} from 'react-i18next';
import SectionDetails from '../components/SectionDetails';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FinalDetailsModal from '../components/FinalDetailsModal';
import firestore from '@react-native-firebase/firestore';

const AddSubjectManually = ({navigation}) => {
  const {t} = useTranslation();
  const {isDarkMode} = useContext(ThemeContext);
  const textColor = isDarkMode ? '#F9FAFB' : '#1C2128';

  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [sections, setSections] = useState([Date.now()]);
  const sectionRefs = useRef({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [finalDetails, setFinalDetails] = useState(null);

  const handleAddSection = () => {
    const id = Date.now();
    setSections(prev => [...prev, id]);
  };

  const handleSaveFinalDetails = data => {
    setFinalDetails(data);
    setIsModalVisible(false);
  };

  const handleSave = async () => {
    if (!subjectName.trim()) {
      Alert.alert('Validation', 'Please enter the subject name.');
      return;
    }

    const sectionValidationResults = Object.values(sectionRefs.current)
      .map(ref => ref?.validateSection?.())
      .filter(Boolean);

    const validationErrors = sectionValidationResults.filter(
      result => !result.isValid,
    );
    if (validationErrors.length > 0) {
      Alert.alert('Validation', validationErrors[0].errorMessage);
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
        'Validation',
        'Please enter at least one valid section and lecture.',
      );
      return;
    }

    const hasInvalidDay = allSectionData.some(section =>
      section.lectures.some(lecture => lecture.day === 'Day'),
    );
    if (hasInvalidDay) {
      Alert.alert('Validation', 'Please select a day for all lectures.');
      return;
    }

    // ✅ Check for duplicate section numbers
    const seen = new Set();
    for (const section of allSectionData) {
      const num = section.sectionNumber.trim();
      if (seen.has(num)) {
        Alert.alert('Validation', `Section number "${num}" is duplicated.`);
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

    const subjectData = {
      name: subjectName.trim(),
      code: subjectCode.trim() || null,
      final: finalDetails || null,
      sections: structuredSections,
      createdAt: new Date().toISOString(),
    };

    try {
      await firestore().collection('subjects').add(subjectData);
      Alert.alert('Success', 'Subject saved');
      navigation.goBack();
    } catch (err) {
      console.error('Error saving subject:', err);
      Alert.alert('Error', 'Failed to save subject');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <BackButton
          style={styles.backButtonSty}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.headerTitle, {color: textColor}]}>
          Add subject manually
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Subject name"
        placeholderTextColor="#AAA"
        value={subjectName}
        onChangeText={setSubjectName}
      />
      <TextInput
        style={styles.input}
        placeholder="Subject code (Optional)"
        placeholderTextColor="#AAA"
        value={subjectCode}
        onChangeText={setSubjectCode}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setIsModalVisible(true)}>
          <FontAwesome6 name="pen" color="white" size={20} />
          <Text style={styles.buttonText}>Final</Text>
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
          <Text style={styles.buttonText}>Add section</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
          <FontAwesome5 name="save" color="white" size={22} solid />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{paddingBottom: 100}}>
        {sections.map(id => (
          <View key={id} style={{marginBottom: 20}}>
            <SectionDetails
              ref={ref => (sectionRefs.current[id] = ref)}
              onDelete={() => {
                setSections(prev => prev.filter(item => item !== id));
                delete sectionRefs.current[id];
              }}
              isDeletable={sections.length > 1}
            />
          </View>
        ))}
      </ScrollView>

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
    marginBottom: -90,
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
});
