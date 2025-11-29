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
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const DashboardScreen = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMoneyCollected: 0,
    mayyathuFundCollected: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint after backend setup
      // const response = await axios.get('http://localhost:5000/dashboard/stats', {
      //   headers: {
      //     Authorization: `Bearer ${/* token from auth store */ ''}`,
      //   },
      // });
      // For now, using mock data
      setStats({
        totalUsers: 125,
        totalMoneyCollected: 250000,
        mayyathuFundCollected: 75000,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddCollection = () => {
    Alert.alert('Info', 'Add collection functionality would be implemented here');
  };

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
            source={require('../assets/Splash.png')}
            style={styles.banner}
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome to your admin panel</Text>
        </View>

        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statCard} onPress={() => Alert.alert('Total Users', `Total: ${stats.totalUsers}`)}>
            <Text style={styles.statValue}>{stats.totalUsers || 0}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statCard} onPress={() => Alert.alert('Total Money Collected', `Amount: ₹${(stats.totalMoneyCollected || 0).toLocaleString()}`)}>
            <Text style={styles.statValue}>
              ₹{(stats.totalMoneyCollected || 0).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Total Money Collected</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statCard} onPress={() => Alert.alert('Mayyathu Fund', `Amount: ₹${(stats.mayyathuFundCollected || 0).toLocaleString()}`)}>
            <Text style={styles.statValue}>
              ₹{(stats.mayyathuFundCollected || 0).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Mayyathu Fund</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAddCollection}>
            <Text style={styles.actionButtonText}>Add Collection</Text>
          </TouchableOpacity>
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
    width: width * 0.6, // Responsive to screen width
    height: width * 0.6, // Keep it circular
    borderRadius: (width * 0.6) / 2, // Perfect circle
    borderWidth: 4,
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
    alignItems: 'center',
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
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'column',
    paddingHorizontal: 15,
    gap: 15,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0D6D3F',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  actionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#0D6D3F',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#0D6D3F',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen;