import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import TimeInfoOfSection from './TimeInfoOfSection';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useTranslation} from 'react-i18next';

const SectionDetails = forwardRef(
  ({onDelete, isDeletable, initialData = {}}, ref) => {
    const {t} = useTranslation();
    const [sectionNumber, setSectionNumber] = useState(
      initialData.sectionNumber || '',
    );

    const [lectures, setLectures] = useState(
      initialData.lectures?.length > 0
        ? initialData.lectures.map(lec => ({
            ...lec,
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
            isDropdownOpen: false,
          }))
        : [
            {
              id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
              day: 'Day',
              startTime: '8:00AM',
              endTime: '8:50AM',
              isDropdownOpen: false,
            },
          ],
    );

    const handleAddLecture = () => {
      setLectures(prev => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          day: 'Day',
          startTime: '8:00AM',
          endTime: '8:50AM',
          isDropdownOpen: false,
        },
      ]);
    };

    const handleDeleteLecture = lectureId => {
      if (lectures.length > 1) {
        setLectures(prev => prev.filter(lecture => lecture.id !== lectureId));
      }
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
      return !lectures.some(lecture => lecture.day === 'Day');
    };

    const renderRightActions = (progress, dragX, lectureId) => {
      const trans = dragX.interpolate({
        inputRange: [-60, 0],
        outputRange: [0, 60],
      });

      return (
        <TouchableOpacity
          style={styles.deleteAction}
          onPress={() => handleDeleteLecture(lectureId)}>
          <Animated.View
            style={[
              styles.deleteActionContent,
              {
                transform: [{translateX: trans}],
              },
            ]}>
            <Icon name="trash-alt" size={16} color="#E53835" />
            <Text style={styles.deleteActionText}>{t('Delete')}</Text>
          </Animated.View>
        </TouchableOpacity>
      );
    };

    useImperativeHandle(ref, () => ({
      getSectionData: () => ({
        sectionNumber,
        lectures,
      }),
      validateSection: () => {
        if (sectionNumber.trim() === '') {
          return {
            isValid: false,
            errorMessage: t('Section number is required'),
          };
        }
        if (!validateDays()) {
          return {
            isValid: false,
            errorMessage: t('Please select a day for all lectures'),
          };
        }

        const toMinutes = timeStr => {
          const [hm, period] = timeStr.split(/(?=[AP]M)/);
          let [h, m] = hm.split(':').map(Number);
          if (period === 'PM' && h !== 12) h += 12;
          if (period === 'AM' && h === 12) h = 0;
          return h * 60 + m;
        };

        const seen = [];

        for (let i = 0; i < lectures.length; i++) {
          const lec1 = lectures[i];
          const start1 = toMinutes(lec1.startTime);
          const end1 = toMinutes(lec1.endTime);

          for (let j = i + 1; j < lectures.length; j++) {
            const lec2 = lectures[j];
            if (lec1.day !== lec2.day) continue;

            const start2 = toMinutes(lec2.startTime);
            const end2 = toMinutes(lec2.endTime);

            const overlap = !(end1 <= start2 || end2 <= start1);
            if (overlap) {
              return {
                isValid: false,
                errorMessage: `${t('Lectures on')} ${lec1.day} ${t(
                  'overlap in section',
                )} ${sectionNumber}`,
              };
            }
          }
        }

        return {isValid: true, errorMessage: null};
      },
    }));

    return (
      <View>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <TextInput
              style={styles.sectionInput}
              placeholder={t('Section number')}
              placeholderTextColor="#AAA"
              value={sectionNumber}
              onChangeText={setSectionNumber}
              keyboardType="numeric"
              maxLength={5}
            />
            {isDeletable && (
              <TouchableOpacity onPress={onDelete}>
                <Icon name="trash" size={16} style={{marginBottom: 7}} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.divider} />

          {lectures.map(lecture => (
            <Swipeable
              key={lecture.id}
              renderRightActions={(progress, dragX) =>
                lectures.length > 1
                  ? renderRightActions(progress, dragX, lecture.id)
                  : null
              }
              rightThreshold={30}
              friction={2}
              enabled={!lecture.isDropdownOpen}>
              <View style={styles.lectureContainer}>
                <TimeInfoOfSection
                  day={lecture.day}
                  startTime={lecture.startTime}
                  endTime={lecture.endTime}
                  isDropdownOpen={lecture.isDropdownOpen}
                  onToggleDropdown={() => toggleDropdown(lecture.id)}
                  onSelectDay={day => handleSelectDay(lecture.id, day)}
                  onSelectStartTime={time =>
                    handleSelectStartTime(lecture.id, time)
                  }
                  onSelectEndTime={time =>
                    handleSelectEndTime(lecture.id, time)
                  }
                />
              </View>
            </Swipeable>
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
          <Text style={styles.addLectureText}>{t('Add new lecture')}</Text>
        </TouchableOpacity>
      </View>
    );
  },
);

export default SectionDetails;

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 4,
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
  lectureContainer: {
    backgroundColor: '#FFF',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: '100%',
    paddingLeft: 12,
  },
  deleteActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    marginTop: -24,
  },
  deleteActionText: {
    color: '#E53835',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
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
