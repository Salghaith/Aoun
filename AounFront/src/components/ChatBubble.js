import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ChatBubble = ({ message, onEdit }) => {
  const isUserMessage = message.sender === 'guestUser';
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text);

  // ✅ When user taps the edit button
  const handleEdit = () => {
    setIsEditing(true);
  };

  // ✅ Saves the edited text
  const handleSaveEdit = () => {
    if (editedText.trim().length > 0) {
      onEdit(message.id, editedText);
    }
    setIsEditing(false);
  };

  return (
    <View
      style={[
        styles.bubbleWrapper,
        isUserMessage ? styles.userContainer : styles.botContainer,
      ]}
    >
      {/* Edit button (left side) for user messages */}
      {isUserMessage && (
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Ionicons name="create-outline" size={22} color="#FFF" />
        </TouchableOpacity>
      )}

      {/* Bot icon (left side) */}
      {!isUserMessage && (
        <MaterialCommunityIcons
          name="robot-outline"
          size={30}
          color="#FFF"
          style={styles.icon}
        />
      )}

      {/* Chat bubble */}
      <View
        style={[
          styles.bubbleContainer,
          isUserMessage ? styles.userBubble : styles.botBubble,
        ]}
      >
        {isEditing ? (
          <TextInput
            style={styles.editInput}
            value={editedText}
            onChangeText={setEditedText}
            autoFocus
            onBlur={handleSaveEdit}
            returnKeyType="done"
            onSubmitEditing={handleSaveEdit}
          />
        ) : (
          <Text style={styles.bubbleText}>{message.text}</Text>
        )}
      </View>

      {/* User icon (right side) for user messages */}
      {isUserMessage && (
        <Ionicons name="person-outline" size={30} color="#FFF" style={styles.icon} />
      )}
    </View>
  );
};

export default ChatBubble;

const styles = StyleSheet.create({
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    marginHorizontal: 10,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  botContainer: {
    justifyContent: 'flex-start',
  },
  icon: {
    marginHorizontal: 10,
  },
  bubbleContainer: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 15,
  },
  userBubble: {
    backgroundColor: '#131417', // User bubble color
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  botBubble: {
    backgroundColor: '#2A2E35', // Bot bubble color
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  bubbleText: {
    color: '#FFF',
    fontSize: 16,
  },
  editButton: {
    marginRight: 10, // Places edit button on the left side for user messages
    padding: 5,
  },
  editInput: {
    color: '#FFF',
    fontSize: 16,
    backgroundColor: '#444',
    padding: 5,
    borderRadius: 5,
  },
});
