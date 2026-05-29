// screens/GoalValuesScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export default function GoalValuesScreen({ navigation, route }) {
  const { selectedArea, objective, emoji, isEditing, goalData } = route.params;
  const [hasRelatedValue, setHasRelatedValue] = useState(isEditing ? (goalData?.hasRelatedValue ?? null) : null);
  const [userValues, setUserValues] = useState([]);
  const [selectedValues, setSelectedValues] = useState(isEditing ? (goalData?.selectedValues || goalData?.values || []) : []);
  const [valueRelation, setValueRelation] = useState(isEditing ? (goalData?.valueRelation || '') : '');

  useEffect(() => {
    const loadUserValues = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.selectedValues) {
              setUserValues(userData.selectedValues);
            }
          }
        } catch (error) {
          console.error('Erro ao carregar valores do usuário:', error);
        }
      }
    };
    loadUserValues();
  }, []);

  const handleContinue = () => {
    navigation.navigate('GoalImportance', {
      selectedArea,
      objective,
      emoji,
      hasRelatedValue,
      selectedValues: hasRelatedValue ? selectedValues : [],
      valueRelation: hasRelatedValue ? valueRelation : null,
      isEditing,
      goalData
    });
  };

  const canContinue = hasRelatedValue !== null && 
    (hasRelatedValue === false || (selectedValues.length > 0 && valueRelation.trim()));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Valores</Text>
      </View>
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView style={styles.content}>
          <Text style={styles.objectiveText}>Objetivo: {objective}</Text>
          
          <Text style={styles.question}>
            Você consegue relacionar algum valor de vida com esse objetivo?
          </Text>
          
          <View style={styles.yesNoContainer}>
            <TouchableOpacity 
              style={[styles.yesNoButton, hasRelatedValue === true && styles.yesNoButtonSelected]}
              onPress={() => setHasRelatedValue(true)}
            >
              <Text style={[styles.yesNoButtonText, hasRelatedValue === true && styles.yesNoButtonTextSelected]}>
                Sim
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.yesNoButton, hasRelatedValue === false && styles.yesNoButtonSelected]}
              onPress={() => setHasRelatedValue(false)}
            >
              <Text style={[styles.yesNoButtonText, hasRelatedValue === false && styles.yesNoButtonTextSelected]}>
                Não
              </Text>
            </TouchableOpacity>
          </View>

          {userValues.length > 0 && (
            <View style={styles.valuesPreview}>
              <Text style={styles.valuesPreviewTitle}>Seus valores:</Text>
              {hasRelatedValue === true && (
                <Text style={styles.subQuestion}>Quais valores se relacionam com seu objetivo?</Text>
              )}
              <View style={styles.valuesContainer}>
                {userValues.map((value, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.valuePreviewItem,
                      hasRelatedValue === true && styles.valueClickableItem,
                      selectedValues.includes(value) && styles.valueSelectedItem
                    ]}
                    onPress={hasRelatedValue === true ? () => {
                      if (selectedValues.includes(value)) {
                        setSelectedValues(selectedValues.filter(v => v !== value));
                      } else {
                        setSelectedValues([...selectedValues, value]);
                      }
                    } : undefined}
                    disabled={hasRelatedValue !== true}
                  >
                    <Text style={[
                      styles.valuePreviewText,
                      hasRelatedValue === true && styles.valueClickableText,
                      selectedValues.includes(value) && styles.valueSelectedText
                    ]}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {hasRelatedValue === true && selectedValues.length > 0 && (
            <View style={styles.relationContainer}>
              <Text style={styles.subQuestion}>
                Como esses valores se relacionam ao seu objetivo?
              </Text>
              <Text style={styles.relationHint}>
                Exemplo: o valor "autocuidado" pode se relacionar ao objetivo de praticar atividade física, pois reservar um tempo para o corpo e a mente expressa o cuidado consigo mesmo.
                Já o valor "família" pode estar sendo ameaçado por um hábito atual — por exemplo, o sedentarismo ou a rotina exaustiva podem reduzir a disposição para participar de momentos com os filhos ou pessoas próximas.
                Assim, refletir sobre seus valores ajuda a compreender por que essa mudança é importante para você.
              </Text>
              
              <TextInput
                style={styles.relationInput}
                placeholder="Descreva a relação..."
                value={valueRelation}
                onChangeText={setValueRelation}
                multiline
                textAlignVertical="top"
              />
            </View>
          )}
          
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
    marginBottom: 20,
    lineHeight: 26,
  },
  yesNoContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  yesNoButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
  yesNoButtonSelected: {
    backgroundColor: '#587D5C',
    borderColor: '#587D5C',
  },
  yesNoButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B5320',
  },
  yesNoButtonTextSelected: {
    color: '#FFFFFF',
  },
  valuesPreview: {
    marginBottom: 30,
  },
  valuesPreviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5320',
    marginBottom: 15,
  },
  valuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  valuePreviewItem: {
    backgroundColor: '#E8E8E8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  valueClickableItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
  valueSelectedItem: {
    backgroundColor: '#587D5C',
    borderColor: '#587D5C',
  },
  valuePreviewText: {
    fontSize: 14,
    color: '#666666',
  },
  valueClickableText: {
    color: '#4B5320',
    fontWeight: '500',
  },
  valueSelectedText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subQuestion: {
    fontSize: 16,
    color: '#4B5320',
    fontWeight: '600',
    marginBottom: 15,
  },
  relationContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  relationHint: {
    fontSize: 14,
    color: '#8B4513',
    fontStyle: 'italic',
    marginBottom: 15,
    lineHeight: 20,
  },
  relationInput: {
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