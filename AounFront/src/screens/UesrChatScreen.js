import React, { useState,useContext } from 'react';
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
import firestore from '@react-native-firebase/firestore';
// Import components
import ChatBubble from '../components/ChatBubble';
import ChatInputBar from '../components/ChatInputBar'; 
import HamburgerMenu from '../components/HamburgerMenu';
import {AuthContext} from '../context/AuthContext';
import { getChatbotResponse } from '../services/openaiService'; // ✅ Add this
import uuid from 'react-native-uuid';

const UserChatScreen = ({ navigation }) => {
  // No old messages are loaded by default
  const [messages, setMessages] = useState([]);  
  const [firstInteraction, setFirstInteraction] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {userData} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [oldSessions, setOldSessions] = useState([]);
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
    setIsMenuOpen(prev => {
      const newState = !prev;
      if (newState) {
        handleOpenOldChat(); // 👉 Call it only when opening the menu
      }
      return newState;
    });
  };

  // ✅ Handle sending a new message
  const handleSendMessage = async (messageObject) => {
    if (!messageObject) return;

    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = Date.now().toString();
      setCurrentSessionId(sessionId); // ✅ Set in state
      // ✅ Create the session in Firestore
      await firestore()
      .collection('chats')
      .doc(userData.userId)
      .collection('sessions')
      .doc(sessionId)
      .set({
        createdAt: firestore.FieldValue.serverTimestamp(),
        sessionName: "Chat " + new Date().toLocaleString(), // Optional
      });
  }
    const userMsg = {
      id: Date.now().toString(),
      type: messageObject.type, // "text" or "file" or "mixed"
      text: messageObject.text || "",
      files: messageObject.files || [],
      sender: 'guestUser',
    };
  
    setMessages((prev) => [...prev, userMsg]);
    setFirstInteraction(false);
    setIsTyping(true); // 👉 Show typing

    try {
      setLoading(true);
      // ✅ Get the conversation context
      const contextSnapshot = await firestore()
      .collection('chats')
      .doc(userData.userId)
      .collection('sessions')
      .doc(sessionId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .get();

      const contextMessages = contextSnapshot.docs.map(doc => {
        const msg = doc.data();
       return {
      role: msg.sender === 'bot' ? 'assistant' : 'user',
      content: msg.text,
        };
     });

       // Append the new user message to context
      contextMessages.push({ role: "user", content: userMsg.text });
      // ✅ Send text and files to OpenAI for processing
      
      const botResponse = await getChatbotResponse(contextMessages, userMsg.files);
      setLoading(false);
      const botReply = {
        id: `bot-${Date.now()}`,
        type: 'text',
        text: botResponse,
        sender: 'bot',
      };
  
      setMessages((prev) => [...prev, botReply]);
  
      // ✅ Save chat history
      await saveMessageToFirestore(userData.userId, sessionId, userMsg);
      await saveMessageToFirestore(userData.userId, sessionId, botReply);

       // Optionally update sessionId if it's a new session
      // setCurrentSessionId(sessionId);
    } catch (error) {
      console.error("❌ Chatbot error:", error);
    }
    finally {
      setIsTyping(false); // 👉 Hide typing
    }
  };

  const saveMessageToFirestore = async (userId, sessionId, message) => {
    try {
      const messageRef = firestore()
        .collection('chats')
        .doc(userId)
        .collection('sessions')
        .doc(sessionId)
        .collection('messages');
  
      await messageRef.add({
        ...message,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
  
      console.log('✅ Message saved to Firestore.');
    } catch (error) {
      console.error('❌ Error saving message to Firestore:', error);
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
  const saveChatHistory = async (chatMessages) => {
  if (!userData || !userData.userId) {
    console.error("❌ No authenticated user. Cannot save chat history.");
    return;
  }

  try {
    await firestore().collection('chats').doc(userData.userId).set({
      messages: chatMessages,
      timestamp: firestore.FieldValue.serverTimestamp()
    });
    console.log(`✅ Chat history saved for user: ${userData.userId}`);
  } catch (error) {
    console.error("❌ Error saving chat history:", error);
  }
};

  // ✅ Load conversation from old answers (hamburger menu)
  const handleOpenOldChat = async () => {
    if (!userData || !userData.userId) {
      console.error("❌ No authenticated user. Cannot load chat history.");
      return;
    }
  
    try {
      const sessionsSnapshot = await firestore()
        .collection('chats')
        .doc(userData.userId)
        .collection('sessions')
        .orderBy('createdAt', 'desc')
        .get();
  
      const sessions = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setOldSessions(sessions); // You'll use this in the hamburger menu
      setIsMenuOpen(true);
      console.log("✅ Loaded old chat sessions:", sessions.length);
    } catch (error) {
      console.error("❌ Error loading sessions:", error);
    }
  };
  const loadSessionMessages = async (sessionId) => {
    try {
      const messagesSnapshot = await firestore()
        .collection('chats')
        .doc(userData.userId)
        .collection('sessions')
        .doc(sessionId)
        .collection('messages')
        .orderBy('createdAt', 'asc')  // 🟢 use 'createdAt' instead of 'timestamp'
        .get();
  
      const chatMessages = messagesSnapshot.docs.map(doc => doc.data());
      setMessages(chatMessages);
      setCurrentSessionId(sessionId);
      setFirstInteraction(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('❌ Failed to load session messages:', error);
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
       sessions={oldSessions}
       onSelectSession={loadSessionMessages} 
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
          data={isTyping ? [...messages, { id: 'typing', type: 'typing', sender: 'bot' }] : messages}
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
        <ChatInputBar onSend={handleSendMessage} isLoggedIn={true} loading={loading} setLoading={setLoading}/>
      </KeyboardAvoidingView>

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
