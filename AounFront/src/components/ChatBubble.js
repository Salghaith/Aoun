import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Markdown from 'react-native-markdown-display';

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



  if (message.type === 'typing') {
    return (
      <View style={[styles.bubbleWrapper, styles.botContainer]}>
        <MaterialCommunityIcons name="robot-outline" size={30} color="#FFF" style={styles.icon} />
        <View style={[styles.bubbleContainer, styles.botBubble]}>
          <Text style={styles.bubbleText}>...</Text>
        </View>
      </View>
    );
  }

  
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
          <>
  {/* Show text message */}
  {message.text?.trim()?.length > 0 && (
    <Markdown style={markdownStyles}>
    {message.text}
  </Markdown>
  )}

  {/* Show uploaded files (if any) */}
  {message.files?.length > 0 && (
    <View style={styles.fileList}>
      {message.files.map((file, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            // You can use Linking API to open file
            Linking.openURL(file.url);
            console.log('Tapped:', file.name);
          }}
          style={styles.fileItem}
        >
          <Ionicons name="document-outline" size={18} color="#CCC" />
          <Text style={styles.fileName}>{file.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )}
</>
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
    lineHeight: 20,
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
  fileList: {
    marginTop: 3,
  },
  
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  
  fileName: {
    marginLeft: 4,
    color: '#DDD',
    fontSize: 14,
    flexShrink: 1,
  },
});
const markdownStyles = {
  body: { color: '#FFF', fontSize: 16, lineHeight: 21 },
  strong: { fontWeight: 'bold' },
  em: { fontStyle: 'italic' },
  bullet_list: { paddingLeft: 1 },
  ordered_list: { paddingLeft: 1 },
  list_item: { marginVertical: 2 },
};
