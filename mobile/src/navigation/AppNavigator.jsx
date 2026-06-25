import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import AccountScreen from '../screens/AccountScreen';
import AdminScreen from '../screens/AdminScreen';

const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const DARK_HEADER = {
  headerStyle: { backgroundColor: '#1E293B' },
  headerTintColor: '#F8FAFC',
  headerTitleStyle: { fontWeight: 'bold' },
};

function MainTabs() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const cart = useSelector((state) => state.cart.cart);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const tabIcon = (name) =>
    ({ color, size }) => <Ionicons name={name} size={size} color={color} />;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: { backgroundColor: '#1E293B', borderTopColor: '#334155' },
        ...DARK_HEADER,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'בית', tabBarIcon: tabIcon('home') }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'עגלה',
          tabBarIcon: tabIcon('cart'),
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ title: 'הזמנות', tabBarIcon: tabIcon('list') }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: 'חשבון', tabBarIcon: tabIcon('person') }}
      />
      {currentUser?.role === 'admin' ? (
        <Tab.Screen
          name="Admin"
          component={AdminScreen}
          options={{ title: 'ניהול', tabBarIcon: tabIcon('settings') }}
        />
      ) : null}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={DARK_HEADER}>
        <RootStack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <RootStack.Screen name="Login" component={LoginScreen} options={{ title: 'כניסה' }} />
        <RootStack.Screen name="Register" component={RegisterScreen} options={{ title: 'הרשמה' }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
