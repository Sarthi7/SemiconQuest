import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProgressContext } from '../../../utils/dataStore';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Level 2 constants and configuration
const LEVEL_CONFIG = {
    name: "Level 2",
    totalTurns: 5,
    baseYield: 90, // 90% yield
    pricePerChip: 15, // $15 per chip
    waferCost: 10, // $10 per wafer
    fixedCosts: 1000, // $1000 fixed costs per turn
    inventoryCost: 1.5, // $1.5 per chip in inventory
    winProfitThreshold: 7500, // $7500 profit to win
    minOTD: 80, // 80% minimum OTD to win
    // New for Level 2
    fabOvertimeCost: 2000, // Additional cost for fab overtime
    atpOvertimeCost: 1500, // Additional cost for ATP overtime
    fabCapacity: {
        normal: 1500, // Normal fab capacity
        overtime: 2000, // Overtime fab capacity
    },
    atpCapacity: {
        normal: 1200, // Normal ATP capacity
        overtime: 1600, // Overtime ATP capacity
    },
    demandSettings: {
        initialDemand: 1000,
        growthRate: 1.15, // 15% growth per turn (increased from Level 1)
        randomFactor: 0.05, // ±5% randomness
    }
};

export default function Level02Game() {
    const router = useRouter();
    const { completeLevel, isLevelCompleted, unlockAchievement } = useProgressContext();

    // Game state
    const [currentTurn, setCurrentTurn] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    // Player decisions for current turn
    const [wafersToLaunch, setWafersToLaunch] = useState(1000);
    const [useFabOvertime, setUseFabOvertime] = useState(false);
    const [useAtpOvertime, setUseAtpOvertime] = useState(false);

    // Game metrics
    const [cash, setCash] = useState(5000);
    const [totalProfit, setTotalProfit] = useState(0);
    const [inventory, setInventory] = useState(200); // Starting with some inventory
    const [wip, setWip] = useState(0); // Work in progress (chips in fab)
    const [delivery, setDelivery] = useState({ total: 0, onTime: 0 });
    const [demand, setDemand] = useState(LEVEL_CONFIG.demandSettings.initialDemand);
    const [fabUsage, setFabUsage] = useState(0); // Track fab capacity usage
    const [atpUsage, setAtpUsage] = useState(0); // Track ATP capacity usage

    // History tracking
    const [history, setHistory] = useState([]);

    // Initialize the game
    useEffect(() => {
        // Calculate next turn demand (for display purposes)
        const nextDemand = calculateNextDemand();
        setDemand(nextDemand);
    }, []);

    // Calculate demand for the next turn (with growth rate and random factor)
    const calculateNextDemand = () => {
        const baseDemand = LEVEL_CONFIG.demandSettings.initialDemand *
            Math.pow(LEVEL_CONFIG.demandSettings.growthRate, currentTurn - 1);

        // Add randomness factor
        const randomFactor = 1 + (Math.random() * LEVEL_CONFIG.demandSettings.randomFactor * 2 -
            LEVEL_CONFIG.demandSettings.randomFactor);

        return Math.round(baseDemand * randomFactor);
    };

    // Process turn when player confirms decisions
    const processTurn = () => {
        // 1. Calculate fab production
        const fabCapacity = useFabOvertime
            ? LEVEL_CONFIG.fabCapacity.overtime
            : LEVEL_CONFIG.fabCapacity.normal;

        const actualWafersProcessed = Math.min(wafersToLaunch, fabCapacity);
        const actualChipsProduced = Math.floor(actualWafersProcessed * (LEVEL_CONFIG.baseYield / 100));

        // 2. Calculate ATP (assembly, test, packaging) production
        const atpCapacity = useAtpOvertime
            ? LEVEL_CONFIG.atpCapacity.overtime
            : LEVEL_CONFIG.atpCapacity.normal;

        // WIP from previous turn + new chips go to ATP
        const totalWipForAtp = wip + actualChipsProduced;
        const actualChipsAssembled = Math.min(totalWipForAtp, atpCapacity);

        // 3. Update WIP (work in progress)
        const newWip = totalWipForAtp - actualChipsAssembled;

        // 4. Update inventory (add newly assembled chips)
        const newInventoryBeforeSales = inventory + actualChipsAssembled;

        // 5. Calculate sales
        const currentDemand = demand;
        const actualSales = Math.min(currentDemand, newInventoryBeforeSales);
        const newInventoryAfterSales = newInventoryBeforeSales - actualSales;

        // 6. Calculate on-time delivery
        const otdPercentage = Math.round((actualSales / currentDemand) * 100);

        // 7. Calculate costs
        const waferCost = wafersToLaunch * LEVEL_CONFIG.waferCost;
        const fabOvertimeCost = useFabOvertime ? LEVEL_CONFIG.fabOvertimeCost : 0;
        const atpOvertimeCost = useAtpOvertime ? LEVEL_CONFIG.atpOvertimeCost : 0;
        const inventoryCost = newInventoryAfterSales * LEVEL_CONFIG.inventoryCost;
        const totalCosts = waferCost + fabOvertimeCost + atpOvertimeCost +
            LEVEL_CONFIG.fixedCosts + inventoryCost;

        // 8. Calculate revenue and profit
        const revenue = actualSales * LEVEL_CONFIG.pricePerChip;
        const turnProfit = revenue - totalCosts;

        // 9. Update cash and total profit
        const newCash = cash + turnProfit;
        const newTotalProfit = totalProfit + turnProfit;

        // 10. Update delivery metrics
        const newDelivery = {
            total: delivery.total + currentDemand,
            onTime: delivery.onTime + actualSales
        };

        // 11. Track fab and ATP usage for metrics
        const fabUsagePercent = Math.round((actualWafersProcessed / fabCapacity) * 100);
        const atpUsagePercent = Math.round((actualChipsAssembled / atpCapacity) * 100);

        // 12. Record turn history
        const turnRecord = {
            turn: currentTurn,
            demand: currentDemand,
            wafersLaunched: wafersToLaunch,
            actualWafersProcessed,
            fabOvertime: useFabOvertime,
            atpOvertime: useAtpOvertime,
            chipsProduced: actualChipsProduced,
            chipsAssembled: actualChipsAssembled,
            wip: newWip,
            inventoryBefore: newInventoryBeforeSales,
            sales: actualSales,
            inventoryAfter: newInventoryAfterSales,
            otd: otdPercentage,
            costs: {
                wafer: waferCost,
                fabOvertime: fabOvertimeCost,
                atpOvertime: atpOvertimeCost,
                fixed: LEVEL_CONFIG.fixedCosts,
                inventory: inventoryCost,
                total: totalCosts
            },
            revenue,
            profit: turnProfit,
            cash: newCash,
            fabUsage: fabUsagePercent,
            atpUsage: atpUsagePercent
        };

        // 13. Update state with all new values
        setWip(newWip);
        setInventory(newInventoryAfterSales);
        setCash(newCash);
        setTotalProfit(newTotalProfit);
        setDelivery(newDelivery);
        setFabUsage(fabUsagePercent);
        setAtpUsage(atpUsagePercent);
        setHistory(prevHistory => [...prevHistory, turnRecord]);

        // 14. Check if game is over
        if (currentTurn >= LEVEL_CONFIG.totalTurns) {
            finishGame(newTotalProfit, newDelivery);
        } else {
            // 15. Prepare for next turn
            setCurrentTurn(currentTurn + 1);
            const nextDemand = calculateNextDemand();
            setDemand(nextDemand);

            // Reset decision variables to reasonable defaults based on next demand
            setWafersToLaunch(Math.round(nextDemand * 1.1)); // 10% buffer
            setUseFabOvertime(false);
            setUseAtpOvertime(false);
        }
    };

    // Handle game completion
    const finishGame = (finalProfit, finalDelivery) => {
        const otdPercentage = Math.round((finalDelivery.onTime / finalDelivery.total) * 100);

        // Check win conditions
        const isProfitSufficient = finalProfit >= LEVEL_CONFIG.winProfitThreshold;
        const isOtdSufficient = otdPercentage >= LEVEL_CONFIG.minOTD;
        const gameWon = isProfitSufficient && isOtdSufficient;

        setGameOver(true);
        setGameWon(gameWon);

        // Show result message
        const title = gameWon ? "Level Complete!" : "Level Failed";
        let message = gameWon
            ? `Congratulations! You've successfully managed the semiconductor supply chain.\n\n`
            : `Unfortunately, you didn't meet the targets for this level.\n\n`;

        message += `Final Profit: $${finalProfit.toLocaleString()}\n`;
        message += `On-Time Delivery: ${otdPercentage}%\n\n`;

        if (!isProfitSufficient) {
            message += `Profit target: $${LEVEL_CONFIG.winProfitThreshold.toLocaleString()}\n`;
        }

        if (!isOtdSufficient) {
            message += `OTD target: ${LEVEL_CONFIG.minOTD}%\n`;
        }

        // Unlock achievements if applicable
        if (gameWon) {
            // Capacity Master achievement for high fab/ATP usage
            if (fabUsage >= 90 && atpUsage >= 90) {
                unlockAchievement('capacity_master', { level: 2 });
            }

            // Efficiency Expert for maintaining low inventory costs
            const avgInventoryCost = history.reduce((sum, turn) => sum + turn.costs.inventory, 0) / history.length;
            if (avgInventoryCost < 500) {
                unlockAchievement('efficiency_expert', { level: 2 });
            }
        }

        Alert.alert(
            title,
            message,
            [
                {
                    text: "See Results",
                    onPress: () => {
                        if (gameWon) {
                            // Mark level as completed in progress store
                            completeLevel(2);

                            // Navigate to quiz
                            router.push('/levels/level02/quiz');
                        } else {
                            // Let player try again
                            resetGame();
                        }
                    }
                }
            ]
        );
    };

    // Reset the game state to initial values
    const resetGame = () => {
        setCurrentTurn(1);
        setGameOver(false);
        setGameWon(false);
        setWafersToLaunch(1000);
        setUseFabOvertime(false);
        setUseAtpOvertime(false);
        setCash(5000);
        setTotalProfit(0);
        setInventory(200);
        setWip(0);
        setDelivery({ total: 0, onTime: 0 });
        setFabUsage(0);
        setAtpUsage(0);
        setHistory([]);

        // Recalculate initial demand
        const initialDemand = calculateNextDemand();
        setDemand(initialDemand);
    };

    // Handle exit from the game
    const handleExit = () => {
        Alert.alert(
            "Exit Level",
            "Are you sure you want to exit this level? Your progress will be lost.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Exit", onPress: () => router.back() }
            ]
        );
    };

    // Calculate on-time delivery percentage
    const getOTDPercentage = () => {
        if (delivery.total === 0) return 100; // No deliveries yet
        return Math.round((delivery.onTime / delivery.total) * 100);
    };

    return (
        <>
            <SafeAreaView style={styles.safeArea}>
                {/* <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

                <View style={styles.header}>
                    <TouchableOpacity onPress={handleExit} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#3f3f9f" />
                    </TouchableOpacity>
                    <Text style={styles.title}>{LEVEL_CONFIG.name}</Text>
                    <Text style={styles.turnIndicator}>Turn {currentTurn} of {LEVEL_CONFIG.totalTurns}</Text>
                </View> */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleExit}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
                    </TouchableOpacity>

                    <Text style={styles.title}>{LEVEL_CONFIG.name}</Text>

                    {/* Empty View for header balance */}
                    <View style={styles.placeholder}>
                        <Text style={styles.turnIndicator}>Turn {currentTurn} of {LEVEL_CONFIG.totalTurns}</Text>
                    </View>
                </View>

                <ScrollView style={styles.scrollView}>
                    {/* Game Dashboard */}
                    <View style={styles.dashboardContainer}>
                        <View style={styles.metricsRow}>
                            <View style={styles.metricCard}>
                                <Text style={styles.metricLabel}>Cash</Text>
                                <Text style={styles.metricValue}>${cash.toLocaleString()}</Text>
                            </View>
                            <View style={styles.metricCard}>
                                <Text style={styles.metricLabel}>Profit</Text>
                                <Text style={[
                                    styles.metricValue,
                                    totalProfit < 0 ? styles.negativeValue : null
                                ]}>
                                    ${totalProfit.toLocaleString()}
                                </Text>
                            </View>
                            <View style={styles.metricCard}>
                                <Text style={styles.metricLabel}>OTD</Text>
                                <Text style={styles.metricValue}>{getOTDPercentage()}%</Text>
                            </View>
                        </View>

                        <View style={styles.demandSection}>
                            <Text style={styles.sectionTitle}>Customer Demand</Text>
                            <Text style={styles.demandValue}>Current Demand: {demand.toLocaleString()} chips</Text>
                            <Text style={styles.demandTrend}>
                                <Ionicons
                                    name="trending-up"
                                    size={16}
                                    color="#3f3f9f"
                                /> Growing ~{Math.round((LEVEL_CONFIG.demandSettings.growthRate - 1) * 100)}% per turn
                            </Text>
                        </View>

                        <View style={styles.inventorySection}>
                            <Text style={styles.sectionTitle}>Inventory & WIP</Text>
                            <View style={styles.metricsRow}>
                                <View style={styles.metricCard}>
                                    <Text style={styles.metricLabel}>Finished Inventory</Text>
                                    <Text style={styles.metricValue}>{inventory.toLocaleString()} chips</Text>
                                    <Text style={styles.metricCost}>
                                        Cost: ${(inventory * LEVEL_CONFIG.inventoryCost).toLocaleString()}/turn
                                    </Text>
                                </View>
                                <View style={styles.metricCard}>
                                    <Text style={styles.metricLabel}>Work In Progress</Text>
                                    <Text style={styles.metricValue}>{wip.toLocaleString()} chips</Text>
                                    <Text style={styles.metricNote}>In fab → assembly</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.capacitySection}>
                            <Text style={styles.sectionTitle}>Production Capacity</Text>
                            <View style={styles.metricsRow}>
                                <View style={styles.metricCard}>
                                    <Text style={styles.metricLabel}>Fab Capacity</Text>
                                    <Text style={styles.metricValue}>
                                        {(useFabOvertime
                                            ? LEVEL_CONFIG.fabCapacity.overtime
                                            : LEVEL_CONFIG.fabCapacity.normal).toLocaleString()}
                                    </Text>
                                    <Text style={styles.metricNote}>
                                        {useFabOvertime ? 'Overtime (+$2000)' : 'Normal'}
                                    </Text>
                                </View>
                                <View style={styles.metricCard}>
                                    <Text style={styles.metricLabel}>ATP Capacity</Text>
                                    <Text style={styles.metricValue}>
                                        {(useAtpOvertime
                                            ? LEVEL_CONFIG.atpCapacity.overtime
                                            : LEVEL_CONFIG.atpCapacity.normal).toLocaleString()}
                                    </Text>
                                    <Text style={styles.metricNote}>
                                        {useAtpOvertime ? 'Overtime (+$1500)' : 'Normal'}
                                    </Text>
                                </View>
                            </View>

                            {/* Capacity Usage Indicators */}
                            {fabUsage > 0 && (
                                <View style={styles.usageContainer}>
                                    <Text style={styles.usageLabel}>Fab Usage: {fabUsage}%</Text>
                                    <View style={styles.usageBarContainer}>
                                        <View
                                            style={[
                                                styles.usageBar,
                                                { width: `${fabUsage}%` },
                                                fabUsage > 90 ? styles.highUsage :
                                                    fabUsage > 70 ? styles.mediumUsage : styles.lowUsage
                                            ]}
                                        />
                                    </View>
                                </View>
                            )}

                            {atpUsage > 0 && (
                                <View style={styles.usageContainer}>
                                    <Text style={styles.usageLabel}>ATP Usage: {atpUsage}%</Text>
                                    <View style={styles.usageBarContainer}>
                                        <View
                                            style={[
                                                styles.usageBar,
                                                { width: `${atpUsage}%` },
                                                atpUsage > 90 ? styles.highUsage :
                                                    atpUsage > 70 ? styles.mediumUsage : styles.lowUsage
                                            ]}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Decision Section */}
                        <View style={styles.decisionSection}>
                            <Text style={styles.sectionTitle}>Make Your Decisions</Text>

                            <View style={styles.decisionCard}>
                                <Text style={styles.decisionLabel}>Wafers to Launch</Text>
                                <View style={styles.inputRow}>
                                    <TouchableOpacity
                                        style={styles.inputButton}
                                        onPress={() => setWafersToLaunch(Math.max(0, wafersToLaunch - 100))}
                                    >
                                        <Text style={styles.inputButtonText}>-100</Text>
                                    </TouchableOpacity>

                                    <Text style={styles.inputValue}>{wafersToLaunch}</Text>

                                    <TouchableOpacity
                                        style={styles.inputButton}
                                        onPress={() => setWafersToLaunch(wafersToLaunch + 100)}
                                    >
                                        <Text style={styles.inputButtonText}>+100</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.inputCost}>
                                    Cost: ${(wafersToLaunch * LEVEL_CONFIG.waferCost).toLocaleString()}
                                </Text>
                            </View>

                            <View style={styles.toggleRow}>
                                <View style={styles.toggleOption}>
                                    <Text style={styles.toggleLabel}>Use Fab Overtime</Text>
                                    <TouchableOpacity
                                        style={[
                                            styles.toggleButton,
                                            useFabOvertime ? styles.toggleActive : null
                                        ]}
                                        onPress={() => setUseFabOvertime(!useFabOvertime)}
                                    >
                                        <Text style={[
                                            styles.toggleButtonText,
                                            useFabOvertime ? styles.toggleActiveText : null
                                        ]}>
                                            {useFabOvertime ? 'ON' : 'OFF'}
                                        </Text>
                                    </TouchableOpacity>
                                    {useFabOvertime && (
                                        <Text style={styles.toggleCost}>
                                            +${LEVEL_CONFIG.fabOvertimeCost.toLocaleString()}
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.toggleOption}>
                                    <Text style={styles.toggleLabel}>Use ATP Overtime</Text>
                                    <TouchableOpacity
                                        style={[
                                            styles.toggleButton,
                                            useAtpOvertime ? styles.toggleActive : null
                                        ]}
                                        onPress={() => setUseAtpOvertime(!useAtpOvertime)}
                                    >
                                        <Text style={[
                                            styles.toggleButtonText,
                                            useAtpOvertime ? styles.toggleActiveText : null
                                        ]}>
                                            {useAtpOvertime ? 'ON' : 'OFF'}
                                        </Text>
                                    </TouchableOpacity>
                                    {useAtpOvertime && (
                                        <Text style={styles.toggleCost}>
                                            +${LEVEL_CONFIG.atpOvertimeCost.toLocaleString()}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={processTurn}
                            >
                                <Text style={styles.confirmButtonText}>Confirm Decisions</Text>
                            </TouchableOpacity>
                        </View>

                        {/* History Section */}
                        {history.length > 0 && (
                            <View style={styles.historySection}>
                                <Text style={styles.sectionTitle}>History</Text>

                                {history.map((turn, index) => (
                                    <View key={index} style={styles.historyCard}>
                                        <Text style={styles.historyTitle}>Turn {turn.turn}</Text>

                                        <View style={styles.historyRow}>
                                            <Text style={styles.historyLabel}>Demand:</Text>
                                            <Text style={styles.historyValue}>{turn.demand.toLocaleString()} chips</Text>
                                        </View>

                                        <View style={styles.historyRow}>
                                            <Text style={styles.historyLabel}>Wafers Launched:</Text>
                                            <Text style={styles.historyValue}>{turn.wafersLaunched.toLocaleString()}</Text>
                                        </View>

                                        <View style={styles.historyRow}>
                                            <Text style={styles.historyLabel}>Chips Produced:</Text>
                                            <Text style={styles.historyValue}>{turn.chipsProduced.toLocaleString()}</Text>
                                        </View>

                                        <View style={styles.historyRow}>
                                            <Text style={styles.historyLabel}>Chips Assembled:</Text>
                                            <Text style={styles.historyValue}>{turn.chipsAssembled.toLocaleString()}</Text>
                                        </View>

                                        <View style={styles.historyRow}>
                                            <Text style={styles.historyLabel}>Sales:</Text>
                                            <Text style={styles.historyValue}>{turn.sales.toLocaleString()} chips</Text>
                                        </View>

                                        <View style={styles.historyRow}>
                                            <Text style={styles.historyLabel}>On-Time Delivery:</Text>
                                            <Text style={styles.historyValue}>{turn.otd}%</Text>
                                        </View>

                                        <View style={styles.historyRow}>
                                            <Text style={styles.historyLabel}>Profit:</Text>
                                            <Text style={[
                                                styles.historyValue,
                                                turn.profit < 0 ? styles.negativeValue : styles.positiveValue
                                            ]}>
                                                ${turn.profit.toLocaleString()}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
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
    // header: {
    //     padding: 15,
    //     alignItems: 'center',
    //     position: 'relative',
    // },
    // backButton: {
    //     position: 'absolute',
    //     left: 15,
    //     top: 15,
    // },
    // title: {
    //     fontSize: 24,
    //     fontWeight: 'bold',
    //     color: '#3f3f9f',
    // },
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
        width: 74,
    },
    turnIndicator: {
        fontSize: 14,
        color: '#6a6ad9',
        marginTop: 0,
    },
    scrollView: {
        flex: 1,
    },
    dashboardContainer: {
        padding: 15,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    metricCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        flex: 1,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'center',
    },
    metricLabel: {
        fontSize: 14,
        color: '#6a6ad9',
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3f3f9f',
    },
    metricCost: {
        fontSize: 12,
        color: '#9999cc',
        marginTop: 4,
    },
    metricNote: {
        fontSize: 12,
        color: '#9999cc',
        marginTop: 4,
    },
    negativeValue: {
        color: '#e74c3c',
    },
    positiveValue: {
        color: '#2ecc71',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3f3f9f',
        marginBottom: 10,
        marginTop: 10,
    },
    demandSection: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    demandValue: {
        fontSize: 16,
        color: '#3f3f9f',
        marginBottom: 5,
    },
    demandTrend: {
        fontSize: 14,
        color: '#6a6ad9',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inventorySection: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    capacitySection: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    usageContainer: {
        marginTop: 10,
    },
    usageLabel: {
        fontSize: 14,
        color: '#3f3f9f',
        marginBottom: 5,
    },
    usageBarContainer: {
        height: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    usageBar: {
        height: '100%',
        borderRadius: 5,
    },
    lowUsage: {
        backgroundColor: '#2ecc71', // Green
    },
    mediumUsage: {
        backgroundColor: '#f39c12', // Orange
    },
    highUsage: {
        backgroundColor: '#e74c3c', // Red
    },
    decisionSection: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    decisionCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    decisionLabel: {
        fontSize: 16,
        color: '#3f3f9f',
        marginBottom: 8,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    inputButton: {
        backgroundColor: '#e6f2ff',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#d1e0ff',
    },
    inputButtonText: {
        color: '#3f3f9f',
        fontWeight: 'bold',
    },
    inputValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3f3f9f',
        minWidth: 80,
        textAlign: 'center',
    },
    inputCost: {
        fontSize: 14,
        color: '#9999cc',
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    toggleOption: {
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    toggleLabel: {
        fontSize: 14,
        color: '#3f3f9f',
        marginBottom: 8,
        textAlign: 'center',
    },
    toggleButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#dadada',
    },
    toggleActive: {
        backgroundColor: '#6a6ad9',
        borderColor: '#5151c2',
    },
    toggleButtonText: {
        fontWeight: 'bold',
        color: '#9999cc',
    },
    toggleActiveText: {
        color: 'white',
    },
    toggleCost: {
        fontSize: 14,
        color: '#e74c3c',
        marginTop: 4,
    },
    confirmButton: {
        backgroundColor: '#6a6ad9',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    historySection: {
        marginTop: 10,
    },
    historyCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3f3f9f',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 5,
    },
    historyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    historyLabel: {
        fontSize: 14,
        color: '#6a6ad9',
    },
    historyValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3f3f9f',
    },
});