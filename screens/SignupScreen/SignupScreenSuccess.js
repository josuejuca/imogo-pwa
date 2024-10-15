import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const SuccessScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/img/success.png')}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.successText} allowFontScaling={false}>
                Seu cadastro foi concluído com sucesso!
            </Text>
            <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={() => navigation.navigate('Welcome')}
            >
                <Text style={styles.buttonText} allowFontScaling={false}>
                    Ir para a tela de login
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: width * 0.08, // Padding lateral de 8% da largura da tela
    },
    image: {
        width: width * 0.6, // Largura da imagem proporcional à largura da tela
        height: height * 0.3, // Altura da imagem proporcional à altura da tela
        marginBottom: height * 0.05, // Espaço abaixo da imagem
    },
    successText: {
        fontSize: Platform.select({
            ios: width * 0.039, // Fonte maior para iOS
            android: width * 0.04, // Fonte ligeiramente menor para Android
        }),
        fontWeight: 'bold',
        color: '#FF7A00', // Cor do texto laranja
        textAlign: 'center',
        marginBottom: height * 0.05, // Espaço abaixo do texto
    },
    buttonPrimary: {
        backgroundColor: '#FF7A00',
        paddingVertical: height * 0.02, // Padding vertical de 2% da altura da tela
        paddingHorizontal: width * 0.1, // Padding horizontal de 10% da largura da tela
        borderRadius: 30,
        width: '80%',
        alignItems: 'center',
        position: 'absolute', // Posiciona o botão como absoluto
        bottom: height * 0.1, // Muda para 10% da altura da tela em relação ao fundo
    },
    buttonText: {
        fontSize: Platform.select({
            ios: width * 0.039, // Fonte maior para iOS
            android: width * 0.04, // Fonte ligeiramente menor para Android
        }),
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default SuccessScreen;
