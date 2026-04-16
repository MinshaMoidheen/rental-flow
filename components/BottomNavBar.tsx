import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, CalendarDays, Package, ShoppingCart } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#FFC444',
  textSub: '#666',
};

const NavItem = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    {icon}
    <Text style={styles.navLabel}>{label}</Text>
  </TouchableOpacity>
);

const BottomNavBar = () => {
  const router = useRouter();

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItemActive} onPress={() => router.push('/')}>
        <Home color="black" size={24} />
        <Text style={styles.navTextActive}>HOME</Text>
      </TouchableOpacity>
      <NavItem icon={<CalendarDays color={COLORS.textSub} size={24} />} label="BOOKINGS" />
      <NavItem icon={<Package color={COLORS.textSub} size={24} />} label="INVENTORY" />
      <NavItem icon={<ShoppingCart color={COLORS.textSub} size={24} />} label="CART" onPress={() => router.push('/cart')} />
    </View>
  );
};

const styles = StyleSheet.create({
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

export default BottomNavBar;
