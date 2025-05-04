import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import TimeInfoOfSection from './TimeInfoOfSection';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SectionDetails = forwardRef(({onDelete, isDeletable}, ref) => {
  const [sectionNumber, setSectionNumber] = useState('');
  const [lectures, setLectures] = useState([
    {
      id: Date.now(),
      day: 'Day',
      startTime: '8:00AM',
      endTime: '8:50PM',
      isDropdownOpen: false,
    },
  ]);

  const handleAddLecture = () => {
    setLectures(prev => [
      ...prev,
      {
        id: Date.now(),
        day: 'Day',
        startTime: '8:00AM',
        endTime: '8:50PM',
        isDropdownOpen: false,
      },
    ]);
  };

  const toggleDropdown = id => {
    setLectures(prev =>
      prev.map(lecture =>
        lecture.id === id
          ? {...lecture, isDropdownOpen: !lecture.isDropdownOpen}
          : {...lecture, isDropdownOpen: false},
      ),
    );
  };

  const handleSelectDay = (id, selectedDay) => {
    setLectures(prev =>
      prev.map(lecture =>
        lecture.id === id
          ? {...lecture, day: selectedDay, isDropdownOpen: false}
          : lecture,
      ),
    );
  };

  const handleSelectStartTime = (id, selectedTime) => {
    setLectures(prev =>
      prev.map(lecture =>
        lecture.id === id ? {...lecture, startTime: selectedTime} : lecture,
      ),
    );
  };

  const handleSelectEndTime = (id, selectedTime) => {
    setLectures(prev =>
      prev.map(lecture =>
        lecture.id === id ? {...lecture, endTime: selectedTime} : lecture,
      ),
    );
  };

  const validateDays = () => {
    // Check if any lecture has the default "Day" value
    return !lectures.some(lecture => lecture.day === 'Day');
  };

  useImperativeHandle(ref, () => ({
    getSectionData: () => ({
      sectionNumber,
      lectures,
    }),
    // Add validation method that can be called from parent
    validateSection: () => {
      return {
        isValid: sectionNumber.trim() !== '' && validateDays(),
        errorMessage:
          sectionNumber.trim() === ''
            ? 'Section number is required'
            : !validateDays()
            ? 'Please select a day for all lectures'
            : null,
      };
    },
  }));

  return (
    <View>
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <TextInput
            style={styles.sectionInput}
            placeholder="Section number"
            placeholderTextColor="#AAA"
            value={sectionNumber}
            onChangeText={setSectionNumber}
            keyboardType="numeric"
          />
          {isDeletable && (
            <TouchableOpacity onPress={onDelete}>
              <Icon name="trash" size={16} style={{marginBottom: 7}} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.divider} />

        {lectures.map(lecture => (
          <TimeInfoOfSection
            key={lecture.id}
            day={lecture.day}
            startTime={lecture.startTime}
            endTime={lecture.endTime}
            isDropdownOpen={lecture.isDropdownOpen}
            onToggleDropdown={() => toggleDropdown(lecture.id)}
            onSelectDay={day => handleSelectDay(lecture.id, day)}
            onSelectStartTime={time => handleSelectStartTime(lecture.id, time)}
            onSelectEndTime={time => handleSelectEndTime(lecture.id, time)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.addLectureButton}
        onPress={handleAddLecture}>
        <Icon
          name="plus-circle"
          size={16}
          color="#FFFFFF"
          style={{marginHorizontal: 6}}
        />
        <Text style={styles.addLectureText}>Add new lecture</Text>
      </TouchableOpacity>
    </View>
  );
});

export default SectionDetails;

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 0,
    marginHorizontal: 34,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionInput: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: '#CCC',
    flex: 1,
    marginRight: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#AAA',
    marginBottom: 12,
  },
  addLectureButton: {
    backgroundColor: '#131417',
    paddingVertical: 4,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
    marginHorizontal: 34,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addLectureText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
