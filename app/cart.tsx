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
} from 'react-native';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Calendar, 
  X, 
  Plus, 
  ArrowRight,
  BadgeCheck
} from 'lucide-react-native';
import { useCart } from '../contexts/CartContext';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

// --- Theme Colors ---
const COLORS = {
  primary: '#FFC444',
  background: '#FAF9F6',
  white: '#FFFFFF',
  textMain: '#1A1A1A',
  textSub: '#666666',
  accentBrown: '#745E2F',
  dateBarBg: '#FFF7E6',
  breakdownBg: '#E9E9E2',
  grayBg: '#F3F4F6',
  border: '#EAEAEA'
};

const CartScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string; to?: string }>();
  const { cartItems, removeFromCart } = useCart();

  const fromDate = params.from ? new Date(params.from) : null;
  const toDate = params.to ? new Date(params.to) : null;

  const durationInDays = (fromDate && toDate) 
    ? Math.max(0, Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)))
    : 3; // fallback

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const dateSummaryText = (fromDate && toDate) 
    ? `${formatDate(fromDate)} → ${formatDate(toDate)} · ${durationInDays} day${durationInDays !== 1 ? 's' : ''}`
    : 'No dates selected';

  const dailyTotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const estimatedRental = dailyTotal * durationInDays;
  const totalDeposit = cartItems.reduce((acc, item) => acc + item.deposit, 0);
  const totalPayable = estimatedRental + totalDeposit;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.textMain} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <CheckCircle2 color={COLORS.textMain} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- DATE EDIT BAR --- */}
        <View style={styles.dateBar}>
          <View style={styles.dateInfo}>
            <Calendar color={COLORS.textMain} size={20} />
            <Text style={styles.dateText}>{dateSummaryText}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/select-dates')}>
            <Text style={styles.editText}>EDIT</Text>
          </TouchableOpacity>
        </View>

        {/* --- INVENTORY LIST HEADER --- */}
        <View style={styles.inventoryHeader}>
          <Text style={styles.sectionTitle}>SELECTED INVENTORY</Text>
          <View style={styles.itemCountPill}>
            <Text style={styles.itemCountText}>{cartItems.length} Items</Text>
          </View>
        </View>

        {/* --- CART ITEMS --- */}
        {cartItems.length === 0 ? (
           <View style={{ padding: 20, alignItems: 'center' }}>
             <Text style={{ color: COLORS.textSub }}>Your cart is empty.</Text>
           </View>
        ) : (
          cartItems.map((item, index) => (
            <CartItem 
              key={index} // Using index to allow duplicates temporarily if id conflicts
              id={item.id}
              category={item.category.toUpperCase()}
              title={item.title}
              price={item.price.toString()}
              deposit={item.deposit.toString()}
              image={item.image}
              onRemove={() => removeFromCart(item.id)}
            />
          ))
        )}

        {/* --- ADD MORE BUTTON --- */}
        <TouchableOpacity style={styles.addMoreBtn} onPress={() => router.back()}>
          <Plus color={COLORS.textSub} size={20} />
          <Text style={styles.addMoreText}>Add More Products</Text>
        </TouchableOpacity>

        {/* --- RENTAL BREAKDOWN CARD --- */}
        {cartItems.length > 0 && (
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownHeader}>
              <Text style={styles.breakdownTitle}>RENTAL BREAKDOWN</Text>
              <View style={styles.durationPill}>
                 <Text style={styles.durationText}>{durationInDays} Days</Text>
              </View>
            </View>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Daily Total</Text>
              <Text style={styles.breakdownValue}>₹{dailyTotal.toLocaleString()}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Estimated Rental</Text>
              <Text style={styles.breakdownValue}>₹{estimatedRental.toLocaleString()}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Security Deposit</Text>
              <Text style={styles.breakdownValue}>₹{totalDeposit.toLocaleString()}</Text>
            </View>

            <View style={styles.divider} />

            <View style={[styles.breakdownRow, { alignItems: 'flex-end', marginTop: 5 }]}>
              <View>
                <Text style={styles.totalLabel}>TOTAL PAYABLE</Text>
                <Text style={styles.totalAmount}>₹{totalPayable.toLocaleString()}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.refundableText}>Inc. Refundable Deposit</Text>
                <BadgeCheck color={COLORS.primary} size={22} style={{ marginTop: 4 }} />
              </View>
            </View>
          </View>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* --- STICKY FOOTER --- */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.paymentBtn} onPress={() => router.push({ pathname: '/checkout', params: { from: params.from, to: params.to } })}>
            <Text style={styles.paymentBtnText}>Continue to Payment</Text>
            <ArrowRight color="white" size={20} />
          </TouchableOpacity>
          <View style={styles.homeIndicator} />
        </View>
      )}
    </SafeAreaView>
  );
};

