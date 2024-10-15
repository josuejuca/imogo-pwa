import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Share } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const ImageCarousel = ({ images = [] }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleScroll = (event) => {
    const slide = Math.ceil(event.nativeEvent.contentOffset.x / screenWidth);
    if (slide !== activeSlide) {
      setActiveSlide(slide);
    }
  };

  

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: 'Confira nosso site: https://imogo.com.br/',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Compartilhado com tipo de atividade
        } else {
          // Compartilhado sem tipo de atividade
        }
      } else if (result.action === Share.dismissedAction) {
        // Compartilhamento foi cancelado
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Carrossel de imagens */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.carousel}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />

            {/* Botão de Voltar (com imagem back_white.png) */}
            <TouchableOpacity style={styles.backButton} onPress={() => {/* Função para voltar */}}>
              <Image source={require('../../assets/icons/back_white.png')} style={styles.backIcon} />
            </TouchableOpacity>

            {/* Botão de Compartilhar (Sem fundo) */}
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Image source={require('../../assets/icons/share.png')} style={styles.shareIcon} />
            </TouchableOpacity>

            {/* Rodapé com numeração (Fundo branco e fonte preta) */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {activeSlide + 1}/{images.length}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  carousel: {
    flex: 1,
  },
  imageContainer: {
    width: screenWidth,
    height: screenWidth * 0.75, // Proporção da imagem
    position: 'relative', // Para permitir sobreposição dos elementos
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 2,
  },
  backIcon: {
    width: 24, // Ajusta a largura da seta
    height: 24, // Ajusta a altura da seta
  },
  shareButton: {
    position: 'absolute',
    top: 20,
    right: 15,
    zIndex: 2,
  },
  shareIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: '#FFFFFF', // Fundo branco
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  footerText: {
    color: '#000', // Texto preto
    fontSize: 14,
  },
});

export default ImageCarousel;
