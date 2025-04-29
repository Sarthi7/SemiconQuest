import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a context
const ProgressContext = createContext();

// Create a Progress Provider component
export const ProgressProvider = ({ children }) => {
    // State for unlocked levels
    const [unlockedLevels, setUnlockedLevels] = useState({
        1: true, // Level 1 is unlocked by default
        2: true,
        3: false,
        4: false,
        5: false,
    });

    // State for level completion status
    const [completedLevels, setCompletedLevels] = useState({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
    });

    // State for achievements
    const [achievements, setAchievements] = useState({});

    // Load progress data from storage on app startup
    useEffect(() => {
        loadProgressData();
    }, []);

    // Load progress from storager
    const loadProgressData = async () => {
        try {
            // Load unlocked levels
            const unlockedData = await AsyncStorage.getItem('unlockedLevels42');
            console.log('unlcoked:',unlockedData);
            if (unlockedData) {
                setUnlockedLevels(JSON.parse(unlockedData));
            }

            // Load completed levels
            const completedData = await AsyncStorage.getItem('completedLevels');
            if (completedData) {
                setCompletedLevels(JSON.parse(completedData));
            }

            // Load achievements
            const achievementsData = await AsyncStorage.getItem('achievements');
            if (achievementsData) {
                setAchievements(JSON.parse(achievementsData));
            }
        } catch (error) {
            console.error('Failed to load progress data:', error);
        }
    };

    // Save progress to storage whenever it changes
    useEffect(() => {
        saveProgressData();
    }, [unlockedLevels, completedLevels, achievements]);

    // Save progress to storage
    const saveProgressData = async () => {
        try {
            await AsyncStorage.setItem('unlockedLevels42', JSON.stringify(unlockedLevels));
            await AsyncStorage.setItem('completedLevels', JSON.stringify(completedLevels));
            await AsyncStorage.setItem('achievements', JSON.stringify(achievements));
        } catch (error) {
            console.error('Failed to save progress data:', error);
        }
    };

    // Function to unlock a specific level
    const unlockLevel = (levelNumber) => {
        if (levelNumber > 1 && levelNumber <= 5) {
            setUnlockedLevels(prev => ({
                ...prev,
                [levelNumber]: true
            }));
        }
    };

    // Function to mark a level as completed
    const completeLevel = (levelNumber) => {
        if (levelNumber >= 1 && levelNumber <= 5) {
            setCompletedLevels(prev => ({
                ...prev,
                [levelNumber]: true
            }));

            // Automatically unlock the next level when completing a level
            if (levelNumber < 5) {
                unlockLevel(levelNumber + 1);
            }
        }
    };

    // Function to check if a level is unlocked
    const isLevelUnlocked = (levelNumber) => {
        return unlockedLevels[levelNumber] || false;
    };

    // Function to check if a level is completed
    const isLevelCompleted = (levelNumber) => {
        return completedLevels[levelNumber] || false;
    };

    // Function to unlock an achievement
    const unlockAchievement = (achievementId, data = {}) => {
        // Only set the achievement if it's not already unlocked
        if (!achievements[achievementId]) {
            setAchievements(prev => ({
                ...prev,
                [achievementId]: {
                    unlocked: true,
                    timestamp: new Date().toISOString(),
                    ...data
                }
            }));
        }
    };

    // Function to check if an achievement is unlocked
    const isAchievementUnlocked = (achievementId) => {
        return achievements[achievementId]?.unlocked || false;
    };

    // Reset all progress (for development/testing)
    const resetAllProgress = async () => {
        const defaultUnlocked = {
            1: true,
            2: true,
            3: false,
            4: false,
            5: false,
        };

        const defaultCompleted = {
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
        };

        setUnlockedLevels(defaultUnlocked);
        setCompletedLevels(defaultCompleted);
        setAchievements({});

        try {
            await AsyncStorage.setItem('unlockedLevels', JSON.stringify(defaultUnlocked));
            await AsyncStorage.setItem('completedLevels', JSON.stringify(defaultCompleted));
            await AsyncStorage.setItem('achievements', JSON.stringify({}));
        } catch (error) {
            console.error('Failed to reset progress data:', error);
        }
    };

    return (
        <ProgressContext.Provider
            value={{
                unlockedLevels,
                completedLevels,
                achievements,
                unlockLevel,
                completeLevel,
                isLevelUnlocked,
                isLevelCompleted,
                unlockAchievement,
                isAchievementUnlocked,
                resetAllProgress
            }}
        >
            {children}
        </ProgressContext.Provider>
    );
};

// Custom hook to use the progress context
export const useProgressContext = () => {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error('useProgressContext must be used within a ProgressProvider');
    }
    return context;
};

// Export the context for direct usage
export default ProgressContext;