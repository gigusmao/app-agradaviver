import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../assets/logo.png';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // A função que lida com o cadastro.
  const handleRegister = async () => {
    // 1. Verificação inicial: garante que os campos não estão vazios.
    if (email.length > 0 && password.length > 0) {
      try {
        // 2. Chamada ao Firebase: tenta criar o usuário.
        await createUserWithEmailAndPassword(auth, email, password);

        // 3. Sucesso: se o código acima funcionar, esta parte será executada.
        navigation.navigate('Dashboard'); // Navega para a tela principal
        
      } catch (error) {
        // 4. Erro: se algo der errado (e-mail inválido, senha fraca), esta parte será executada.
        Alert.alert("Erro", error.message);
      }
    } else {
      // 5. Campos vazios: se o usuário tentar cadastrar sem preencher os campos.
      Alert.alert("Erro", "Preencha e-mail e senha.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Image source={Logo} style={styles.logo} />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Crie sua conta</Text>

      {/* Campo de e-mail */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail} // Atualiza o estado quando o texto muda
      />

      {/* Campo de senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword} // Atualiza o estado quando o texto muda
      />

        {/* Botão de cadastro, que chama a função handleRegister */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4E9',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#587D5C',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
    alignSelf: 'center',
    marginTop: 120,
  },
  formContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '40%',
    backgroundColor: '#587D5C',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#FFFFFF',
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#633B48',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});