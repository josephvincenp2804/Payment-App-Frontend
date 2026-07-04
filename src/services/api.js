import axios from 'axios';

// Get backend API URL from the Expo environment
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000'; // Fallback to Android emulator host IP, default to 5000

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
