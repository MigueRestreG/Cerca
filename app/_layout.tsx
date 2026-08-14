import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';

import { useTheme } from '@/hooks/use-theme';
import { queryClient } from '@/lib/query-client';
import { AppProvider } from '@/providers/app-provider';
import { AuthProvider, useAuth } from '@/providers/auth-provider';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ fade: true, duration: 180 });

function RootStack() {
  const { loading } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loading]);

  if (loading) {
    return null;
  }

  return (
    <>
      <LinearGradient
        colors={['#040506', '#050709', '#020304']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <View style={{ position: 'absolute', left: -120, top: 100, width: 280, height: 280, borderRadius: 280, backgroundColor: theme.primaryGlow, opacity: 0.7 }} />
      <View style={{ position: 'absolute', right: -100, top: 40, width: 260, height: 260, borderRadius: 260, backgroundColor: theme.blueGlow, opacity: 0.58 }} />
      <View style={{ position: 'absolute', left: 40, bottom: 140, width: 180, height: 180, borderRadius: 180, backgroundColor: theme.whiteGlow, opacity: 0.5 }} />
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(Auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <AuthProvider>
              <RootStack />
            </AuthProvider>
          </AppProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
