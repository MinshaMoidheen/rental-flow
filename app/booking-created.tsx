import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import {
  ArrowLeft,
  Check,
  MessageSquare,
  Calendar,
  Home,
  CalendarDays,
  Package,
  ShoppingCart,
} from 'lucide-react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useCart } from '../contexts/CartContext';
import BottomNavBar from '../components/BottomNavBar';

const { width } = Dimensions.get('window');

// --- Theme Colors ---
const COLORS = {
  background: '#FCFAF7',
  white: '#FFFFFF',
  textMain: '#1A1A1A',
  textSub: '#666666',
  primaryDark: '#33332D',
  primaryYellow: '#FFC444',
  successGreen: '#27AE60',
  successBg: '#E8F6EF',
  cardGray: '#F3F3ED',
  accentBrown: '#745E2F',
};

const BookingCreatedScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string; to?: string }>();
  const { cartItems } = useCart();

  const fromDate = params.from ? new Date(params.from) : null;
  const toDate = params.to ? new Date(params.to) : null;

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };
  const datesText = (fromDate && toDate) ? `${formatDate(fromDate)} → ${formatDate(toDate)}` : 'No dates selected';

  const durationInDays = (fromDate && toDate) 
    ? Math.max(0, Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)))
    : 3;

  const dailyTotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const estimatedRental = dailyTotal * durationInDays;
  const totalDeposit = cartItems.reduce((acc, item) => acc + item.deposit, 0);
  const totalPayable = estimatedRental + totalDeposit;
  const advanceToPay = dailyTotal;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.textMain} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Created</Text>
        <View style={{ width: 40 }} /> {/* Spacer for centering */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- MAIN SUCCESS CARD --- */}
        <View style={styles.successCard}>
          <View style={styles.checkCircle}>
            <View style={styles.innerCheck}>
               <Check color="white" size={24} strokeWidth={4} />
            </View>
          </View>

          <Text style={styles.successHeading}>Booking Created Successfully</Text>
          
          <View style={styles.idPill}>
            <Text style={styles.idPillText}>RF-{Math.floor(Math.random() * 9000) + 1000}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsGrid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>CUSTOMER</Text>
              <Text style={styles.gridValue}>Sebin George</Text>
            </View>
            <View style={[styles.gridItem, { alignItems: 'flex-end' }]}>
              <Text style={styles.gridLabel}>TOTAL AMOUNT</Text>
              <Text style={styles.gridValue}>₹{totalPayable.toLocaleString()}</Text>
            </View>
            <View style={[styles.gridItem, { marginTop: 20 }]}>
              <Text style={styles.gridLabel}>DATES</Text>
              <Text style={styles.gridValue}>{datesText}</Text>
            </View>
            <View style={[styles.gridItem, { marginTop: 20, alignItems: 'flex-end' }]}>
              <Text style={styles.gridLabel}>SECURITY DEPOSIT</Text>
              <Text style={styles.gridValue}>₹{totalDeposit.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* --- ACTION BUTTONS --- */}
        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push({ pathname: '/review-booking', params: { from: params.from, to: params.to } })}>
            <Text style={styles.primaryBtnText}>View Booking</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn}>
            <MessageSquare color={COLORS.textMain} size={20} style={{ marginRight: 10 }} />
            <Text style={styles.secondaryBtnText}>Send WhatsApp Confirmation</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backLink} onPress={() => router.push('/')}>
            <Text style={styles.backLinkText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        {/* --- RENTAL INVENTORY SUMMARY --- */}
        <View style={styles.inventoryCard}>
          <Text style={styles.inventoryTitle}>RENTAL INVENTORY</Text>
          
          <View style={[styles.inventoryRow, { flexWrap: 'wrap', gap: 10 }]}>
            {cartItems.map((item, idx) => (
              <InventoryItem 
                 key={idx}
                 category={item.category.toUpperCase().substring(0, 10)} 
                 name={item.title.substring(0, 12) + (item.title.length > 12 ? '...' : '')} 
                 image={item.image} 
              />
            ))}
          </View>

          <View style={styles.inventoryFooter}>
            <View>
              <Text style={styles.statusLabel}>PAYMENT STATUS</Text>
              <View style={styles.row}>
                <View style={[styles.dot, { backgroundColor: COLORS.primaryYellow }]} />
                <Text style={styles.statusMain}>Advance Paid</Text>
              </View>
              <Text style={styles.statusSub}>Advance: ₹{advanceToPay.toLocaleString()}</Text>
            </View>

            <View style={styles.reminderPill}>
              <Text style={styles.reminderLabel}>PICKUP REMINDER</Text>
              <View style={styles.row}>
                <Calendar color={COLORS.textMain} size={14} />
                <Text style={styles.reminderTime}>{formatDate(fromDate) || 'Next Week'}, 10:00 AM</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* --- BOTTOM NAVIGATION --- */}
      <BottomNavBar />
    </SafeAreaView>
  );
};

