import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Platform, SafeAreaView, StatusBar } from 'react-native';
import axios from 'axios'; // Usando Axios para fazer a requisição

const { width, height } = Dimensions.get('window');

const PreDocumentoScreen = ({ navigation, route }) => {
    const { id } = route.params || {}; // Pegando o ID da rota
    const [documento, setDocumento] = useState(null);
    const [usuarioId, setUsuarioId] = useState(null);
    const [textoDocumento, setTextoDocumento] = useState('...');

    // Função para buscar os dados do imóvel pela API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://imogo.juk.re/api/v1/imoveis/${id}`);
                const { tipo_documento, usuario_id, classificacao, tipo } = response.data;

                // Ajusta o texto e define o usuário
                setUsuarioId(usuario_id);
                if (tipo_documento === 'CNH') {
                    setTextoDocumento("Envie sua CNH");
                } else {
                    setTextoDocumento("Envie seu documento de identidade");
                }

                // Armazena o documento completo para navegações futuras
                setDocumento(response.data);
            } catch (error) {
                console.error("Erro ao buscar os dados do imóvel:", error);
            }
        };

        fetchData();
    }, [id]);

    // Função para manipular a navegação com base no tipo de documento
    const handleNext = () => {
        if (documento?.tipo_documento === 'CNH') {
            navigation.navigate('TipoFotoScreen', { id, usuario_id: documento.usuario_id, classificacao: documento.classificacao, tipo: documento.tipo, tipo_documento: documento.tipo_documento });
        } else {
            navigation.navigate('TipoFotoScreen', { id, usuario_id: documento.usuario_id, classificacao: documento.classificacao, tipo: documento.tipo, tipo_documento: documento.tipo_documento });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.progressBarContainer}>
                <View style={styles.progressSegmentFilled}></View>
                <View style={styles.progressSegmentFilled}></View>
                <View style={styles.progressSegmentFilled}></View>
                <View style={styles.progressSegmentHalfFilled}>
                    <View style={styles.progressSegmentHalfFilledInner}></View>
                </View>
                <View style={styles.progressSegment}></View>
            </View>

            <Image
                source={require('../../assets/img/stape3.png')} // Substitua pelo caminho correto da imagem
                style={styles.image}
                resizeMode="contain"
            />

            <Text style={styles.title} allowFontScaling={false}>{textoDocumento}</Text>
            <Text style={styles.description} allowFontScaling={false}>
                Precisamos checar a sua identidade para concluir o seu cadastro #{id} | @{usuarioId}
            </Text>

            <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleNext} // Manipulando a navegação com base no documento
            >
                <Text style={styles.buttonText} allowFontScaling={false}>Próximo</Text>
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
            web: height * 0.05,
        }),
        alignItems: 'center',
    },
    progressBarContainer: {
        marginTop: Platform.select({
            ios: height * 0.02, // Espaço menor no iOS
            android: height * 0.015, // Espaço menor no Android
            web: height * 0.015,
        }),
        margin:Platform.select({
            ios: height * 0.02, // Espaço menor no iOS
            android: height * 0.015, // Espaço menor no Android
            web: height * 0.015,
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
            android: width * 0.042,
        }),
        fontWeight: 'bold',
        color: '#1F2024',
        textAlign: 'center',
        marginBottom: height * 0.01, // Ajuste de margem inferior para o título
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

export default PreDocumentoScreen;
