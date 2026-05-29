// screens/InterestAreasScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const INTEREST_AREAS = [
  'Atividade física',
  'Alimentação',
  'Sono',
  'Manejo do estresse'
];

export default function InterestAreasScreen({ navigation, route }) {
  const { selectedValues } = route.params;
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [customArea, setCustomArea] = useState('');

  const toggleArea = (area) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter(a => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  const addCustomArea = () => {
    if (customArea.trim() && !selectedAreas.includes(customArea.trim())) {
      setSelectedAreas([...selectedAreas, customArea.trim()]);
      setCustomArea('');
    }
  };

  const handleContinue = async () => {
    if (selectedAreas.length === 0) {
      Alert.alert('Atenção', 'Por favor, selecione pelo menos uma área de interesse.');
      return;
    }
    
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          selectedValues,
          interestAreas: selectedAreas,
          onboardingCompleted: true,
          createdAt: new Date()
        }, { merge: true });
        
        navigation.navigate('Dashboard');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar seus dados. Tente novamente.');
        console.error('Erro ao salvar dados do onboarding:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Áreas de Interesse</Text>
      </View>
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView style={styles.content}>
          <Text style={styles.description}>
            Agora, escolha as áreas em que tem interesse de mudança.
          </Text>
          
          <View style={styles.areasContainer}>
            {INTEREST_AREAS.map((area, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.areaButton,
                  selectedAreas.includes(area) && styles.areaButtonSelected
                ]}
                onPress={() => toggleArea(area)}
              >
                <View style={styles.areaContent}>
                  <Text style={[
                    styles.areaText,
                    selectedAreas.includes(area) && styles.areaTextSelected
                  ]}>
                    {area}
                  </Text>
                  {selectedAreas.includes(area) && (
                    <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
            {selectedAreas.filter(area => !INTEREST_AREAS.includes(area)).map((customAreaItem, index) => (
              <TouchableOpacity
                key={`custom-${index}`}
                style={[styles.areaButton, styles.areaButtonSelected]}
                onPress={() => toggleArea(customAreaItem)}
              >
                <View style={styles.areaContent}>
                  <Text style={[styles.areaText, styles.areaTextSelected]}>
                    {customAreaItem}
                  </Text>
                  <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.customAreaContainer}>
            <Text style={styles.customLabel}>Outros:</Text>
            <View style={styles.customInputContainer}>
              <TextInput
                style={styles.customInput}
                placeholder="Digite uma área personalizada"
                value={customArea}
                onChangeText={setCustomArea}
              />
              <TouchableOpacity onPress={addCustomArea} style={styles.addButton}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.selectedCount}>
            Selecionadas: {selectedAreas.length} área{selectedAreas.length !== 1 ? 's' : ''}
          </Text>
          
          <TouchableOpacity 
            style={[styles.continueButton, selectedAreas.length === 0 && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={selectedAreas.length === 0}
          >
            <Text style={styles.continueButtonText}>Finalizar</Text>
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
  description: {
    fontSize: 18,
    color: '#8B4513',
    lineHeight: 26,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '500',
  },
  areasContainer: {
    marginBottom: 30,
  },
  areaButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  areaButtonSelected: {
    backgroundColor: '#587D5C',
    borderColor: '#587D5C',
  },
  areaContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  areaText: {
    fontSize: 18,
    color: '#4B5320',
    fontWeight: '500',
  },
  areaTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectedCount: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 30,
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
  customAreaContainer: {
    marginBottom: 20,
  },
  customLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5320',
    marginBottom: 10,
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#633B48',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});