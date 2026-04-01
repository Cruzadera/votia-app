import axios from 'axios';
import Constants from 'expo-constants';

const defaultHost = 'localhost';
const manifest: any = Constants.manifest || (Constants as any).expoConfig;
const hostFromMetro = manifest?.debuggerHost?.split(':')[0];
const host = hostFromMetro || defaultHost;
const API_PORT = 3001; // backend en 3001
const API_BASE_URL = `http://${host}:${API_PORT}/api`;

console.log('[api] base url', API_BASE_URL);

const api = axios.create({ baseURL: API_BASE_URL, timeout: 10000 });

export default {
  login: (name: string) => api.post('/users', { name }),
  createGroup: (name: string) => api.post('/groups', { name }),
  joinGroup: (inviteCode: string) => api.post('/groups/join', { inviteCode }),
  getDailyQuestion: (groupId: number) => api.get(`/daily-questions/${groupId}`),
  submitAnswer: (payload: any) => api.post('/answers', payload),
  getResults: (groupId: number) => api.get(`/groups/${groupId}/results`)
};
