// screens/GoalImportanceScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GoalImportanceScreen({ navigation, route }) {
  const { selectedArea, objective, emoji, hasRelatedValue, selectedValues, valueRelation, isEditing, goalData } = route.params;
  const [importance, setImportance] = useState(isEditing ? (goalData?.importance ?? null) : null);

  const handleContinue = () => {
    navigation.navigate('GoalBarriers', {
      selectedArea,
      objective,
      emoji,
      hasRelatedValue,
      selectedValues,
      valueRelation,
      importance,
      isEditing,
      goalData
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Importância</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.objectiveText}>Objetivo: {objective}</Text>
        
        <Text style={styles.question}>
          De 0-10, qual a importância dessa mudança para você?
        </Text>
        
        <View style={styles.scaleContainer}>
          <View style={styles.scaleButtons}>
            {[0,1,2,3,4,5,6,7,8,9,10].map(num => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.scaleButton,
                  importance === num && styles.scaleButtonSelected
                ]}
                onPress={() => setImportance(num)}
              >
                <Text style={[
                  styles.scaleButtonText,
                  importance === num && styles.scaleButtonTextSelected
                ]}>
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>Nenhuma importância</Text>
            <Text style={styles.scaleLabel}>Extremamente importante</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.continueButton, importance === null && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={importance === null}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4E9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#587D5C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 60,
  },
  backButton: {
    backgroundColor: '#633B48',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  objectiveText: {
    fontSize: 16,
    color: '#587D5C',
    fontWeight: '600',
    marginBottom: 30,
    backgroundColor: '#D7E0D3',
    padding: 15,
    borderRadius: 10,
  },
  question: {
    fontSize: 18,
    color: '#4B5320',
    fontWeight: '600',
    marginBottom: 30,
    lineHeight: 26,
    textAlign: 'center',
  },
  scaleContainer: {
    marginBottom: 40,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  scaleLabel: {
    fontSize: 11,
    color: '#8B4513',
    fontStyle: 'italic',
  },
  scaleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scaleButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 1,
  },
  scaleButtonSelected: {
    backgroundColor: '#633B48',
    borderColor: '#633B48',
    transform: [{ scale: 1.15 }],
  },
  scaleButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4B5320',
  },
  scaleButtonTextSelected: {
    color: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#633B48',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});