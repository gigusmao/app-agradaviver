// screens/ContentDetailScreen.js

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ContentDetailScreen({ navigation, route }) {
  const { item } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F4E9' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conteúdo</Text>
      </View>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.detailTitle}>{item.title}</Text>
        <Image source={{ uri: item.image }} style={styles.detailImage} />
        <Text style={styles.detailText}>{item.text}</Text>
        
        <View style={styles.inspirationContainer}>
          <Text style={styles.inspirationText}>
            Esse conteúdo te inspirou a mudar algum hábito de vida? Transforme agora essa inspiração em uma meta sustentável à sua rotina!
          </Text>
          
          <TouchableOpacity 
            style={styles.createGoalButton}
            onPress={() => navigation.navigate('Goals')}
          >
            <Text style={styles.createGoalButtonText}>Criar Nova Meta</Text>
          </TouchableOpacity>
        </View>
        
        {route.params?.fromAreaFocus && (
          <TouchableOpacity 
            style={styles.continueJourneyButton}
            onPress={() => navigation.navigate('GoalObjective', { selectedArea: route.params.selectedArea })}
          >
            <Text style={styles.continueJourneyButtonText}>Continuar jornada do plano de ação</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#587D5C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 20,
  },
  backButton: {
    backgroundColor: '#633B48',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4B5320',
  },
  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    color: '#4B5320',
    marginBottom: 30,
  },
  inspirationContainer: {
    backgroundColor: '#F0F8E8',
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#587D5C',
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 30,
  },
  inspirationText: {
    fontSize: 18,
    color: '#633B48',
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  createGoalButton: {
    backgroundColor: '#633B48',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: 'center',
  },
  createGoalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueJourneyButton: {
    backgroundColor: '#587D5C',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueJourneyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});