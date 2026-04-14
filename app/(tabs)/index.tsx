import React from 'react';
import { useRouter } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  Menu,
  Bell,
  PlusCircle,
  Search,
  RotateCcw,
  Package,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Home,
  Calendar,
  LayoutGrid,
  User,
  Clock,
} from 'lucide-react-native';

// --- Theme Colors ---
const COLORS = {
  primary: '#FFC444',
  dark: '#333333',
  lightGray: '#F5F5F5',
  cream: '#FFF9EB',
  dangerLight: '#FEF2F2',
  dangerBorder: '#B91C1C',
  textHeader: '#1A1A1A',
  textSub: '#666666',
  activityBg: '#EFEFE9',
};

const DashboardApp = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <Menu color="black" size={28} />
          <View style={styles.headerRight}>
            <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
              <Text style={styles.userName}>Meenakshi Mohan</Text>
              <Text style={styles.userRole}>COUNTER STAFF</Text>
            </View>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/100?img=47' }} 
              style={styles.avatar} 
            />
            <View style={styles.bellContainer}>
              <Bell color={COLORS.primary} size={20} fill={COLORS.primary} />
            </View>
          </View>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>Good morning, Meena 👋</Text>
          <Text style={styles.dateText}>Friday, 27 March 2026</Text>
        </View>

        {/* --- QUICK ACTIONS GRID --- */}
        <View style={styles.grid}>
          <QuickAction icon={<PlusCircle color="black" size={20} />} label="NEW BOOKING" onPress={() => router.push('/select-dates')} />
          <QuickAction icon={<Search color="black" size={20} />} label="FIND ORDER" />
          <QuickAction icon={<RotateCcw color="black" size={20} />} label="MARK RETURN" />
          <QuickAction icon={<Package color="black" size={20} />} label="INVENTORY" />
        </View>

        {/* --- STATS CARDS --- */}
        <View style={styles.row}>
          <View style={[styles.statsCard, { backgroundColor: COLORS.dark }]}>
            <Text style={[styles.statsNumber, { color: 'white' }]}>15</Text>
            <Text style={[styles.statsLabel, { color: 'white' }]}>Pickups Today</Text>
            <TouchableOpacity style={styles.viewListBtn}>
              <Text style={[styles.viewListText, { color: COLORS.primary }]}>View List</Text>
              <ArrowRight color={COLORS.primary} size={18} />
            </TouchableOpacity>
          </View>

          <View style={[styles.statsCard, styles.statsCardOutline]}>
            <Text style={styles.statsNumber}>5</Text>
            <Text style={styles.statsLabel}>Returns Today</Text>
            <TouchableOpacity style={styles.viewListBtn}>
              <Text style={[styles.viewListText, { color: '#8B5E3C' }]}>View List</Text>
              <ArrowRight color="#8B5E3C" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- OVERDUE ALERT --- */}
        <View style={styles.alertBar}>
          <View style={styles.alertLeftBorder} />
          <View style={styles.alertIconBox}>
             <Clock color="#B91C1C" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>2 Overdue Returns</Text>
            <Text style={styles.alertSubtitle}>Action required immediately</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.alertLink}>View List</Text>
          </TouchableOpacity>
        </View>

        {/* --- CLEANING QUEUE --- */}
        <View style={styles.sectionHeader}>
          <Sparkles color={COLORS.primary} size={20} />
          <Text style={styles.sectionTitle}>CLEANING QUEUE</Text>
        </View>
        
        <View style={styles.queueContainer}>
          <QueueItem 
            title="Bridal Set A" 
            refId="BR-902" 
            image="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=100&auto=format&fit=crop" 
          />
          <QueueItem 
            title="Pearl Necklace B" 
            refId="PRL-44" 
            image="https://images.unsplash.com/photo-1535633302704-b02f4fdfa4d9?q=80&w=100&auto=format&fit=crop" 
          />
          <QueueItem 
            title="Gold Bangles Set" 
            refId="GBN-112" 
            image="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=100&auto=format&fit=crop" 
          />
        </View>

        {/* --- RECENT ACTIVITY --- */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
        </View>

        <ActivityItem 
          name="Riya Sharma" 
          action="Inventory Issued" 
          time="10:45 AM" 
          borderColor="#8B5E3C" 
        />
        <ActivityItem 
          name="Priya Menon" 
          action="Payment Recorded" 
          time="09:30 AM" 
          borderColor={COLORS.primary} 
        />
        <ActivityItem 
          name="Ananya M." 
          action="Booking Created" 
          time="08:15 AM" 
          borderColor="#4B4B4B" 
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- BOTTOM NAVIGATION --- */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <Home color="black" size={24} />
          <Text style={styles.navTextActive}>HOME</Text>
        </TouchableOpacity>
        <NavItem icon={<Calendar color="#666" size={24} />} label="BOOKINGS" />
        <NavItem icon={<LayoutGrid color="#666" size={24} />} label="INVENTORY" />
        <NavItem icon={<User color="#666" size={24} />} label="PROFILE" />
      </View>
    </SafeAreaView>
  );
};

