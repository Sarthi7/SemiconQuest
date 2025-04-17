import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
//   const [fontsLoaded] = useFonts({
//     'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
//     'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
//     'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
//   });

//   if (!fontsLoaded) {
//     return null;
//   }

  return (
    <SafeAreaProvider>
        <LinearGradient
                colors={['#F9FCE7', '#e6f2ff']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
            <StatusBar style="dark" />
            <Stack 
                screenOptions={{
                headerShown: false,
                animation: 'fade',
                contentStyle: { backgroundColor: 'transparent' },
                }}
            />
        </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});