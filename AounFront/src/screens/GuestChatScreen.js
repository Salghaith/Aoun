import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import components
import ChatBubble from '../components/ChatBubble';
import ChatInputBar from '../components/ChatInputBar';

const GuestChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [firstInteraction, setFirstInteraction] = useState(true);

  // ✅ Navigate to Login Page
  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  // ✅ Reset Chat (Clears Messages)
  const handleResetChat = () => {
    setMessages([]);
    setFirstInteraction(true);
  };

  // ✅ Handle Sending Messages
  const handleSendMessage = (newMessage) => {
    if (newMessage.trim().length > 0) {
      const userMsg = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: 'guestUser',
      };

      setMessages((prev) => [...prev, userMsg]);
      setFirstInteraction(false);

      setTimeout(() => {
        const botReply = {
          id: `bot-${Date.now()}`,
          text: `I see! You're asking about "${newMessage}". Let me help you with that.`,
          sender: 'bot',
          relatedTo: userMsg.id
        };
        setMessages((prev) => [...prev, botReply]);
      }, 1000);
    }
  };

  // ✅ Handle Editing Messages
  const handleEditMessage = (messageId, newText) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, text: newText } : msg
      )
    );

    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.relatedTo === messageId
            ? { ...msg, text: `I see! You're now asking about "${newText}". Let me help you with that.` }
            : msg
        )
      );
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        {/* Reset Chat Icon (Left Side) */}
        <TouchableOpacity onPress={handleResetChat} style={styles.iconButton}>
          <Ionicons name="newspaper-outline" size={28} color="#FFF" />
        </TouchableOpacity>

        {/* Login Button (Right Side) */}
        <TouchableOpacity onPress={handleLoginPress} style={styles.loginButton}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.chatContainer}>
        {firstInteraction ? (
          <View style={styles.headerContainer}>
            <Image 
              source={require('../assets/images/aoun-logo.png')} 
              style={styles.schoolHatImage} 
              resizeMode="contain"
            />
            <Text style={styles.infoText}>
              Hello! I'm here to assist you. Ask me anything, and I'll do my best to help.
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={({ item }) => <ChatBubble message={item} onEdit={handleEditMessage} />}
            keyExtractor={(item) => item.id}
            style={styles.chatList}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>

      {/* CHAT INPUT BAR */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.keyboardAvoid}
      >
        <ChatInputBar onSend={handleSendMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default GuestChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2128',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginTop: 15,
  },
  iconButton: {
    padding: 5,
  },
  loginButton: {
    padding: 5,
  },
  loginText: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1, 
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  schoolHatImage: {
    width: 200,
    height: 200,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
  infoText: {
    color: '#FFF',
    fontSize: 15,
    textAlign: 'center',
    marginHorizontal: 30,
    marginTop: 20,
  },
  chatList: {
    flexGrow: 1,
  },
  keyboardAvoid: {
    paddingBottom: 70,
  },
});
