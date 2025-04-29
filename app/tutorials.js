import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView
  } from 'react-native';
  import { MaterialCommunityIcons } from '@expo/vector-icons';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { useRouter } from 'expo-router';
  

const tutorials = () => {
    const router = useRouter();

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.replace('/')}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          
          <Text style={styles.title}>Tutorial</Text>
          
          {/* Empty View for header balance */}
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>
  )
}

export default tutorials

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
        color: '#3f3f9f',
      },
      placeholder: {
        width: 40,
      }
})