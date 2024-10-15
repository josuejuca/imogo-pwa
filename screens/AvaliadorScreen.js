import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import Svg, { Path, G, Rect, Mask } from 'react-native-svg';
import { WebView } from 'react-native-webview';
import { useState } from 'react';

const { width, height } = Dimensions.get('window');

// Ícone de seta para voltar
const BackArrowIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Mask id="mask0_1_782" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="5" y="0" width="15" height="24">
      <Path fillRule="evenodd" clipRule="evenodd" d="M18.5489 0.939645C19.151 1.52543 19.151 2.47518 18.5489 3.06097L9.36108 12.0003L18.5489 20.9396C19.151 21.5254 19.151 22.4752 18.5489 23.061C17.9469 23.6468 16.9707 23.6468 16.3686 23.061L5.00049 12.0003L16.3686 0.939645C16.9707 0.353859 17.9469 0.353859 18.5489 0.939645Z" fill="#FB7D10" />
    </Mask>
    <G mask="url(#mask0_1_782)">
      <Rect x="0.000488281" y="-0.00164795" width="24" height="24" fill="#FB7D10" />
    </G>
  </Svg>
);

const AvaliadorScreen = ({ route, navigation }) => {
  const { usuario_id } = route.params || {};
  const [loading, setLoading] = useState(true); // Estado para controlar o loading

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle} allowFontScaling={false}>Precificador</Text>
      </View>

      {/* Exibe o loading enquanto o WebView não carrega */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FB7D10" />
        </View>
      )}

      {/* WebView do https://imogo.online/avaliacao */}
      <WebView
        source={{ uri: 'https://imogo.online/avaliacao' }}
        style={[styles.webview, { display: loading ? 'none' : 'flex' }]} // Oculta WebView enquanto carrega
        onLoadEnd={() => setLoading(false)} // Define loading como false quando a página termina de carregar
      />
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
  loadingContainer: {
    ...StyleSheet.absoluteFillObject, // Faz o container de loading ocupar toda a tela
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    zIndex: 1, // Garante que o loading fique acima de outros elementos
  },
});

export default AvaliadorScreen;
