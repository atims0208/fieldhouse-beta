import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const testEndpoints = async (baseUrl: string) => {
  console.log('Testing API endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing /health endpoint');
    const healthResponse = await axios.get(`${baseUrl}/health`);
    console.log(`Health check response: ${healthResponse.status}\n`);

    // Test auth endpoint
    console.log('2. Testing /auth/status endpoint');
    const authResponse = await axios.get(`${baseUrl}/auth/status`);
    console.log(`Auth status response: ${authResponse.status}\n`);

  } catch (error) {
    console.error('Error testing endpoints:', error);
  }
};

export default testEndpoints; 