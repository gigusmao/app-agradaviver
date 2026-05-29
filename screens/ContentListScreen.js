// screens/ContentListScreen.js

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Conteúdo de exemplo para a lista
const contentData = [
  { id: '1', title: 'Conteúdo sobre Alimentação', image: 'https://media.istockphoto.com/id/1457433817/pt/foto/group-of-healthy-food-for-flexitarian-diet.jpg?s=612x612&w=0&k=20&c=gtYkwgspeAjAIUoSIPOeci2o02IrWwPLJY0Ql5jhiKQ=', text: 'Aqui vai um conteúdo detalhado sobre alimentação saudável e nutrição. Você pode adicionar informações sobre dietas balanceadas, dicas de receitas e a importância de uma alimentação consciente.' },
  { id: '2', title: 'Conteúdo sobre Atividade Física', image: 'https://www.conceitozen.com.br/wp-content/uploads/2018/08/os-beneficios-da-atividade-fisica-para-o-corpo.jpg', text: 'Aqui vai um conteúdo detalhado sobre a importância da atividade física. Você pode adicionar informações sobre diferentes tipos de exercícios, a importância do aquecimento e a relação entre exercício e bem-estar mental.' },
];

export default function ContentListScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contentItem}
      onPress={() => navigation.navigate('ContentDetail', { item })}
    >
      <Text style={styles.contentTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F4E9' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conteúdos</Text>
      </View>
      <View style={styles.contentContainer}>
        <FlatList
          data={contentData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
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
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  contentItem: {
    backgroundColor: '#D7E0D3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B5320',
  },
});