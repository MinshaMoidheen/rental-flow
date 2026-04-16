import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import {
  ArrowLeft,
  Calendar,
  ShoppingBag,
  UserCircle2,
  Wallet,
  FileText,
  Home,
  LayoutGrid,
  Package,
  ShoppingCart,
  MapPin,
  Phone,
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
  accentBrown: '#8B5E3C', // Used for "Edit" and Deposit text
  primaryYellow: '#FFC444',
  border: '#F0F0F0',
  iconBg: '#F9F1E2',
  negative: '#E74C3C',
};

const ReviewBookingScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string; to?: string }>();
  const { cartItems } = useCart();

  const fromDate = params.from ? new Date(params.from) : null;
  const toDate = params.to ? new Date(params.to) : null;

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const durationInDays = (fromDate && toDate) 
    ? Math.max(0, Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)))
    : 3; // fallback
    
  const dailyTotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const estimatedRental = dailyTotal * durationInDays;
  const totalDeposit = cartItems.reduce((acc, item) => acc + item.deposit, 0);
  const advanceReceived = dailyTotal; 
  const balanceDue = (estimatedRental + totalDeposit) - advanceReceived;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.primaryYellow} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Booking</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- SECTION: RENTAL DATES --- */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Calendar color={COLORS.accentBrown} size={20} />
            </View>
            <Text style={styles.sectionLabel}>RENTAL DATES</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.largeDate}>
              {formatDate(fromDate) || '30 Mar 2026'} <Text style={{ color: '#CCC' }}>→</Text> {formatDate(toDate) || '2 Apr 2026'}
            </Text>
            <Text style={styles.durationLabel}>{durationInDays} Days Duration</Text>
          </View>
        </View>

        {/* --- SECTION: SELECTED PRODUCTS --- */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <ShoppingBag color={COLORS.accentBrown} size={20} />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.sectionLabel}>SELECTED PRODUCTS</Text>
                <Text style={styles.subLabel}>{cartItems.length} Items Total</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => router.push({ pathname: '/cart', params })}><Text style={styles.editText}>Edit</Text></TouchableOpacity>
          </View>

          <View style={styles.productList}>
            {cartItems.map((item, index) => (
              <ProductItem 
                key={index}
                title={item.title}
                category={item.category.toUpperCase()}
                price={`₹${item.price.toLocaleString()}/day`}
                deposit={`₹${item.deposit.toLocaleString()}`}
                image={item.image}
              />
            ))}
          </View>
        </View>

        {/* --- SECTION: CUSTOMER DETAILS --- */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <UserCircle2 color={COLORS.accentBrown} size={20} />
              </View>
              <Text style={[styles.sectionLabel, { marginLeft: 12 }]}>CUSTOMER DETAILS</Text>
            </View>
            <TouchableOpacity><Text style={styles.editText}>Edit</Text></TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.customerName}>Sebin George</Text>
            <View style={[styles.row, { marginTop: 6 }]}>
              <Phone size={14} color={COLORS.textSub} style={{ marginRight: 6 }} />
              <Text style={styles.customerDetailText}>+91 98765 43210</Text>
            </View>
            <View style={[styles.row, { marginTop: 4 }]}>
              <MapPin size={14} color={COLORS.textSub} style={{ marginRight: 6 }} />
              <Text style={styles.customerDetailText}>Kochi, Kerala</Text>
            </View>
          </View>
        </View>

        {/* --- SECTION: PAYMENT SUMMARY --- */}
        <View style={styles.summaryCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <Wallet color={COLORS.accentBrown} size={20} />
              </View>
              <Text style={[styles.sectionLabel, { marginLeft: 12 }]}>PAYMENT SUMMARY</Text>
            </View>
            <TouchableOpacity><Text style={styles.editText}>Edit</Text></TouchableOpacity>
          </View>
          
          <View style={styles.summaryRows}>
            <SummaryRow label="Rental Subtotal" value={`₹${estimatedRental.toLocaleString()}`} isNegative={false} />
            <SummaryRow label="Security Deposit" value={`₹${totalDeposit.toLocaleString()}`} isNegative={false} />
            <SummaryRow label="Advance Received" value={`- ₹${advanceReceived.toLocaleString()}`} isNegative />
          </View>

          <View style={styles.divider} />

          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Balance Due</Text>
            <Text style={styles.balanceValue}>₹{balanceDue.toLocaleString()}</Text>
          </View>

          <View style={styles.methodPill}>
             <Wallet size={12} color={COLORS.accentBrown} style={{ marginRight: 6 }} />
             <Text style={styles.methodText}>METHOD: CASH</Text>
          </View>
        </View>

        {/* --- SECTION: SPECIAL NOTES --- */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <FileText color={COLORS.accentBrown} size={20} />
              </View>
              <Text style={[styles.sectionLabel, { marginLeft: 12 }]}>SPECIAL NOTES</Text>
            </View>
            <TouchableOpacity><Text style={styles.editText}>Edit</Text></TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
             <Text style={styles.notesText}>
               "Handle with care, premium jewelry sets. Return by 10 AM on {formatDate(toDate)}."
             </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- BOTTOM NAVIGATION --- */}
      <BottomNavBar />
    </SafeAreaView>
  );
};

// --- Sub-Components ---

const ProductItem = ({ title, category, price, deposit, image }: any) => (
  <View style={styles.productRow}>
    <Image source={Number(image) || { uri: image }} style={styles.productImage} />
    <View style={styles.productInfo}>
      <Text style={styles.productTitle}>{title}</Text>
      <Text style={styles.productDetails}>{category} • {price}</Text>
      <Text style={styles.depositText}>Deposit: {deposit}</Text>
    </View>
  </View>
);

const SummaryRow = ({ label, value, isNegative }: any) => (
  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={[styles.summaryValue, isNegative && { color: COLORS.negative }]}>{value}</Text>
  </View>
);



// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 35,
    padding: 20,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#F3F3ED', 
    borderRadius: 35,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.iconBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#999',
    letterSpacing: 0.5,
  },
  subLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accentBrown,
    marginTop: 2,
  },
  editText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.accentBrown,
  },
  cardContent: {
    paddingLeft: 4,
  },
  largeDate: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  durationLabel: {
    fontSize: 14,
    color: COLORS.textSub,
    marginTop: 6,
    fontWeight: '600',
  },
  productList: {
    marginTop: 5,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  productImage: {
    width: 65,
    height: 65,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  productDetails: {
    fontSize: 12,
    color: COLORS.textSub,
    marginTop: 2,
  },
  depositText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accentBrown,
    marginTop: 4,
  },
  customerName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  customerDetailText: {
    fontSize: 14,
    color: COLORS.textSub,
    fontWeight: '500',
  },
  summaryRows: {
    marginTop: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: COLORS.textSub,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 15,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  balanceLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  balanceValue: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  methodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  methodText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSub,
  },
  notesText: {
    fontSize: 14,
    color: COLORS.textSub,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

});

export default ReviewBookingScreen;
