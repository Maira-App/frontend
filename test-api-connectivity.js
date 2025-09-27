/**
 * API Connection Test
 * Run this test to verify the frontend can connect to the backend
 */

import { apiClient } from '../src/lib/api/client.js';
import { clientsService } from '../src/lib/api/clients.js';
import { calendarService } from '../src/lib/api/activities.js';
import { authService } from '../src/lib/api/auth.js';

// Test health endpoint
export async function testHealthEndpoint() {
  try {
    const response = await apiClient.health();
    console.log('✅ Health endpoint working:', response);
    return true;
  } catch (error) {
    console.error('❌ Health endpoint failed:', error.message);
    return false;
  }
}

// Test client search
export async function testClientSearch() {
  try {
    const response = await clientsService.search('test', { limit: 5 });
    console.log('✅ Client search working:', response);
    return true;
  } catch (error) {
    console.error('❌ Client search failed:', error.message);
    return false;
  }
}

// Test calendar agenda
export async function testCalendarAgenda() {
  try {
    const response = await calendarService.getEvents();
    console.log('✅ Calendar agenda working:', response);
    return true;
  } catch (error) {
    console.error('❌ Calendar agenda failed:', error.message);
    return false;
  }
}

// Test Google auth status
export async function testGoogleAuth() {
  try {
    const response = await authService.getGoogleAuthStatus('default');
    console.log('✅ Google auth status working:', response);
    return true;
  } catch (error) {
    console.error('❌ Google auth status failed:', error.message);
    return false;
  }
}

// Run all tests
export async function runApiTests() {
  console.log('🧪 Running API connectivity tests...\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealthEndpoint },
    { name: 'Client Search', fn: testClientSearch },
    { name: 'Calendar Agenda', fn: testCalendarAgenda },
    { name: 'Google Auth Status', fn: testGoogleAuth },
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`Testing ${test.name}...`);
    const passed = await test.fn();
    results.push({ name: test.name, passed });
    console.log('');
  }
  
  console.log('📊 Test Results:');
  results.forEach(result => {
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}`);
  });
  
  const passedCount = results.filter(r => r.passed).length;
  console.log(`\n${passedCount}/${results.length} tests passed`);
  
  return results;
}

// Usage: Call runApiTests() in browser console after frontend loads
if (typeof window !== 'undefined') {
  window.runApiTests = runApiTests;
  console.log('API tests available. Run window.runApiTests() to test backend connectivity.');
}