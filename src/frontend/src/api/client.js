import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '';
const DEV_TOKEN = 'dev-secret-ooty-2025';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Authorization': `Bearer ${DEV_TOKEN}`
  }
});

export const getHealth = () => client.get('/health');
export const getLiveWeather = (lat, lon) => {
  const params = lat && lon ? `?lat=${lat}&lon=${lon}` : '';
  return client.get(`/weather/live${params}`);
};
export const getMetrics = (horizon) => client.get(`/metrics?horizon=${horizon}`);
export const predictSingle = (data) => client.post('/predict/single', data);
export const predictBatch = (data) => client.post('/predict/batch', data);
export const triggerRetrain = () => client.post('/retrain');

export default client;
