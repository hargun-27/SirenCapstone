import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSiren } from '../state/SirenContext';
import { DeviceConnectionScreen } from '../screens/home/DeviceConnectionScreen';
import { DeviceStatusScreen } from '../screens/home/DeviceStatusScreen';

export type HomeStackParamList = {
  DeviceConnection: undefined;
  DeviceStatus: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  const { paired } = useSiren();

  return (
    <Stack.Navigator
      key={paired ? 'paired' : 'unpaired'}
      initialRouteName={paired ? 'DeviceStatus' : 'DeviceConnection'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="DeviceConnection"
        component={DeviceConnectionScreen}
      />
      <Stack.Screen name="DeviceStatus" component={DeviceStatusScreen} />
    </Stack.Navigator>
  );
}