// --- Sub-component for Cart Item ---
const CartItem = ({ id, category, title, price, deposit, image, onRemove }: any) => (
  <View style={styles.itemCard}>
    <Image source={Number(image) || { uri: image }} style={styles.itemImage} />
    <View style={styles.itemDetails}>
      <Text style={styles.itemCategory}>{category}</Text>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemPrice}>
        ₹{price}<Text style={styles.perDay}>/day</Text>
      </Text>
      <Text style={styles.itemDeposit}>Deposit: ₹{deposit}</Text>
    </View>
    <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
      <X color="#CCC" size={18} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textMain },
  headerIcon: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20 },
  
  dateBar: {
    backgroundColor: COLORS.dateBarBg,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  dateInfo: { flexDirection: 'row', alignItems: 'center' },
  dateText: { marginLeft: 10, fontSize: 15, fontWeight: '500', color: COLORS.textMain },
  editText: { fontWeight: '800', fontSize: 13, color: COLORS.accentBrown },

  inventoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: COLORS.textSub, letterSpacing: 0.5 },
  itemCountPill: { backgroundColor: '#F0E6D2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  itemCountText: { fontSize: 10, fontWeight: '800', color: COLORS.accentBrown },

  itemCard: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  itemImage: { width: 85, height: 85, borderRadius: 15, backgroundColor: '#eee' },
  itemDetails: { flex: 1, paddingLeft: 15, justifyContent: 'center' },
  itemCategory: { fontSize: 10, fontWeight: '800', color: COLORS.accentBrown, letterSpacing: 0.5 },
  itemTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMain, marginTop: 4 },
  itemPrice: { fontSize: 15, fontWeight: '700', color: COLORS.textMain, marginTop: 10 },
  perDay: { fontWeight: '500', color: COLORS.textSub, fontSize: 12 },
  itemDeposit: { fontSize: 11, color: COLORS.textSub, marginTop: 2 },
  removeBtn: { padding: 5, alignSelf: 'flex-start' },

  addMoreBtn: {
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#DDD',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  addMoreText: { marginLeft: 10, fontSize: 16, fontWeight: '600', color: COLORS.textSub },

  breakdownCard: {
    backgroundColor: COLORS.breakdownBg,
    borderRadius: 35,
    padding: 25,
    marginBottom: 30,
  },
  breakdownHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  breakdownTitle: { fontSize: 11, fontWeight: '800', color: COLORS.textSub, letterSpacing: 0.5 },
  durationPill: { backgroundColor: '#E0DCCF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  durationText: { fontSize: 11, fontWeight: '800', color: COLORS.accentBrown },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  breakdownLabel: { fontSize: 15, color: COLORS.textSub, fontWeight: '500' },
  breakdownValue: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 15 },
  totalLabel: { fontSize: 11, fontWeight: '800', color: COLORS.textSub, letterSpacing: 0.5 },
  totalAmount: { fontSize: 26, fontWeight: '800', color: COLORS.textMain, marginTop: 5 },
  refundableText: { fontSize: 9, fontWeight: '600', color: COLORS.textSub },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  paymentBtn: {
    backgroundColor: '#33332D',
    height: 65,
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentBtnText: { color: 'white', fontSize: 18, fontWeight: '700', marginRight: 10 },
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

export default CartScreen;
