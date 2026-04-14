import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { 
  ChevronLeft, 
  ChevronRight, 
  XCircle, 
  CheckCircle2, 
  Repeat 
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  primaryYellow: '#FFC444',
  selectedDark: '#6B540C',
  selectedRangeBg: '#EBEEF7',
  textMain: '#1A1A1A',
  textSub: '#666666',
  blocked: '#CCCCCC',
  summaryBg: '#F3F1E9',
  white: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.4)',
};

const DatePickerModal = ({ visible, onClose, onApply, initialFrom, initialTo }: any) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Sync with initial props
  useEffect(() => {
    if (visible) {
      setStartDate(initialFrom ? new Date(initialFrom) : null);
      setEndDate(initialTo ? new Date(initialTo) : null);
      setCurrentMonth(initialFrom ? new Date(initialFrom) : new Date());
    }
  }, [visible, initialFrom, initialTo]);

  // Calendar logic
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const getCalendarDates = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const dates = [];
    const today = new Date();
    today.setHours(0,0,0,0);
    
    for (let i = 0; i < firstDay; i++) {
        const d = new Date(year, month - 1, daysInPrevMonth - firstDay + i + 1);
        dates.push({ day: d.getDate(), isCurrentMonth: false, date: d, blocked: false });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        dates.push({ day: i, isCurrentMonth: true, date: d, blocked: false });
    }
    
    const paddingNext = 42 - dates.length; // Ensure 6 rows
    for (let i = 1; i <= paddingNext; i++) {
        const d = new Date(year, month + 1, i);
        dates.push({ day: i, isCurrentMonth: false, date: d, blocked: false });
    }
    return dates;
  };

  const currentDates = getCalendarDates();

  const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));

  const handleDatePress = (d: Date, blocked: boolean) => {
    if (blocked) return;
    d.setHours(0,0,0,0);
    
    if (!startDate || (startDate && endDate)) {
        setStartDate(d);
        setEndDate(null);
    } else if (startDate && !endDate) {
        if (d < startDate) {
            setStartDate(d);
        } else {
            setEndDate(d);
        }
    }
  };

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return d1.getTime() === d2.getTime();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-- ---';
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const durationInDays = (startDate && endDate) 
    ? Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)))
    : 0;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          <View style={styles.handleBar} />

          <View style={styles.header}>
            <Text style={styles.title}>Select Rental Dates</Text>
            <Text style={styles.subtitle}>Choose start and end date for this rental</Text>
          </View>

          <View style={styles.divider} />

          <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
            <View style={styles.calendarContainer}>
              <View style={styles.monthNav}>
                <TouchableOpacity onPress={handlePrevMonth}><ChevronLeft color="black" size={24} /></TouchableOpacity>
                <Text style={styles.monthText}>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
                <TouchableOpacity onPress={handleNextMonth}><ChevronRight color="black" size={24} /></TouchableOpacity>
              </View>

              <View style={styles.weekdayRow}>
                {days.map((d, i) => (
                  <Text key={i} style={styles.weekdayText}>{d}</Text>
                ))}
              </View>

              <View style={styles.dateGrid}>
                {currentDates.map((item, index) => {
                  const isSelectedStart = isSameDay(item.date, startDate);
                  const isSelectedEnd = isSameDay(item.date, endDate);
                  const isInRange = startDate && endDate && item.date > startDate && item.date < endDate;
                  const isCurrentToday = isSameDay(item.date, new Date());
                  
                  return (
                    <TouchableOpacity 
                      key={index} 
                      activeOpacity={0.8}
                      onPress={() => handleDatePress(item.date, item.blocked)}
                      style={[
                        styles.dateContainer,
                        isInRange && styles.rangeBg,
                        isSelectedStart && endDate && styles.rangeBgStart, // Only range tail if end exists
                        isSelectedEnd && styles.rangeBgEnd,
                    ]}>
                      <View style={[
                        styles.dateCircle,
                        (isSelectedStart || isSelectedEnd) && styles.selectedCircle,
                        isCurrentToday && !isSelectedStart && !isSelectedEnd && styles.currentCircle
                      ]}>
                        <Text style={[
                          styles.dateText,
                          !item.isCurrentMonth && { color: '#BBB' },
                          item.blocked && styles.blockedText,
                          (isSelectedStart || isSelectedEnd) && styles.selectedDateText,
                        ]}>
                          {item.day}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.legendRow}>
              <LegendItem color={COLORS.primaryYellow} label="Available" />
              <LegendItem color={COLORS.selectedDark} label="Selected" />
              <LegendItem color={COLORS.blocked} label="Blocked" />
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryInputs}>
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryLabel}>FROM</Text>
                  <Text style={styles.summaryDate}>{formatDate(startDate)}</Text>
                </View>
                
                <Repeat color={COLORS.selectedDark} size={24} style={{ marginHorizontal: 15 }} />

                <View style={styles.summaryBox}>
                  <Text style={[styles.summaryLabel, { textAlign: 'right' }]}>TO</Text>
                  <Text style={[styles.summaryDate, { textAlign: 'right' }]}>{formatDate(endDate)}</Text>
                </View>
              </View>
              <View style={styles.durationLine}>
                <Text style={styles.durationText}>DURATION : {durationInDays ? `${durationInDays} DAYS` : '--'}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <XCircle color="black" size={24} />
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>

            <TouchableOpacity 
               style={styles.applyBtn} 
               onPress={() => {
                 if (onApply && startDate && endDate) onApply(startDate, endDate);
                 else if (onClose) onClose();
               }}
            >
              <Text style={styles.applyText}>APPLY</Text>
              <CheckCircle2 color="black" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.homeIndicator} />
        </View>
      </View>
    </Modal>
  );
};

