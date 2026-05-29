import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, deleteDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export default function GoalDetailScreen({ route, navigation }) {
  const { goal } = route.params;
  const [progressData, setProgressData] = useState({ completed: 0, total: 0, percentage: 0, streak: 0 });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    calculateProgress();
    loadRecentActivity();
  }, []);

  const calculateProgress = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      const checkedCollectionRef = collection(db, `users/${user.uid}/checkedGoals`);
      const querySnapshot = await getDocs(checkedCollectionRef);
      
      let completed = 0;
      let total = 0;
      let streak = 0;
      const now = new Date();
      
      if (goal.frequency.toLowerCase().includes('diária')) {
        // Para metas diárias, calcular últimos 30 dias
        total = 30;
        const activities = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.goalId === goal.id && data.checked) {
            const activityDate = new Date(data.timestamp?.toDate?.() || data.timestamp);
            const daysDiff = Math.floor((now - activityDate) / (1000 * 60 * 60 * 24));
            if (daysDiff < 30) {
              completed++;
              activities.push({ date: activityDate, daysDiff });
            }
          }
        });
        
        // Calcular streak
        activities.sort((a, b) => a.daysDiff - b.daysDiff);
        for (let i = 0; i < activities.length; i++) {
          if (activities[i].daysDiff === i) {
            streak++;
          } else {
            break;
          }
        }
      } else {
        // Para metas semanais/mensais, usar lógica existente
        const targetReps = parseInt(goal.repetitions) || 1;
        total = targetReps;
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.goalId === goal.id && data.checked) {
            completed++;
          }
        });
      }
      
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      setProgressData({ completed, total, percentage, streak });
    } catch (error) {
      console.error('Erro ao calcular progresso:', error);
    }
  };

  const loadRecentActivity = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      const checkedCollectionRef = collection(db, `users/${user.uid}/checkedGoals`);
      const q = query(checkedCollectionRef, orderBy('timestamp', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);
      
      const activities = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.goalId === goal.id && data.checked) {
          activities.push({
            date: data.timestamp?.toDate?.() || new Date(data.timestamp),
            checked: data.checked
          });
        }
      });
      
      setRecentActivity(activities);
    } catch (error) {
      console.error('Erro ao carregar atividade recente:', error);
    }
  };

  const handleDeleteGoal = () => {
    Alert.alert(
      'Excluir Meta',
      'Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: confirmDelete }
      ]
    );
  };

  const confirmDelete = async () => {
    const user = auth.currentUser;
    if (user && goal.id) {
      try {
        await deleteDoc(doc(db, `users/${user.uid}/goals`, goal.id));
        Alert.alert(
          'Meta Excluída',
          'A meta foi excluída com sucesso.',
          [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }]
        );
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível excluir a meta. Tente novamente.');
        console.error('Erro ao excluir meta:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Meta</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.titleHeader}>
          <View style={styles.titleContainer}>
            {goal.emoji && <Text style={styles.titleEmoji}>{goal.emoji}</Text>}
            <View style={styles.titleTextContainer}>
              <Text style={styles.title}>{goal.objective || goal.title}</Text>
              <Text style={styles.titleSubtext}>{goal.selectedArea || goal.area}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.card}>
          {goal.interestArea && (
            <View style={styles.section}>
              <Text style={styles.label}>Área de Interesse:</Text>
              <Text style={styles.value}>{goal.interestArea}</Text>
            </View>
          )}
          
          {goal.selectedArea && (
            <View style={styles.section}>
              <Text style={styles.label}>Área de Foco:</Text>
              <Text style={styles.value}>{goal.selectedArea}</Text>
            </View>
          )}
          
          {goal.values && goal.values.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.label}>Valores Relacionados:</Text>
              {goal.values.map((value, index) => (
                <Text key={index} style={styles.value}>• {value}</Text>
              ))}
            </View>
          )}
          
          {goal.importance && (
            <View style={styles.section}>
              <Text style={styles.label}>Importância (0-10):</Text>
              <Text style={styles.value}>{goal.importance}</Text>
            </View>
          )}
          
          {goal.barriers && goal.barriers.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.label}>Obstáculos e Soluções:</Text>
              {goal.barriers.map((barrier, index) => (
                <View key={index} style={styles.barrierSolutionPair}>
                  <Text style={styles.barrierText}>• {barrier}</Text>
                  {goal.solutions && goal.solutions[index] && (
                    <Text style={styles.solutionText}>  → {goal.solutions[index]}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
          
          {goal.startDate && (
            <View style={styles.section}>
              <Text style={styles.label}>Dia de Início:</Text>
              <Text style={styles.value}>{new Date(goal.startDate).toLocaleDateString('pt-BR')}</Text>
            </View>
          )}
          
          {goal.frequency && (
            <View style={styles.section}>
              <Text style={styles.label}>Frequência:</Text>
              <Text style={styles.value}>{goal.frequency}</Text>
            </View>
          )}
          
          {goal.repetitions && (
            <View style={styles.section}>
              <Text style={styles.label}>Repetições:</Text>
              <Text style={styles.value}>{goal.repetitions}</Text>
            </View>
          )}
          
          {goal.duration && (
            <View style={styles.section}>
              <Text style={styles.label}>Duração:</Text>
              <Text style={styles.value}>{goal.duration}</Text>
            </View>
          )}
          
          {goal.location && (
            <View style={styles.section}>
              <Text style={styles.label}>Local:</Text>
              <Text style={styles.value}>{goal.location}</Text>
            </View>
          )}
          
          {goal.confidence && (
            <View style={styles.section}>
              <Text style={styles.label}>Grau de Confiança:</Text>
              <Text style={styles.value}>{goal.confidence}</Text>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => navigation.navigate('GoalObjective', {
                selectedArea: goal.selectedArea || goal.area,
                isEditing: true,
                goalData: { ...goal, id: goal.id }
              })}
            >
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Editar Meta</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleDeleteGoal}
            >
              <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
              <Text style={styles.deleteButtonText}>Excluir Meta</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Ionicons name="stats-chart" size={24} color="#587D5C" />
            <Text style={styles.progressTitle}>Progresso</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressData.percentage}%` }]} />
            </View>
            <Text style={styles.progressText}>{progressData.completed} de {progressData.total} ({progressData.percentage}%)</Text>
            {goal.frequency.toLowerCase().includes('diária') && progressData.streak > 0 && (
              <Text style={styles.streakText}>🔥 {progressData.streak} dias consecutivos</Text>
            )}
          </View>
          
          {recentActivity.length > 0 && (
            <View style={styles.activitySection}>
              <Text style={styles.activityLabel}>Atividade Recente:</Text>
              {recentActivity.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#587D5C" />
                  <Text style={styles.activityText}>
                    {activity.date.toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
  },
  titleHeader: {
    backgroundColor: '#6B4C57',
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleEmoji: {
    fontSize: 30,
    marginRight: 15,
    backgroundColor: '#E8DCE2',
    width: 50,
    height: 50,
    borderRadius: 25,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 50,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  titleSubtext: {
    fontSize: 14,
    color: '#E0D0D8',
    fontWeight: '500',
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5320',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#8B4513',
    lineHeight: 22,
  },
  barrierSolutionPair: {
    marginBottom: 10,
  },
  barrierText: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '500',
    marginBottom: 3,
  },
  solutionText: {
    fontSize: 15,
    color: '#587D5C',
    fontStyle: 'italic',
    marginLeft: 15,
  },
  progressCard: {
    backgroundColor: '#D7E0D3',
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#587D5C',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B5320',
    marginLeft: 10,
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#587D5C',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 16,
    color: '#4B5320',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 5,
  },
  streakText: {
    fontSize: 15,
    color: '#633B48',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  activitySection: {
    borderTopWidth: 1,
    borderTopColor: '#C0C0C0',
    paddingTop: 15,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5320',
    marginBottom: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
  },
  activityText: {
    fontSize: 14,
    color: '#8B4513',
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#633B48',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#B91C1C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});