import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const testEndpoints = async (baseUrl: string) => {
  console.log('Testing API endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing / 