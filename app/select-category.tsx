import React, { useState } from 'react';
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
  Search, 
  Calendar, 
  ChevronRight, 
  ArrowRight 
} from 'lucide-react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2; // Calculation for 2-column grid with margins

// --- Theme Colors ---
const COLORS = {
  primaryCream: '#FFF9ED',
  textMain: '#1A1A1A',
  textSub: '#666666',
  accentBrown: '#745E2F',
  cardBg: '#FFF9ED',
  buttonDark: '#33332D',
  background: '#FFFFFF',
  grayBg: '#F3F4F6',
};

const SelectCategoryScreen = () => {
  // Mock data for categories
  const categories = [
    {
      id: '1',
      title: 'Ornaments',
      desc: 'Neck sets, bangles, earrings',
      items: '124 ITEMS',
      image: require('../assets/images/cat_ornaments_1776157536829.png'),
    },
    {
      id: '2',
      title: 'Bride Attire',
      desc: 'Lehenga, saree, blouse sets',
      items: '124 ITEMS',
      image: require('../assets/images/cat_bride_1776157561382.png'),
    },
    {
      id: '3',
      title: 'Groom Attire',
      desc: 'Sherwani, kurta sets, safa',
      items: '124 ITEMS',
      image: require('../assets/images/cat_groom_1776157575730.png'),
    },
    {
      id: '4',
      title: 'Wedding Acc.',
      desc: 'Kalire, veils, clutches',
      items: '124 ITEMS',
      image: require('../assets/images/cat_wedding_acc_1776157605204.png'),
    },
    {
      id: '5',
      title: 'Footwear',
      desc: 'Juttis, sandals, formal',
      items: '124 ITEMS',
      image: require('../assets/images/cat_footwear_1776157707337.png'),
    },
    {
      id: '6',
      title: 'Add-ons',
      desc: 'Bags, pins, extra sets',
      items: '124 ITEMS',
      image: require('../assets/images/cat_addons_1776157722552.png'),
    },
  ];

  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string; to?: string }>();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.textMain} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Category</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Search color={COLORS.textMain} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- DATE SUMMARY BAR --- */}
        <View style={styles.dateSummaryBar}>
          <View style={styles.dateInfo}>
            <Calendar color={COLORS.textMain} size={20} />
            <Text style={styles.dateSummaryText}>{dateSummaryText}</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.editText}>EDIT</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.instructionText}>
          Select a category to browse available rental items
        </Text>

        {/* --- CATEGORY GRID --- */}
        <View style={styles.grid}>
          {categories.map((item) => {
            const isSelected = selectedCategories.includes(item.id);
            return (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.card, isSelected && { borderColor: COLORS.primary, borderWidth: 2 }]}
              onPress={() => toggleCategory(item.id)}
            >
              <Image source={item.image} style={styles.cardImage} />
              <View style={[styles.cardContent, isSelected && { backgroundColor: '#F9F1E2' }]}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
                
                <View style={styles.cardFooter}>
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>{item.items}</Text>
                  </View>
                  <View style={[styles.chevronCircle, isSelected && { backgroundColor: COLORS.primary }]}>
                    <ChevronRight color={isSelected ? 'white' : COLORS.accentBrown} size={14} strokeWidth={3} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )})}
        </View>

        {/* Padding for bottom button */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* --- STICKY FOOTER --- */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => {
            router.push({
              pathname: '/product-listing',
              params: {
                from: params.from,
                to: params.to,
                categories: selectedCategories.join(',')
              }
            });
          }}
        >
          <Text style={styles.continueText}>Continue to Products</Text>
          <ArrowRight color="white" size={20} />
        </TouchableOpacity>
        <View style={styles.homeIndicator} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.grayBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  dateSummaryBar: {
    backgroundColor: COLORS.primaryCream,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateSummaryText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textMain,
  },
  editText: {
    fontWeight: '800',
    fontSize: 14,
    color: COLORS.accentBrown,
  },
  instructionText: {
    fontSize: 15,
    color: COLORS.textSub,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: COLUMN_WIDTH,
    backgroundColor: COLORS.cardBg,
    borderRadius: 25,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F2ECE0',
  },
  cardImage: {
    width: '100%',
    height: 130,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  cardDesc: {
    fontSize: 12,
    color: COLORS.textSub,
    marginTop: 4,
    lineHeight: 16,
    height: 32, // Fixed height to keep grid even
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  pill: {
    backgroundColor: '#F9F1E2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accentBrown,
  },
  chevronCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F9F1E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  continueButton: {
    backgroundColor: COLORS.buttonDark,
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
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
    marginTop: 15,
    marginBottom: 5,
  },
});

export default SelectCategoryScreen;