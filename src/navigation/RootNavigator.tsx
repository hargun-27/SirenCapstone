import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { TabNavigator } from './TabNavigator';
import { MotionAlertScreen } from '../screens/alerts/MotionAlertScreen';
import { useSiren } from '../state/SirenContext';

enableScreens(true);

export type RootStackParamList = {
  Tabs: undefined;
  MotionAlert: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

/** When alarm is triggered (motionDetectedAt set), show motion alert automatically; when untriggered, dismiss it so user sees disarmed state. */
function TabsWithMotionListener(
  props: NativeStackScreenProps<RootStackParamList, 'Tabs'>,
) {
  const { navigation } = props;
  const { motionDetectedAt, motionAlertsEnabled } = useSiren();
  const wasTriggeredRef = useRef(!!motionDetectedAt);

  // Show motion alert when device becomes triggered
  useEffect(() => {
    if (motionDetectedAt && motionAlertsEnabled) {
      wasTriggeredRef.current = true;
      navigation.navigate('MotionAlert');
    }
  }, [motionDetectedAt, motionAlertsEnabled, navigation]);

  // When fetch shows device is untriggered, dismiss motion alert immediately so user sees disarmed state
  useEffect(() => {
    if (motionDetectedAt) {
      wasTriggeredRef.current = true;
    } else if (wasTriggeredRef.current) {
      wasTriggeredRef.current = false;
      // Only go back if the motion alert is actually on the stack (avoids "GO_BACK was not handled")
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, [motionDetectedAt, navigation]);

  return <TabNavigator />;
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Tabs" component={TabsWithMotionListener} />
        <RootStack.Screen
          name="MotionAlert"
          component={MotionAlertScreen}
          options={{ presentation: 'modal' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
