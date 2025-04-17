import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function About() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Screen</Text>
      <Text>This is the about page of your app.</Text>
      <Button
        title="Go back to Home"
        onPress={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});