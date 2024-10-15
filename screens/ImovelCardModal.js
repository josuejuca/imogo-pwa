// components/ImovelCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importando o hook useNavigation
import { Ionicons } from '@expo/vector-icons';
const { width, height } = Dimensions.get('window');

// Função para definir os ícones dos status
const getStatusIcon = (status) => {
  switch (status) {
    case 10:
      return require('../assets/icons/juridico.png');
    case 11:
      return require('../assets/icons/camera.png');
    case 12:
      return require('../assets/icons/doc.png');
    case 13:
      return require('../assets/icons/ok.png');
    case 20:
      return require('../assets/icons/negociacao.png');
    case 21:
      return require('../assets/icons/email.png');
    case 22:
      return require('../assets/icons/doc.png');
    case 23:
      return require('../assets/icons/calculadora.png');
    case 24:
      return require('../assets/icons/dinheiro.png');
    default:
      return require('../assets/icons/default.png'); // Ícone default para status 1-9
  }
};

// Função para definir as cores e progresso com base no status
const getProgressBar = (status) => {
  let stages = status >= 10 && status <= 19 ? 3 : 5; // 3 etapas para 10-19, 5 para 1-9 e 20-29
  let progress;

  // Ajuste da sequência do cadastro para status 1 a 5
  if (status >= 1 && status <= 5) {
    progress = status; // Progresso é baseado no próprio status
  } else if (status === 24 || status === 13) {
    progress = stages; // Completar todos os estágios para status 24 e 13
  } else {
    progress = Math.min(stages, (status % 10) + 1); // Progresso conforme o ID
  }

  let color = status >= 1 && status <= 9 ? '#8F9098' : '#FB7D10'; // Cor cinza para 1-9 e laranja para 10-29

  return { progress, stages, color };
};

// Função para definir a descrição com base no status
const getDescription = (status) => {
  if (status >= 1 && status <= 9) {
    return 'Finalize o cadastro do imóvel';
  } else if (status >= 10 && status <= 19) {
    switch (status) {
      case 10:
        return 'Em análise jurídica';
      case 11:
        return 'Agendar visita fotográfica';
      case 12:
        return 'Publicando anúncio';
      case 13:
        return 'Anúncio publicando';
      default:
        return 'Em progresso';
    }
  } else if (status >= 20 && status <= 29) {
    switch (status) {
      case 20:
        return 'Aguardando agendamento de visita';
      case 21:
        return 'Aguardando assinatura da carta proposta';
      case 22:
        return 'Aguardando assinatura do contrato de corretagem';
      case 23:
        return 'Em análise financeira';
      case 24:
        return 'Vendido';
      default:
        return 'Em progresso';
    }
  }
  return 'Status desconhecido';
};

const ImovelCard = ({ imovel }) => {
  const navigation = useNavigation(); // Hook useNavigation para obter o objeto navigation
  const { status, valor, localizacao, id, imagem, usuario_id } = imovel; // Incluímos o ID do imóvel aqui
  const { progress, stages, color } = getProgressBar(status);
  const description = getDescription(status);
  const icon = getStatusIcon(status);

  // Função para decidir a navegação com base no status
  const handleNavigation = () => {
    if (status >= 1 && status <= 9) {
      // Redireciona para CadastroImovel se o status estiver entre 1 e 9
      navigation.navigate('CadastroImovel', { id, status, usuario_id });
    } else {
      // Redireciona para ImovelDetalhe para status acima de 9
      navigation.navigate('ImovelScreen', { id, status, usuario_id });
    }
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={handleNavigation}>
      {/* Imagem do imóvel */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imagem }} style={styles.image} resizeMode="cover" />


      </View>

      {/* Seção de Descrição e Progresso */}
      <View style={styles.infoContainer}>
        {/* Descrição */}
        <Text style={styles.priceText} allowFontScaling={false}>{valor}</Text>
        <Text style={[styles.locationText , { color: status >= 10 ? '#FB7D10' : '#8F9098' }]} allowFontScaling={false}><Ionicons name="location-sharp" color={status >= 10 ? '#FB7D10' : '#8F9098'} /> {localizacao}</Text>

        {/* Progresso */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            {[...Array(stages)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressSegment,
                  {
                    backgroundColor:
                      index < progress - 1 || (status === 24 || status === 13)
                        ? color // Estágios anteriores completos ou progresso completo para status 13/24
                        : index === progress - 1 && status !== 24 && status !== 13
                          ? 'transparent' // Barra ativa será dividida em duas cores, exceto para 13/24
                          : '#D0D0D0', // Estágios futuros vazios
                  },
                ]}
              >
                {index === progress - 1 && status !== 24 && status !== 13 && (
                  <View style={styles.activeProgressSegment}>
                    {/* Metade preenchida com a cor ativa */}
                    <View style={[styles.progressHalf, { backgroundColor: color }]} />
                    {/* Metade preenchida com a cor inativa */}
                    <View style={[styles.progressHalf, { backgroundColor: '#D0D0D0' }]} />
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Ícone de Status */}
          {icon && <Image source={icon} style={styles.statusIcon} />}
        </View>

        {/* Descrição do Progresso */}
        <Text style={[styles.descriptionText, { color: status >= 10 ? '#FB7D10' : '#8F9098' }]} allowFontScaling={false}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF', // Cor do cartão
    borderRadius: 15,
    marginVertical: height * 0.02,
    width: '90%', // Ocupar 90% da largura da tela
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: height * 0.2, // Tamanho fixo da imagem
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: '#fafafa', // Mesma cor do fundo da view
  },
  priceText: {
    fontSize: width * 0.045,
    color: '#1F2024',
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  locationText: {
    fontSize: width * 0.037,
    color: '#FB7D10',
    marginBottom: height * 0.01,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  progressBar: {
    flexDirection: 'row',
    flex: 1,
  },
  progressSegment: {
    height: 8,
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  activeProgressSegment: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden', // Para que as metades fiquem dentro da barra
  },
  progressHalf: {
    flex: 1,
    height: '100%',
  },
  statusIcon: {
    width: 34,
    height: 34,
    marginLeft: width * 0.02,
  },
  descriptionText: {
    fontSize: width * 0.035,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
});

export default ImovelCard;
