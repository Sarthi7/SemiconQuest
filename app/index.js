
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { Image } from 'react-native';
import MenuButton from '../components/MenuButton';
import IconButton from '../components/IconButton';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.contentContainer}>
                    <View style={styles.headerContainer}>
                        <View style={styles.logoWrapper}>
                            <Image 
                                source={require('../assets/images/logo.png')} 
                                style={styles.logo} 
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.title}>Semicon Quest</Text>
                        <Text style={styles.subtitle}>Begin your journey</Text>
                    </View>

                    <View style={styles.menuContainer}>
                        <MenuButton
                            icon="gamepad-variant"
                            title="Play Game"
                            onPress={() => router.push('/levels')}
                        />
                        <MenuButton
                            icon="school"
                            title="Tutorials"
                            onPress={() => router.push('/tutorials')}
                        />
                        <MenuButton
                            icon="trophy"
                            title="Leaderboards"
                            onPress={() => router.push('/leaderboards')}
                        />
                        <MenuButton
                            icon="medal"
                            title="Achievements"
                            onPress={() => router.push('/achievements')}
                        />
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.iconButtonsContainer}>
                            <IconButton icon="cog" onPress={() => router.push('/settings')} />
                            <IconButton icon="account" onPress={() => router.push('/profile')} />
                            <IconButton icon="volume-high" onPress={() => console.log('Toggle sound')} />
                        </View>
                        <Text style={styles.version}>Version 1.0.0</Text>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingTop: StatusBar.currentHeight || 25,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    headerContainer: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#3f3f9f',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 18,
        // fontFamily: 'Poppins-Regular',
        color: '#6a6ad9',
        marginTop: 5,
    },
    menuContainer: {
        marginVertical: 20,
    },
    footer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    iconButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
    },
    version: {
        // fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#9999cc',
        marginTop: 10,
    },
});