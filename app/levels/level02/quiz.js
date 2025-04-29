import React from 'react';
import { useRouter } from 'expo-router';
import { useProgressContext } from '../../../utils/dataStore';
import Quiz from '../../../components/Quiz';

export default function Level02Quiz() {
    const router = useRouter();
    const { completeLevel, unlockAchievement } = useProgressContext();

    // Define the quiz questions for level 2
    const questions = [
        {
            question: "Why is it important to track Work-in-Progress (WIP) between fab and assembly in semiconductor manufacturing?",
            options: [
                "It only affects accounting and has no operational impact",
                "It helps identify bottlenecks and balance production flow",
                "WIP should be maximized to increase efficiency",
                "WIP has no impact on lead times"
            ],
            correctAnswer: 1,
            explanation: "Tracking WIP helps identify bottlenecks between fabrication and assembly, allowing for better capacity planning and reduced lead times. It's crucial for balancing the entire production flow."
        },
        {
            question: "What is the main trade-off when using overtime in semiconductor manufacturing?",
            options: [
                "Higher capacity at no additional cost",
                "Lower quality products with higher production volume",
                "Increased capacity but at higher operational costs",
                "Faster delivery with no impact on profitability"
            ],
            correctAnswer: 2,
            explanation: "Overtime provides increased production capacity, but comes with higher operational costs. This represents a trade-off between meeting customer demand (and potentially increasing revenue) versus managing production costs."
        },
        {
            question: "How does inventory management affect a semiconductor supply chain?",
            options: [
                "Inventory should always be maximized to ensure customer satisfaction",
                "Inventory has carrying costs but reduces the risk of stockouts",
                "Inventory has no impact on overall profitability",
                "Higher inventory always leads to better on-time delivery"
            ],
            correctAnswer: 1,
            explanation: "Inventory acts as a buffer against demand fluctuations and reduces stockout risk, but it also incurs carrying costs (capital tied up, storage costs, risk of obsolescence). Good inventory management requires finding the optimal balance."
        },
        {
            question: "What is a potential bottleneck in the semiconductor production process?",
            options: [
                "Having too many raw wafers",
                "When assembly/test capacity is lower than fab capacity",
                "When customer demand is perfectly predictable",
                "Having too much finished goods inventory"
            ],
            correctAnswer: 1,
            explanation: "A bottleneck occurs when one stage has lower capacity than preceding stages. If assembly/test capacity is lower than fab capacity, WIP will accumulate and overall throughput will be limited by the assembly/test capacity."
        },
        {
            question: "Why do capacity decisions in semiconductor manufacturing require long-term planning?",
            options: [
                "Capacity can be easily adjusted on a daily basis",
                "Capacity only affects current quarter operations",
                "Capacity investments are expensive and take time to implement",
                "Capacity has no relation to customer demand"
            ],
            correctAnswer: 2,
            explanation: "Capacity investments in semiconductor manufacturing are expensive and take significant time to implement. Adding equipment, training staff, or expanding facilities requires advance planning and considerable capital expenditure."
        }
    ];

    // Handle quiz completion
    const handleQuizComplete = (score, totalQuestions) => {
        // Mark level as completed
        completeLevel(2);

        // Award achievement for perfect score
        if (score === totalQuestions) {
            unlockAchievement('level2_perfect_quiz', { score });
        }

        // Return to level select
        router.replace('/level-select');
    };

    return (
        <Quiz
            title="Level 2: Capacity & Lead Times Quiz"
            questions={questions}
            onComplete={handleQuizComplete}
        />
    );
}