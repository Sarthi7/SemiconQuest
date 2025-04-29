import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Reusable Quiz Component
 * @param {Object} props
 * @param {string} props.title - Title of the quiz
 * @param {Array} props.questions - Array of question objects with format:
 *   {
 *     question: string,
 *     options: string[],
 *     correctAnswer: number (index of correct option),
 *     explanation: string
 *   }
 * @param {Function} props.onComplete - Function called when quiz is complete
 * @param {Object} props.gameResult - Results from the game (optional)
*/

export default function Quiz({ title, questions, onComplete, gameResult }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  const selectAnswer = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };
  
  const isAnswerSelected = (questionIndex, answerIndex) => {
    return selectedAnswers[questionIndex] === answerIndex;
  };
  
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      let correctAnswers = 0;
      questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correctAnswer) {
          correctAnswers++;
        }
      });
      
      setScore(correctAnswers);
      setQuizCompleted(true);
    }
  };
  
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const canProceed = () => {
    return currentQuestion in selectedAnswers;
  };
  
  const handleFinishQuiz = () => {
    if (onComplete) {
      onComplete(score, questions.length);
    }
  };
  
  const renderQuestion = () => {
    const question = questions[currentQuestion];
    
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionNumber}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
        
        <Text style={styles.questionText}>{question.question}</Text>
        
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isAnswerSelected(currentQuestion, index) && styles.selectedOption
              ]}
              onPress={() => selectAnswer(currentQuestion, index)}
            >
              <Text style={[
                styles.optionText,
                isAnswerSelected(currentQuestion, index) && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.navigationContainer}>
          {currentQuestion > 0 && (
            <TouchableOpacity 
              style={styles.navButton} 
              onPress={prevQuestion}
            >
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              styles.navButton, 
              styles.primaryButton,
              !canProceed() && styles.disabledButton
            ]} 
            onPress={nextQuestion}
            disabled={!canProceed()}
          >
            <Text style={[
              styles.primaryButtonText,
              !canProceed() && styles.disabledButtonText
            ]}>
              {currentQuestion < questions.length - 1 ? 'Next' : 'Finish Quiz'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const renderQuizResults = () => {
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultTitle}>Quiz Complete!</Text>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Your Score</Text>
          <Text style={styles.scoreValue}>{score} / {questions.length}</Text>
          <Text style={styles.scorePercentage}>
            ({Math.round((score / questions.length) * 100)}%)
          </Text>
        </View>
        
        <ScrollView style={styles.explanationsContainer}>
          {questions.map((question, index) => (
            <View key={index} style={styles.explanationItem}>
              <Text style={styles.explanationQuestion}>{question.question}</Text>
              <Text style={styles.explanationText}>
                {selectedAnswers[index] === question.correctAnswer ? 
                  '✓ Correct: ' : 
                  '✗ Incorrect: '}
                {question.explanation}
              </Text>
            </View>
          ))}
        </ScrollView>
        
        <TouchableOpacity 
          style={[styles.navButton, styles.primaryButton]} 
          onPress={handleFinishQuiz}
        >
          <Text style={styles.primaryButtonText}>Continue to Next Level</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.quizContainer}>
          <Text style={styles.quizTitle}>{title || "Quiz"}</Text>
          
          {!quizCompleted ? renderQuestion() : renderQuizResults()}
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
  },
  quizContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  quizTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3f3f9f',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  questionContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  questionNumber: {
    fontSize: 16,
    color: '#6a6ad9',
    marginBottom: 16,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3f3f9f',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#6a6ad9',
    backgroundColor: '#E8EDFF',
  },
  optionText: {
    fontSize: 16,
    color: '#3f3f9f',
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#D0D0D0',
  },
  disabledButtonText: {
    color: '#A0A0A0',
  },
  resultsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3f3f9f',
    marginBottom: 24,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 18,
    color: '#6a6ad9',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3f3f9f',
  },
  scorePercentage: {
    fontSize: 18,
    color: '#6a6ad9',
  },
  explanationsContainer: {
    width: '100%',
    marginBottom: 24,
    maxHeight: 300,
  },
  explanationItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  explanationQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3f3f9f',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 16,
    color: '#3f3f9f',
    lineHeight: 22,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  navButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  navButtonText: {
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