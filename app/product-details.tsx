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
  CheckCircle2,
  Maximize2,
  ShoppingCart,
  Calendar,
  FileText,
  Info,
  ShieldCheck,
  Zap,
  Truck,
  Home,
  CalendarDays,
  Package,
} from 'lucide-react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useCart } from '../contexts/CartContext';
import BottomNavBar from '../components/BottomNavBar';

const { width } = Dimensions.get('window');

// --- Theme Colors ---
const COLORS = {
  primary: '#FFC444',
  background: '#FCFAF7',
  white: '#FFFFFF',
  textMain: '#1A1A1A',
  textSub: '#666666',
  accentBrown: '#745E2F',
  cardBg: '#F3F1E9', // Creamy summary background
  greenPill: '#E8F5E9',
  greenText: '#2E7D32',
  infoBg: '#FFF9E8',
};

const ProductDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<any>();
  const { addToCart } = useCart();

  const fromDate = params.from ? new Date(params.from) : null;
  const toDate = params.to ? new Date(params.to) : null;

  const durationInDays = (fromDate && toDate) 
    ? Math.max(0, Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)))
    : null;

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };
  
  const formatYear = (date: Date | null) => {
    if (!date) return '';
    return date.getFullYear().toString();
  };

  const datesText = (fromDate && toDate) ? `${formatDate(fromDate)} → ${formatDate(toDate)}\n${formatYear(fromDate)}` : 'No dates selected';
  const durationText = durationInDays ? `${durationInDays} Day${durationInDays !== 1 ? 's' : ''}` : '-';

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.textMain} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <CheckCircle2 color={COLORS.textMain} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- IMAGE SECTION --- */}
        <View style={styles.imageContainer}>
          <Image
            source={Number(params.imageId) || require('../assets/images/cat_bride_1776157561382.png')}
            style={styles.mainImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.expandButton}>
            <Maximize2 color="white" size={20} />
          </TouchableOpacity>
          
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* --- TITLE & PRICE SECTION --- */}
        <View style={styles.infoSection}>
          <View style={styles.rowBetween}>
            <Text style={styles.categoryLabel}>{(params.category || 'ORNAMENTS').toUpperCase()}</Text>
            <View style={styles.stockPill}>
              <View style={styles.stockDot} />
              <Text style={styles.stockText}>IN STOCK</Text>
            </View>
          </View>
          
          <Text style={styles.productTitle}>{params.title || 'Bridal Gold Set A'}</Text>
          
          <View style={[styles.row, { marginTop: 12 }]}>
            <Text style={styles.rentLabel}>Rent : </Text>
            <Text style={styles.rentPrice}>₹{params.price || '1,500'}</Text>
            <View style={styles.depositPill}>
              <Text style={styles.depositText}>Deposit ₹{params.deposit || '7,000'}</Text>
            </View>
          </View>

          {/* ADD TO CART BUTTON */}
          <TouchableOpacity 
            style={styles.addToCartBtn}
            onPress={() => {
              addToCart({
                id: params.id || Math.random().toString(),
                title: params.title || 'Bridal Gold Set A',
                category: params.category || 'ORNAMENTS',
                price: Number(params.price) || 1500,
                deposit: Number(params.deposit) || 7000,
                image: params.imageId || require('../assets/images/cat_bride_1776157561382.png')
              });
              router.back();
            }}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
            <ShoppingCart color="black" size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* --- RENTAL SUMMARY CARD --- */}
        <View style={styles.summaryCard}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Calendar color={COLORS.accentBrown} size={20} />
              <Text style={styles.sectionHeading}>Rental Summary</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/select-dates')}><Text style={styles.changeLink}>CHANGE</Text></TouchableOpacity>
          </View>

          <View style={[styles.rowBetween, { marginTop: 15 }]}>
            <View>
              <Text style={styles.summaryLabel}>SELECTED DATES</Text>
              <Text style={styles.summaryValue}>{datesText}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.summaryLabel}>DURATION</Text>
              <Text style={styles.summaryValue}>{durationText}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <SummaryRow label="Total Rental" value="₹4,500" />
          <SummaryRow label="Total Deposit" value="₹7,000" />
          <SummaryRow label="Total Amount" value="₹12000" isBold />
          <SummaryRow label="Advance to pay" value="₹1500" isPrimary />
        </View>

        {/* --- ITEM SPECIFICATIONS CARD --- */}
        <View style={styles.specsCard}>
          <View style={styles.row}>
            <FileText color={COLORS.accentBrown} size={20} />
            <Text style={styles.sectionHeading}>Item Specifications</Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <SpecRow label="SKU" value="BRD-G-001" />
            <SpecRow label="Style" value="Antique Gold Finish" />
            <SpecRow label="Material" value="22K Gold Plated" />
          </View>

          <View style={styles.includedSection}>
            <Text style={styles.includedLabel}>INCLUDED</Text>
            <Text style={styles.includedValue}>Necklace, Pair of Earrings, Maang Tikka</Text>
          </View>

          {/* INFO BANNER */}
          <View style={styles.infoBanner}>
            <Info color={COLORS.accentBrown} size={18} />
            <Text style={styles.infoBannerText}>
              Available for selected dates. Includes a 1-day buffer before the next booking.
            </Text>
          </View>
        </View>

        {/* --- TRUST ICONS --- */}
        <View style={styles.trustRow}>
          <TrustItem icon={<ShieldCheck color="#999" size={24} />} label="SECURED" />
          <TrustItem icon={<Zap color="#999" size={24} />} label="SANITIZED" />
          <TrustItem icon={<Truck color="#999" size={24} />} label="INSURED" />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- BOTTOM NAVIGATION --- */}
      <BottomNavBar />
    </SafeAreaView>
  );
};

