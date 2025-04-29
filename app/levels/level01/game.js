import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { levelConfig } from '../../../utils/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const GameScreen = ({ navigation }) => {
    // Game state
    const router = useRouter();
    const [currentTurn, setCurrentTurn] = useState(1);
    const [profit, setProfit] = useState(0);
    const [totalChipsSold, setTotalChipsSold] = useState(0);
    const [totalDemand, setTotalDemand] = useState(0);
    const [inventory, setInventory] = useState(0);
    const [wafersInProcess, setWafersInProcess] = useState(0);
    const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
    const { totalTurns, baseYield, pricePerChip, waferCost, fixedCosts, inventoryCost, winProfitThreshold, minOTD } = levelConfig.level1;

    // Input state
    const [wafersToStart, setWafersToStart] = useState('0');

    // Demand forecast - generates stable demand that gradually increases
    const [demandForecast, setDemandForecast] = useState([]);

    // History tracking for reflection
    const [history, setHistory] = useState([]);

    // Initialize the game
    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        // Generate demand forecast for all turns (stable customer with slight increase)
        const initialDemand = 800;
        const growthRate = 1.1; // 10% growth per turn

        let forecast = [];
        for (let i = 0; i < totalTurns; i++) {
            // Calculate demand with slight randomness (±5%)
            const baseDemand = Math.floor(initialDemand * Math.pow(growthRate, i));
            const randomFactor = 0.95 + (Math.random() * 0.1); // Random between 0.95 and 1.05
            const demand = Math.floor(baseDemand * randomFactor);
            forecast.push(demand);
        }

        setDemandForecast(forecast);
        setCurrentTurn(1);
        setProfit(0);
        setInventory(0);
        setWafersInProcess(0);
        setTotalChipsSold(0);
        setTotalDemand(0);
        setGameStatus('playing');
        setHistory([]);
    };

    // Calculate expected output from wafers
    const calculateExpectedOutput = (wafers) => {
        return Math.floor(wafers * (baseYield / 100));
    };

    // Process a turn
    const processTurn = () => {
        // Parse input
        const wafers = parseInt(wafersToStart, 10) || 0;

        // Current demand for this turn
        const currentDemand = demandForecast[currentTurn - 1];

        // Move wafers in process to usable chips (with yield applied)
        const newChips = calculateExpectedOutput(wafers);

        // Update total inventory (previous inventory + new chips)
        const totalInventory = inventory + newChips;

        // Calculate how many chips we can sell (limited by inventory and demand)
        const chipsSold = Math.min(totalInventory, currentDemand);

        // Calculate remaining inventory after sales
        const remainingInventory = totalInventory - chipsSold;

        // Calculate revenue from sales
        const revenue = chipsSold * pricePerChip;

        // Calculate costs (wafer costs + fixed costs + inventory holding costs)
        const waferCosts = wafers * waferCost;
        const inventoryCosts = remainingInventory * inventoryCost;
        const totalCosts = waferCosts + fixedCosts + inventoryCosts;

        // Calculate turn profit
        const turnProfit = revenue - totalCosts;

        // Update state for next turn
        const newTotalProfit = profit + turnProfit;

        // Track OTD (On-Time Delivery) metrics
        const newTotalChipsSold = totalChipsSold + chipsSold;
        const newTotalDemand = totalDemand + currentDemand;
        const otdPercentage = Math.floor((newTotalChipsSold / newTotalDemand) * 100);

        // Save turn history for reflection
        const turnRecord = {
            turn: currentTurn,
            waferStarted: wafers,
            waferInProcess: wafersInProcess,
            chipProduced: newChips,
            demand: currentDemand,
            chipsSold,
            inventory: remainingInventory,
            revenue,
            costs: totalCosts,
            profit: turnProfit,
            otd: otdPercentage
        };
        setHistory([...history, turnRecord]);

        // Update game state
        setWafersInProcess(wafers);
        setInventory(remainingInventory);
        setProfit(newTotalProfit);
        setTotalChipsSold(newTotalChipsSold);
        setTotalDemand(newTotalDemand);

        // Move to next turn or end game
        if (currentTurn >= totalTurns) {
            // Game over - check win condition
            const finalOTD = Math.floor((newTotalChipsSold / newTotalDemand) * 100);

            if (newTotalProfit >= winProfitThreshold && finalOTD >= minOTD) {
                setGameStatus('won');
            } else {
                setGameStatus('lost');
            }
        } else {
            setCurrentTurn(currentTurn + 1);
            setWafersToStart('0'); // Reset input field
        }
    };

    const showGameOverScreen = () => {
        const otdPercentage = Math.floor((totalChipsSold / totalDemand) * 100);

        return (
            <View style={styles.gameOverContainer}>
                <Text style={styles.gameOverTitle}>
                    {gameStatus === 'won' ? 'Level Complete!' : 'Level Failed'}
                </Text>

                <View style={styles.resultsContainer}>
                    <Text style={styles.resultText}>Final Profit: ${profit}</Text>
                    <Text style={styles.resultText}>On-Time Delivery: {otdPercentage}%</Text>
                </View>

                {gameStatus === 'won' ? (
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>
                            Great job! You've successfully completed the level. Now it's time to test your knowledge with a short quiz!
                        </Text>
                    </View>
                ) : (
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>
                            You didn't meet the targets this time. Remember to balance production with demand and watch your inventory costs. Try again to improve your strategy!
                        </Text>
                    </View>)
                }

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => initializeGame()}>
                        <Text style={styles.buttonText}>Try Again</Text>
                    </TouchableOpacity>

                    {gameStatus === 'won' ? (
                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={() => router.replace('/levels/level01/quiz')}>
                            <Text style={styles.primaryButtonText}>Continue to Quiz</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={() => router.replace('/level-select')}>
                            <Text style={styles.primaryButtonText}>Back to Levels</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    const renderGameScreen = () => {
        // Current demand for this turn
        const currentDemand = demandForecast[currentTurn - 1];

        // Next turn forecast (if available)
        const nextTurnForecast = currentTurn < totalTurns
            ? demandForecast[currentTurn]
            : "N/A";

        // Calculate expected output from input
        const expectedOutput = calculateExpectedOutput(parseInt(wafersToStart, 10) || 0);

        // Calculate production vs demand
        const currentProduction = wafersInProcess > 0
            ? calculateExpectedOutput(wafersInProcess)
            : 0;
        const productionVsDemand = currentProduction - currentDemand;
        const productionStatus = productionVsDemand >= 0
            ? `Surplus by ${productionVsDemand} units`
            : `Under-production by ${Math.abs(productionVsDemand)} units`;

        return (
            <View style={styles.gameContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Factory Dashboard</Text>
                    <Text style={styles.turnText}>Turn {currentTurn} of {totalTurns}</Text>
                </View>

                {/* Demand Forecast Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Demand Forecast</Text>
                        <Text style={styles.sectionValue}>{currentDemand} units</Text>
                    </View>

                    <View style={styles.forecastChart}>
                        {/* Simple bar chart representation */}
                        {demandForecast.map((demand, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.forecastBar,
                                    {
                                        height: 20 + (demand / 100),
                                        opacity: index === currentTurn - 1 ? 1 : 0.5
                                    }
                                ]}
                            />
                        ))}
                    </View>

                    <Text style={styles.forecastText}>
                        Next turn forecast: {nextTurnForecast} units
                    </Text>
                </View>

                {/* Production Input Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Start Production</Text>
                    </View>

                    <View style={styles.inputRow}>
                        <Text style={styles.inputLabel}>Wafers to Start</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={wafersToStart}
                            onChangeText={setWafersToStart}
                            placeholder="Enter amount"
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <Text style={styles.inputLabel}>Fab Yield</Text>
                        <Text style={styles.staticValue}>{baseYield}%</Text>
                    </View>
                </View>

                {/* Expected Output Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Expected Output</Text>

                    <View style={styles.metricRow}>
                        <Text style={styles.metricLabel}>Input</Text>
                        <Text style={styles.metricValue}>
                            {parseInt(wafersToStart, 10) || 0} wafers
                        </Text>
                    </View>

                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${expectedOutput / (parseInt(wafersToStart, 10) || 1) * 100}%` }
                            ]}
                        />
                    </View>

                    <View style={styles.metricRow}>
                        <Text style={styles.metricLabel}>Usable Output</Text>
                        <Text style={styles.metricValue}>
                            {expectedOutput} wafers
                        </Text>
                    </View>
                </View>

                {/* Production vs Demand Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Production vs Demand</Text>

                    <View style={styles.metricRow}>
                        <Text style={styles.metricLabel}>Customer Demand</Text>
                        <Text style={styles.metricValue}>
                            {currentDemand} units
                        </Text>
                    </View>

                    <View style={styles.statusBar}>
                        <View
                            style={[
                                styles.statusFill,
                                {
                                    width: `${Math.min(100, (currentProduction / currentDemand) * 100)}%`,
                                    backgroundColor: productionVsDemand >= 0 ? '#4CAF50' : '#FFC107'
                                }
                            ]}
                        />
                    </View>

                    {productionVsDemand < 0 && (
                        <Text style={styles.warningText}>
                            ⚠️ {productionStatus}
                        </Text>
                    )}

                    {productionVsDemand >= 0 && (
                        <Text style={styles.successText}>
                            ✓ {productionStatus}
                        </Text>
                    )}
                </View>

                {/* Current Status Summary */}
                <View style={styles.statusContainer}>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>Inventory</Text>
                        <Text style={styles.statusValue}>{inventory} units</Text>
                    </View>

                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>In Process</Text>
                        <Text style={styles.statusValue}>{wafersInProcess} wafers</Text>
                    </View>

                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>Profit</Text>
                        <Text style={styles.statusValue}>${profit}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={processTurn}>
                    <Text style={styles.confirmButtonText}>Confirm Production</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <>
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.replace('/level-select')}
            >
                <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            
            <Text style={styles.title}>Level 1</Text>
            
            {/* Empty View for header balance */}
            <View style={styles.placeholder} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {gameStatus === 'playing' ? renderGameScreen() : showGameOverScreen()}
            </ScrollView>
        </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
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
        color: '#000',
      },
      placeholder: {
        width: 40,
      },
    scrollContent: {
        flexGrow: 1,
        padding: 16,
    },
    gameContainer: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3f3f9f',
    },
    turnText: {
        fontSize: 16,
        color: '#6a6ad9',
    },
    sectionContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#3f3f9f',
    },
    sectionValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3f3f9f',
    },
    forecastChart: {
        flexDirection: 'row',
        height: 100,
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        marginVertical: 12,
    },
    forecastBar: {
        width: 40,
        backgroundColor: '#E8C1C5',
        borderRadius: 4,
    },
    forecastText: {
        marginTop: 8,
        color: '#6a6ad9',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    inputLabel: {
        fontSize: 16,
        color: '#3f3f9f',
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 8,
        width: '50%',
        fontSize: 16,
        textAlign: 'center',
    },
    staticValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3f3f9f',
    },
    metricRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },
    metricLabel: {
        fontSize: 16,
        color: '#3f3f9f',
    },
    metricValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3f3f9f',
    },
    progressBar: {
        height: 10,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        marginVertical: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#6a6ad9',
    },
    statusBar: {
        height: 16,
        backgroundColor: '#E0E0E0',
        borderRadius: 8,
        marginVertical: 12,
        overflow: 'hidden',
    },
    statusFill: {
        height: '100%',
        borderRadius: 8,
    },
    warningText: {
        color: '#FFC107',
        marginTop: 4,
        fontWeight: '500',
    },
    successText: {
        color: '#4CAF50',
        marginTop: 4,
        fontWeight: '500',
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statusItem: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        flex: 1,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    statusLabel: {
        fontSize: 14,
        color: '#6a6ad9',
        marginBottom: 4,
    },
    statusValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3f3f9f',
    },
    confirmButton: {
        backgroundColor: '#8C1D40',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    gameOverContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
    },
    gameOverTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#3f3f9f',
        marginBottom: 24,
    },
    resultsContainer: {
        width: '100%',
        backgroundColor: '#F0F4FF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    resultText: {
        fontSize: 18,
        color: '#3f3f9f',
        marginBottom: 8,
    },
    reflectionContainer: {
        width: '100%',
        marginBottom: 24,
    },
    reflectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3f3f9f',
        marginBottom: 16,
    },
    reflectionQuestion: {
        fontSize: 16,
        color: '#3f3f9f',
        marginBottom: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 8,
    },
    buttonText: {
        color: '#3f3f9f',
        fontSize: 16,
        fontWeight: '600',
    },
    primaryButton: {
        backgroundColor: '#6a6ad9',
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default GameScreen;