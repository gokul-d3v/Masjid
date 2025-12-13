import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native';
import { Card as PaperCard, Button as PaperButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar as CalendarIcon, Clock, Sun, MapPin, RotateCcw } from 'lucide-react-native';
import Header from '../components/Header';

const MuslimCalendarScreen = () => {
  const insets = useSafeAreaInsets();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [hijriDate, setHijriDate] = useState('');

  // Helper function to get Hijri date (simplified implementation)
  const getHijriDate = (date: Date) => {
    // This is a simplified implementation
    // In a real app, we'd use a proper Hijri conversion library
    const hijriYears = 1445; // Approximate for 2024
    const hijriMonths = ['Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'];
    const monthIndex = date.getMonth(); // Simplified, not accurate
    return `${date.getDate()} ${hijriMonths[monthIndex]}, ${hijriYears} AH`;
  };

  // Helper function to calculate prayer times based on Indian cities
  const calculatePrayerTimes = (city: string = 'Mumbai') => {
    const today = new Date();

    // Approximate prayer times for major Indian cities based on standard calculations
    // This is still a simplified version - a real app would use a prayer time calculation library
    const prayerTimesByCity: Record<string, any> = {
      'Mumbai': {
        fajr: '5:15 AM',
        sunrise: '6:45 AM',
        dhuhr: '12:25 PM',
        asr: '3:45 PM',
        maghrib: '6:05 PM',
        isha: '7:30 PM',
      },
      'Delhi': {
        fajr: '5:00 AM',
        sunrise: '6:30 AM',
        dhuhr: '12:15 PM',
        asr: '3:30 PM',
        maghrib: '5:50 PM',
        isha: '7:15 PM',
      },
      'Bangalore': {
        fajr: '5:30 AM',
        sunrise: '7:00 AM',
        dhuhr: '12:40 PM',
        asr: '4:00 PM',
        maghrib: '6:20 PM',
        isha: '7:45 PM',
      },
      'Hyderabad': {
        fajr: '5:20 AM',
        sunrise: '6:50 AM',
        dhuhr: '12:30 PM',
        asr: '3:50 PM',
        maghrib: '6:10 PM',
        isha: '7:35 PM',
      },
      'Kolkata': {
        fajr: '4:45 AM',
        sunrise: '6:15 AM',
        dhuhr: '12:05 PM',
        asr: '3:25 PM',
        maghrib: '5:45 PM',
        isha: '7:10 PM',
      },
      'default': {
        fajr: '5:15 AM',
        sunrise: '6:45 AM',
        dhuhr: '12:25 PM',
        asr: '3:45 PM',
        maghrib: '6:05 PM',
        isha: '7:30 PM',
      }
    };

    const times = prayerTimesByCity[city] || prayerTimesByCity['default'];
    return {
      fajr: times.fajr,
      sunrise: times.sunrise,
      dhuhr: times.dhuhr,
      asr: times.asr,
      maghrib: times.maghrib,
      isha: times.isha,
    };
  };

  const [selectedCity, setSelectedCity] = useState('Kochi'); // Default to Kerala city
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [currentPrayer, setCurrentPrayer] = useState<string>('');
  const [nextPrayer, setNextPrayer] = useState<string>('');
  const [nextPrayerTime, setNextPrayerTime] = useState<string>('');

  // Prayer info with Arabic names - removing the icon property since it was causing errors
  const prayerInfo: Record<string, { name: string; arabic: string; description: string }> = {
    fajr: { name: 'Fajr', arabic: 'الفجر', description: 'Dawn prayer' },
    sunrise: { name: 'Sunrise', arabic: 'الشروق', description: 'Sunrise time' },
    dhuhr: { name: 'Dhuhr', arabic: 'الظهر', description: 'Midday prayer' },
    asr: { name: 'Asr', arabic: 'العصر', description: 'Afternoon prayer' },
    maghrib: { name: 'Maghrib', arabic: 'المغرب', description: 'Sunset prayer' },
    isha: { name: 'Isha', arabic: 'العشاء', description: 'Night prayer' }
  };

  // Helper function to get Arabic name for a prayer
  const getArabicName = (prayer: string): string => {
    const key = prayer.toLowerCase();
    if (key in prayerInfo) {
      return prayerInfo[key].arabic;
    }
    return '';
  };

  useEffect(() => {
    setHijriDate(getHijriDate(currentDate));
    fetchPrayerTimes(selectedCity);
  }, [currentDate, selectedCity]);

  // Update timer every minute
  useEffect(() => {
    if (prayerTimes) {
      updatePrayerStatus();
      const interval = setInterval(() => {
        updatePrayerStatus();
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [prayerTimes]);

  // Function to fetch real-time prayer times from Al-Adhan API
  const fetchPrayerTimes = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      // Map Kerala city names to the format expected by the API
      const cityMapping: Record<string, string> = {
        'Kochi': 'Kochi',
        'Thiruvananthapuram': 'Thiruvananthapuram',
        'Kozhikode': 'Kozhikode',
        'Thrissur': 'Thrissur',
        'Kannur': 'Kannur'
      };

      // For simplicity, we'll use generic India coordinates as the API has limited city support
      // In a real app, we'd use exact coordinates for each Kerala city
      let coordinates: { latitude: number, longitude: number } | null = null;

      switch (city) {
        case 'Kochi':
          coordinates = { latitude: 9.9312, longitude: 76.2673 };
          break;
        case 'Thiruvananthapuram':
          coordinates = { latitude: 8.5241, longitude: 76.9366 };
          break;
        case 'Kozhikode':
          coordinates = { latitude: 11.2588, longitude: 75.7804 };
          break;
        case 'Thrissur':
          coordinates = { latitude: 10.5276, longitude: 76.2144 };
          break;
        case 'Kannur':
          coordinates = { latitude: 11.8742, longitude: 75.3636 };
          break;
        default:
          coordinates = { latitude: 9.9312, longitude: 76.2673 }; // Default to Kochi
      }

      // Using Al-Adhan API with coordinates
      const response = await fetch(
        `http://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=India&method=3`
      );

      if (!response.ok) {
        // If city API fails, try with coordinates
        const coordResponse = await fetch(
          `http://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&method=3`
        );

        if (!coordResponse.ok) {
          throw new Error('Failed to fetch prayer times');
        }

        const data = await coordResponse.json();
        if (data.code !== 200) {
          throw new Error(data.data || 'API error occurred');
        }

        setPrayerTimes(mapPrayerTimes(data.data.timings));
        return;
      }

      const data = await response.json();
      if (data.code !== 200) {
        throw new Error(data.data || 'API error occurred');
      }

      setPrayerTimes(mapPrayerTimes(data.data.timings));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching prayer times');
      // Fallback to manual calculation
      setPrayerTimes(calculatePrayerTimes(city));
      console.error('Error fetching prayer times:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to map API response to our format
  const mapPrayerTimes = (apiTimings: any) => {
    return {
      fajr: apiTimings.fajr || apiTimings.Fajr || '',
      sunrise: apiTimings.sunrise || apiTimings.Sunrise || '',
      dhuhr: apiTimings.dhuhr || apiTimings.Dhuhr || '',
      asr: apiTimings.asr || apiTimings.Asr || '',
      maghrib: apiTimings.maghrib || apiTimings.Maghrib || '',
      isha: apiTimings.isha || apiTimings.Isha || '',
    };
  };

  // Function to determine current and next prayer
  const getCurrentAndNextPrayer = () => {
    if (!prayerTimes) return null;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute; // Convert to minutes for easier comparison

    // Convert prayer times to minutes
    const parseTime = (timeString: string) => {
      if (!timeString) return 0;
      const [time, modifier] = timeString.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (modifier === 'PM' && hours !== 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      return hours * 60 + minutes;
    };

    const prayerTimesArray = [
      { name: 'Fajr', time: parseTime(prayerTimes.fajr), arabic: 'الفجر' },
      { name: 'Sunrise', time: parseTime(prayerTimes.sunrise), arabic: 'الشروق' },
      { name: 'Dhuhr', time: parseTime(prayerTimes.dhuhr), arabic: 'الظهر' },
      { name: 'Asr', time: parseTime(prayerTimes.asr), arabic: 'العصر' },
      { name: 'Maghrib', time: parseTime(prayerTimes.maghrib), arabic: 'المغرب' },
      { name: 'Isha', time: parseTime(prayerTimes.isha), arabic: 'العشاء' },
    ];

    // Find current prayer (the last prayer that has passed)
    let currentPrayer = prayerTimesArray[0]; // Default to Fajr if before any prayer
    let nextPrayer = prayerTimesArray[0]; // Default to Fajr if no remaining prayers

    for (let i = 0; i < prayerTimesArray.length; i++) {
      if (currentTime >= prayerTimesArray[i].time) {
        currentPrayer = prayerTimesArray[i];
      } else {
        nextPrayer = prayerTimesArray[i];
        break;
      }
    }

    // Calculate time remaining for next prayer
    let timeRemaining = 0;
    if (nextPrayer) {
      timeRemaining = nextPrayer.time - currentTime;
      if (timeRemaining < 0) {
        // If time is negative, it means next prayer is tomorrow
        timeRemaining = 24 * 60 + timeRemaining;
      }
    }

    const hoursRemaining = Math.floor(timeRemaining / 60);
    const minutesRemaining = timeRemaining % 60;

    return {
      current: currentPrayer,
      next: nextPrayer,
      timeRemaining: `${hoursRemaining}h ${minutesRemaining}m`
    };
  };

  // Function to update current prayer status and countdown
  const updatePrayerStatus = () => {
    if (!prayerTimes) return;

    const prayerData = getCurrentAndNextPrayer();
    if (prayerData) {
      setCurrentPrayer(prayerData.current.name);
      setNextPrayer(prayerData.next.name);

      // Map prayer name to time
      const timeMap: Record<string, string> = {
        'Fajr': prayerTimes.fajr,
        'Sunrise': prayerTimes.sunrise,
        'Dhuhr': prayerTimes.dhuhr,
        'Asr': prayerTimes.asr,
        'Maghrib': prayerTimes.maghrib,
        'Isha': prayerTimes.isha
      };

      setNextPrayerTime(timeMap[prayerData.next.name] || '');
      setTimeRemaining(prayerData.timeRemaining);
    }
  };

  // Function to refresh prayer times
  const refreshPrayerTimes = () => {
    fetchPrayerTimes(selectedCity);
    Alert.alert('Info', 'Updating prayer times for ' + selectedCity + '...');
  };

  // Function to get user's location (simplified - in a real app we'd use react-native-geolocation)
  const getUserLocation = () => {
    // This is a simplified implementation
    // In a real app, we would use the Geolocation API or a geolocation library
    // For now, we'll just set to Mumbai as default for India
    setSelectedCity('Mumbai');
    Alert.alert('Location', 'Location set to Mumbai (default for India)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header
          title="Muslim Calendar"
          subtitle="Islamic dates and prayer times"
        />

        {/* Location Card */}
        <PaperCard style={styles.locationCard}>
          <View style={styles.locationContent}>
            <View style={styles.locationHeader}>
              <MapPin size={20} color="#025937" />
              <Text style={styles.locationTitle}>Current Location</Text>
            </View>
            <View style={styles.locationSelection}>
              <Text style={styles.locationText}>City: <Text style={styles.selectedCity}>{selectedCity}</Text></Text>
              <View style={styles.locationButtons}>
                <PaperButton
                  mode="outlined"
                  onPress={getUserLocation}
                  style={styles.locationButton}
                >
                  <Text style={styles.buttonText}>Use My Location</Text>
                </PaperButton>
                <PaperButton
                  mode="outlined"
                  onPress={() => {
                    // In a real app, this would open a city selection modal
                    // For now, let's just cycle through Kerala cities
                    const cities = ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kannur'];
                    const currentIndex = cities.indexOf(selectedCity);
                    const nextIndex = (currentIndex + 1) % cities.length;
                    setSelectedCity(cities[nextIndex]);
                  }}
                  style={styles.locationButton}
                >
                  <Text style={styles.buttonText}>Change City</Text>
                </PaperButton>
              </View>
            </View>
          </View>
        </PaperCard>

        {/* Date Display */}
        <PaperCard style={styles.dateCard}>
          <View style={styles.dateContent}>
            <View style={styles.dateIconContainer}>
              <CalendarIcon size={24} color="#025937" />
            </View>
            <View style={styles.dateTextContainer}>
              <Text style={styles.gregorianDate}>
                {currentDate.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
              <Text style={styles.hijriDate}>
                {hijriDate}
              </Text>
            </View>
          </View>
        </PaperCard>

        {/* Prayer Times */}
        <PaperCard style={styles.prayerCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderContent}>
              <Clock size={20} color="#025937" />
              <Text style={styles.cardTitle}>Prayer Times</Text>
            </View>
            <PaperButton mode="text" onPress={refreshPrayerTimes} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#2563eb" />
              ) : (
                <View style={styles.refreshButtonContent}>
                  <RotateCcw size={16} color="#2563eb" />
                  <Text style={styles.refreshText}>Refresh</Text>
                </View>
              )}
            </PaperButton>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#025937" />
              <Text style={styles.loadingText}>Fetching prayer times...</Text>
            </View>
          ) : prayerTimes && (
            <View style={styles.prayerTimesContainer}>
              {/* Next Prayer Indicator */}
              <View style={styles.nextPrayerContainer}>
                {currentPrayer && nextPrayer && (
                  <>
                    <Text style={styles.nextPrayerLabel}>Current: {currentPrayer} ({getArabicName(currentPrayer)})</Text>
                    <Text style={styles.nextPrayerLabel}>Next Prayer</Text>
                    <View style={styles.nextPrayerCard}>
                      <Text style={styles.nextPrayerName}>{nextPrayer} ({getArabicName(nextPrayer)})</Text>
                      <Text style={styles.prayerTime}>{nextPrayerTime}</Text>
                      <Text style={styles.timeRemaining}>In {timeRemaining}</Text>
                    </View>
                  </>
                )}
              </View>

              <View style={styles.prayerRow}>
                <View style={styles.prayerIconContainer}>
                  <Sun size={20} color="#F59E0B" />
                </View>
                <View style={styles.prayerTextContainer}>
                  <Text style={styles.prayerName}>Fajr (الفجر)</Text>
                  <Text style={styles.prayerTime}>{prayerTimes.fajr}</Text>
                </View>
              </View>

              <View style={styles.prayerRow}>
                <View style={styles.prayerIconContainer}>
                  <Sun size={20} color="#EF4444" />
                </View>
                <View style={styles.prayerTextContainer}>
                  <Text style={styles.prayerName}>Sunrise (الشروق)</Text>
                  <Text style={styles.prayerTime}>{prayerTimes.sunrise}</Text>
                </View>
              </View>

              <View style={styles.prayerRow}>
                <View style={styles.prayerIconContainer}>
                  <Sun size={20} color="#025937" />
                </View>
                <View style={styles.prayerTextContainer}>
                  <Text style={styles.prayerName}>Dhuhr (الظهر)</Text>
                  <Text style={styles.prayerTime}>{prayerTimes.dhuhr}</Text>
                </View>
              </View>

              <View style={styles.prayerRow}>
                <View style={styles.prayerIconContainer}>
                  <Sun size={20} color="#8B5CF6" />
                </View>
                <View style={styles.prayerTextContainer}>
                  <Text style={styles.prayerName}>Asr (العصر)</Text>
                  <Text style={styles.prayerTime}>{prayerTimes.asr}</Text>
                </View>
              </View>

              <View style={styles.prayerRow}>
                <View style={styles.prayerIconContainer}>
                  <Sun size={20} color="#F59E0B" />
                </View>
                <View style={styles.prayerTextContainer}>
                  <Text style={styles.prayerName}>Maghrib (المغرب)</Text>
                  <Text style={styles.prayerTime}>{prayerTimes.maghrib}</Text>
                </View>
              </View>

              <View style={styles.prayerRow}>
                <View style={styles.prayerIconContainer}>
                  <Sun size={20} color="#3B82F6" />
                </View>
                <View style={styles.prayerTextContainer}>
                  <Text style={styles.prayerName}>Isha (العشاء)</Text>
                  <Text style={styles.prayerTime}>{prayerTimes.isha}</Text>
                </View>
              </View>
            </View>
          )}
        </PaperCard>

        {/* Hijri Calendar Preview */}
        <PaperCard style={styles.calendarCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderContent}>
              <CalendarIcon size={20} color="#025937" />
              <Text style={styles.cardTitle}>Islamic Calendar</Text>
            </View>
          </View>

          <View style={styles.calendarContent}>
            <Text style={styles.calendarInfo}>
              Islamic months follow the lunar cycle. Each month begins with the sighting of the new moon.
            </Text>
            <View style={styles.monthGrid}>
              {['Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani'].map((month, index) => (
                <View key={index} style={styles.monthItem}>
                  <Text style={styles.monthText}>{month}</Text>
                </View>
              ))}
            </View>
          </View>
        </PaperCard>

        {/* Important Islamic Events */}
        <PaperCard style={styles.eventsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderContent}>
              <CalendarIcon size={20} color="#025937" />
              <Text style={styles.cardTitle}>Upcoming Events</Text>
            </View>
          </View>

          <View style={styles.eventsContainer}>
            <View style={styles.eventRow}>
              <Text style={styles.eventDate}>Dec 20</Text>
              <Text style={styles.eventName}>Eid Milad un Nabi</Text>
            </View>
            <View style={styles.eventRow}>
              <Text style={styles.eventDate}>Jan 10</Text>
              <Text style={styles.eventName}>Ashura</Text>
            </View>
            <View style={styles.eventRow}>
              <Text style={styles.eventDate}>Mar 25</Text>
              <Text style={styles.eventName}>Month of Ramadan begins</Text>
            </View>
          </View>
        </PaperCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: 0,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  locationCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  locationContent: {},
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  locationSelection: {},
  locationText: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 12,
  },
  selectedCity: {
    fontWeight: 'bold',
    color: '#025937',
  },
  locationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#059669',
    fontSize: 12,
  },
  dateCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIconContainer: {
    marginRight: 16,
  },
  dateTextContainer: {},
  gregorianDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  hijriDate: {
    fontSize: 16,
    color: '#025937',
    fontWeight: '500',
  },
  prayerCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  refreshText: {
    color: '#2563eb',
    fontSize: 14,
  },
  prayerTimesContainer: {},
  prayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  prayerIconContainer: {
    marginRight: 16,
    width: 32,
    alignItems: 'center',
  },
  prayerTextContainer: {
    flex: 1,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  prayerTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  nextPrayerContainer: {
    marginBottom: 16,
  },
  nextPrayerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  nextPrayerCard: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextPrayerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#025937',
  },
  timeRemaining: {
    fontSize: 14,
    color: '#025937',
    fontWeight: '500',
  },
  refreshButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6b7280',
  },
  calendarCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  calendarContent: {},
  calendarInfo: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthItem: {
    backgroundColor: '#f0fdf4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  monthText: {
    fontSize: 12,
    color: '#025937',
    fontWeight: '500',
  },
  eventsCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  eventsContainer: {},
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  eventDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    minWidth: 60,
  },
  eventName: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
});

export default MuslimCalendarScreen;