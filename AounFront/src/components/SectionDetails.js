import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import TimeInfoOfSection from './TimeInfoOfSection';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SectionDetails = ({onDelete, isDeletable}) => {
  const [lectureRows, setLectureRows] = useState([Date.now()]);

  const handleAddLecture = () => {
    setLectureRows(prev => [...prev, Date.now()]);
  };

  const handleDeleteLecture = id => {
    setLectureRows(prev => prev.filter(item => item !== id));
  };

  const renderLeftActions = (progress, dragX) => {
    const backgroundColor = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: ['#fff', '#ff8a8a'],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.swipeBackground, {backgroundColor}]} />
    );
  };

  return (
    <View>
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Section number</Text>
          {isDeletable && (
            <TouchableOpacity onPress={onDelete}>
              <Icon name="trash" size={16} style={{marginBottom: 7}} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.divider} />

        {lectureRows.map((id, index) =>
          index === 0 ? (
            <TimeInfoOfSection key={id} />
          ) : (
            <Swipeable
              key={id}
              renderLeftActions={renderLeftActions}
              onSwipeableOpen={() => handleDeleteLecture(id)}>
              <TimeInfoOfSection />
            </Swipeable>
          ),
        )}
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
};

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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#AAA',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addLectureText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  swipeBackground: {
    flex: 1,
    borderRadius: 6,
    marginBottom: 10,
  },
});
