import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useProgressContext } from '../../../utils/dataStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Level02Index() {
    const router = useRouter();
    const { isLevelUnlocked } = useProgressContext();

    // Check if level is unlocked
    const levelUnlocked = isLevelUnlocked(2);

    // Start the level
    const startLevel = () => {
        if (levelUnlocked) {
            router.push('/levels/level02/game');
        }
    };

    return (
        <>
            <SafeAreaView style={styles.safeArea}>
                {/* <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.push('/level-select')}
                    >
                        <Ionicons name="arrow-back" size={24} color="#3f3f9f" />
                    </TouchableOpacity>
                    <Text style={styles.levelTitle}>Level 2: Capacity & Lead Times</Text>
                </View> */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.replace('/level-select')}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Level 2</Text>

                    {/* Empty View for header balance */}
                    <View style={styles.placeholder} />
                </View>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.contentContainer}>
                        <View style={styles.imageContainer}>
                            <View style={styles.imagePlaceholder}>
                                <Ionicons name="time-outline" size={80} color="#6a6ad9" />
                            </View>
                        </View>

                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>Level Overview</Text>
                            <Text style={styles.infoText}>
                                In this level, you'll manage both fabrication and assembly processes
                                with decisions about capacity, overtime, and inventory management.
                                Your customer's demand is growing steadily, so you'll need to balance
                                production capacity with inventory costs.
                            </Text>
                        </View>

                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>New Elements</Text>
                            <View style={styles.bulletPoint}>
                                <Ionicons name="ellipse" size={8} color="#6a6ad9" style={styles.bullet} />
                                <Text style={styles.bulletText}>
                                    Work-in-Progress (WIP) tracking between fab and assembly
                                </Text>
                            </View>
                            <View style={styles.bulletPoint}>
                                <Ionicons name="ellipse" size={8} color="#6a6ad9" style={styles.bullet} />
                                <Text style={styles.bulletText}>
                                    Overtime options for both fab and assembly/test processes
                                </Text>
                            </View>
                            <View style={styles.bulletPoint}>
                                <Ionicons name="ellipse" size={8} color="#6a6ad9" style={styles.bullet} />
                                <Text style={styles.bulletText}>
                                    Capacity utilization tracking to help optimize production
                                </Text>
                            </View>
                            <View style={styles.bulletPoint}>
                                <Ionicons name="ellipse" size={8} color="#6a6ad9" style={styles.bullet} />
                                <Text style={styles.bulletText}>
                                    Inventory costs and management across the supply chain
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>Win Conditions</Text>
                            <Text style={styles.infoText}>
                                To complete this level, you must:
                            </Text>
                            <View style={styles.bulletPoint}>
                                <Ionicons name="checkmark-circle" size={16} color="#2ecc71" style={styles.bullet} />
                                <Text style={styles.bulletText}>
                                    Achieve at least $7,500 in total profit after 5 turns
                                </Text>
                            </View>
                            <View style={styles.bulletPoint}>
                                <Ionicons name="checkmark-circle" size={16} color="#2ecc71" style={styles.bullet} />
                                <Text style={styles.bulletText}>
                                    Maintain at least 80% on-time delivery rate
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>Tips</Text>
                            <View style={styles.bulletPoint}>
                                <Ionicons name="bulb" size={16} color="#f39c12" style={styles.bullet} />
                                <Text style={styles.bulletText}>
                                    Plan for 2-turn lead times (1 turn for fab + 1 turn for assembly)
                                </Text>
                            </View>
                            <View style={styles.bulletPoint}>
                                <Ionicons name="bulb" size={16} color="#f39c12" style={styles.bullet} />
                                <Text style={styles.bulletText}>
                                    Use overtime strategically - it's expensive but can help meet spikes in demand
                                </Text>
                            </View>
                            <View style={styles.bulletPoint}>
                                <Ionicons name="bulb" size={16} color="#f39c12" style={styles.bullet} />
                                <Text style={styles.bulletText}>
                                    Balance inventory carrying costs against the risk of stockouts
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.startButton,
                                !levelUnlocked && styles.disabledButton
                            ]}
                            onPress={startLevel}
                            disabled={!levelUnlocked}
                        >
                            <Text style={styles.startButtonText}>
                                {levelUnlocked ? "Start Level" : "Level Locked"}
                            </Text>
                            {levelUnlocked ? (
                                <Ionicons name="play" size={20} color="white" />
                            ) : (
                                <Ionicons name="lock-closed" size={20} color="white" />
                            )}
                        </TouchableOpacity>

                        {!levelUnlocked && (
                            <Text style={styles.lockedText}>
                                Complete Level 1 to unlock this level.
                            </Text>
                        )}
                    </View>
                </ScrollView>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3f3f9f',
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 15,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    imagePlaceholder: {
        width: 200,
        height: 200,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3f3f9f',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#3f3f9f',
        lineHeight: 24,
        marginBottom: 10,
    },
    bulletPoint: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    bullet: {
        marginTop: 5,
        marginRight: 8,
    },
    bulletText: {
        fontSize: 16,
        color: '#3f3f9f',
        flex: 1,
        lineHeight: 22,
    },
    startButton: {
        backgroundColor: '#6a6ad9',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginTop: 10,
        marginBottom: 10,
    },
    startButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    disabledButton: {
        backgroundColor: '#9999cc',
    },
    lockedText: {
        textAlign: 'center',
        color: '#e74c3c',
        fontSize: 16,
        marginBottom: 20,
    },
});