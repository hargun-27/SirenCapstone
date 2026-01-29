import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { TabNavigator } from './TabNavigator';
import { MotionAlertScreen } from '../screens/alerts/MotionAlertScreen';

enableScreens(true);

export type RootStackParamList = {
  Tabs: undefined;
  MotionAlert: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Tabs" component={TabNavigator} />
        <RootStack.Screen
          name="MotionAlert"
          component={MotionAlertScreen}
          options={{ presentation: 'modal' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
