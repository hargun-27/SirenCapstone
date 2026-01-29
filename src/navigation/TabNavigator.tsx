import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Colors } from '../theme/colors';
import { HomeStack } from './HomeStack';
import { SettingsScreen } from '../screens/settings/SettingsScreen';

export type TabParamList = {
  Home: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function getTabBarIcon(
  routeName: keyof TabParamList,
  color: string,
  size: number,
) {
  const iconName = routeName === 'Home' ? 'shield-outline' : 'settings-outline';
  return React.createElement(Ionicons, { name: iconName, size, color });
}

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          borderTopColor: Colors.border,
          backgroundColor: Colors.background,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ color, size }) =>
          getTabBarIcon(route.name as keyof TabParamList, color, size),
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
