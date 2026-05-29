// screens/DashboardScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, SafeAreaView, Platform, ScrollView, Dimensions, Image, Modal } from 'react-native';
import { collection, query, orderBy, getDocs, doc, setDoc, getDoc, where } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get("window").width;

// Dados de exemplo para o carrossel
const carouselData = [
  { id: '1', title: 'Conteúdo sobre Alimentação', image: 'https://media.istockphoto.com/id/1457433817/pt/foto/group-of-healthy-food-for-flexitarian-diet.jpg?s=612x612&w=0&k=20&c=gtYkwgspeAjAIUoSIPOeci2o02IrWwPLJY0Ql5jhiKQ=', text: 'Aqui vai um conteúdo detalhado sobre alimentação saudável e nutrição. Você pode adicionar informações sobre dietas balanceadas, dicas de receitas e a importância de uma alimentação consciente.' },
  { id: '2', title: 'Conteúdo sobre Atividade Física', image: 'https://www.conceitozen.com.br/wp-content/uploads/2018/08/os-beneficios-da-atividade-fisica-para-o-corpo.jpg', text: 'Aqui vai um conteúdo detalhado sobre a importância da atividade física. Você pode adicionar informações sobre diferentes tipos de exercícios, a importância do aquecimento e a relação entre exercício e bem-estar mental.' },
  // Você pode adicionar mais itens aqui
];

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [weights, setWeights] = useState([]);
  const [goals, setGoals] = useState([]);
  const [checkedGoals, setCheckedGoals] = useState({});
  const [goalProgress, setGoalProgress] = useState({});
  const [loadingWeights, setLoadingWeights] = useState(true);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [menuVisible, setMenuVisible] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [userInterestAreas, setUserInterestAreas] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.interestAreas) {
              setUserInterestAreas(userData.interestAreas);
            }
          }
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
        }
      }
    };
    loadUserData();
  }, []);


  const fetchWeights = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const weightsCollectionRef = collection(db, `users/${user.uid}/weights`);
        const q = query(weightsCollectionRef, orderBy('date', 'desc'));
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
        setLoadingWeights(false);
      }
    }
  };

  const getDateRange = (frequency) => {
    const now = new Date();
    let startDate, endDate;
    
    if (frequency.toLowerCase().includes('diária')) {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    } else if (frequency.toLowerCase().includes('semanal')) {
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek;
      startDate = new Date(now.getFullYear(), now.getMonth(), diff);
      endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if (frequency.toLowerCase().includes('mensal')) {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
    
    return { startDate, endDate };
  };

  const calculateProgress = async (goal) => {
    const user = auth.currentUser;
    if (!user) return { completed: 0, total: 0, percentage: 0 };
    
    const { startDate, endDate } = getDateRange(goal.frequency);
    const checkedCollectionRef = collection(db, `users/${user.uid}/checkedGoals`);
    
    try {
      const querySnapshot = await getDocs(checkedCollectionRef);
      let completed = 0;
      let total = 0;
      
      if (goal.frequency.toLowerCase().includes('diária')) {
        total = 1;
        const today = new Date().toDateString();
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.goalId === goal.id && data.date === today && data.checked) {
            completed = 1;
          }
        });
      } else if (goal.frequency.toLowerCase().includes('semanal')) {
        total = parseInt(goal.repetitions) || 1;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const docDate = new Date(data.timestamp?.toDate?.() || data.timestamp);
          if (data.goalId === goal.id && docDate >= startDate && docDate < endDate && data.checked) {
            completed++;
          }
        });
      } else if (goal.frequency.toLowerCase().includes('mensal')) {
        total = parseInt(goal.repetitions) || 1;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const docDate = new Date(data.timestamp?.toDate?.() || data.timestamp);
          if (data.goalId === goal.id && docDate >= startDate && docDate < endDate && data.checked) {
            completed++;
          }
        });
      }
      
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { completed, total, percentage };
    } catch (error) {
      console.error('Erro ao calcular progresso:', error);
      return { completed: 0, total: 0, percentage: 0 };
    }
  };

  const fetchGoals = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const goalsCollectionRef = collection(db, `users/${user.uid}/goals`);
        const q = query(goalsCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const fetchedGoals = [];
        querySnapshot.forEach((doc) => {
          fetchedGoals.push({ id: doc.id, ...doc.data() });
        });
        setGoals(fetchedGoals);
        
        // Carregar estados dos checkboxes para hoje
        const today = new Date().toDateString();
        const checkedStates = {};
        const progressData = {};
        
        for (const goal of fetchedGoals) {
          try {
            const checkDoc = await getDoc(doc(db, `users/${user.uid}/checkedGoals`, `${goal.id}_${today}`));
            if (checkDoc.exists()) {
              checkedStates[goal.id] = checkDoc.data().checked;
            }
            
            // Calcular progresso para cada meta
            const progress = await calculateProgress(goal);
            progressData[goal.id] = progress;
          } catch (error) {
            console.error('Erro ao carregar estado do checkbox:', error);
          }
        }
        
        setCheckedGoals(checkedStates);
        setGoalProgress(progressData);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar as metas.");
        console.error("Erro ao buscar metas: ", error);
      } finally {
        setLoadingGoals(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWeights();
      fetchGoals();
    }, [])
  );
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Home');
    } catch (error) {
      Alert.alert("Erro ao sair", "Não foi possível sair da sua conta.");
    }
  };

  const handleChecklistPress = async (goalId) => {
    const user = auth.currentUser;
    if (user) {
      const newCheckedState = !checkedGoals[goalId];
      const today = new Date().toDateString();
      
      try {
        await setDoc(doc(db, `users/${user.uid}/checkedGoals`, `${goalId}_${today}`), {
          goalId,
          checked: newCheckedState,
          date: today,
          timestamp: new Date()
        });
        
        setCheckedGoals(prevCheckedGoals => ({
          ...prevCheckedGoals,
          [goalId]: newCheckedState,
        }));
        
        // Recalcular progresso após mudança
        const goal = goals.find(g => g.id === goalId);
        if (goal) {
          const progress = await calculateProgress(goal);
          setGoalProgress(prev => ({
            ...prev,
            [goalId]: progress
          }));
        }
      } catch (error) {
        console.error('Erro ao salvar estado do checkbox:', error);
      }
    }
  };

  const dailyGoals = goals.filter(goal => goal.frequency.toLowerCase().includes('diária'));
  const weeklyGoals = goals.filter(goal => goal.frequency.toLowerCase().includes('semanal'));
  const monthlyGoals = goals.filter(goal => goal.frequency.toLowerCase().includes('mensal'));

  const _renderCarouselItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.carouselItem}
        onPress={() => navigation.navigate('ContentDetail', { item })}
      >
        <Image source={{ uri: item.image }} style={styles.carouselImage} />
        <Text style={styles.carouselTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderChecklistItem = ({ item }) => {
    const progress = goalProgress[item.id] || { completed: 0, total: 0, percentage: 0 };
    const isDaily = item.frequency.toLowerCase().includes('diária');
    const isWeekly = item.frequency.toLowerCase().includes('semanal');
    const isMonthly = item.frequency.toLowerCase().includes('mensal');
    
    return (
      <View style={styles.checklistItemCard}>
        <View style={styles.checklistItemHeader}>
          <TouchableOpacity onPress={() => handleChecklistPress(item.id)} style={[styles.checkbox, checkedGoals[item.id] && styles.checkboxChecked]}>
            {checkedGoals[item.id] && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
          </TouchableOpacity>
          <View style={styles.checklistContent}>
            <Text style={[styles.checklistTitle, checkedGoals[item.id] && styles.checklistTitleCompleted]}>{item.title}</Text>
          </View>
          {item.emoji && <Text style={styles.goalEmoji}>{item.emoji}</Text>}
        </View>
        {!isDaily && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBarImproved}>
              <View style={[styles.progressFillImproved, { width: `${progress.percentage}%` }]} />
            </View>
            <Text style={styles.progressTextImproved}>
              {progress.completed} de {progress.total} concluídas
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderWeightItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('WeightDetail', { item })} style={styles.weightItem}>
      <View>
        <Text style={styles.weightDate}>Data: {new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.weightValue}>Peso: {item.weight} kg</Text>
      </View>
    </TouchableOpacity>
  );

  const renderGoalItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.goalItem} 
      onPress={() => navigation.navigate('GoalDetail', { goal: item })}
    >
      <View style={styles.goalHeader}>
        {item.emoji && <Text style={styles.goalEmoji}>{item.emoji}</Text>}
        <View style={styles.goalTitleContainer}>
          <Text style={styles.goalTitle}>{item.objective || item.title}</Text>
          <Text style={styles.goalArea}>{item.selectedArea || item.area}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );



  if (loadingWeights || loadingGoals) {
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
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Painel</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.contentContainer}>
        
        {userInterestAreas.length > 0 && (
          <View style={styles.focusContainer}>
            <Text style={styles.focusTitle}>Vamos começar a mudança hoje?</Text>
            <Text style={styles.focusSubtitle}>Qual área de interesse gostaria de abordar agora?</Text>
            <View style={styles.interestAreasButtons}>
              {userInterestAreas.map((area, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.interestAreaButton}
                  onPress={() => navigation.navigate('AreaFocus', { selectedArea: area })}
                >
                  <Text style={styles.interestAreaButtonText}>{area}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.addInterestAreaButton}
                onPress={() => navigation.navigate('InterestAreas')}
              >
                <Ionicons name="add" size={20} color="#633B48" />
                <Text style={styles.addInterestAreaButtonText}>Adicionar Área</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Seção do Carrossel de Conteúdos */}
        <Text style={styles.sectionTitle}>Inspire-se</Text>
        <View style={styles.inspireSection}>
          <View style={styles.carouselContainer}>
          {carouselData.length > 0 ? (
            <>
              <FlatList
                data={carouselData}
                renderItem={_renderCarouselItem}
                keyExtractor={item => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                snapToInterval={screenWidth - 80}
                decelerationRate="fast"
                onMomentumScrollEnd={(event) => {
                  const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (screenWidth - 80));
                  setCurrentSlide(slideIndex);
                }}
              />
              <View style={styles.pagination}>
                {carouselData.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentSlide && styles.paginationDotActive
                    ]}
                  />
                ))}
              </View>
            </>
          ) : (
            <Text style={styles.noDataText}>Nenhum conteúdo para exibir.</Text>
          )}
            <TouchableOpacity onPress={() => navigation.navigate('ContentList')} style={styles.viewAllButton}>
              <Text style={styles.viewAllButtonText}>Visualizar todos os conteúdos</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Checklist</Text>
        <View style={styles.card}>
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>Hoje - {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
          </View>
          <Text style={styles.checklistSectionTitle}>Metas Diárias</Text>
          {dailyGoals.length > 0 ? (
            <FlatList
              data={dailyGoals}
              renderItem={renderChecklistItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noDataText}>Nenhuma meta diária cadastrada.</Text>
          )}

          <Text style={styles.checklistSectionTitle}>Metas Semanais</Text>
          {weeklyGoals.length > 0 ? (
            <FlatList
              data={weeklyGoals}
              renderItem={renderChecklistItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noDataText}>Nenhuma meta semanal cadastrada.</Text>
          )}

          <Text style={styles.checklistSectionTitle}>Metas Mensais</Text>
          {monthlyGoals.length > 0 ? (
            <FlatList
              data={monthlyGoals}
              renderItem={renderChecklistItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noDataText}>Nenhuma meta mensal cadastrada.</Text>
          )}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Minhas Medidas</Text>
        <View style={styles.card}>
          {weights.length > 0 ? (
            <FlatList
              data={weights}
              renderItem={renderWeightItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noDataText}>Nenhum registro de peso encontrado.</Text>
          )}
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => navigation.navigate('WeightInput')}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          {weights.length > 1 && (
            <TouchableOpacity 
              style={styles.chartButton} 
              onPress={() => navigation.navigate('WeightChart')}
            >
              <Ionicons name="stats-chart" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Minhas Metas</Text>
        <View style={styles.card}>
          {goals.length > 0 ? (
            <FlatList
              data={goals}
              renderItem={renderGoalItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noDataText}>Nenhuma meta cadastrada.</Text>
          )}
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => navigation.navigate('AreaFocus')}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuModal}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuHeaderText}>Menu</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('AreaFocus'); }}>
                <Ionicons name="flag-outline" size={24} color="#4B5320" />
                <Text style={styles.menuItemText}>Registrar Meta</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('WeightInput'); }}>
                <Ionicons name="fitness-outline" size={24} color="#4B5320" />
                <Text style={styles.menuItemText}>Registrar Peso</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('WeightChart'); }}>
                <Ionicons name="stats-chart-outline" size={24} color="#4B5320" />
                <Text style={styles.menuItemText}>Gráfico de Peso</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('ContentList'); }}>
                <Ionicons name="library-outline" size={24} color="#4B5320" />
                <Text style={styles.menuItemText}>Conteúdos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); setWelcomeVisible(true); }}>
                <Ionicons name="heart-outline" size={24} color="#4B5320" />
                <Text style={styles.menuItemText}>Jornada de Onboarding</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.menuLogoutButton} onPress={() => { setMenuVisible(false); handleLogout(); }}>
              <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
              <Text style={styles.menuLogoutText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={welcomeVisible}
        onRequestClose={() => setWelcomeVisible(false)}
      >
        <View style={styles.welcomeOverlay}>
          <View style={styles.welcomeModal}>
            <ScrollView contentContainerStyle={styles.welcomeContent}>
              <Text style={styles.welcomeTitle}>Bem-vindo(a) ao AgradaViver</Text>
              
              <Text style={styles.welcomeDescription}>
                Cuidar de si é um processo que vai muito além do peso. Nosso propósito é te ajudar a construir uma relação mais leve e consciente com sua saúde, acompanhando passo a passo as mudanças que você deseja ver na sua vida.
              </Text>
              
              <Text style={styles.welcomeDescription}>
                Aqui, você poderá criar metas personalizadas, acompanhar seu progresso e descobrir conteúdos que te ajudam a entender o porquê e o como de cada escolha.
              </Text>
              
              <Text style={styles.welcomeDescription}>
                Antes de começarmos, queremos te conhecer melhor, seus valores, o que te motiva e em quais áreas da sua rotina você gostaria de focar neste momento.
              </Text>
              
              <Text style={styles.welcomeQuestion}>Vamos iniciar?</Text>
              
              <View style={styles.welcomeButtons}>
                <TouchableOpacity 
                  style={styles.welcomeStartButton}
                  onPress={() => {
                    setWelcomeVisible(false);
                    navigation.navigate('ValuesSelection');
                  }}
                >
                  <Text style={styles.welcomeStartButtonText}>Começar minha jornada</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.welcomeCloseButton}
                  onPress={() => setWelcomeVisible(false)}
                >
                  <Text style={styles.welcomeCloseButtonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#587D5C',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuButton: {
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
  },
  logoutButton: {
    backgroundColor: '#633B48',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    backgroundColor: '#F7F4E9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F4E9',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4B5320',
  },
  inspireSection: {
    backgroundColor: '#D7E0D3',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  carouselContainer: {
    marginBottom: 10,
  },
  carouselItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 200,
    padding: 10,
    marginLeft: 25,
    marginRight: 25,
  },
  carouselImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  carouselTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5320',
    marginTop: 10,
  },
  viewAllButton: {
    backgroundColor: '#587D5C',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  viewAllButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  card: {
    flex: 1,
    backgroundColor: '#D7E0D3',
    borderRadius: 20,
    padding: 20,
    paddingBottom: 80,
    marginBottom: 20,
    position: 'relative',
  },
  checklistItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checklistItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checklistContent: {
    flex: 1,
    marginLeft: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#587D5C',
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#587D5C',
    borderColor: '#587D5C',
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5320',
    flex: 1,
  },
  checklistTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#8B4513',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBarImproved: {
    height: 6,
    backgroundColor: '#E8F5E8',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFillImproved: {
    height: '100%',
    backgroundColor: '#587D5C',
    borderRadius: 3,
  },
  progressTextImproved: {
    fontSize: 12,
    color: '#8B4513',
    textAlign: 'center',
    fontWeight: '500',
  },
  dateHeader: {
    backgroundColor: '#F7F4E9',
    borderWidth: 1,
    borderColor: '#587D5C',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  dateText: {
    color: '#4B5320',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  checklistDetails: {
    fontSize: 14,
    color: '#8B4513',
  },
  checklistSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    color: '#4B5320',
  },
  weightItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weightDate: {
    fontSize: 14,
    color: '#8B4513',
  },
  weightValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B5320',
  },
  goalItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5320',
    marginBottom: 4,
  },
  goalArea: {
    fontSize: 14,
    color: '#8B4513',
    fontStyle: 'italic',
  },

  noDataText: {
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 15,
    color: '#888',
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    backgroundColor: '#633B48',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 30,
  },
  chartButton: {
    position: 'absolute',
    bottom: 10,
    right: 90,
    backgroundColor: '#587D5C',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C0C0C0',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#633B48',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuModal: {
    backgroundColor: '#F7F4E9',
    width: '80%',
    maxHeight: '70%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuHeader: {
    backgroundColor: '#587D5C',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  menuHeaderText: {
    fontSize: 24,
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
  menuItems: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuItemText: {
    fontSize: 18,
    color: '#4B5320',
    marginLeft: 15,
    fontWeight: '500',
  },
  menuLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#633B48',
    paddingVertical: 15,
    paddingHorizontal: 20,
    margin: 20,
    borderRadius: 25,
    justifyContent: 'center',
  },
  menuLogoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  welcomeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeModal: {
    backgroundColor: '#F7F4E9',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
  },
  welcomeContent: {
    padding: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B5320',
    textAlign: 'center',
    marginBottom: 20,
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#8B4513',
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'justify',
  },
  welcomeQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5320',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  welcomeButtons: {
    gap: 15,
  },
  welcomeStartButton: {
    backgroundColor: '#633B48',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  welcomeStartButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeCloseButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  welcomeCloseButtonText: {
    color: '#8B4513',
    fontSize: 16,
    fontWeight: '600',
  },
  focusContainer: {
    backgroundColor: '#D7E0D3',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  focusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B5320',
    textAlign: 'center',
    marginBottom: 8,
  },
  focusSubtitle: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 20,
  },
  interestAreasButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  interestAreaButton: {
    backgroundColor: '#587D5C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
  },
  interestAreaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addInterestAreaButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#633B48',
    borderStyle: 'dashed',
  },
  addInterestAreaButtonText: {
    color: '#633B48',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  goalEmoji: {
    fontSize: 24,
    marginRight: 5,
  },

});