import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { levels } from '../../utils/constants';

export default function LevelScreen() {
  const router = useRouter();
  console.log(router);
  const { id } = useLocalSearchParams();
  
  // Convert id to number and find the level
  const levelId = parseInt(id, 10);
  const level = levels.find(lvl => lvl.id === levelId) || {
    id: levelId,
    title: 'Unknown Level',
    description: 'Level details not available.',
    unlocked: false
  };

  // Get an appropriate icon based on level id
  const getLevelIcon = (id) => {
    const icons = {
      1: 'package-variant-closed',
      2: 'truck-delivery',
      3: 'clipboard-list',
      4: 'chart-timeline-variant',
      5: 'earth',
    };
    return icons[id] || 'cube-outline';
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          
          <Text style={styles.title}>Level {levelId}</Text>
          
          {/* Empty View for header balance */}
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.content}>
          <View style={styles.levelContainer}>
            <View style={styles.levelIconContainer}>
              <MaterialCommunityIcons 
                name={getLevelIcon(levelId)} 
                size={60} 
                color="#6B0F1A" 
              />
            </View>
            <Text style={styles.levelTitle}>{level.title}</Text>
            <Text style={styles.levelDescription}>{level.description}</Text>
            
            {level.unlocked ? (
              <TouchableOpacity 
                style={styles.startButton}
                onPress={() => router.push('/levels/level01')}
              >
                <Text style={styles.startButtonText}>Start Level</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.lockedContainer}>
                <MaterialCommunityIcons name="lock" size={24} color="#999" />
                <Text style={styles.lockedText}>Complete previous levels to unlock</Text>
              </View>
            )}
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  levelContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  levelIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f9e8f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6B0F1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  levelDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#6B0F1A',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 25,
    shadowColor: '#6B0F1A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  },
  lockedContainer: {
    alignItems: 'center',
  },
  lockedText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
});