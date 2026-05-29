// screens/GoalSolutionsScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GoalSolutionsScreen({ navigation, route }) {
  const { selectedArea, objective, emoji, hasRelatedValue, selectedValues, valueRelation, importance, barriers, isEditing, goalData } = route.params;
  const [solutions, setSolutions] = useState(isEditing && goalData?.solutions ? goalData.solutions : barriers.map(() => ''));

  const updateSolution = (index, text) => {
    const newSolutions = [...solutions];
    newSolutions[index] = text;
    setSolutions(newSolutions);
  };

  const handleContinue = () => {
    navigation.navigate('GoalActionPlan', {
      selectedArea,
      objective,
      emoji,
      hasRelatedValue,
      selectedValues,
      valueRelation,
      importance,
      barriers,
      solutions,
      isEditing,
      goalData
    });
  };

  const canContinue = solutions.every(solution => solution.trim());

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Soluções</Text>
      </View>
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView style={styles.content}>
          <Text style={styles.objectiveText}>Objetivo: {objective}</Text>
          
          <Text style={styles.question}>
            Vamos pensar em como seria possível ultrapassar as barreiras mencionadas anteriormente:
          </Text>
          
          <View style={styles.solutionsContainer}>
            {barriers.map((barrier, index) => (
              <View key={index} style={styles.solutionGroup}>
                <View style={styles.barrierContainer}>
                  <Text style={styles.barrierLabel}>Barreira {index + 1}:</Text>
                  <Text style={styles.barrierText}>{barrier}</Text>
                </View>
                
                <TextInput
                  style={styles.solutionInput}
                  placeholder="Como superar esta barreira?"
                  value={solutions[index]}
                  onChangeText={(text) => updateSolution(index, text)}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            ))}
          </View>
          
          <TouchableOpacity 
            style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!canContinue}
          >
            <Text style={styles.continueButtonText}>Continuar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 25,
    lineHeight: 26,
  },
  solutionsContainer: {
    marginBottom: 30,
  },
  solutionGroup: {
    marginBottom: 25,
  },
  barrierContainer: {
    backgroundColor: '#E8F4E6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#587D5C',
  },
  barrierLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B5320',
    marginBottom: 5,
  },
  barrierText: {
    fontSize: 16,
    color: '#4B5320',
    lineHeight: 22,
  },
  solutionInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    fontSize: 16,
    minHeight: 80,
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