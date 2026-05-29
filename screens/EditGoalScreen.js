// screens/EditGoalScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Modal } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';

const FREQUENCY_OPTIONS = [
  { label: 'Diária', value: 'diária' },
  { label: 'Semanal', value: 'semanal' },
  { label: 'Mensal', value: 'mensal' },
];

export default function EditGoalScreen({ navigation, route }) {
  const { goalId, initialTitle, initialFrequency, initialDuration, initialRepetitions, initialNotes } = route.params;

  const [title, setTitle] = useState(initialTitle);
  const [frequency, setFrequency] = useState(initialFrequency);
  const [repetitions, setRepetitions] = useState(initialRepetitions || '');
  const [repetitionsNumber, setRepetitionsNumber] = useState(initialRepetitions ? initialRepetitions.toString().replace(/[^0-9]/g, '') : '');
  const [duration, setDuration] = useState(initialDuration || '');
  const [durationNumber, setDurationNumber] = useState(initialDuration ? initialDuration.toString().replace(/[^0-9]/g, '') : '');
  const [notes, setNotes] = useState(initialNotes);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);

  const handleSelectFrequency = (value) => {
    setFrequency(value);
    setShowFrequencyPicker(false);
    setDurationNumber('');
    setRepetitionsNumber('');
  };

  const getDurationUnit = () => {
    if (frequency === 'diária') return { singular: 'dia', plural: 'dias' };
    if (frequency === 'semanal') return { singular: 'semana', plural: 'semanas' };
    if (frequency === 'mensal') return { singular: 'mês', plural: 'meses' };
    return { singular: '', plural: '' };
  };

  const formatDurationText = () => {
    if (!durationNumber || !frequency) return '';
    const unit = getDurationUnit();
    const number = parseInt(durationNumber);
    return number === 1 ? unit.singular : unit.plural;
  };

  const handleDurationChange = (text) => {
    setDurationNumber(text);
    if (text && frequency) {
      const unit = getDurationUnit();
      const number = parseInt(text);
      const unitText = number === 1 ? unit.singular : unit.plural;
      setDuration(`${text} ${unitText}`);
    } else {
      setDuration('');
    }
  };

  const getRepetitionsText = () => {
    if (!repetitionsNumber || !frequency) return '';
    const number = parseInt(repetitionsNumber);
    const vezText = number === 1 ? 'vez' : 'vezes';
    if (frequency === 'diária') return `${vezText} por dia`;
    if (frequency === 'semanal') return `${vezText} por semana`;
    if (frequency === 'mensal') return `${vezText} por mês`;
    return '';
  };

  const handleRepetitionsChange = (text) => {
    setRepetitionsNumber(text);
    if (text && frequency) {
      const number = parseInt(text);
      const vezText = number === 1 ? 'vez' : 'vezes';
      let periodText = '';
      if (frequency === 'diária') periodText = 'por dia';
      if (frequency === 'semanal') periodText = 'por semana';
      if (frequency === 'mensal') periodText = 'por mês';
      setRepetitions(`${text} ${vezText} ${periodText}`);
    } else {
      setRepetitions('');
    }
  };

  const formatFrequencyText = (text) => {
    if (!text) return 'Selecione a frequência...';
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleUpdateGoal = async () => {
    if (title.length > 0 && frequency.length > 0) {
      const user = auth.currentUser;
      if (user) {
        try {
          const goalDocRef = doc(db, `users/${user.uid}/goals`, goalId);
          await updateDoc(goalDocRef, {
            title: title,
            frequency: frequency,
            duration: duration,
            repetitions: repetitions,
            notes: notes,
          });
          Alert.alert("Sucesso", "Meta atualizada com sucesso!");
          navigation.goBack();
        } catch (error) {
          Alert.alert("Erro ao atualizar", error.message);
        }
      }
    } else {
      Alert.alert("Erro", "Por favor, preencha o título e a frequência da meta.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F4E9' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Meta</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Beber 2L de água"
              value={title}
              onChangeText={setTitle}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Frequência:</Text>
            <TouchableOpacity onPress={() => setShowFrequencyPicker(true)} style={styles.input}>
              <Text style={frequency ? styles.inputText : styles.placeholderText}>
                {formatFrequencyText(frequency)}
              </Text>
              <Ionicons name="caret-down" size={20} color="#9EA0A4" style={styles.pickerIcon} />
            </TouchableOpacity>
          </View>
          {frequency && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Repetições:</Text>
              <View style={styles.durationContainer}>
                <TextInput
                  style={styles.durationInput}
                  placeholder="0"
                  value={repetitionsNumber}
                  onChangeText={handleRepetitionsChange}
                  keyboardType="numeric"
                />
                <Text style={styles.durationUnit}>{getRepetitionsText()}</Text>
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duração:</Text>
            {frequency ? (
              <View style={styles.durationContainer}>
                <TextInput
                  style={styles.durationInput}
                  placeholder="0"
                  value={durationNumber}
                  onChangeText={handleDurationChange}
                  keyboardType="numeric"
                />
                <Text style={styles.durationUnit}>{formatDurationText()}</Text>
              </View>
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Selecione a frequência primeiro"
                editable={false}
                value={duration}
              />
            )}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notas:</Text>
            <TextInput
              style={styles.inputArea}
              multiline={true}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleUpdateGoal}>
            <Text style={styles.buttonText}>Salvar Edição</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <Modal visible={showFrequencyPicker} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {FREQUENCY_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleSelectFrequency(option.value)}
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
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#F7F4E9',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#4B5320',
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  inputArea: {
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#633B48',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
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
    color: 'black',
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
  inputText: {
    color: 'black',
  },
  placeholderText: {
    color: '#9EA0A4',
  },
  pickerIcon: {
    position: 'absolute',
    right: 10,
    top: 13,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingHorizontal: 10,
    height: 50,
  },
  durationInput: {
    flex: 1,
    fontSize: 16,
    paddingRight: 10,
  },
  durationUnit: {
    fontSize: 16,
    color: '#4B5320',
    fontWeight: '500',
  },
});