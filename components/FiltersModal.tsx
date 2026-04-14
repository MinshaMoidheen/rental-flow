import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  PanResponder,
} from 'react-native';
import { X, Gem, Shirt, Briefcase, Dot } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// --- Theme Colors ---
const COLORS = {
  primaryYellow: '#FFC444',
  buttonNavy: '#3F4E77',
  textMain: '#1A1A1A',
  textSub: '#666666',
  chipBg: '#F1F1E9',
  white: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.4)',
  border: '#F0F0F0',
};

const FiltersModal = ({ visible, onClose }: any) => {
  const [avail, setAvail] = useState('All');
  const [cats, setCats] = useState<string[]>([]);
  const [size, setSize] = useState('M');

  const [rateLow, setRateLow] = useState(300);
  const [rateHigh, setRateHigh] = useState(2500);

  const [depLow, setDepLow] = useState(1000);
  const [depHigh, setDepHigh] = useState(10000);

  const toggleCat = (c: string) => setCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  
  const activeFiltersCount = (avail !== 'All' ? 1 : 0) + (cats.length) + (size ? 1 : 0);

  const clearAll = () => {
     setAvail('All'); setCats([]); setSize('');
     setRateLow(300); setRateHigh(2500);
     setDepLow(1000); setDepHigh(10000);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          <View style={styles.handleBar} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <X color="black" size={28} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* --- AVAILABILITY --- */}
            <FilterSection title="AVAILABILITY">
              <View style={styles.chipRow}>
                <Chip label="All" active={avail === 'All'} onPress={() => setAvail('All')} />
                <Chip label="Available" active={avail === 'Available'} onPress={() => setAvail('Available')} />
                <Chip label="In for service" active={avail === 'In for service'} onPress={() => setAvail('In for service')} />
              </View>
            </FilterSection>

            {/* --- CATEGORY --- */}
            <FilterSection title="CATEGORY">
              <View style={styles.chipRow}>
                <Chip label="Ornaments" icon={<Gem size={18} color="#745E2F" />} active={cats.includes('Ornaments')} onPress={() => toggleCat('Ornaments')} />
                <Chip label="Bride" icon={<Shirt size={18} color="#745E2F" />} active={cats.includes('Bride')} onPress={() => toggleCat('Bride')} />
                <Chip label="Groom" icon={<Briefcase size={18} color="#745E2F" />} active={cats.includes('Groom')} onPress={() => toggleCat('Groom')} />
              </View>
            </FilterSection>

            {/* --- SIZE --- */}
            <FilterSection title="SIZE">
              <View style={styles.chipRow}>
                {['XS', 'S', 'M', 'L', 'XL'].map(s => (
                   <SizeCircle key={s} label={s} active={size === s} onPress={() => setSize(s)} />
                ))}
              </View>
            </FilterSection>

            {/* --- RENTAL RATE SLIDER --- */}
            <View style={styles.rangeHeader}>
              <Text style={styles.sectionTitle}>RENTAL RATE (PER DAY)</Text>
              <Text style={styles.rangeValue}>₹{rateLow.toLocaleString()} - ₹{rateHigh.toLocaleString()}</Text>
            </View>
            <CustomRangeSlider min={0} max={5000} step={100} low={rateLow} high={rateHigh} setLow={setRateLow} setHigh={setRateHigh} />

            {/* --- SECURITY DEPOSIT SLIDER --- */}
            <View style={[styles.rangeHeader, { marginTop: 30 }]}>
              <Text style={styles.sectionTitle}>SECURITY DEPOSIT</Text>
              <Text style={styles.rangeValue}>₹{depLow.toLocaleString()} - ₹{depHigh.toLocaleString()}</Text>
            </View>
            <CustomRangeSlider min={0} max={20000} step={500} low={depLow} high={depHigh} setLow={setDepLow} setHigh={setDepHigh} />

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* --- STICKY FOOTER --- */}
          <View style={styles.footer}>
            <View style={styles.footerStatus}>
              <View style={styles.filtersApplied}>
                <View style={styles.statusDot} />
                <Text style={styles.appliedText}>{activeFiltersCount} FILTERS APPLIED</Text>
              </View>
              <TouchableOpacity onPress={clearAll}>
                <Text style={styles.clearAll}>Clear All</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.resultsBtn} onPress={onClose}>
              <Text style={styles.resultsBtnText}>Show Results</Text>
            </TouchableOpacity>
            
            <View style={styles.homeIndicator} />
          </View>

        </View>
      </View>
    </Modal>
  );
};

