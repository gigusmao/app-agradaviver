// screens/GoalSummaryScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export default function GoalSummaryScreen({ navigation, route }) {
  const { selectedArea, objective, emoji, hasRelatedValue, selectedValues, valueRelation, importance, barriers, solutions, startDate, frequency, duration, timeUnit, repetitions, location, isEditing, goalData } = route.params;
  const [confidence, setConfidence] = useState(null);

  const [showLowConfidenceModal, setShowLowConfidenceModal] = useState(false);

  const handleConfidenceSelect = (value) => {
    setConfidence(value);
    
    if (value < 10) {
      setShowLowConfidenceModal(true);
    }
  };

  const handleCreateGoal = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const goalDataToSave = {
          title: objective,
          objective: objective,
          selectedArea: selectedArea,
          area: selectedArea,
          emoji: emoji,
          frequency: frequency,
          duration: `${duration} ${timeUnit}`,
          repetitions: `${repetitions} ${repetitions === '1' ? 'vez' : 'vezes'} por ${frequency === 'diária' ? 'dia' : frequency === 'semanal' ? 'semana' : 'mês'}`,
          location: location,
          hasRelatedValue,
          selectedValues: hasRelatedValue ? selectedValues : [],
          valueRelation: hasRelatedValue ? valueRelation : null,
          importance,
          barriers,
          solutions,
          startDate: startDate.toISOString(),
          confidence,
          fromJourney: true
        };

        if (isEditing && goalData?.id) {
          const goalDocRef = doc(db, `users/${user.uid}/goals`, goalData.id);
          await updateDoc(goalDocRef, {
            ...goalDataToSave,
            updatedAt: new Date()
          });
          
          Alert.alert(
            'Meta Atualizada!', 
            'Sua meta foi atualizada com sucesso.',
            [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }]
          );
        } else {
          const goalsCollectionRef = collection(db, `users/${user.uid}/goals`);
          await addDoc(goalsCollectionRef, {
            ...goalDataToSave,
            createdAt: new Date()
          });
          
          Alert.alert(
            'Meta Criada!', 
            'Sua meta foi criada com sucesso e já está disponível no painel.',
            [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }]
          );
        }
      } catch (error) {
        Alert.alert('Erro', isEditing ? 'Não foi possível atualizar a meta. Tente novamente.' : 'Não foi possível criar a meta. Tente novamente.');
        console.error('Erro ao salvar meta:', error);
      }
    }
  };

  const handleEditPlan = () => {
    setShowLowConfidenceModal(false);
    navigation.navigate('GoalActionPlan', {
      selectedArea,
      objective,
      hasRelatedValue,
      selectedValues,
      valueRelation,
      importance,
      barriers,
      solutions
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resumo</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Recapitulação do seu plano</Text>
        
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Objetivo</Text>
          <Text style={styles.cardText}>{objective}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Área de Interesse</Text>
          <Text style={styles.cardText}>{selectedArea}</Text>
        </View>

        {hasRelatedValue && selectedValues.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>Valores Relacionados</Text>
            <Text style={styles.cardText}>{selectedValues.join(', ')}</Text>
            {valueRelation && (
              <>
                <Text style={styles.cardSubtitle}>Como se relacionam:</Text>
                <Text style={styles.cardText}>{valueRelation}</Text>
              </>
            )}
          </View>
        )}

        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Importância</Text>
          <Text style={styles.cardText}>{importance}/10</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Plano de Ação</Text>
          <Text style={styles.cardText}>Início: {startDate.toLocaleDateString('pt-BR')}</Text>
          <Text style={styles.cardText}>Frequência: {frequency.charAt(0).toUpperCase() + frequency.slice(1)}</Text>
          <Text style={styles.cardText}>Repetições: {repetitions} {repetitions === '1' ? 'vez' : 'vezes'} por {frequency === 'diária' ? 'dia' : frequency === 'semanal' ? 'semana' : 'mês'}</Text>
          <Text style={styles.cardText}>Duração: {duration} {timeUnit}</Text>
          <Text style={styles.cardText}>Local: {location}</Text>
        </View>

        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceQuestion}>
            Considerando seu plano de ação idealizado, em uma escala de 0-10, qual seu grau de confiança no sucesso dessa meta?
          </Text>
          
          <View style={styles.scaleContainer}>
            <View style={styles.scaleButtons}>
              {[0,1,2,3,4,5,6,7,8,9,10].map(num => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.scaleButton,
                    confidence === num && styles.scaleButtonSelected
                  ]}
                  onPress={() => handleConfidenceSelect(num)}
                >
                  <Text style={[
                    styles.scaleButtonText,
                    confidence === num && styles.scaleButtonTextSelected
                  ]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.scaleLabels}>
              <Text style={styles.scaleLabel}>Nada confiante</Text>
              <Text style={styles.scaleLabel}>Extremamente confiante</Text>
            </View>
          </View>
        </View>
        
        {confidence !== null && (
          <TouchableOpacity style={styles.createButton} onPress={handleCreateGoal}>
            <Text style={styles.createButtonText}>{isEditing ? 'Atualizar Meta' : 'Finalizar Meta'}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>



      <Modal visible={showLowConfidenceModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.lowConfidenceModal}>
            <Text style={styles.lowConfidenceTitle}>Gostaria de ajustar seu plano para se sentir mais confiante?</Text>
            <Text style={styles.lowConfidenceHint}>
              Uma dica: começar com passos menores e consistentes costuma ser mais eficaz do que tentar grandes mudanças de uma só vez.
            </Text>
            <View style={styles.lowConfidenceButtons}>
              <TouchableOpacity onPress={handleEditPlan} style={styles.lowConfidenceYesButton}>
                <Text style={styles.lowConfidenceYesButtonText}>Sim, ajustar plano</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowLowConfidenceModal(false)} style={styles.lowConfidenceNoButton}>
                <Text style={styles.lowConfidenceNoButtonText}>Não, continuar assim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  sectionTitle: {
    fontSize: 20,
    color: '#4B5320',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#587D5C',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5320',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5320',
    marginTop: 10,
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: '#8B4513',
    lineHeight: 22,
    marginBottom: 5,
  },
  confidenceContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  confidenceQuestion: {
    fontSize: 18,
    color: '#4B5320',
    fontWeight: '600',
    marginBottom: 20,
    lineHeight: 26,
    textAlign: 'center',
  },
  scaleContainer: {
    marginBottom: 30,
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
  createButton: {
    backgroundColor: '#633B48',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  lowConfidenceModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '80%',
  },
  lowConfidenceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B5320',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 26,
  },
  lowConfidenceHint: {
    fontSize: 16,
    color: '#8B4513',
    lineHeight: 24,
    marginBottom: 25,
    textAlign: 'justify',
  },
  lowConfidenceButtons: {
    gap: 15,
  },
  lowConfidenceYesButton: {
    backgroundColor: '#633B48',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  lowConfidenceYesButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lowConfidenceNoButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  lowConfidenceNoButtonText: {
    color: '#8B4513',
    fontSize: 16,
    fontWeight: '600',
  },
});