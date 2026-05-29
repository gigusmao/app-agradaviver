// screens/WelcomeScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Bem-vindo(a) ao AgradaViver</Text>
        
        <Text style={styles.description}>
          Cuidar de si é um processo que vai muito além do peso. Nosso propósito é te ajudar a construir uma relação mais leve e consciente com sua saúde, acompanhando passo a passo as mudanças que você deseja ver na sua vida.
        </Text>
        
        <Text style={styles.description}>
          Aqui, você poderá criar metas personalizadas, acompanhar seu progresso e descobrir conteúdos que te ajudam a entender o porquê e o como de cada escolha.
        </Text>
        
        <Text style={styles.description}>
          Antes de começarmos, queremos te conhecer melhor, seus valores, o que te motiva e em quais áreas da sua rotina você gostaria de focar neste momento.
        </Text>
        
        <Text style={styles.question}>Vamos iniciar?</Text>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => navigation.navigate('ValuesSelection')}
        >
          <Text style={styles.startButtonText}>Começar minha jornada</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4E9',
  },
  content: {
    flexGrow: 1,
    padding: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4B5320',
    textAlign: 'center',
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: '#8B4513',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'justify',
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5320',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#633B48',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});