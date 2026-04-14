import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { 
  ArrowLeft, 
  Calendar, 
  Banknote, 
  ChevronRight, 
  CheckCircle2 
} from 'lucide-react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useCart } from '../contexts/CartContext';

const { width } = Dimensions.get('window');

// --- Theme Colors ---
const COLORS = {
  background: '#FCFAF7',
  cardBg: '#FFFFFF',
  inputBg: '#EFEFE9',
  primaryYellow: '#FFC444',
  primaryDark: '#33332D',
  textMain: '#1A1A1A',
  textSub: '#666666',
  border: '#EAEAEA',
  activeChip: '#FFC444',
};

const RentalCheckoutScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string; to?: string }>();
  const { cartItems } = useCart();

  const fromDate = params.from ? new Date(params.from) : null;
  const toDate = params.to ? new Date(params.to) : null;

  const durationInDays = (fromDate && toDate) 
    ? Math.max(0, Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)))
    : 3; // fallback

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const dailyTotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const estimatedRental = dailyTotal * durationInDays;
  const totalDeposit = cartItems.reduce((acc, item) => acc + item.deposit, 0);
  const totalPayable = estimatedRental + totalDeposit;
  const advanceToPay = dailyTotal; // Mock advance equal to 1 day's rent

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color={COLORS.textMain} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rental Checkout</Text>
        </View>
        <View style={styles.headerSub}>
          <Calendar color={COLORS.accentBrown} size={18} />
          <Text style={styles.headerSubText}>{cartItems.length} items · {formatDate(fromDate)} → {formatDate(toDate)}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- CUSTOMER DETAILS --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer Details</Text>
          
          <LabeledInput label="NAME" placeholder="Sebin George" />
          <LabeledInput label="PHONE NUMBER" placeholder="+989832983" keyboardType="phone-pad" />
          <LabeledInput label="WHATSAPP NUMBER (OPTIONAL)" placeholder="" keyboardType="phone-pad" />
          <LabeledInput label="ADDRESS" placeholder="" />
        </View>

        {/* --- BOOKING SUMMARY --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Booking Summary</Text>
          <View style={styles.row}>
            <SummaryItem label="TOTAL ITEMS" value={`${cartItems.length} Items`} />
            <SummaryItem label="DURATION" value={`${durationInDays} Days`} />
          </View>
        </View>

        {/* --- PAYMENT DETAILS --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Details</Text>
          <View style={styles.row}>
            <LabeledInput label="ADVANCE TO PAY" placeholder={`₹ ${advanceToPay.toLocaleString()}`} style={{ flex: 1, marginRight: 10 }} />
            <LabeledInput label="SECURITY DEPOSIT" placeholder={`₹ ${totalDeposit.toLocaleString()}`} style={{ flex: 1 }} />
          </View>

          <Text style={styles.inputLabel}>PAYMENT METHOD</Text>
          <View style={styles.chipRow}>
            {['CASH', 'UPI', 'CARD', 'BANK'].map((method) => (
              <TouchableOpacity 
                key={method} 
                style={[styles.chip, paymentMethod === method && styles.activeChip]}
                onPress={() => setPaymentMethod(method)}
              >
                <Text style={[styles.chipText, paymentMethod === method && styles.activeChipText]}>{method}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <LabeledInput label="APPLY DISCOUNT" placeholder="Coupon or Amount" />
        </View>

        {/* --- INSTRUCTIONS --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Instructions</Text>
          <TextInput 
            style={styles.textArea} 
            placeholder="Handling notes or delivery special instructions..." 
            multiline
            placeholderTextColor="#999"
          />
        </View>

        {/* --- TOTALS SUMMARY (Yellow Card) --- */}
        <View style={styles.yellowCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.yellowLabel}>RENTAL SUBTOTAL</Text>
            <Text style={styles.yellowValue}>₹ {estimatedRental.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.yellowLabel}>DEPOSIT TOTAL</Text>
            <Text style={styles.yellowValue}>₹ {totalDeposit.toLocaleString()}</Text>
          </View>
          
          <View style={[styles.summaryRow, { marginTop: 10 }]}>
            <Text style={[styles.yellowLabel, { fontWeight: '800' }]}>TOTAL AMOUNT</Text>
            <Text style={styles.totalAmountText}>₹ {totalPayable.toLocaleString()}</Text>
          </View>

          {/* Advance Highlight Bar */}
          <View style={styles.darkHighlight}>
            <Banknote color="white" size={28} />
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.advanceLabel}>ADVANCE TO PAY</Text>
              <Text style={styles.advanceValue}>₹ {advanceToPay.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* --- FOOTER --- */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={() => router.push({ pathname: '/booking-created', params: { from: params.from, to: params.to } })}
        >
          <Text style={styles.confirmText}>Confirm Payment</Text>
          <Banknote color="white" size={20} />
        </TouchableOpacity>
        <View style={styles.homeIndicator} />
      </View>
    </SafeAreaView>
  );
};

