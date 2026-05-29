// screens/GoalBarriersScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GoalBarriersScreen({ navigation, route }) {
  const { selectedArea, objective, emoji, hasRelatedValue, selectedValues, valueRelation, importance, isEditing, goalData } = route.params;
  const [barriers, setBarriers] = useState(isEditing && goalData?.barriers?.length > 0 ? goalData.barriers : ['']);

  const addBarrier = () => {
    setBarriers([...barriers, '']);
  };

  const updateBarrier = (index, text) => {
    const newBarriers = [...barriers];
    newBarriers[index] = text;
    setBarriers(newBarriers);
  };

  const removeBarrier = (index) => {
    if (barriers.length > 1) {
      const newBarriers = barriers.filter((_, i) => i !== index);
      setBarriers(newBarriers);
    }
  };

  const handleContinue = () => {
    const filledBarriers = barriers.filter(barrier => barrier.trim());
    navigation.navigate('GoalSolutions', {
      selectedArea,
      objective,
      emoji,
      hasRelatedValue,
      selectedValues,
      valueRelation,
      importance,
      barriers: filledBarriers,
      isEditing,
      goalData
    });
  };

  const canContinue = barriers.some(barrier => barrier.trim());

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Barreiras</Text>
      </View>
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView style={styles.content}>
          <Text style={styles.objectiveText}>Objetivo: {objective}</Text>
          
          <Text style={styles.question}>
            Quais barreiras, medos e angústias podem surgir nesse processo de mudança?
          </Text>
          
          <View style={styles.barriersContainer}>
            {barriers.map((barrier, index) => (
              <View key={index} style={styles.barrierRow}>
                <TextInput
                  style={styles.barrierInput}
                  placeholder={`Barreira ${index + 1}`}
                  value={barrier}
                  onChangeText={(text) => updateBarrier(index, text)}
                  multiline
                  textAlignVertical="top"
                />
                {barriers.length > 1 && (
                  <TouchableOpacity 
                    onPress={() => removeBarrier(index)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
          
          <TouchableOpacity onPress={addBarrier} style={styles.addBarrierButton}>
            <Ionicons name="add" size={20} color="#587D5C" />
            <Text style={styles.addBarrierText}>Adicionar outra barreira</Text>
          </TouchableOpacity>
          
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
  barriersContainer: {
    marginBottom: 20,
  },
  barrierRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  barrierInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    fontSize: 16,
    minHeight: 50,
  },
  removeButton: {
    marginLeft: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBarrierButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#587D5C',
    borderStyle: 'dashed',
    marginBottom: 30,
  },
  addBarrierText: {
    fontSize: 16,
    color: '#587D5C',
    marginLeft: 8,
    fontWeight: '500',
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