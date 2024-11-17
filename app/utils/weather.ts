// utils/weather.ts
import axios from 'axios';

const API_KEY = 'e42b64ff6a4e401480f152419241111'; // Replace with your API key
const BASE_URL = 'http://api.weatherapi.com/v1/current.json';

export async function getWeather(city: string) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: city,
      },
    });
    console.log("resp", response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}
