import axios from 'axios';
import {OPENAI_API_KEY} from '@env';
import {Platform} from 'react-native';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// const baseURL = //For local testing
//   Platform.OS == 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';
const baseURL = 'https://salghaith.online'; //For production

// ✅ Handle both text and file input
export const getChatbotResponse = async (contextMessages, files = []) => {
  try {
    const response = await axios.post(`${baseURL}/api/chat`, {
      messages: contextMessages,
      files,
    });

    return response.data.reply;
  } catch (error) {
    console.error('❌ Backend Error:', error.response?.data || error.message);
    return 'Error processing your request.';
  }
};
