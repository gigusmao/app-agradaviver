// screens/GoalActionPlanScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const FREQUENCY_OPTIONS = [
  { label: 'Diária', value: 'diária' },
  { label: 'Semanal', value: 'semanal' },
  { label: 'Mensal', value: 'mensal' },
];

const TIME_UNITS = [
  { label: 'Minutos', value: 'minutos' },
  { label: 'Horas', value: 'horas' },
];

export default function GoalActionPlanScreen({ navigation, route }) {
  const { selectedArea, objective, emoji, hasRelatedValue, selectedValues, valueRelation, importance, barriers, solutions, isEditing, goalData, startDate: existingStartDate, frequency: existingFrequency, duration: existingDuration, timeUnit: existingTimeUnit, repetitions: existingRepetitions, location: existingLocation } = route.params;
  const [startDate, setStartDate] = useState(existingStartDate ? new Date(existingStartDate) : (isEditing && goalData?.startDate ? new Date(goalData.startDate) : new Date()));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [frequency, setFrequency] = useState(existingFrequency || (isEditing ? goalData?.frequency || '' : ''));
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [duration, setDuration] = useState(existingDuration || (isEditing ? goalData?.duration?.split(' ')[0] || '' : ''));
  const [timeUnit, setTimeUnit] = useState(existingTimeUnit || (isEditing ? goalData?.duration?.split(' ')[1] || '' : ''));
  const [showTimeUnitPicker, setShowTimeUnitPicker] = useState(false);
  const [repetitions, setRepetitions] = useState(existingRepetitions || (isEditing ? goalData?.repetitions?.split(' ')[0] || '' : ''));
  const [location, setLocation] = useState(existingLocation || (isEditing ? goalData?.location || '' : ''));

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleContinue = () => {
    navigation.navigate('GoalSummary', {
      selectedArea,
      objective,
      emoji,
      hasRelatedValue,
      selectedValues,
      valueRelation,
      importance,
      barriers,
      solutions,
      startDate,
      frequency,
      duration,
      timeUnit,
      repetitions,
      location,
      isEditing,
      goalData
    });
  };

  const canContinue = frequency && duration && timeUnit && repetitions && location.trim();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plano de Ação</Text>
      </View>
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView style={styles.content}>
          <Text style={styles.objectiveText}>Objetivo: {objective}</Text>
          
          <Text style={styles.sectionTitle}>Agora vamos detalhar o plano de ação</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quando vou começar?</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
              <Text style={styles.dateButtonText}>
                {startDate.toLocaleDateString('pt-BR')}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#4B5320" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Qual a frequência?</Text>
            <TouchableOpacity onPress={() => setShowFrequencyPicker(true)} style={styles.pickerButton}>
              <Text style={frequency ? styles.pickerButtonText : styles.placeholderText}>
                {frequency ? frequency.charAt(0).toUpperCase() + frequency.slice(1) : 'Selecione a frequência'}
              </Text>
              <Ionicons name="caret-down" size={20} color="#9EA0A4" />
            </TouchableOpacity>
          </View>

          {frequency && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Quantas vezes por {frequency === 'diária' ? 'dia' : frequency === 'semanal' ? 'semana' : 'mês'}?
              </Text>
              <View style={styles.repetitionsContainer}>
                <TextInput
                  style={styles.repetitionsInput}
                  placeholder="0"
                  value={repetitions}
                  onChangeText={setRepetitions}
                  keyboardType="numeric"
                />
                <Text style={styles.repetitionsUnit}>
                  {repetitions === '1' ? 'vez' : 'vezes'} por {frequency === 'diária' ? 'dia' : frequency === 'semanal' ? 'semana' : 'mês'}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Por quanto tempo cada dia?</Text>
            <View style={styles.durationContainer}>
              <TextInput
                style={styles.durationInput}
                placeholder="0"
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
              />
              <TouchableOpacity onPress={() => setShowTimeUnitPicker(true)} style={styles.unitButton}>
                <Text style={timeUnit ? styles.unitButtonText : styles.placeholderText}>
                  {timeUnit || 'Unidade'}
                </Text>
                <Ionicons name="caret-down" size={16} color="#9EA0A4" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Onde vou fazer?</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: Em casa, na academia, no parque..."
              value={location}
              onChangeText={setLocation}
              multiline
              textAlignVertical="top"
            />
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

      {showDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      <Modal visible={showFrequencyPicker} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {FREQUENCY_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setFrequency(option.value);
                  setShowFrequencyPicker(false);
                }}
                style={styles.optionButton}
              >
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowFrequencyPicker(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showTimeUnitPicker} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {TIME_UNITS.map(unit => (
              <TouchableOpacity
                key={unit.value}
                onPress={() => {
                  setTimeUnit(unit.value);
                  setShowTimeUnitPicker(false);
                }}
                style={styles.optionButton}
              >
                <Text style={styles.optionText}>{unit.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowTimeUnitPicker(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
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
  objectiveText: {
    fontSize: 16,
    color: '#587D5C',
    fontWeight: '600',
    marginBottom: 30,
    backgroundColor: '#D7E0D3',
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#4B5320',
    fontWeight: '600',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5320',
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#4B5320',
  },
  pickerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#4B5320',
  },
  placeholderText: {
    fontSize: 16,
    color: '#9EA0A4',
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  durationInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    fontSize: 16,
  },
  unitButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 120,
    justifyContent: 'space-between',
  },
  unitButtonText: {
    fontSize: 16,
    color: '#4B5320',
  },
  repetitionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingHorizontal: 15,
    height: 50,
    justifyContent: 'space-between',
  },
  repetitionsInput: {
    fontSize: 16,
    minWidth: 40,
    textAlign: 'center',
  },
  repetitionsUnit: {
    fontSize: 16,
    color: '#633B48',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  textInput: {
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
    marginTop: 20,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
  },
  optionButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 18,
    color: '#4B5320',
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: '#633B48',
    fontSize: 16,
    fontWeight: 'bold',
  },
});