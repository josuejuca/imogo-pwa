import React, { useReducer } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Platform, SafeAreaView, StatusBar, Linking } from 'react-native';

const { width, height } = Dimensions.get('window');

const CadastroImovelSuccessScreen = ({ navigation, route }) => {
    const { usuario_id } = route.params || {};
    return (

        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Image
                source={require('../../assets/img/stape6.png')} // Substitua pelo caminho correto da imagem
                style={styles.image}
                resizeMode="contain"
            />

            <Text style={styles.title} allowFontScaling={false}>Recebemos o cadastrado do seu imóvel!</Text>
            <Text style={styles.description} allowFontScaling={false}>
                Agora vamos avaliar todos os dados cadastrados e, se necessário, entraremos em contato por e-mail ou WhatsApp. Fique atento!
            </Text>
            <Text style={styles.description} allowFontScaling={false}>
                Em caso de dúvidas fale com nosso suporte:
            </Text>
            <Text style={styles.description_uri} onPress={() => Linking.openURL('https://api.whatsapp.com/send?phone=5561983550036')} allowFontScaling={false}>
                Contato com o suporte
            </Text>
            <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={() => navigation.navigate('Home', { usuario_id })} // Ajuste para a navegação correta
            >
                <Text style={styles.buttonText} allowFontScaling={false}>OK</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
        paddingHorizontal: width * 0.05,
        paddingTop: Platform.select({
            ios: height * 0.05,
            android: height * 0.05,
        }),
        alignItems: 'center',
    },
    progressBarContainer: {
        marginTop: Platform.select({
            ios: height * 0.02, // Espaço menor no iOS
            android: height * 0.015, // Espaço menor no Android
        }),
        margin: Platform.select({
            ios: height * 0.02, // Espaço menor no iOS
            android: height * 0.015, // Espaço menor no Android
        }),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: height * 0.04, // Ajuste de margem inferior
    },
    progressSegment: {
        height: height * 0.008, // Ajuste da altura para a barra de progresso
        width: '20%',
        backgroundColor: '#DCDCDC',
        borderRadius: 4,
    },
    progressSegmentFilled: {
        height: height * 0.008,
        width: '20%',
        backgroundColor: '#FF7A00',
        borderRadius: 4,
    },
    progressSegmentHalfFilled: {
        height: height * 0.008,
        width: '20%',
        backgroundColor: '#DCDCDC',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressSegmentHalfFilledInner: {
        height: '100%',
        width: '50%',
        backgroundColor: '#FB7D10',
    },
    image: {
        width: width * 0.7, // Aumentado para 70% da largura da tela
        height: height * 0.4, // Aumentado para 40% da altura da tela
        marginBottom: height * 0.03, // Ajustei o espaço inferior para a imagem
    },
    title: {
        fontSize: Platform.select({
            ios: width * 0.045,
            android: width * 0.057,
        }),
        fontWeight: 'bold',
        color: '#FB7D10',
        textAlign: 'center',
        marginBottom: height * 0.02, // Ajuste de margem inferior para o título
        marginHorizontal: width * 0.05, // Margem lateral para alinhar com a imagem
    },
    description: {
        fontSize: Platform.select({
            ios: width * 0.035,
            android: width * 0.035,
        }),
        color: '#2F3036',
        textAlign: 'center',
        marginBottom: height * 0.03,
        marginHorizontal: width * 0.01, // Ajustei a margem lateral para o texto descritivo
    },
    description_uri: {
        fontSize: Platform.select({
            ios: width * 0.035,
            android: width * 0.035,
        }),
        color: '#FB7D10',
        textAlign: 'center',
        marginBottom: height * 0.03,
        marginHorizontal: width * 0.1, // Ajustei a margem lateral para o texto descritivo
    },
    buttonPrimary: {
        backgroundColor: '#FF7A00',
        paddingVertical: height * 0.02, // Padding vertical de 2% da altura da tela
        paddingHorizontal: width * 0.1, // Padding horizontal de 10% da largura da tela
        borderRadius: 30,
        width: '80%',
        alignItems: 'center',
        position: 'absolute', // Posiciona o botão como absoluto
        bottom: height * 0.08, // Ajuste da posição do botão em relação ao fundo da tela
    },
    buttonText: {
        fontSize: Platform.select({
            ios: width * 0.04, // Fonte maior para iOS
            android: width * 0.03, // Fonte ligeiramente menor para Android
        }),
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default CadastroImovelSuccessScreen;
