import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LevelCard from '../components/LevelCard';
import { levels } from '../utils/constants';

export default function LevelSelectionScreen() {
  const router = useRouter();

  const navigateToLevel = (level) => {
    if (isLevelUnlocked(level.id)) {
      // navigation.navigate(level.route);
      console.log('R: ',level.route);
      router.replace(level.route);
    }
  };

  // useEffect(() => {
  //   const loadUnlockedLevels = async () => {
  //     try {
  //       const value = await AsyncStorage.getItem('unlockedLevels');
  //       if (value !== null) {
  //         setUnlockedLevels(parseInt(value));
  //       }
  //     } catch (error) {
  //       console.error('Error loading unlocked levels:', error);
  //     }
  //   };
    
  //   loadUnlockedLevels();
  // }, []);

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.replace('/')}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          
          <Text style={styles.title}>Select Level</Text>
          
          {/* Empty View for header balance */}
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {levels.map(level => (
            <LevelCard
              key={level.id}
              id={level.id}
              title={level.title}
              description={level.description}
              unlocked={level.unlocked}
              onPress={() => router.replace(level.route)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
});



// File: app/single-player.js
// import React from 'react';
// import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useNavigation, useRouter } from 'expo-router';
// import { useProgressContext } from '../utils/dataStore';
// import { Ionicons } from '@expo/vector-icons';
// import { levels } from '../utils/constants';


// export default function SinglePlayerScreen() {
//   const navigation = useNavigation();
//   const router = useRouter();
//   const { isLevelUnlocked, isLevelCompleted } = useProgressContext();
  
  
//   // Navigate to a level
//   const navigateToLevel = (level) => {
//     if (isLevelUnlocked(level.id)) {
//       // navigation.navigate(level.route);
//       console.log('R: ',level.route);
//       router.replace(level.route);
//     }
//   };
  
//   return (
//     <>
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.header}>
//            <TouchableOpacity 
//             style={styles.backButton}
//             onPress={() => router.replace('/')}
//           >
//             <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
//           </TouchableOpacity>
          
//           <Text style={styles.title}>Select Level</Text>
          
//           {/* Empty View for header balance */}
//           <View style={styles.placeholder} />
//         </View>
//         <Text style={styles.headerTitle}>Single Player Levels</Text>

//         <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
//           {levels.map((level) => {
//             const unlocked = isLevelUnlocked(level.id);
//             const completed = isLevelCompleted(level.id);
            
//             return (
//               <TouchableOpacity
//                 key={level.id}
//                 style={[
//                   styles.levelCard,
//                   !unlocked && styles.lockedLevel
//                 ]}
//                 onPress={() => navigateToLevel(level)}
//                 disabled={!unlocked}
//               >
//                 <View style={styles.levelIconContainer}>
//                   <Ionicons
//                     name={level.icon}
//                     size={32}
//                     color={unlocked ? '#6a6ad9' : '#A0A0A0'}
//                   />
//                 </View>
                
//                 <View style={styles.levelInfo}>
//                   <View style={styles.levelTitleRow}>
//                     <Text style={[
//                       styles.levelTitle,
//                       !unlocked && styles.lockedText
//                     ]}>
//                       Level {level.id}: {level.title}
//                     </Text>
                    
//                     {completed && (
//                       <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
//                     )}
                    
//                     {!unlocked && (
//                       <Ionicons name="lock-closed" size={24} color="#A0A0A0" />
//                     )}
//                   </View>
                  
//                   <Text style={[
//                     styles.levelDescription,
//                     !unlocked && styles.lockedText
//                   ]}>
//                     {level.description}
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//             );
//           })}
//         </ScrollView>
        
//         {/* <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.navigate('/')}
//         >
//           <Text style={styles.backButtonText}>Back to Main Menu</Text>
//         </TouchableOpacity> */}
//       </SafeAreaView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   safeArea: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   header: {
//     paddingVertical: 24,
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#3f3f9f',
//     marginBottom: 8,
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: '#6a6ad9',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 24,
//   },
//   levelCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   lockedLevel: {
//     opacity: 0.7,
//     backgroundColor: '#F0F0F0',
//   },
//   levelIconContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#F0F4FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   levelInfo: {
//     flex: 1,
//   },
//   levelTitleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   levelTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#3f3f9f',
//     flex: 1,
//     marginRight: 8,
//   },
//   levelDescription: {
//     fontSize: 14,
//     color: '#6a6ad9',
//     lineHeight: 20,
//   },
//   lockedText: {
//     color: '#A0A0A0',
//   },
//   backButton: {
//     backgroundColor: '#6a6ad9',
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   backButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });