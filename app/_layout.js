import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProgressProvider } from '../utils/dataStore';
// import * as SplashScreen from 'expo-splash-screen';

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
    <ProgressProvider>
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
                    animationDuration: 250,
                    presentation: 'card',
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                    animationTypeForReplace: 'push',
                    contentStyle: { backgroundColor: 'transparent' },
                }}
            />
                {/* <Stack.Screen name="index" />
                <Stack.Screen name="level-select" />
                <Stack.Screen name="single-player" />
                <Stack.Screen name="levels/Level1" />
                <Stack.Screen name="levels/Level1/game" />
                <Stack.Screen name="levels/Level1/quiz" /> */}
                {/* Add other level routes as you build them */}
                {/* Other screens */}
                {/* <Stack.Screen name="tutorials" />
                <Stack.Screen name="leaderboards" />
                <Stack.Screen name="achievements" /> */}
            {/* </Stack> */}
        </LinearGradient>
    </ProgressProvider>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});