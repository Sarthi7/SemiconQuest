
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter, useNavigation } from 'expo-router';
import { useState } from 'react';
import { Image } from 'react-native';
import MenuButton from '../components/MenuButton';
import IconButton from '../components/IconButton';

export default function HomeScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const [volIcon, changeVol] = useState('volume-high');

    const updateVol = () => {
        changeVol(prev => prev == 'volume-high' ? 'volume-off' : 'volume-high');
    }

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
                            onPress={() => router.replace('/level-select')}
                        />
                        <MenuButton
                            icon="school"
                            title="Tutorials"
                            onPress={() => router.replace('/tutorials')}
                        />
                        <MenuButton
                            icon="trophy"
                            title="Leaderboards"
                            onPress={() => router.replace('/leaderboards')}
                        />
                        <MenuButton
                            icon="medal"
                            title="Achievements"
                            onPress={() => router.replace('/achievements')}
                        />
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.iconButtonsContainer}>
                            <IconButton icon="information" onPress={() => router.replace('/about')} />
                            <IconButton icon="account" onPress={() => router.replace('/profile')} />
                            <IconButton icon={volIcon} onPress={() => updateVol()} />
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
        fontSize: 14,
        color: '#9999cc',
        marginTop: 10,
    },
});