const LegendItem = ({ color, label }: any) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 25, paddingTop: 10, alignItems: 'center', width: '100%', maxWidth: 500, alignSelf: 'center', maxHeight: '90%' },
  handleBar: { width: 45, height: 5, backgroundColor: '#E0E0E0', borderRadius: 10, marginBottom: 20 },
  header: { alignSelf: 'flex-start', marginBottom: 15 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.textMain },
  subtitle: { fontSize: 15, color: COLORS.textSub, marginTop: 4 },
  divider: { width: '100%', height: 1, backgroundColor: '#F0F0F0', marginBottom: 10 },
  calendarContainer: { width: '100%', paddingVertical: 10 },
  monthNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, marginBottom: 20 },
  monthText: { fontSize: 18, fontWeight: '800', color: '#333' },
  weekdayRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  weekdayText: { width: 40, textAlign: 'center', fontSize: 14, fontWeight: '800', color: '#8B5E3C' },
  dateGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  dateContainer: { width: (width - 50) / 7, height: 48, justifyContent: 'center', alignItems: 'center', marginVertical: 2 },
  dateCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  dateText: { fontSize: 15, fontWeight: '600', color: COLORS.textMain },
  blockedText: { color: COLORS.blocked, textDecorationLine: 'line-through' },
  selectedCircle: { backgroundColor: COLORS.selectedDark },
  selectedDateText: { color: 'white' },
  currentCircle: { borderWidth: 2, borderColor: COLORS.primaryYellow },
  rangeBg: { backgroundColor: COLORS.selectedRangeBg },
  rangeBgStart: { backgroundColor: COLORS.selectedRangeBg, borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
  rangeBgEnd: { backgroundColor: COLORS.selectedRangeBg, borderTopRightRadius: 20, borderBottomRightRadius: 20 },
  legendRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 15 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: 13, fontWeight: '600', color: COLORS.textSub },
  summaryCard: { backgroundColor: COLORS.summaryBg, width: '100%', borderRadius: 30, padding: 20, marginVertical: 10 },
  summaryInputs: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  summaryBox: { flex: 1 },
  summaryLabel: { fontSize: 10, fontWeight: '800', color: COLORS.textSub, letterSpacing: 1 },
  summaryDate: { fontSize: 18, fontWeight: '800', color: COLORS.textMain, marginTop: 4 },
  durationLine: { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 12, alignItems: 'center' },
  durationText: { fontSize: 14, fontWeight: '800', color: '#8B5E3C', letterSpacing: 0.5 },
  footer: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 25 },
  cancelBtn: { flexDirection: 'row', alignItems: 'center', paddingLeft: 10 },
  cancelText: { fontSize: 16, fontWeight: '800', color: COLORS.textMain, marginLeft: 10 },
  applyBtn: { backgroundColor: COLORS.primaryYellow, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 35, height: 55, borderRadius: 28 },
  applyText: { fontSize: 16, fontWeight: '800', color: COLORS.textMain, marginRight: 10 },
  homeIndicator: { width: 120, height: 5, backgroundColor: 'black', borderRadius: 10, marginBottom: 15 }
});

export default DatePickerModal;
