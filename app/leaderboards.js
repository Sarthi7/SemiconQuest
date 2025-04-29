import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LeaderboardsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('global');

  // Sample leaderboard data - in a real app, this would come from an API/JSON
  const leaderboardData = {
    global: [
      {
        id: '1',
        rank: 1,
        name: 'Alex Chen',
        avatar: null, // Will use icon instead
        title: 'Senior Operator',
        score: '$2.5M',
        onTime: '98%'
      },
      {
        id: '2',
        rank: 2,
        name: 'Sarah Miller',
        avatar: null,
        title: 'Process Engineer',
        score: '$2.1M',
        onTime: '96%'
      },
      {
        id: '3',
        rank: 3,
        name: 'James Wilson',
        avatar: null,
        title: 'Line Manager',
        score: '$1.9M',
        onTime: '95%'
      },
      {
        id: '4',
        rank: 4,
        name: 'Elena Rodriguez',
        avatar: null,
        title: 'Quality Assurance',
        score: '$1.7M',
        onTime: '94%'
      },
      {
        id: '5',
        rank: 5,
        name: 'Michael Johnson',
        avatar: null,
        title: 'Inventory Specialist',
        score: '$1.6M',
        onTime: '92%'
      },
      {
        id: '6',
        rank: 6,
        name: 'Thomas Wright',
        avatar: null,
        title: 'Process Engineer',
        score: '$1.5M',
        onTime: '91%'
      },
      {
        id: '7',
        rank: 7,
        name: 'Zoe Barnes',
        avatar: null,
        title: 'Senior Operator',
        score: '$1.4M',
        onTime: '90%'
      },
    ],
    friends: [
      {
        id: '3',
        rank: 1,
        name: 'James Wilson',
        avatar: null,
        title: 'Line Manager',
        score: '$1.9M',
        onTime: '95%'
      },
      {
        id: '5',
        rank: 2,
        name: 'Michael Johnson',
        avatar: null,
        title: 'Inventory Specialist',
        score: '$1.6M',
        onTime: '92%'
      },
      {
        id: '7',
        rank: 3,
        name: 'Zoe Barnes',
        avatar: null,
        title: 'Senior Operator',
        score: '$1.4M',
        onTime: '90%'
      },
    ],
    weekly: [
      {
        id: '2',
        rank: 1,
        name: 'Sarah Miller',
        avatar: null,
        title: 'Process Engineer',
        score: '$400K',
        onTime: '98%'
      },
      {
        id: '1',
        rank: 2,
        name: 'Alex Chen',
        avatar: null,
        title: 'Senior Operator',
        score: '$380K',
        onTime: '97%'
      },
      {
        id: '6',
        rank: 3,
        name: 'Thomas Wright',
        avatar: null,
        title: 'Process Engineer',
        score: '$350K',
        onTime: '96%'
      },
    ]
  };

  // Get the appropriate data based on active tab
  const data = leaderboardData[activeTab] || [];
  const totalPlayers = 1234;
  const lastUpdated = '2m ago';
  
  // Get avatar color based on rank
  const getAvatarColor = (rank) => {
    switch(rank) {
      case 1: return '#F5A623'; // Gold
      case 2: return '#BDBDBD'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#3f3f9f'; // Default purple
    }
  };

  // Get avatar initials
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  // Render player item
  const renderItem = ({ item }) => {
    const avatarColor = getAvatarColor(item.rank);
    
    return (
      <View style={[styles.playerCard, { backgroundColor: 'white' }]}>
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>#{item.rank}</Text>
        </View>
        
        <View style={[styles.avatarContainer, { backgroundColor: avatarColor + '20' }]}>
          <Text style={[styles.avatarText, { color: avatarColor }]}>
            {getInitials(item.name)}
          </Text>
        </View>
        
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
          <Text style={styles.playerTitle}>{item.title}</Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{item.score}</Text>
          <Text style={styles.onTimeText}>{item.onTime} On-time</Text>
        </View>
      </View>
    );
  };

  // Tab button component
  const TabButton = ({ title, icon, isActive, onPress }) => (
    <TouchableOpacity 
      style={[styles.tabButton, isActive && styles.activeTabButton]} 
      onPress={onPress}
    >
      <MaterialCommunityIcons 
        name={icon} 
        size={24} 
        color={isActive ? '#3f3f9f' : '#9999cc'} 
      />
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.replace('/')}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          
          <Text style={styles.title}>Leaderboards</Text>
          
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Total Players: {totalPlayers}</Text>
          <Text style={styles.statsText}>Last Updated: {lastUpdated}</Text>
        </View>
        
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        
        <View style={styles.tabBar}>
          <TabButton 
            title="Global" 
            icon="trophy" 
            isActive={activeTab === 'global'} 
            onPress={() => setActiveTab('global')} 
          />
          <TabButton 
            title="Friends" 
            icon="account-group" 
            isActive={activeTab === 'friends'} 
            onPress={() => setActiveTab('friends')} 
          />
          <TabButton 
            title="Weekly" 
            icon="chart-line" 
            isActive={activeTab === 'weekly'} 
            onPress={() => setActiveTab('weekly')} 
          />
        </View>
      </SafeAreaView>
    </View>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f7ff',
  },
  statsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3f3f9f',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Give space for tab bar
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3f3f9f',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  playerTitle: {
    fontSize: 14,
    color: '#3f3f9f',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F5A623',
  },
  onTimeText: {
    fontSize: 12,
    color: '#999',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabButton: {
    borderTopWidth: 2,
    borderTopColor: '#3f3f9f',
    backgroundColor: '#f5f7ff',
  },
  tabText: {
    fontSize: 12,
    color: '#9999cc',
    marginTop: 4,
  },
  activeTabText: {
    color: '#3f3f9f',
    fontWeight: '600',
  },
});