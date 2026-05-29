// screens/WeightChartScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Dimensions, Platform, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get("window").width;

export default function WeightChartScreen({ navigation }) {
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWeights = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const weightsCollectionRef = collection(db, `users/${user.uid}/weights`);
        const q = query(weightsCollectionRef, orderBy('date', 'asc')); // Ordena do mais antigo para o mais recente para o gráfico
        const querySnapshot = await getDocs(q);

        const fetchedWeights = [];
        querySnapshot.forEach((doc) => {
          fetchedWeights.push({ id: doc.id, ...doc.data() });
        });
        setWeights(fetchedWeights);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar o histórico de peso.");
        console.error("Erro ao buscar pesos: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getWeightAnalysis = () => {
    if (weights.length < 2) return null;
    
    const firstWeight = weights[0].weight;
    const lastWeight = weights[weights.length - 1].weight;
    const totalVariation = lastWeight - firstWeight;
    
    const variations = [];
    for (let i = 1; i < weights.length; i++) {
      const current = weights[i];
      const previous = weights[i - 1];
      const variation = current.weight - previous.weight;
      const daysDiff = Math.ceil((new Date(current.date) - new Date(previous.date)) / (1000 * 60 * 60 * 24));
      
      variations.push({
        date: current.date,
        weight: current.weight,
        variation,
        daysDiff,
        previousWeight: previous.weight
      });
    }
    
    return { totalVariation, variations, firstWeight, lastWeight };
  };

  const analysis = getWeightAnalysis();

  useFocusEffect(
    useCallback(() => {
      fetchWeights();
    }, [])
  );

  const dataForChart = {
    labels: weights.map(w => new Date(w.date).toLocaleDateString()).slice(-5),
    datasets: [{
      data: weights.map(w => w.weight).slice(-5),
      color: (opacity = 1) => `rgba(99, 59, 72, ${opacity})`,
      strokeWidth: 2
    }]
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#633B48" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F4E9' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Evolução de Peso</Text>
      </View>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.chartTitle}>Seu progresso em kg</Text>
        {weights.length > 0 ? (
          <>
            <LineChart
              data={dataForChart}
              width={screenWidth - 40}
              height={220}
              yAxisInterval={1}
              segments={4}
              fromZero={false}
              withDots={true}
              withShadow={false}
              renderDotContent={({ x, y, index }) => {
                const weight = weights.slice(-5)[index];
                return (
                  <View key={index} style={[styles.tooltip, { left: x - 20, top: y - 30 }]}>
                    <Text style={styles.tooltipText}>{weight?.weight}kg</Text>
                  </View>
                );
              }}
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#D7E0D3',
                backgroundGradientTo: '#D7E0D3',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(99, 59, 72, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#633B48"
                }
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
            
            {analysis && (
              <View style={styles.analysisContainer}>
                <Text style={styles.analysisTitle}>Detalhamento da Evolução</Text>
                
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>Resumo Geral</Text>
                  <Text style={styles.summaryText}>
                    Peso inicial: <Text style={styles.boldText}>{analysis.firstWeight}kg</Text>
                  </Text>
                  <Text style={styles.summaryText}>
                    Peso atual: <Text style={styles.boldText}>{analysis.lastWeight}kg</Text>
                  </Text>
                  <Text style={[styles.summaryText, { marginTop: 5 }]}>
                    Variação total: 
                    <Text style={[styles.boldText, { color: analysis.totalVariation >= 0 ? '#A8574B' : '#587D5C' }]}>
                      {analysis.totalVariation >= 0 ? '+' : ''}{analysis.totalVariation.toFixed(1)}kg
                    </Text>
                  </Text>
                </View>
                
                <View style={styles.variationsCard}>
                  <Text style={styles.variationsTitle}>Variações por Período</Text>
                  {analysis.variations.map((variation, index) => (
                    <View key={index} style={styles.variationItem}>
                      <View style={styles.variationMainRow}>
                        <Text style={styles.variationDate}>
                          {new Date(variation.date).toLocaleDateString('pt-BR')}
                        </Text>
                        <Text style={styles.variationWeight}>
                          {variation.previousWeight}kg → {variation.weight}kg
                        </Text>
                        <Text style={[styles.variationChange, { color: variation.variation >= 0 ? '#A8574B' : '#587D5C' }]}>
                          {variation.variation >= 0 ? '+' : ''}{variation.variation.toFixed(1)}kg
                        </Text>
                      </View>
                      {variation.daysDiff > 1 && (
                        <Text style={styles.variationPeriod}>
                          ({variation.daysDiff} dias)
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.noDataText}>Nenhum registro de peso para exibir no gráfico.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#F7F4E9',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4B5320',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#633B48',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  analysisContainer: {
    marginTop: 20,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B5320',
    marginBottom: 15,
  },
  summaryCard: {
    backgroundColor: '#D7E0D3',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5320',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    color: '#4B5320',
    marginBottom: 3,
  },
  boldText: {
    fontWeight: 'bold',
  },
  variationsCard: {
    backgroundColor: '#D7E0D3',
    borderRadius: 12,
    padding: 15,
  },
  variationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5320',
    marginBottom: 15,
  },
  variationItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#B8C5B4',
  },
  variationMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  variationDate: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  variationWeight: {
    fontSize: 13,
    color: '#4B5320',
    flex: 1.5,
    textAlign: 'center',
  },
  variationChange: {
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  variationPeriod: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    marginTop: 3,
  },
});