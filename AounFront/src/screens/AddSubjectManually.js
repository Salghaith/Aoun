import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import BackButton from '../components/BackButton';
import {ThemeContext} from '../context/ThemeContext';
import {useTranslation} from 'react-i18next';
import SectionDetails from '../components/SectionDetails';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import BottomNav from '../components/BottomNav';

const AddSubjectManually = ({navigation}) => {
  const {t} = useTranslation();
  const {isDarkMode} = useContext(ThemeContext);
  const textColor = isDarkMode ? '#F9FAFB' : '#1C2128';

  const [sections, setSections] = useState([Date.now()]);

  const handleAddSection = () => {
    setSections(prev => [...prev, Date.now()]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <BackButton
          style={styles.backButtonSty}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.headerTitle, {color: textColor}]}>
          {t('Add subject manually')}
        </Text>
      </View>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Subject name"
        placeholderTextColor="#AAA"
      />
      <TextInput
        style={styles.input}
        placeholder="Subject code (Optional)"
        placeholderTextColor="#AAA"
      />

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton}>
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
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome5 name="save" color="white" size={22} solid />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Sections */}
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{paddingBottom: 100}}>
        {sections.map((id, index) => (
          <View key={id} style={{marginBottom: 20}}>
            <SectionDetails
              onDelete={() =>
                setSections(prev => prev.filter(item => item !== id))
              }
              isDeletable={sections.length > 1}
            />
          </View>
        ))}
      </ScrollView>

      <BottomNav activeTab="Chat" />
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
    marginBottom: -90, // Keep this if it helps your layout
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
