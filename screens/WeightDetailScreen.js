// screens/WeightDetailScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { useFocusEffect } from '@react-navigation/native';

export default function WeightDetailScreen({ navigation, route }) {
  const { item } = route.params;
  const [weight, setWeight] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeightDetails = useCallback(async () => {
    const user = auth.currentUser;
    if (user && item?.id) {
      try {
        const docRef = doc(db, `users/${user.uid}/weights`, item.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWeight({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
          setWeight(null);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [item?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchWeightDetails();
    }, [fetchWeightDetails])
  );

  const handleDeleteWeight = () => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja apagar este registro de peso?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Apagar",
          onPress: async () => {
            const user = auth.currentUser;
            if (user && weight) {
              try {
                const docRef = doc(db, `users/${user.uid}/weights`, weight.id);
                await deleteDoc(docRef);
                Alert.alert("Sucesso", "Registro de peso apagado com sucesso.");
                navigation.goBack();
              } catch (error) {
                Alert.alert("Erro ao apagar", error.message);
              }
            }
          },
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#633B48" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!weight) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F4E9' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes do Peso</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.detailTitle}>Medida não encontrada.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F4E9' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Peso</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.detailTitle}>Peso: {weight.weight} kg</Text>
        <Text style={styles.detailText}>Data: {new Date(weight.date).toLocaleDateString()}</Text>
        <Text style={styles.detailText}>Notas: {weight.notes}</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditWeight', {
              weightId: weight.id,
              initialWeight: weight.weight,
              initialNotes: weight.notes,
              initialDate: weight.date,
            })}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteWeight}
          >
            <Text style={styles.editButtonText}>Apagar</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4B5320',
  },
  detailText: {
    fontSize: 18,
    marginBottom: 5,
    color: '#8B4513',
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#633B48',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginRight: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#A8574B',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginLeft: 10,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});