// --- Sub-Components ---

const QuickAction = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    {icon}
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const QueueItem = ({ title, refId, image }) => (
  <View style={styles.queueItem}>
    <Image source={{ uri: image }} style={styles.queueImage} />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemRef}>REF: {refId}</Text>
    </View>
    <TouchableOpacity style={styles.markCleanBtn}>
      <Text style={styles.markCleanText}>MARK CLEAN ✓</Text>
    </TouchableOpacity>
  </View>
);

const ActivityItem = ({ name, action, time, borderColor }) => (
  <TouchableOpacity style={styles.activityCard}>
    <View style={[styles.activityBorder, { backgroundColor: borderColor }]} />
    <View style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 15 }}>
      <Text style={styles.activityName}>{name}</Text>
      <Text style={styles.activityAction}>{action} • <Text style={{fontWeight: '400'}}>{time}</Text></Text>
    </View>
    <ChevronRight color="#CCC" size={20} style={{ marginRight: 10 }} />
  </TouchableOpacity>
);

const NavItem = ({ icon, label }) => (
  <TouchableOpacity style={styles.navItem}>
    {icon}
    <Text style={styles.navLabel}>{label}</Text>
  </TouchableOpacity>
);

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textHeader,
  },
  userRole: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  bellContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF9ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  greetingSection: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textHeader,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.textSub,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionBtn: {
    width: '48%',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statsCard: {
    width: '48%',
    borderRadius: 25,
    padding: 20,
    height: 150,
    justifyContent: 'space-between',
  },
  statsCardOutline: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  statsNumber: {
    fontSize: 32,
    fontWeight: '800',
  },
  statsLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: -10,
  },
  viewListBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewListText: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 5,
  },
  alertBar: {
    backgroundColor: COLORS.dangerLight,
    borderRadius: 20,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
    overflow: 'hidden',
    marginBottom: 25,
  },
  alertLeftBorder: {
    width: 4,
    height: '60%',
    backgroundColor: '#B91C1C',
    borderRadius: 2,
    marginLeft: 2,
  },
  alertIconBox: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  alertSubtitle: {
    fontSize: 12,
    color: COLORS.textSub,
  },
  alertLink: {
    color: '#B91C1C',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    marginLeft: 8,
    color: COLORS.dark,
  },
  queueContainer: {
    backgroundColor: COLORS.cream,
    borderRadius: 30,
    padding: 15,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginBottom: 12,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Android shadow
    elevation: 2,
  },
  queueImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemRef: {
    fontSize: 11,
    color: COLORS.textSub,
    marginTop: 2,
  },
  markCleanBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  markCleanText: {
    fontSize: 10,
    fontWeight: '800',
  },
  activityCard: {
    backgroundColor: COLORS.activityBg,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  activityBorder: {
    width: 5,
    height: '100%',
  },
  activityName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  activityAction: {
    fontSize: 13,
    color: COLORS.textSub,
    fontWeight: '600',
    marginTop: 2,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  navItem: {
    alignItems: 'center',
  },
  navItemActive: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
    marginTop: -5,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#999',
    marginTop: 5,
  },
  navTextActive: {
    fontSize: 10,
    fontWeight: '800',
    color: 'black',
  },
});

export default DashboardApp;