// --- Sub-components ---

const FilterSection = ({ title, children }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Chip = ({ label, active, icon, onPress }: any) => (
  <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
    {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const SizeCircle = ({ label, active, onPress }: any) => (
  <TouchableOpacity style={[styles.sizeCircle, active && styles.sizeCircleActive]} onPress={onPress}>
    <Text style={[styles.sizeText, active && styles.sizeTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const CustomRangeSlider = ({ min, max, step, low, high, setLow, setHigh }: any) => {
  const [width, setWidth] = useState(1);
  
  const stateRef = useRef({ low, high, width, startLow: low, startHigh: high });
  stateRef.current.low = low;
  stateRef.current.high = high;
  stateRef.current.width = width;

  const clampLow = (val: number, currentHigh: number) => Math.max(min, Math.min(val, currentHigh));
  const clampHigh = (val: number, currentLow: number) => Math.max(currentLow, Math.min(val, max));

  const lowPan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { stateRef.current.startLow = stateRef.current.low; },
    onPanResponderMove: (e, g) => {
      const { startLow, width, high: currentHigh } = stateRef.current;
      const deltaRatio = g.dx / width;
      let newVal = startLow + deltaRatio * (max - min);
      setLow(Math.round(clampLow(newVal, currentHigh) / step) * step);
    }
  })).current;

  const highPan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { stateRef.current.startHigh = stateRef.current.high; },
    onPanResponderMove: (e, g) => {
      const { startHigh, width, low: currentLow } = stateRef.current;
      const deltaRatio = g.dx / width;
      let newVal = startHigh + deltaRatio * (max - min);
      setHigh(Math.round(clampHigh(newVal, currentLow) / step) * step);
    }
  })).current;

  const getLeftPct = (val: number) => `${((val - min) / (max - min)) * 100}%`;
  const getWidthPct = (v1: number, v2: number) => `${((v2 - v1) / (max - min)) * 100}%`;

  return (
    <View style={styles.sliderContainer} onLayout={e => setWidth(Math.max(1, e.nativeEvent.layout.width))}>
      <View style={styles.sliderTrack} />
      <View style={[styles.sliderActiveTrack, { left: getLeftPct(low), width: getWidthPct(low, high) }]} />
      <View {...lowPan.panHandlers} style={[styles.sliderThumb, { left: getLeftPct(low), marginLeft: -12 }]} />
      <View {...highPan.panHandlers} style={[styles.sliderThumb, { left: getLeftPct(high), marginLeft: -12 }]} />
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: height * 0.85,
    width: '100%',
    alignSelf: 'center',
    maxWidth: 500,
  },
  handleBar: {
    width: 45,
    height: 5,
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSub,
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.chipBg,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 10,
  },
  chipActive: {
    backgroundColor: COLORS.primaryYellow,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSub,
  },
  chipTextActive: {
    color: COLORS.textMain,
  },
  sizeCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sizeCircleActive: {
    backgroundColor: COLORS.primaryYellow,
    borderColor: COLORS.primaryYellow,
  },
  sizeText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4B3F1E',
  },
  sizeTextActive: {
    color: '#4B3F1E',
  },
  rangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rangeValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  sliderContainer: {
    height: 30,
    justifyContent: 'center',
    width: '100%',
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    width: '100%',
  },
  sliderActiveTrack: {
    position: 'absolute',
    height: 4,
    backgroundColor: COLORS.primaryYellow,
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: COLORS.primaryYellow,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8F8F8',
  },
  footerStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  filtersApplied: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#745E2F',
    marginRight: 8,
  },
  appliedText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textSub,
    letterSpacing: 0.5,
  },
  clearAll: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3F4E77',
  },
  resultsBtn: {
    backgroundColor: COLORS.buttonNavy,
    height: 65,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultsBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  homeIndicator: {
    width: 120,
    height: 5,
    backgroundColor: 'black',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
});

export default FiltersModal;