// --- Helper Components ---

const SummaryRow = ({ label, value, isBold, isPrimary }: any) => (
  <View style={styles.summaryRow}>
    <Text style={[styles.summaryItemLabel, isBold && { fontWeight: '700', color: COLORS.textMain }]}>{label}</Text>
    <Text style={[
      styles.summaryItemValue, 
      isBold && { fontSize: 18, fontWeight: '800', color: COLORS.textMain },
      isPrimary && { color: COLORS.primary, fontWeight: '800' }
    ]}>{value}</Text>
  </View>
);

const SpecRow = ({ label, value }: any) => (
  <View style={styles.specItemRow}>
    <Text style={styles.specLabel}>{label}</Text>
    <Text style={styles.specValue}>{value}</Text>
  </View>
);

const TrustItem = ({ icon, label }: any) => (
  <View style={styles.trustItem}>
    {icon}
    <Text style={styles.trustLabel}>{label}</Text>
  </View>
);



// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textMain },
  headerIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  
  imageContainer: { width: '100%', height: 380, borderRadius: 24, overflow: 'hidden', marginBottom: 20 },
  mainImage: { width: '100%', height: '100%' },
  expandButton: { position: 'absolute', top: 15, right: 15, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  pagination: { position: 'absolute', bottom: 15, alignSelf: 'center', flexDirection: 'row' },
  dot: { width: 30, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)', marginHorizontal: 3 },
  dotActive: { backgroundColor: 'white' },

  infoSection: { marginBottom: 25 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  categoryLabel: { fontSize: 13, fontWeight: '600', color: '#999', letterSpacing: 0.5 },
  stockPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.greenPill, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  stockDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.greenText, marginRight: 6 },
  stockText: { fontSize: 10, fontWeight: '800', color: COLORS.greenText },
  productTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textMain, marginTop: 8 },
  rentLabel: { fontSize: 16, color: COLORS.textSub },
  rentPrice: { fontSize: 22, fontWeight: '800', color: COLORS.textMain },
  depositPill: { backgroundColor: '#F0F0F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, marginLeft: 15 },
  depositText: { fontSize: 12, color: COLORS.textSub, fontWeight: '600' },

  addToCartBtn: { backgroundColor: COLORS.primary, height: 58, borderRadius: 29, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 25 },
  addToCartText: { fontSize: 17, fontWeight: '800', color: 'black', marginRight: 10 },

  summaryCard: { backgroundColor: COLORS.cardBg, borderRadius: 24, padding: 20, marginBottom: 20 },
  sectionHeading: { fontSize: 18, fontWeight: '700', color: COLORS.textMain, marginLeft: 10 },
  changeLink: { fontSize: 12, fontWeight: '800', color: COLORS.accentBrown },
  summaryLabel: { fontSize: 10, fontWeight: '700', color: '#999', letterSpacing: 0.5 },
  summaryValue: { fontSize: 15, fontWeight: '700', color: COLORS.textMain, marginTop: 4, lineHeight: 20 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 15 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryItemLabel: { fontSize: 15, color: COLORS.textSub, fontWeight: '500' },
  summaryItemValue: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },

  specsCard: { backgroundColor: COLORS.white, borderRadius: 24, padding: 20, marginBottom: 25 },
  specItemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  specLabel: { fontSize: 14, color: COLORS.textSub },
  specValue: { fontSize: 14, fontWeight: '700', color: COLORS.textMain },
  includedSection: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 15 },
  includedLabel: { fontSize: 10, fontWeight: '800', color: '#999', letterSpacing: 1 },
  includedValue: { fontSize: 14, color: COLORS.textMain, fontWeight: '600', marginTop: 6 },
  infoBanner: { backgroundColor: COLORS.infoBg, padding: 15, borderRadius: 18, flexDirection: 'row', marginTop: 20 },
  infoBannerText: { flex: 1, fontSize: 12, color: COLORS.accentBrown, marginLeft: 10, lineHeight: 18, fontWeight: '500' },

  trustRow: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 },
  trustItem: { alignItems: 'center', marginHorizontal: 15 },
  trustLabel: { fontSize: 10, fontWeight: '700', color: '#BBB', marginTop: 6 },



});

export default ProductDetailsScreen;
