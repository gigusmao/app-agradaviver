// screens/EditWeightScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform, ScrollView, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function EditWeightScreen({ navigation, route }) {
  const { weightId, initialWeight, initialNotes, initialDate } = route.params;

  const [weight, setWeight] = useState(initialWeight.toString());
  const [notes, setNotes] = useState(initialNotes);
  const [date, setDate] = useState(new Date(initialDate));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleUpdateWeight = async () => {
    if (weight.length > 0) {
      const user = auth.currentUser;
      if (user) {
        try {
          const weightDocRef = doc(db, `users/${user.uid}/weights`, weightId);
          await updateDoc(weightDocRef, {
            weight: parseFloat(weight),
            notes: notes,
            date: date.toISOString(),
          });
          Alert.alert("Sucesso", "Registro de peso atualizado com sucesso!");
          navigation.goBack();
        } catch (error) {
          Alert.alert("Erro ao atualizar", error.message);
        }
      }
    } else {
      Alert.alert("Erro", "Por favor, insira o peso.");
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleWeightChange = (text) => {
    // Substitui a vírgula por ponto para salvar o valor decimal corretamente
    setWeight(text.replace(',', '.'));
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
          <Text style={styles.headerTitle}>Editar peso</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Peso (kg):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={weight}
              onChangeText={handleWeightChange} // Alterado para a nova função
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data:</Text>
            <TouchableOpacity onPress={showDatePickerModal} style={styles.input}>
              <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'calendar' : 'default'}
              onChange={onChangeDate}
            />
          )}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notas:</Text>
            <TextInput
              style={styles.inputArea}
              multiline={true}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleUpdateWeight}>
            <Text style={styles.buttonText}>Salvar Edição</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
});