import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import { 
  ArrowLeft, 
  Search, 
  Calendar, 
  SlidersHorizontal,
  Home,
  CalendarDays,
  Package,
  ShoppingCart,
  ArrowRight
} from 'lucide-react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useCart } from '../contexts/CartContext';
import FiltersModal from '../components/FiltersModal';
import BottomNavBar from '../components/BottomNavBar';

const { width } = Dimensions.get('window');
const PRODUCT_CARD_WIDTH = (width - 50) / 2;

// --- Theme Colors ---
const COLORS = {
  primary: '#FFC444',
  textMain: '#1A1A1A',
  textSub: '#666666',
  accentBrown: '#745E2F',
  dateBarBg: '#FFF9ED',
  inputBg: '#EFEFE9',
  cardBg: '#000000',
  white: '#FFFFFF',
  
  // Status Colors
  inStock: '#22C55E',
  rented: '#F97316',
  repair: '#EF4444',
  cleaning: '#3B82F6'
};

const BrowseProductsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string; to?: string; categories?: string }>();
  const { cartItems } = useCart();
  const [showFilters, setShowFilters] = useState(false);

  const fromDate = params.from ? new Date(params.from) : null;
  const toDate = params.to ? new Date(params.to) : null;

  const durationInDays = (fromDate && toDate) 
    ? Math.max(0, Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)))
    : null;

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const dateSummaryText = (fromDate && toDate) 
    ? `${formatDate(fromDate)} → ${formatDate(toDate)} · ${durationInDays} day${durationInDays !== 1 ? 's' : ''}`
    : 'No dates selected';

  const sections = [
    {
      title: "Christian Bridal Set",
      products: [
        { id: '1', title: 'Bridal Gold Set A', status: 'IN STOCK', color: COLORS.inStock, image: require('../assets/images/cat_ornaments_1776157536829.png') },
        { id: '2', title: 'Bridal Elegant Set B', status: 'RENTED', color: COLORS.rented, image: require('../assets/images/cat_bride_1776157561382.png') },
      ]
    },
    {
      title: "Hindu Bridal set",
      products: [
        { id: '3', title: 'Bridal Lehenga A', status: 'REPAIR', color: COLORS.repair, image: require('../assets/images/cat_wedding_acc_1776157605204.png') },
        { id: '4', title: 'Bridal Sherwani', status: 'CLEANING', color: COLORS.cleaning, image: require('../assets/images/cat_groom_1776157575730.png') },
      ]
    },
    {
      title: "Accessories",
      products: [
        { id: '5', title: 'Bridal Jewelry C', status: 'IN STOCK', color: COLORS.inStock, image: require('../assets/images/cat_ornaments_1776157536829.png') },
        { id: '6', title: 'Classic Juttis', status: 'IN STOCK', color: COLORS.inStock, image: require('../assets/images/cat_footwear_1776157707337.png') },
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.textMain} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Browse Products</Text>
        <TouchableOpacity style={styles.iconCircle}>
          <Search color={COLORS.textMain} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          
          {/* --- DATE BAR --- */}
          <View style={styles.dateBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Calendar color={COLORS.textMain} size={20} />
              <Text style={styles.dateText}>{dateSummaryText}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/select-dates')}><Text style={styles.editText}>EDIT</Text></TouchableOpacity>
          </View>

          {/* --- SEARCH INPUT --- */}
          <View style={styles.searchContainer}>
            <Search color={COLORS.textSub} size={20} style={{ marginLeft: 15 }} />
            <TextInput 
              placeholder="Search products" 
              style={styles.searchInput} 
              placeholderTextColor={COLORS.textSub}
            />
          </View>

          {/* --- FILTER CHIPS --- */}
          <View style={styles.filterRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={[styles.chip, styles.chipActive]}>
                <Text style={styles.chipTextActive}>ORNAMENTS</Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>BRIDAL</Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>GROOM</Text>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
              <Text style={styles.filterBtnText}>Filter</Text>
              <SlidersHorizontal color="white" size={16} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>

          {/* --- PRODUCT SECTIONS --- */}
          {sections.map((section, idx) => (
            <View key={idx} style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <TouchableOpacity><Text style={styles.viewFullText}>View Full</Text></TouchableOpacity>
              </View>
              <View style={styles.productGrid}>
                {section.products.map((item) => (
                  <ProductCard 
                    key={item.id} 
                    item={item} 
                    onPress={() => router.push({
                      pathname: '/product-details',
                      params: {
                        from: params.from,
                        to: params.to,
                        id: item.id,
                        title: item.title,
                        category: section.title,
                        price: 1500, // mock price
                        deposit: 7000, // mock deposit
                        imageId: item.image // passes require ID
                      }
                    })}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
        <View style={{ height: 180 }} />
      </ScrollView>

       <View style={styles.cartOverlay}>
         <View style={styles.cartContent}>
            <View style={styles.thumbnails}>
               {cartItems.map((c, i) => i < 2 ? (
                 <Image key={i} source={c.image} style={[styles.thumb, i > 0 && { marginLeft: -10 }]} />
               ) : null)}
            </View>
            <Text style={styles.cartAddedText}>{cartItems.length} ITEMS ADDED</Text>
         </View>
         <TouchableOpacity style={styles.viewCartButton} onPress={() => router.push({ pathname: '/cart', params: { from: params.from, to: params.to } })}>
           <Text style={styles.viewCartText}>VIEW CART</Text>
         </TouchableOpacity>
       </View>

      {/* --- BOTTOM NAVIGATION --- */}
      <BottomNavBar />
      <FiltersModal visible={showFilters} onClose={() => setShowFilters(false)} />
    </SafeAreaView>
  );
};

const ProductCard = ({ item, onPress }: any) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image 
      source={item.image || require('../assets/images/cat_bride_1776157561382.png')} 
      style={styles.cardImage} 
    />
    <View style={styles.cardOverlay}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <View style={[styles.statusDot, { backgroundColor: item.color }]} />
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
    </View>
  </TouchableOpacity>
);



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textMain },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  contentPadding: { paddingHorizontal: 20 },
  dateBar: { backgroundColor: COLORS.dateBarBg, height: 55, borderRadius: 28, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 15 },
  dateText: { marginLeft: 10, fontSize: 14, fontWeight: '500', color: COLORS.textMain },
  editText: { fontSize: 13, fontWeight: '800', color: COLORS.accentBrown },
  searchContainer: { backgroundColor: COLORS.inputBg, height: 48, borderRadius: 24, flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.textMain },
  filterRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10 },
  chip: { backgroundColor: '#E5E7EB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { fontSize: 11, fontWeight: '800', color: COLORS.textSub },
  chipTextActive: { fontSize: 11, fontWeight: '800', color: COLORS.textMain },
  filterButton: { backgroundColor: 'black', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  filterBtnText: { color: 'white', fontSize: 12, fontWeight: '700' },
  sectionContainer: { marginTop: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textMain },
  viewFullText: { fontSize: 14, fontWeight: '600', color: '#315DC1' },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: PRODUCT_CARD_WIDTH, height: 210, borderRadius: 30, overflow: 'hidden', marginBottom: 15 },
  cardImage: { width: '100%', height: '100%' },
  cardOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, backgroundColor: 'rgba(0,0,0,0.2)' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 10, fontWeight: '800', color: 'white' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: 'white' },
  cartOverlay: { 
    position: 'absolute', bottom: 110, alignSelf: 'center', width: '90%', height: 65, 
    backgroundColor: '#E5E7EB', borderRadius: 32, flexDirection: 'row', padding: 5,
    alignItems: 'center', justifyContent: 'space-between'
  },
  cartContent: { flexDirection: 'row', alignItems: 'center', paddingLeft: 10 },
  thumbnails: { flexDirection: 'row', marginRight: 10 },
  thumb: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#E5E7EB' },
  cartAddedText: { fontSize: 11, fontWeight: '800', color: COLORS.textSub },
  viewCartButton: { backgroundColor: COLORS.primary, height: '100%', borderRadius: 30, paddingHorizontal: 25, justifyContent: 'center' },
  viewCartText: { fontWeight: '800', fontSize: 12, color: COLORS.accentBrown },


});

export default BrowseProductsScreen;