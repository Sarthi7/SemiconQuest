// levels/Level1/quiz.js - Level 1 specific quiz implementation
import React from 'react';
import { useNavigation, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useProgressContext } from '../../../utils/dataStore';
import Quiz from '../../../components/Quiz';

export default function Level1Quiz() {
    const navigation = useNavigation();
    const router = useRouter();
    const { gameResult } = useLocalSearchParams();
    const { unlockLevel, completeLevel, unlockAchievement } = useProgressContext();

    // Level 1 specific quiz questions
    const level1Questions = [
        {
            question: "Why is forecasting important in semiconductor manufacturing?",
            options: [
                "It's not important, you can always adjust production instantly",
                "It helps plan production considering lead times and yields",
                "It guarantees you'll never have excess inventory",
                "It eliminates the need for inventory management"
            ],
            correctAnswer: 1, // Index of correct answer
            explanation: "Forecasting is crucial because semiconductor manufacturing has lead times, and you need to plan production in advance considering these delays and yield factors."
        },
        {
            question: "If your yield is 90% and customer demand is 900 units, how many wafers should you start to exactly meet demand?",
            options: [
                "810 wafers",
                "900 wafers",
                "1000 wafers",
                "990 wafers"
            ],
            correctAnswer: 2,
            explanation: "To produce 900 usable chips with a 90% yield, you need to start 900 ÷ 0.9 = 1000 wafers."
        },
        {
            question: "What happens if you consistently produce less than demand?",
            options: [
                "Nothing, as long as profit is positive",
                "You'll maintain high inventory levels",
                "You'll have lower on-time delivery percentage",
                "Your yield will improve"
            ],
            correctAnswer: 2,
            explanation: "Consistently underproducing leads to lower on-time delivery (OTD) percentages, as you won't be able to fulfill all customer orders, potentially causing you to fail the level."
        },
        {
            question: "What is a key challenge when dealing with lead times in production?",
            options: [
                "Production happens instantly when ordered",
                "You must plan ahead based on future demand",
                "Lead times never affect production planning",
                "Longer lead times always result in higher profits"
            ],
            correctAnswer: 1,
            explanation: "The key challenge with lead times is that you must plan production ahead of time based on forecasted demand, not current demand."
        }
    ];

    // Handle quiz completion
    const handleQuizComplete = (score, totalQuestions) => {
        // Mark level as completed
        const percentage = Math.round((score / totalQuestions) * 100);
        completeLevel(1);

        // Unlock the next level
        if (percentage >= 70) {
            unlockLevel(2);

            // Optional: unlock achievement for completing level 1
            // unlockAchievement('level1_complete', {
            //   score: percentage,
            //   date: new Date().toISOString()
            // });

            Alert.alert(
                'Level Complete!',
                `Great job! You scored ${percentage}% on the quiz. Level 2 has been unlocked!`,
                [
                    { text: 'Continue', onPress: () => router.replace('/level-select') }
                ]
            );
        } else {
            Alert.alert(
                'Quiz Completed',
                `You scored ${percentage}%. You need at least 70% to unlock the next level.`,
                [
                    { text: 'Try Again', onPress: () => router.replace('/levels/level01/quiz') },
                    { text: 'Back to Levels', onPress: () => router.replace('/level-select') }
                ]
            );
        }
    };

    return (
        <Quiz
            title="Level 1 Reflection Quiz"
            questions={level1Questions}
            onComplete={handleQuizComplete}
            gameResult={gameResult}
        />
    );
}