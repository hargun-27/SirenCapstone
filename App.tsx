/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Colors } from './src/theme/colors';
import { SirenProvider } from './src/state/SirenContext';

function App() {
  const missing: string[] = [];
  if (!GestureHandlerRootView) missing.push('GestureHandlerRootView');
  if (!SafeAreaProvider) missing.push('SafeAreaProvider');
  if (!SirenProvider) missing.push('SirenProvider');
  if (!RootNavigator) missing.push('RootNavigator');
  if (missing.length) {
    throw new Error(
      `Siren startup error: missing component export(s): ${missing.join(', ')}`,
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.background}
        />
        <SirenProvider>
          <RootNavigator />
        </SirenProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;
