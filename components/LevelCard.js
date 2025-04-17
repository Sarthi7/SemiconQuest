import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LevelCard({
  id,
  title,
  description,
  unlocked = false,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={[styles.card, !unlocked && styles.disabledCard]}
      onPress={unlocked ? onPress : null}
      activeOpacity={unlocked ? 0.7 : 1}
    >
      <View style={styles.levelLabelContainer}>
        <View style={[
          styles.levelLabel, 
          unlocked ? styles.unlockedLabel : styles.lockedLabel
        ]}>
          <Text style={styles.levelLabelText}>Level {id}</Text>
        </View>
        
        {unlocked ? (
          <MaterialCommunityIcons name="chevron-right" size={24} color="#F5A623" />
        ) : (
          <MaterialCommunityIcons name="lock" size={20} color="#999" />
        )}
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  disabledCard: {
    backgroundColor: '#f9f9f9',
  },
  levelLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  levelLabel: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  unlockedLabel: {
    backgroundColor: '#6B0F1A',
  },
  lockedLabel: {
    backgroundColor: '#cccccc',
  },
  levelLabelText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});