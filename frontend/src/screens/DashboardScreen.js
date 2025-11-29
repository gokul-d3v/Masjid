import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import axios from 'axios';

const DashboardScreen = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMoneyCollected: 0,
    mayyathuFundCollected: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get('http://localhost:5000/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${/* token from auth store */ ''}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchDashboardData} />
        }
      >
        {/* Circular splash banner at the top */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('../assets/Splash.png')} // Update this path to your splash image
            style={styles.banner}
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome to your admin panel</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalUsers || 0}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              ₹{(stats.totalMoneyCollected || 0).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Total Money Collected</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              ₹{(stats.mayyathuFundCollected || 0).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Mayyathu Fund</Text>
          </View>
        </View>

        {/* More dashboard content can be added here */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  bannerContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  banner: {
    width: 250,
    height: 250,
    borderRadius: 125, // Makes it circular
    borderWidth: 5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20.0,
    elevation: 24,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0D6D3F',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default DashboardScreen;