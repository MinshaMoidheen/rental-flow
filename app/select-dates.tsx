import React, { useState, createElement } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { ArrowLeft, Calendar, Check, ArrowRight } from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';
import DatePickerModal from '../components/DatePickerModal';

const { width } = Dimensions.get('window');

// Helper to avoid timezone offset bugs that make 15th show as 14th
const toLocalDateString = (date?: Date | null) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Web-only explicit input renderer that floats invisibly over the native components
const WebDatePickerOverlay = ({ value, onChange, minDate }: { value: Date | null, onChange: (d: Date) => void, minDate?: Date | null }) => {
  if (Platform.OS !== 'web') return null;
  return createElement('input', {
    type: 'date',
    value: toLocalDateString(value),
    min: toLocalDateString(minDate),
    onClick: (e: any) => {
      try {
        if (e.target.showPicker) e.target.showPicker();
      } catch (err) {}
    },
    onChange: (e: any) => {
      if (e.target.value) {
        const parts = e.target.value.split('-');
        if (parts.length === 3) {
          onChange(new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
        }
      }
    },
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      cursor: 'pointer',
      zIndex: 10,
    }
  });
};

// --- Theme Colors ---
const COLORS = {
  primary: '#FFC444',
  textMain: '#333333',
  textSub: '#666666',
  accentBrown: '#745E2F',
  inputBg: '#EFEFE9',
  cardBg: '#F8F8F8',
  buttonDark: '#33332D',
  background: '#FFFFFF',
  bottomBg: '#FCFBF7',
};

const SelectDatesScreen = () => {
  const router = useRouter();

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const handleConfirmFrom = (selectedDate: Date) => {
    setShowFromPicker(false);
    setFromDate(selectedDate);
    if (toDate && selectedDate > toDate) {
      setToDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
    }
  };

  const handleConfirmTo = (selectedDate: Date) => {
    setShowToPicker(false);
    setToDate(selectedDate);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const durationInDays = (fromDate && toDate) 
    ? Math.max(0, Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)))
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color={COLORS.textMain} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Dates</Text>
        </View>

        <Text style={styles.subtitle}>
          Choose the rental period to check available items
        </Text>

        {/* --- DATE SELECTION CARD --- */}
        <View style={styles.selectionCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>FROM DATE</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowFromPicker(true)}>
              <Calendar color={COLORS.accentBrown} size={22} strokeWidth={2.5} />
              <Text style={styles.dateText}>{formatDate(fromDate)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>TO DATE</Text>
            <TouchableOpacity style={[styles.dateInput, styles.activeInput]} onPress={() => setShowFromPicker(true)}>
              <Calendar color={COLORS.accentBrown} size={22} strokeWidth={2.5} />
              <Text style={styles.dateText}>{formatDate(toDate)}</Text>
            </TouchableOpacity>
          </View>



          {/* SUMMARY PILL */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryYellowBar} />
            <View style={styles.summaryContent}>
              <View>
                {fromDate && toDate ? (
                  <>
                    <Text style={styles.summaryRangeText}>{formatDate(fromDate)} → {formatDate(toDate)}</Text>
                    <Text style={styles.summaryDurationText}>RENTAL DURATION: {durationInDays} DAY{durationInDays !== 1 ? 'S' : ''}</Text>
                  </>
                ) : (
                  <Text style={styles.summaryRangeText}>Select Dates For Rental</Text>
                )}
              </View>
              <View style={[styles.checkCircle, { backgroundColor: fromDate && toDate ? '#F9F1E2' : '#F5F5F5' }]}>
                <Check color={fromDate && toDate ? COLORS.accentBrown : '#CCC'} size={16} strokeWidth={3} />
              </View>
            </View>
          </View>
        </View>

        {/* --- BANNER SECTION --- */}
        <ImageBackground
          source={require('../assets/images/img1.png')}
          style={styles.bannerImage}
          imageStyle={{ borderRadius: 24 }}
        >
          <View style={styles.bannerOverlay}>
            <View style={styles.curatedPill}>
              <Text style={styles.curatedSubText}>CURATED SELECTION</Text>
              <Text style={styles.curatedMainText}>Browse 240+ Premium Items</Text>
            </View>
          </View>
        </ImageBackground>

      </ScrollView>

      {/* --- BOTTOM ACTION BUTTON --- */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={() => {
            router.push({
              pathname: '/select-category',
              params: {
                from: fromDate?.toISOString(),
                to: toDate?.toISOString(),
              }
            });
          }}
        >
          <Text style={styles.continueButtonText}>Continue to Categories</Text>
          <ArrowRight color="white" size={20} />
        </TouchableOpacity>
        {/* Home Indicator Spacer for iOS */}
        <View style={styles.homeIndicator} />
      </View>

      <DatePickerModal 
        visible={showFromPicker}
        initialFrom={fromDate}
        initialTo={toDate}
        onClose={() => setShowFromPicker(false)}
        onApply={(start: Date, end: Date) => {
          setFromDate(start);
          setToDate(end);
          setShowFromPicker(false);
        }} 
      />
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSub,
    lineHeight: 22,
    marginBottom: 25,
  },
  selectionCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSub,
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  dateInput: {
    backgroundColor: COLORS.inputBg,
    height: 58,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  activeInput: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  dateText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#444',
    marginLeft: 12,
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: 75,
    flexDirection: 'row',
    overflow: 'hidden',
    marginTop: 10,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  summaryYellowBar: {
    width: 6,
    height: '60%',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignSelf: 'center',
    marginLeft: 2,
  },
  summaryContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  summaryRangeText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.accentBrown,
  },
  summaryDurationText: {
    fontSize: 12,
    color: COLORS.textSub,
    fontWeight: '600',
    marginTop: 4,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9F1E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  curatedPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 35,
    alignItems: 'center',
    width: '80%',
  },
  curatedSubText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSub,
    letterSpacing: 1,
    marginBottom: 4,
  },
  curatedMainText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  bottomContainer: {
    backgroundColor: COLORS.bottomBg,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  continueButton: {
    backgroundColor: COLORS.buttonDark,
    height: 65,
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 10,
  },
  homeIndicator: {
    width: 120,
    height: 5,
    backgroundColor: 'black',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
});

export default SelectDatesScreen;
