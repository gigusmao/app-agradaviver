// screens/GoalObjectiveScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GoalObjectiveScreen({ navigation, route }) {
  const { selectedArea, isEditing, goalData } = route.params;
  const [objective, setObjective] = useState(isEditing ? (goalData?.objective || goalData?.title || '') : '');
  const [selectedEmoji, setSelectedEmoji] = useState(isEditing ? (goalData?.emoji || '') : '');
  const [showEmojiInput, setShowEmojiInput] = useState(false);

  const handleContinue = () => {
    if (objective.trim()) {
      navigation.navigate('GoalValues', { 
        selectedArea, 
        objective: objective.trim(),
        emoji: selectedEmoji,
        isEditing,
        goalData
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Editar Meta' : 'Plano de Ação'}</Text>
      </View>
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView style={styles.content}>
          <Text style={styles.areaTitle}>Área: {selectedArea}</Text>
          
          <Text style={styles.question}>
            Escreva de forma resumida a coisa específica que gostaria de fazer:
          </Text>
          
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => setShowEmojiInput(true)} style={styles.emojiButton}>
              <Text style={styles.emojiButtonText}>{selectedEmoji || '😊'}</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: Beber 2 litros de água por dia"
              value={objective}
              onChangeText={setObjective}
              multiline
              textAlignVertical="top"
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.continueButton, !objective.trim() && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!objective.trim()}
          >
            <Text style={styles.continueButtonText}>Continuar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <Modal visible={showEmojiInput} animationType="slide" transparent={true}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.emojiModal}>
            <Text style={styles.emojiModalTitle}>Digite um emoji para sua meta</Text>
            <TextInput
              style={styles.emojiInput}
              placeholder="Digite um emoji (ex: 🎯)"
              value={selectedEmoji}
              onChangeText={setSelectedEmoji}
              maxLength={8}
              textAlign="center"
              fontSize={24}
            />
            <View style={styles.emojiModalButtons}>
              <TouchableOpacity onPress={() => setShowEmojiInput(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowEmojiInput(false)} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  areaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#587D5C',
    marginBottom: 30,
    textAlign: 'center',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
    gap: 10,
  },
  emojiButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
  },
  emojiButtonText: {
    fontSize: 24,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    fontSize: 16,
    minHeight: 100,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  emojiModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  emojiModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B5320',
    textAlign: 'center',
    marginBottom: 20,
  },
  emojiInput: {
    backgroundColor: '#F7F4E9',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    minHeight: 60,
  },
  emojiModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#CCCCCC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#633B48',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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