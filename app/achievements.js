import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AchievementsScreen() {
  const router = useRouter();

  // Achievement data
  const achievements = [
    {
      id: 1,
      title: 'On-Time Champion',
      description: 'Complete 10 deliveries ahead of schedule',
      icon: 'trophy',
      iconColor: '#F5A623',
      completed: true,
      progress: 1,
    },
    {
      id: 2,
      title: 'Profit Master',
      description: 'Earn 1,000,000 credits in total',
      icon: 'currency-usd',
      iconColor: '#E74C3C',
      completed: false,
      progress: 0.75, // 75% complete
      progressText: '750,000/1,000,000',
    },
    {
      id: 3,
      title: 'Innovation Expert',
      description: 'Develop 5 new chip designs',
      icon: 'star',
      iconColor: '#8E8E93',
      completed: false,
      locked: true,
      progress: 0,
    },
    {
      id: 4,
      title: 'Speed Demon',
      description: 'Complete a level in under 30 seconds',
      icon: 'lightning-bolt',
      iconColor: '#9B59B6',
      completed: false,
      progress: 0.25, // 25% complete
      progressText: '1/4 completed',
    },
  ];

  // Calculate total and completed achievements (dynamically)
  const totalAchievements = 20; // You can replace this with achievements.length when all achievements are defined
  const completedAchievements = achievements.filter(a => a.completed).length;
  const completionPercentage = Math.round((completedAchievements / totalAchievements) * 100);

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
          
          <Text style={styles.title}>Achievements</Text>
          
          {/* Empty View for header balance */}
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Completion card */}
          <View style={styles.completionCard}>
            <View style={styles.completionTextContainer}>
              <Text style={styles.completionLabel}>Completed</Text>
              <Text style={styles.completionCount}>{completedAchievements}/{totalAchievements}</Text>
            </View>
            <View style={styles.percentageContainer}>
              <Text style={styles.percentageText}>{completionPercentage}%</Text>
            </View>
          </View>
          
          {/* Achievement cards */}
          {achievements.map(achievement => (
            <View key={achievement.id} style={[
              styles.achievementCard,
              achievement.locked && styles.lockedAchievementCard
            ]}>
              <View style={styles.achievementHeader}>
                <View style={[
                  styles.achievementIconContainer, 
                  { backgroundColor: achievement.iconColor + '20' } // Adding transparency to the color
                ]}>
                  <MaterialCommunityIcons 
                    name={achievement.icon} 
                    size={24} 
                    color={achievement.iconColor} 
                  />
                </View>
                <View style={styles.achievementTextContainer}>
                  <Text style={[
                    styles.achievementTitle,
                    achievement.locked && styles.lockedText
                  ]}>{achievement.title}</Text>
                  <Text style={[
                    styles.achievementDescription,
                    achievement.locked && styles.lockedText
                  ]}>{achievement.description}</Text>
                </View>
                
                {achievement.completed && (
                  <View style={styles.completedIcon}>
                    <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
                  </View>
                )}
                
                {achievement.locked && (
                  <MaterialCommunityIcons name="lock" size={24} color="#999" />
                )}
              </View>
              
              {achievement.progress > 0 && achievement.progress < 1 && !achievement.locked && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { width: `${achievement.progress * 100}%` },
                        achievement.iconColor ? { backgroundColor: achievement.iconColor } : {}
                      ]} 
                    />
                  </View>
                  {achievement.progressText && (
                    <Text style={styles.progressText}>{achievement.progressText}</Text>
                  )}
                </View>
              )}
            </View>
          ))}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  completionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  completionTextContainer: {
    flex: 1,
  },
  completionLabel: {
    fontSize: 14,
    color: '#666',
  },
  completionCount: {
    fontSize: 24,
    fontWeight: 'bold',
    fontWeight: 'bold',
    color: '#3f3f9f',
  },
  percentageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EBF1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3f3f9f',
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementTextContainer: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3f3f9f',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  completedIcon: {
    marginLeft: 8,
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  lockedAchievementCard: {
    opacity: 0.7,
  },
  lockedText: {
    color: '#999',
  },
});