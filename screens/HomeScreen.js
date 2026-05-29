// App.js

// 1. Importações: importamos os componentes necessários do React e do React Native.
// 'useState' e 'useEffect' são hooks do React para gerenciar estado e efeitos colaterais.
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

// Importe sua imagem aqui. Certifique-se de que a imagem 'logo.png' está na pasta `assets` do seu projeto.
// Se a imagem tiver outro nome, substitua 'logo.png' pelo nome correto.
import Logo from '../assets/logo.png';

// 2. Componente Principal (App): esta é a função que representa a tela do nosso aplicativo.
export default function HomeScreen({ navigation }) {
    return (
    // O `View` é como uma `div` do HTML. Ele é um container para outros componentes.
    <View style={styles.container}>
      {/* A imagem do logo do aplicativo. */}
      <Image source={Logo} style={styles.logo} />

      {/* Um container para os botões de Login e Cadastro. */}
      <View style={styles.buttonContainer}>
        {/* Botão de Login: o `TouchableOpacity` cria um botão que reage ao toque. */}
        {/* O evento `onPress` chama a função `navigation.navigate('Login')` para ir para a tela de login. */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Botão de Cadastre-se: similar ao de login. */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 3. Estilização: aqui definimos a aparência dos nossos componentes.
// O `StyleSheet.create` nos ajuda a criar um objeto de estilos otimizado.
const styles = StyleSheet.create({
  container: {
    flex: 1, // Faz com que o container ocupe todo o espaço da tela.
    backgroundColor: '#F7F4E9', // Cor de fundo principal.
  },
  logo: {
    width: 300, // Largura do logo.
    height: 300, // Altura do logo.
    marginBottom: 20, // Espaçamento abaixo do logo.
    alignSelf: 'center', // Centraliza a imagem horizontalmente dentro do container.
    marginTop: 120, // Adicionei um espaçamento no topo para a imagem não ficar colada na borda.
  },
  buttonContainer: {
    position: 'absolute', // Permite posicionar o container em relação ao seu pai (a tela).
    bottom: 0, // Inicia na parte inferior da tela.
    width: '100%', // Ocupa toda a largura.
    height: '40%', // Ocupa 50% da altura da tela, começando de baixo.
    backgroundColor: '#587D5C',
    padding: 20, // Adiciona um padding interno para que os botões não fiquem grudados nas bordas.
    alignItems: 'center', // Centraliza os botões horizontalmente.
    justifyContent: 'center', // Centraliza os botões verticalmente.
    borderTopLeftRadius: 50, // Borda arredondada no canto superior esquerdo.
    borderTopRightRadius: 50, // Borda arredondada no canto superior direito.
  },
  button: {
    backgroundColor: '#633B48', // Cor de fundo dos botões.
    paddingVertical: 15, // Espaçamento vertical interno do botão.
    paddingHorizontal: 50, // Espaçamento horizontal interno do botão.
    borderRadius: 30, // Deixa os cantos do botão arredondados.
    marginBottom: 15, // Espaçamento entre os botões.
    alignItems: 'center', // Alinha os itens no centro horizontalmente.
    width: '80%', // Dei uma largura fixa para os botões para que eles não ocupem toda a largura do container.
  },
  buttonText: {
    color: '#FFFFFF', // Cor do texto do botão.
    fontSize: 20, // Tamanho da fonte do texto do botão.
  },
});