import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HamburgerMenu = ({ onClose, onSelectAnswer }) => {
  // State to store saved conversations
  const [savedConversations, setSavedConversations] = useState([]);

  // Slide-in animation for smooth menu opening
  const slideAnim = useRef(new Animated.Value(-300)).current;

  // Load saved conversations from AsyncStorage when menu opens
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const storedConversations = await AsyncStorage.getItem('savedConversations');
        if (storedConversations) {
          setSavedConversations(JSON.parse(storedConversations));
        }
      } catch (error) {
        console.error('Error loading saved conversations:', error);
      }
    };
    loadConversations();

    // Start slide-in animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
      {/* Header Section with Title & Close Button */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Previous Answers</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close-circle-outline" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* List of Saved Conversations */}
      <FlatList
        data={savedConversations}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.messageItem} 
            onPress={() => onSelectAnswer(item)} // Opens full previous conversation
          >
            <Text style={styles.messageText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No saved answers yet.</Text>}
      />
    </Animated.View>
  );
};

export default HamburgerMenu;

// ✅ STYLES
const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '75%',
    height: '90%', // Stops above BottomNav
    backgroundColor: '#1F262E',
    padding: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  header: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  messageItem: {
    backgroundColor: '#2E3A45',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#0084FF',
  },
  messageText: {
    color: '#E0E0E0',
    fontSize: 15,
  },
  emptyMessage: {
    color: '#AAA',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
