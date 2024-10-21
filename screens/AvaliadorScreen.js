import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg'; // Certifique-se de importar corretamente
import { useState } from 'react';

const { width } = Dimensions.get('window');

// Ícone de seta para voltar
const BackArrowIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18l-6-6 6-6"
      stroke="#FB7D10"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AvaliadorScreen = ({ route, navigation }) => {
  const { usuario_id } = route.params || {};
  const [loading, setLoading] = useState(true); // Estado para controlar o loading

  // Função para renderizar o iframe na web
  const renderWebContent = () => (
    <iframe
      src="https://imogo.online/avaliacao"
      style={styles.iframe}
      onLoad={() => setLoading(false)}
      title="Precificador"
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle} allowFontScaling={false}>Precificador</Text>
      </View>

      {/* Exibe o loading enquanto o iframe não carrega */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FB7D10" />
        </View>
      )}

      {/* Condicional para diferenciar o uso do WebView no mobile e iframe na web */}
      {Platform.OS === 'web' ? renderWebContent() : (
        <WebView
          source={{ uri: 'https://imogo.online/avaliacao' }}
          style={[styles.webview, { display: loading ? 'none' : 'flex' }]} // Oculta WebView enquanto carrega
          onLoadEnd={() => setLoading(false)} // Define loading como false quando a página termina de carregar
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40, // Maior espaçamento para a barra de status
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#1F2024',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  webview: {
    flex: 1,
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject, // Faz o container de loading ocupar toda a tela
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    zIndex: 1, // Garante que o loading fique acima de outros elementos
  },
});

export default AvaliadorScreen;
