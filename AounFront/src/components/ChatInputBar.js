import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
//import RNBlobUtil from 'react-native-blob-util'; 

const MAX_FILE_SIZE_MB = 50;

const ChatInputBar = ({ onSend, isLoggedIn, loading, setLoading }) => {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'ppt':
      case 'pptx': return '📊';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      case 'txt': return '📃';
      default: return '📎';
    }
  };
  // ✅ Sends the typed message when user presses "Send"
  const handleSendPress = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;
  
    setLoading(true);

    let uploadedFiles = [];
    let uploadFailed = false;
  
    for (const file of selectedFiles) {
      try {
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const tempPath = `${RNBlobUtil.fs.dirs.CacheDir}/${cleanFileName}`;
  
        console.log(`📤 Uploading ${file.name}...`);
  
        // Read from content:// and write to a temp file path
        const fileData = await RNBlobUtil.fs.readStream(
          file.uri,
          'base64',
          4095
        );
  
        let base64Data = '';
        await new Promise((resolve, reject) => {
          fileData.open();
          fileData.onData((chunk) => {
            base64Data += chunk;
          });
          fileData.onError((err) => reject(err));
          fileData.onEnd(() => resolve());
        });
  
        await RNBlobUtil.fs.writeFile(tempPath, base64Data, 'base64');
  
        // Upload to Firebase
        const reference = storage().ref(`uploads/${cleanFileName}`);
        await reference.putFile(`file://${tempPath}`);
        const fileURL = await reference.getDownloadURL();
  
        console.log(`✅ Uploaded ${file.name} to Firebase`);
  
        uploadedFiles.push({
          name: file.name,
          url: fileURL,
          type: file.type || 'unknown',
        });
  
      } catch (error) {
        console.error('❌ File upload error:', error);
        uploadFailed = true;
      }
    }
  
    // Send only if there's something to send
    if (uploadedFiles.length > 0 || message.trim()) {
      onSend({
        type: 'mixed',
        text: message.trim(),
        files: uploadedFiles,
      });
  
      setMessage('');
      setSelectedFiles([]);
      setUploadProgress(null);
      setLoading(false);
    } else if (uploadFailed) {
      Alert.alert("Upload Failed", "We couldn't upload your files. Please try again.");
    }
  };

  // ✅ Request storage permission on Android 13+ for file upload
  const requestFilePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const readImages = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          );
          const readVideos = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
          );
          const readAudio = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
          );
  
          const granted =
            readImages === PermissionsAndroid.RESULTS.GRANTED ||
            readVideos === PermissionsAndroid.RESULTS.GRANTED ||
            readAudio === PermissionsAndroid.RESULTS.GRANTED;
  
          if (!granted) {
            Alert.alert('Permission Denied', 'Storage access is required to upload files.');
            return false;
          }
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );
  
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Permission Denied', 'Storage access is required to upload files.');
            return false;
          }
        }
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // ✅ Handle file picker & show picked file name
  const handleFileUpload = async () => {
    if (!isLoggedIn) return;

    const hasPermission = await requestFilePermission();
    if (!hasPermission) return;

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      console.log('📂 Files selected:', res);

    // 🔒 Check size (in bytes)
    const oversized = res.find(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (oversized) {
      Alert.alert('File too large', `Limit: ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setSelectedFiles(res);
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log('User canceled picker');
    } else {
      console.error('❌ Picker error:', err);
    }
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <View style={styles.container}>
      {selectedFiles.length > 0 && (
      <View style={styles.filePreview}>
        {selectedFiles.map((file, index) => (
        <View key={index} style={styles.fileItem}>
        <Text style={styles.fileText}>
          {getFileIcon(file.name)} {file.name || 'Unnamed File'}
        </Text>
        <TouchableOpacity onPress={() => handleRemoveFile(index)}>
          <Text style={styles.removeIcon}>❌</Text>
        </TouchableOpacity>
        </View>
       ))}
    </View>
    )}
      
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
      {/* 🌀 Uploading Spinner or ➡️ Send */}
      <TouchableOpacity
        style={styles.sendButton}
        onPress={handleSendPress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Ionicons name="arrow-forward-outline" size={22} color="#1C2128" />
        )}
      </TouchableOpacity>

      {/* 📶 Upload Progress (optional) */}
      {uploadProgress !== null && (
        <Text style={styles.progressText}>{uploadProgress}%</Text>
      )}
  

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
  filePreview: {
  position: 'absolute',
  bottom: 55,
  left: 20,
  right: 20,
  backgroundColor: '#F2F2F2',
  borderRadius: 10,
  padding: 8,
  elevation: 3,
  flexDirection: "column",
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  zIndex: 10,
},
fileItem: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 6,
},
fileText: {
  fontSize: 13,
  color: '#000',
  flex: 1,
},
removeIcon: {
  fontSize: 16,
  marginLeft: 10,
},
progressText: {
  position: 'absolute',
  right: 10,
  top: -20,
  fontSize: 12,
  color: '#888',
},
});
