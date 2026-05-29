// screens/AreaFocusScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AREA_CONTENT = {
  'Atividade física': [
    { id: '2', title: 'Conteúdo sobre Atividade Física', image: 'https://www.conceitozen.com.br/wp-content/uploads/2018/08/os-beneficios-da-atividade-fisica-para-o-corpo.jpg', text: 'Aqui vai um conteúdo detalhado sobre a importância da atividade física. Você pode adicionar informações sobre diferentes tipos de exercícios, a importância do aquecimento e a relação entre exercício e bem-estar mental.' }
  ],
  'Alimentação': [
    { id: '1', title: 'Conteúdo sobre Alimentação', image: 'https://media.istockphoto.com/id/1457433817/pt/foto/group-of-healthy-food-for-flexitarian-diet.jpg?s=612x612&w=0&k=20&c=gtYkwgspeAjAIUoSIPOeci2o02IrWwPLJY0Ql5jhiKQ=', text: 'Aqui vai um conteúdo detalhado sobre alimentação saudável e nutrição. Você pode adicionar informações sobre dietas balanceadas, dicas de receitas e a importância de uma alimentação consciente.' }
  ],
  'Sono': [
    { id: '3', title: 'Conteúdo sobre Sono', image: 'https://via.placeholder.com/300x200/587D5C/FFFFFF?text=Sono', text: 'Conteúdo sobre a importância do sono para a saúde e bem-estar.' }
  ],
  'Manejo do estresse': [
    { id: '4', title: 'Conteúdo sobre Estresse', image: 'https://via.placeholder.com/300x200/633B48/FFFFFF?text=Estresse', text: 'Conteúdo sobre técnicas de manejo do estresse e relaxamento.' }
  ]
};

export default function AreaFocusScreen({ navigation, route }) {
  const { selectedArea } = route.params;
  const areaContent = AREA_CONTENT[selectedArea] || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedArea}</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Antes de traçar seu plano de ação, que tal aprender mais sobre como e porquê adotar hábitos saudáveis de {selectedArea.toLowerCase()}?
        </Text>
        
        {areaContent.length > 0 ? (
          <View style={styles.contentContainer}>
            {areaContent.map((content) => (
              <TouchableOpacity
                key={content.id}
                style={styles.contentBox}
                onPress={() => navigation.navigate('ContentDetail', { 
                  item: content, 
                  fromAreaFocus: true,
                  selectedArea 
                })}
              >
                <Image source={{ uri: content.image }} style={styles.contentImage} />
                <Text style={styles.contentTitle}>{content.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.noContentText}>
            Nenhum conteúdo disponível para esta área no momento.
          </Text>
        )}
        
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => navigation.navigate('GoalObjective', { selectedArea })}
        >
          <Text style={styles.continueButtonText}>Continuar para o plano de ação</Text>
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
  contentContainer: {
    marginBottom: 30,
  },
  contentBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5320',
    textAlign: 'center',
  },
  noContentText: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    marginTop: 50,
    fontStyle: 'italic',
  },
  continueButton: {
    backgroundColor: '#633B48',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});