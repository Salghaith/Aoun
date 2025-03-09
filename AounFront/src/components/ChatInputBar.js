import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';

const ChatInputBar = ({ onSend, isLoggedIn }) => {
  const [message, setMessage] = useState('');

  // ✅ Sends the typed message when user presses "Send"
  const handleSendPress = () => {
    if (message.trim().length > 0) {
      onSend(message.trim());
      setMessage(''); // Clear input
    }
  };

  // ✅ Request storage permission on Android 13+ for file upload
  const requestFilePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Storage access is required to upload files.');
          return false;
        }
      } catch (err) {
        console.error('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  // ✅ Handle file picker & show picked file name
  const handleFileUpload = async () => {
    if (!isLoggedIn) return; // Double-check user is logged in

    const hasPermission = await requestFilePermission();
    if (!hasPermission) return;

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // Allows all file types
      });

      console.log('File picked:', res);
      Alert.alert('File Selected', `You picked: ${res[0].name}`);

      // 🔹 TODO: Your friend can integrate actual backend upload here
      // e.g. uploadFile(res[0]) -> returns an uploaded file URL -> onSend(...) to display in chat

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the file picker');
      } else {
        console.error('File picker error:', err);
      }
    }
  };
  
  return (
    <View style={styles.container}>
      {/* 📎 File Upload Button (Only for Logged-in Users) */}
      {isLoggedIn && (
        <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
          <Ionicons name="attach-outline" size={22} color="#1C2128" />
        </TouchableOpacity>
      )}

      {/* 📝 Chat Input */}
      <TextInput
        style={styles.input}
        placeholder="Ask me anything"
        placeholderTextColor="#777"
        value={message}
        onChangeText={setMessage}
      />

      {/* ➡️ Send Button */}
      <TouchableOpacity style={styles.sendButton} onPress={handleSendPress}>
        <Ionicons name="arrow-forward-outline" size={22} color="#1C2128" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInputBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    marginHorizontal: 16,
    marginBottom: 36,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  uploadButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 10,
  },
  sendButton: {
    width: 45,
    height: 45,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