// --- Helper Components ---

const LabeledInput = ({ label, placeholder, style, keyboardType }: any) => (
  <View style={[{ marginBottom: 15 }, style]}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput 
      style={styles.input} 
      placeholder={placeholder} 
      placeholderTextColor="#444" 
      keyboardType={keyboardType}
    />
  </View>
);

const SummaryItem = ({ label, value }: any) => (
  <View style={{ flex: 1 }}>
    <Text style={styles.inputLabel}>{label}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
  </View>
);

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: 'white', paddingBottom: 15 },
  headerTop: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textMain, marginLeft: 10 },
  headerSub: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', marginHorizontal: 0, paddingVertical: 12, paddingHorizontal: 20, marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerSubText: { fontSize: 14, color: COLORS.textMain, marginLeft: 10, fontWeight: '500' },
  
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  
  card: { backgroundColor: COLORS.cardBg, borderRadius: 24, padding: 20, marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textMain, marginBottom: 15 },
  
  inputLabel: { fontSize: 10, fontWeight: '800', color: COLORS.textSub, marginBottom: 8, letterSpacing: 0.5 },
  input: { backgroundColor: COLORS.inputBg, height: 55, borderRadius: 28, paddingHorizontal: 20, fontSize: 16, fontWeight: '600', color: COLORS.textMain },
  
  row: { flexDirection: 'row' },
  summaryValue: { fontSize: 18, fontWeight: '800', color: COLORS.textMain },
  
  chipRow: { flexDirection: 'row', marginBottom: 20 },
  chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#EEE', marginRight: 10 },
  activeChip: { borderColor: COLORS.primaryYellow, backgroundColor: '#FFFDF5' },
  chipText: { fontSize: 11, fontWeight: '800', color: COLORS.textSub },
  activeChipText: { color: COLORS.primaryYellow },
  
  textArea: { backgroundColor: COLORS.inputBg, borderRadius: 20, height: 100, padding: 20, fontSize: 14, color: COLORS.textMain, textAlignVertical: 'top' },
  
  yellowCard: { backgroundColor: COLORS.primaryYellow, borderRadius: 24, padding: 25, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  yellowLabel: { fontSize: 12, fontWeight: '600', color: '#333' },
  yellowValue: { fontSize: 15, fontWeight: '700', color: '#333' },
  totalAmountText: { fontSize: 22, fontWeight: '800', color: 'black' },
  
  darkHighlight: { backgroundColor: COLORS.primaryDark, borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  advanceLabel: { fontSize: 10, fontWeight: '800', color: '#BBB' },
  advanceValue: { fontSize: 26, fontWeight: '800', color: 'white', marginTop: 2 },
  
  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: COLORS.background, paddingHorizontal: 20, paddingVertical: 10 },
  confirmButton: { backgroundColor: COLORS.primaryDark, height: 65, borderRadius: 32, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  confirmText: { color: 'white', fontSize: 18, fontWeight: '700', marginRight: 12 },
  homeIndicator: { width: 120, height: 5, backgroundColor: 'black', borderRadius: 10, alignSelf: 'center', marginTop: 20, marginBottom: 5 },
});

export default RentalCheckoutScreen;
