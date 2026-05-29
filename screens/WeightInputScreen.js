// screens/WeightInputScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform, ScrollView, KeyboardAvoidingView, SafeAreaView, Modal } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

export default function WeightInputScreen({ navigation }) {
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSaveWeight = async () => {
    if (weight.length > 0) {
      const user = auth.currentUser;
      if (user) {
        try {
          const weightsCollectionRef = collection(db, `users/${user.uid}/weights`);
          await addDoc(weightsCollectionRef, {
            weight: parseFloat(weight),
            notes: notes,
            date: date.toISOString(),
          });

          Alert.alert("Sucesso", `${weight}kg registrado em ${date.toLocaleDateString()}!`);
          setWeight('');
          setNotes('');
          setDate(new Date());
          navigation.goBack();
        } catch (error) {
          Alert.alert("Erro ao salvar", error.message);
        }
      }
    } else {
      Alert.alert("Erro", "Por favor, insira o peso.");
    }
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
          <Text style={styles.headerTitle}>Nova medida de peso</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Peso (kg):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={weight}
              onChangeText={handleWeightChange}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data:</Text>
            <TouchableOpacity onPress={showDatePickerModal} style={styles.input}>
              <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.calendarModal}>
                  <View style={styles.calendarHeader}>
                    <Text style={styles.calendarTitle}>Selecionar Data</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.closeButton}>
                      <Ionicons name="close" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                  <Calendar
                    onDayPress={(day) => {
                      const [year, month, dayOfMonth] = day.dateString.split('-').map(Number);
                      const selectedDate = new Date(year, month - 1, dayOfMonth);
                      setDate(selectedDate);
                      setShowDatePicker(false);
                    }}
                    markedDates={{
                      [date.toISOString().split('T')[0]]: { selected: true, selectedColor: '#587D5C' }
                    }}
                    theme={{
                      backgroundColor: '#FFFFFF',
                      calendarBackground: '#FFFFFF',
                      textSectionTitleColor: '#4B5320',
                      selectedDayBackgroundColor: '#587D5C',
                      selectedDayTextColor: '#FFFFFF',
                      todayTextColor: '#633B48',
                      dayTextColor: '#4B5320',
                      textDisabledColor: '#CCCCCC',
                      arrowColor: '#587D5C',
                      monthTextColor: '#4B5320',
                      indicatorColor: '#587D5C',
                    }}
                  />
                </View>
              </View>
            </Modal>
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
          <TouchableOpacity style={styles.button} onPress={handleSaveWeight}>
            <Text style={styles.buttonText}>Salvar</Text>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModal: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  calendarHeader: {
    backgroundColor: '#587D5C',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    backgroundColor: '#633B48',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});