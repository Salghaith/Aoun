import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import RNBlobUtil from 'react-native-blob-util';
import {useTranslation} from 'react-i18next';

const MAX_FILE_SIZE_MB = 50;

const ChatInputBar = ({onSend, isLoggedIn, loading, setLoading}) => {
  const {t} = useTranslation();
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);

  const getFileIcon = filename => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'ppt':
      case 'pptx':
        return '📊';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️';
      case 'txt':
        return '📃';
      default:
        return '📎';
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

        let actualPath = file.uri;
        if (Platform.OS === 'android' && file.uri.startsWith('content://')) {
          actualPath = await RNBlobUtil.android.contentUriToFilePath(file.uri);
        }

        const reference = storage().ref(`uploads/${cleanFileName}`);
        await reference.putFile(actualPath);
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
      Alert.alert(
        t('Upload Failed'),
        t("We couldn't upload your files. Please try again."),
      );
    }
  };

  // ✅ Request storage permission on Android 13+ for file upload
  const requestFilePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const readImages = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          );
          const readVideos = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          );
          const readAudio = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
          );

          const granted =
            readImages === PermissionsAndroid.RESULTS.GRANTED ||
            readVideos === PermissionsAndroid.RESULTS.GRANTED ||
            readAudio === PermissionsAndroid.RESULTS.GRANTED;

          if (!granted) {
            Alert.alert(
              t('Permission Denied'),
              t('Storage access is required to upload files.'),
            );
            return false;
          }
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              t('Permission Denied'),
              t('Storage access is required to upload files.'),
            );
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
      const oversized = res.find(
        file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024,
      );
      if (oversized) {
        Alert.alert(t('File too large'), `Limit: ${MAX_FILE_SIZE_MB}MB`);
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

  const handleRemoveFile = indexToRemove => {
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
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleFileUpload}>
          <Ionicons name="attach-outline" size={22} color="#1C2128" />
        </TouchableOpacity>
      )}

      {/* 📝 Chat Input */}
      <TextInput
        style={styles.input}
        placeholder={t('Ask me anything')}
        placeholderTextColor="#777"
        value={message}
        onChangeText={setMessage}
      />
      {/* 🌀 Uploading Spinner or ➡️ Send */}
      <TouchableOpacity
        style={styles.sendButton}
        onPress={handleSendPress}
        disabled={loading}>
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
    marginBottom: '15%',
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
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
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
