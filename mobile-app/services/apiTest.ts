// Test file to demonstrate all API functionality
// This is for documentation and testing purposes

import { authService, dashboardService, memberService, userService, profileService, dataService } from './services/api';

// Test all authentication endpoints
const testAuth = async () => {
  try {
    // Login
    const loginResponse = await authService.login({ email: 'test@example.com', password: 'password' });
    console.log('Login response:', loginResponse.data);

    // Register (new endpoint added)
    const registerResponse = await authService.register({ 
      name: 'Test User', 
      email: 'test@example.com', 
      password: 'password',
      phone: '1234567890'
    });
    console.log('Register response:', registerResponse.data);

    // Forgot password
    const forgotResponse = await authService.forgotPassword({ email: 'test@example.com' });
    console.log('Forgot password response:', forgotResponse.data);

    // Reset password
    const resetResponse = await authService.resetPassword({ 
      token: 'reset-token', 
      newPassword: 'newPassword' 
    });
    console.log('Reset password response:', resetResponse.data);
  } catch (error) {
    console.error('Auth test error:', error);
  }
};

// Test all dashboard endpoints
const testDashboard = async () => {
  try {
    // Get dashboard stats
    const statsResponse = await dashboardService.getStats();
    console.log('Dashboard stats response:', statsResponse.data);

    // Get recent activities
    const activitiesResponse = await dashboardService.getRecentActivities();
    console.log('Recent activities response:', activitiesResponse.data);

    // Manage money collections
    const collectionsResponse = await dashboardService.getMoneyCollections();
    console.log('Money collections response:', collectionsResponse.data);

    // Add a money collection
    const addCollectionResponse = await dashboardService.addMoneyCollection({
      amount: 100,
      description: 'Test collection',
      category: 'donation',
      date: new Date().toISOString(),
      collectedBy: 'Test User'
    });
    console.log('Add money collection response:', addCollectionResponse.data);

    // Update money collection
    const updateCollectionResponse = await dashboardService.updateMoneyCollection('collectionId', {
      amount: 150,
      description: 'Updated collection'
    });
    console.log('Update money collection response:', updateCollectionResponse.data);

    // Delete money collection
    const deleteCollectionResponse = await dashboardService.deleteMoneyCollection('collectionId');
    console.log('Delete money collection response:', deleteCollectionResponse.data);

    // Get mayyathu data
    const mayyathuResponse = await dashboardService.getMayyathuData();
    console.log('Mayyathu data response:', mayyathuResponse.data);

    // Get monthly donations
    const donationsResponse = await dashboardService.getMonthlyDonations();
    console.log('Monthly donations response:', donationsResponse.data);
  } catch (error) {
    console.error('Dashboard test error:', error);
  }
};

// Test all member endpoints
const testMembers = async () => {
  try {
    // Get all members
    const membersResponse = await memberService.getAll();
    console.log('Members response:', membersResponse.data);

    // Get member by ID
    const memberResponse = await memberService.getById('memberId');
    console.log('Member by ID response:', memberResponse.data);

    // Create member
    const createMemberResponse = await memberService.create({
      fullName: 'Test Member',
      age: 30,
      phone: '1234567890',
      adharNumber: '123456789012',
      registrationNumber: 'REG001',
      houseType: 'owned',
      familyMembersCount: 2,
      familyMembers: [
        { name: 'Spouse', relation: 'wife', age: 28 },
        { name: 'Child', relation: 'son', age: 5 }
      ]
    });
    console.log('Create member response:', createMemberResponse.data);

    // Update member
    const updateMemberResponse = await memberService.update('memberId', {
      fullName: 'Updated Member',
      age: 31
    });
    console.log('Update member response:', updateMemberResponse.data);

    // Update mayyathu status
    const mayyathuStatusResponse = await memberService.updateMayyathuStatus('memberId', true);
    console.log('Update mayyathu status response:', mayyathuStatusResponse.data);

    // Delete member
    const deleteMemberResponse = await memberService.delete('memberId');
    console.log('Delete member response:', deleteMemberResponse.data);
  } catch (error) {
    console.error('Members test error:', error);
  }
};

// Test all user management endpoints
const testUsers = async () => {
  try {
    // Get all users
    const usersResponse = await userService.getAll();
    console.log('Users response:', usersResponse.data);

    // Get user by ID
    const userResponse = await userService.getById('userId');
    console.log('User by ID response:', userResponse.data);

    // Create user
    const createUserResponse = await userService.create({
      name: 'New User',
      email: 'newuser@example.com',
      phone: '1234567890'
    });
    console.log('Create user response:', createUserResponse.data);

    // Update user
    const updateUserResponse = await userService.update('userId', {
      name: 'Updated User',
      email: 'updateduser@example.com'
    });
    console.log('Update user response:', updateUserResponse.data);

    // Delete user
    const deleteUserResponse = await userService.delete('userId');
    console.log('Delete user response:', deleteUserResponse.data);
  } catch (error) {
    console.error('Users test error:', error);
  }
};

// Test profile endpoints
const testProfile = async () => {
  try {
    // Update profile
    const profileResponse = await profileService.update({
      name: 'Updated Name',
      email: 'updated@example.com',
      phone: '1234567890'
    });
    console.log('Profile update response:', profileResponse.data);
  } catch (error) {
    console.error('Profile test error:', error);
  }
};

// Test data endpoints
const testData = async () => {
  try {
    // Get all data
    const dataResponse = await dataService.getAll();
    console.log('Data response:', dataResponse.data);

    // Get data by ID
    const dataByIdResponse = await dataService.getById('dataId');
    console.log('Data by ID response:', dataByIdResponse.data);

    // Create data
    const createDataResponse = await dataService.create({
      title: 'Test Data',
      description: 'This is a test data entry',
      content: 'This contains detailed information about the test data'
    });
    console.log('Create data response:', createDataResponse.data);

    // Update data
    const updateDataResponse = await dataService.update('dataId', {
      title: 'Updated Test Data',
      description: 'This is an updated test data entry'
    });
    console.log('Update data response:', updateDataResponse.data);

    // Delete data
    const deleteDataResponse = await dataService.delete('dataId');
    console.log('Delete data response:', deleteDataResponse.data);
  } catch (error) {
    console.error('Data test error:', error);
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('Starting API functionality tests...');
  
  await testAuth();
  await testDashboard();
  await testMembers();
  await testUsers();
  await testProfile();
  await testData();

  console.log('API functionality tests completed.');
};

export default runAllTests;