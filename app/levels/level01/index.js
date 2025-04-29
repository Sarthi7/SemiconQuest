import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Index = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const tutorialSlides = [
    {
      title: "Welcome to Level 1",
      content: "In this level, you'll learn the basics of semiconductor manufacturing and supply chain management. You'll be managing a simple production line with a single customer.",
    //   image: require('../../assets/images/tutorial/tutorial_intro.png'),
    },
    {
      title: "Forecasting and Demand",
      content: "Your customer has a stable demand pattern. Pay attention to the forecast chart to plan your production accordingly. Each turn represents a production cycle.",
    //   image: require('../../assets/images/tutorial/tutorial_forecast.png'),
    },
    {
      title: "Wafer Production",
      content: "You'll need to decide how many wafers to start producing each turn. Remember, there's a 1-turn delay between starting production and having finished chips.",
    //   image: require('../../assets/images/tutorial/tutorial_production.png'),
    },
    {
      title: "Yield Considerations",
      content: "Not all wafers will result in usable chips. In this level, you have a 90% yield, meaning for every 100 wafers you start, you'll get 90 usable chips.",
    //   image: require('../../assets/images/tutorial/tutorial_yield.png'),
    },
    {
      title: "Profit and Success",
      content: "Your goal is to maximize profit while maintaining good on-time delivery. Balance production with demand to succeed!",
    //   image: require('../../assets/images/tutorial/tutorial_profit.png'),
    },
  ];
  
  const nextSlide = () => {
    if (currentSlide < tutorialSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.replace('/levels/level01/game'); // Tutorial completed, move to game
    }
  };
  
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  
  const skipTutorial = () => {
    router.replace('/levels/level01/game'); // Skip and move directly to game
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
            
          <View style={styles.placeholder}>
            <Text style={styles.slideNumber}>
              {currentSlide + 1} / {tutorialSlides.length}
            </Text>
          </View>
        </View>
        <View style={styles.tutorialContainer}>
          
          <Text style={styles.tutorialTitle}>{tutorialSlides[currentSlide].title}</Text>
          
          <View style={styles.imageContainer}>
            {tutorialSlides[currentSlide].image && (
              {/* <Image
                source={tutorialSlides[currentSlide].image}
                style={styles.tutorialImage}
                resizeMode="contain"
              /> */}
            )}
          </View>
          
          <Text style={styles.tutorialContent}>
            {tutorialSlides[currentSlide].content}
          </Text>
          
          <View style={styles.navigationContainer}>
            {currentSlide > 0 ? (
              <TouchableOpacity 
                style={styles.navButton} 
                onPress={prevSlide}
              >
                <Text style={styles.navButtonText}>Previous</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.skipButton} 
                onPress={skipTutorial}
              >
                <Text style={styles.skipButtonText}>Skip Tutorial</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.navButton, styles.primaryButton]} 
              onPress={nextSlide}
            >
              <Text style={styles.primaryButtonText}>
                {currentSlide < tutorialSlides.length - 1 ? 'Next' : 'Start Level'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingTop: StatusBar.currentHeight || 25,
  },
  tutorialContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  slideNumberContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  slideNumber: {
    color: '#3f3f9f',
    fontWeight: '600',
  },
  tutorialTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3f3f9f',
    marginBottom: 24,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorialImage: {
    width: '100%',
    height: '100%',
  },
  tutorialContent: {
    fontSize: 18,
    lineHeight: 26,
    color: '#3f3f9f',
    textAlign: 'center',
    marginBottom: 40,
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
  skipButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  skipButtonText: {
    color: '#6a6ad9',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Index;