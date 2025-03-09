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
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import components
import ChatBubble from '../components/ChatBubble';
import ChatInputBar from '../components/ChatInputBar'; 
import BottomNav from '../components/BottomNav';
import HamburgerMenu from '../components/HamburgerMenu';

const UserChatScreen = ({ navigation }) => {
  // No old messages are loaded by default
  const [messages, setMessages] = useState([]);  
  const [firstInteraction, setFirstInteraction] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ Reset chat (clears messages, welcome reappears)
  const handleResetChat = async () => {
    setMessages([]);
    setFirstInteraction(true);
    // Clear stored messages if you want to fully reset
    await AsyncStorage.removeItem('chatMessages');
    await AsyncStorage.removeItem('chatSessions'); 
  };

  // ✅ Open/close the previous answers menu
  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // ✅ Handle sending a new message
  const handleSendMessage = async (newMessage) => {
    if (newMessage.trim().length > 0) {
      const userMsg = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: 'guestUser',
      };

      // Add user message, remove welcome
      setMessages((prev) => [...prev, userMsg]);
      setFirstInteraction(false);

      // Simulated bot response
      setTimeout(async () => {
        const botReply = {
          id: `bot-${Date.now()}`,
          text: `I see! You're asking about "${newMessage}". Let me help you with that.`,
          sender: 'bot',
          relatedTo: userMsg.id
        };

        setMessages((prev) => [...prev, botReply]);

        // Optionally save the bot response for old answers
        await saveBotResponse(botReply);
      }, 1000);
    }
  };

  // ✅ Edit a sent message and update bot's response
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

  // ✅ Save only bot responses for old answers
  const saveBotResponse = async (botReply) => {
    try {
      const storedResponses = await AsyncStorage.getItem('savedAnswers');
      const savedResponses = storedResponses ? JSON.parse(storedResponses) : [];
      savedResponses.push(botReply);
      await AsyncStorage.setItem('savedAnswers', JSON.stringify(savedResponses));
    } catch (error) {
      console.error("Error saving bot response:", error);
    }
  };

  // ✅ Load conversation from old answers (hamburger menu)
  const handleOpenOldChat = async (chatId) => {
    try {
      const storedChats = await AsyncStorage.getItem('chatSessions');
      if (storedChats) {
        const savedChats = JSON.parse(storedChats);
        const selectedChat = savedChats.find(chat => chat.id === chatId);
        if (selectedChat) {
          setMessages(selectedChat.messages);
          setFirstInteraction(false);
          setIsMenuOpen(false);
        }
      }
    } catch (error) {
      console.error("Error opening old chat:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        {/* Hamburger Menu */}
        <TouchableOpacity onPress={handleToggleMenu} style={styles.iconButton}>
          <Ionicons name="menu-outline" size={34} color="#FFF" />
        </TouchableOpacity>

        {/* Reset Chat */}
        <TouchableOpacity onPress={handleResetChat} style={styles.iconButton}>
          <Ionicons name="newspaper-outline" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Hamburger Menu Component */}
      {isMenuOpen && (
        <HamburgerMenu 
          onClose={handleToggleMenu} 
          onSelectAnswer={handleOpenOldChat} 
        />
      )}

      {/* MAIN CONTENT */}
      <View style={styles.chatContainer}>
        {firstInteraction ? (
          // User sees the welcome message on first load
          <View style={styles.headerContainer}>
            <Image 
              source={require('../assets/images/aoun-logo.png')} 
              style={styles.schoolHatImage} 
              resizeMode="contain"
            />
            <Text style={styles.infoText}>
              Hello! I'm here to help. Ask me anything and I'll do my best to assist you.
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <ChatBubble message={item} onEdit={handleEditMessage} />
            )}
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
        <ChatInputBar onSend={handleSendMessage} isLoggedIn={true} />
      </KeyboardAvoidingView>

      {/* BOTTOM NAVIGATION */}
      <BottomNav activeTab="Chat" />
    </SafeAreaView>
  );
};

export default UserChatScreen;


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