// --- Helper Components ---

const InventoryItem = ({ category, name, image }: any) => (
  <View style={styles.itemBox}>
    <Image source={Number(image) || { uri: image }} style={styles.itemImage} />
    <View style={{ marginLeft: 10 }}>
      <Text style={styles.itemCategory}>{category}</Text>
      <Text style={styles.itemName}>{name}</Text>
    </View>
  </View>
);



// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textMain },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  
  scrollContent: { paddingHorizontal: 25, paddingTop: 10 },
  
  successCard: { backgroundColor: COLORS.white, borderRadius: 40, padding: 30, alignItems: 'center', marginBottom: 30 },
  checkCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.successBg, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  innerCheck: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.successGreen, justifyContent: 'center', alignItems: 'center' },
  successHeading: { fontSize: 24, fontWeight: '800', textAlign: 'center', color: COLORS.textMain, lineHeight: 30 },
  idPill: { backgroundColor: '#F0F0F0', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 15, marginTop: 15 },
  idPillText: { fontSize: 14, fontWeight: '700', color: COLORS.textSub, letterSpacing: 1 },
  divider: { width: '100%', height: 1, backgroundColor: '#F0F0F0', marginVertical: 25 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%' },
  gridItem: { width: '50%' },
  gridLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textSub, letterSpacing: 0.5, marginBottom: 4 },
  gridValue: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },

  buttonSection: { width: '100%', alignItems: 'center' },
  primaryBtn: { backgroundColor: COLORS.primaryDark, width: '100%', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  primaryBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
  secondaryBtn: { backgroundColor: COLORS.white, width: '100%', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderWidth: 1, borderColor: '#EEE' },
  secondaryBtnText: { color: COLORS.textMain, fontSize: 16, fontWeight: '700' },
  backLink: { marginTop: 20 },
  backLinkText: { fontSize: 15, fontWeight: '700', color: COLORS.textSub },

  inventoryCard: { backgroundColor: COLORS.cardGray, borderRadius: 30, padding: 20, marginTop: 35 },
  inventoryTitle: { fontSize: 11, fontWeight: '800', color: COLORS.textSub, letterSpacing: 1, marginBottom: 15 },
  inventoryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  itemBox: { backgroundColor: COLORS.white, borderRadius: 15, padding: 8, flexDirection: 'row', alignItems: 'center', width: '48%' },
  itemImage: { width: 40, height: 40, borderRadius: 8 },
  itemCategory: { fontSize: 9, fontWeight: '800', color: COLORS.primaryYellow },
  itemName: { fontSize: 11, fontWeight: '700', color: COLORS.textMain, marginTop: 2 },

  inventoryFooter: { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  statusLabel: { fontSize: 10, fontWeight: '800', color: COLORS.textSub, marginBottom: 5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusMain: { fontSize: 13, fontWeight: '700', color: COLORS.textMain },
  statusSub: { fontSize: 11, color: COLORS.textSub, marginTop: 2 },
  reminderPill: { backgroundColor: COLORS.primaryYellow, borderRadius: 15, paddingHorizontal: 12, paddingVertical: 10 },
  reminderLabel: { fontSize: 9, fontWeight: '800', color: COLORS.accentBrown, marginBottom: 4 },
  reminderTime: { fontSize: 11, fontWeight: '800', color: COLORS.textMain, marginLeft: 5 },



});

export default BookingCreatedScreen;
