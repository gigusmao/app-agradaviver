// screens/ValuesSelectionScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VALUES_OPTIONS = [
  'Bom pai/mãe',
  'Beleza',
  'Bom esposo(a)',
  'Confiança',
  'Disciplina',
  'Tolerância',
  'Estar no controle',
  'Ser forte',
  'Respeito aos outros',
  'Competência',
  'Boa forma',
  'Fazer a vontade de Deus',
  'Espiritual',
  'Respeito',
  'Ser apoio dos outros',
  'Ter energia',
  'Consideração',
  'Respeitado na comunidade',
  'Amizade',
  'Sucesso',
  'Ser produtivo',
  'Juventude',
  'Independência',
  'Família'
];

export default function ValuesSelectionScreen({ navigation }) {
  const [selectedValues, setSelectedValues] = useState([]);
  const [customValue, setCustomValue] = useState('');

  const toggleValue = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter(v => v !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const addCustomValue = () => {
    if (customValue.trim() && !selectedValues.includes(customValue.trim())) {
      setSelectedValues([...selectedValues, customValue.trim()]);
      setCustomValue('');
    }
  };

  const handleContinue = () => {
    if (selectedValues.length < 3) {
      Alert.alert('Atenção', 'Por favor, selecione pelo menos 3 valores.');
      return;
    }
    navigation.navigate('InterestAreas', { selectedValues });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conhecendo você</Text>
      </View>
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Nesta etapa, queremos entender o que é importante para você e em quais áreas da sua rotina deseja concentrar seus esforços neste momento. Selecione abaixo os valores que mais representam o que guia suas escolhas e atitudes.
        </Text>
        
        <Text style={styles.subtitle}>Selecione pelo menos 3 valores:</Text>
        
        <View style={styles.valuesContainer}>
          {VALUES_OPTIONS.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.valueButton,
                selectedValues.includes(value) && styles.valueButtonSelected
              ]}
              onPress={() => toggleValue(value)}
            >
              <Text style={[
                styles.valueText,
                selectedValues.includes(value) && styles.valueTextSelected
              ]}>
                {value}
              </Text>
            </TouchableOpacity>
          ))}
          {selectedValues.filter(value => !VALUES_OPTIONS.includes(value)).map((customValue, index) => (
            <TouchableOpacity
              key={`custom-${index}`}
              style={[styles.valueButton, styles.valueButtonSelected]}
              onPress={() => toggleValue(customValue)}
            >
              <Text style={[styles.valueText, styles.valueTextSelected]}>
                {customValue}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.customValueContainer}>
          <Text style={styles.customLabel}>Outros:</Text>
          <View style={styles.customInputContainer}>
            <TextInput
              style={styles.customInput}
              placeholder="Digite um valor personalizado"
              value={customValue}
              onChangeText={setCustomValue}
            />
            <TouchableOpacity onPress={addCustomValue} style={styles.addButton}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.selectedCount}>
          Selecionados: {selectedValues.length} (mínimo 3)
        </Text>
        
        <TouchableOpacity 
          style={[styles.continueButton, selectedValues.length < 3 && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={selectedValues.length < 3}
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
  description: {
    fontSize: 16,
    color: '#8B4513',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'justify',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B5320',
    marginBottom: 15,
  },
  valuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  valueButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
  valueButtonSelected: {
    backgroundColor: '#587D5C',
    borderColor: '#587D5C',
  },
  valueText: {
    fontSize: 14,
    color: '#4B5320',
  },
  valueTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  customValueContainer: {
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
  },
  addButton: {
    backgroundColor: '#633B48',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCount: {
    fontSize: 14,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#633B48',
    paddingVertical: 15,
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