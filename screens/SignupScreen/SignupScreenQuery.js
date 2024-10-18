import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert, Platform, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const SurveyScreen = ({ navigation, route }) => {
    const { name, surname, email, password, phone } = route.params;
    const fullName = `${name} ${surname}`;
    const [selectedOption, setSelectedOption] = useState(null);
    const [buttonScale] = useState(new Animated.Value(1)); // Valor inicial de escala do botão
    const [loading, setLoading] = useState(false); // Estado para controle do carregamento

    const options = ['Facebook', 'Instagram', 'Google', 'Loja de aplicativos', 'Indicação de amigos', 'Outro'];

    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95, // Escala para baixo quando pressionado
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1, // Escala de volta ao tamanho original
            useNativeDriver: true,
        }).start();
    };

    const handleButtonPress = async () => {
        if (loading) return; // Impede ação se já estiver carregando

        setLoading(true); // Ativa o estado de carregamento

        try {
            const response = await axios.post('https://imogo.juk.re/api/v1/usuarios/', {
                email: email,
                nome_social: fullName,
                origem: selectedOption || 'Não informado', // Envia "Não informado" se nenhuma opção for selecionada
                senha: password,
                telefone: phone,
                foto_conta: 'https://juca.eu.org/img/icon_dafault.jpg'
            });

            if (response.status === 200) {
                navigation.navigate('SuccessScreen');
            } else {
                Alert.alert('Erro', `Não foi possível criar o usuário. Código: ${response.status}`);
                setLoading(false); // Reativa o botão em caso de falha
            }
        } catch (error) {
            // Verifica se o erro tem uma resposta e se é um erro 400
            if (error.response && error.response.status === 400) {
                // Exibe a mensagem de erro fornecida pela API
                const errorMessage = error.response.data?.message || 'E-mail já cadastrado.';
                Alert.alert('Erro', errorMessage);
            } else {
                // Mensagem genérica para outros erros
                const status = error.response?.status || 'Desconhecido';
                Alert.alert('Erro', `Não foi possível conectar à API. Código: ${status}`);
            }
            setLoading(false); // Reativa o botão em caso de erro
        }
    };

    const handleOptionPress = (option) => {
        setSelectedOption(prevOption => (prevOption === option ? null : option));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Barra de Progresso */}
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressSegmentFilled}></View>
                    <View style={styles.progressSegmentFilled}></View>
                    <View style={styles.progressSegmentHalfFilled}>
                        <View style={styles.progressSegmentHalfFilledInner}></View>
                    </View>

                </View>

                <Text style={styles.subtitle} allowFontScaling={false}>Só mais uma coisa</Text>
                <Text style={styles.title} allowFontScaling={false}>Como conheceu a imoGo?</Text>
                <Text style={styles.description} allowFontScaling={false}>Nos conte como chegou até aqui</Text>

                {options.map(option => (
                    <TouchableOpacity
                        key={option}
                        style={[styles.optionButton, selectedOption === option && styles.optionButtonSelected]}
                        onPress={() => handleOptionPress(option)}
                    >
                        <Text style={[styles.optionText, selectedOption === option && styles.optionTextSelected]} allowFontScaling={false}>
                            {option}
                        </Text>
                        {selectedOption === option && (
                            <Ionicons name="checkmark" size={20} color="#FFF" style={styles.optionIcon} />
                        )}
                    </TouchableOpacity>
                ))}

                <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
                    <TouchableOpacity
                        style={[styles.buttonPrimary, loading && styles.buttonDisabled]}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={handleButtonPress}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText} allowFontScaling={false}>
                            {loading ? 'Criando conta...' : 'Concluir'}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

export default SurveyScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: width * 0.06, // Padding ajustado para 6% da largura da tela
        paddingTop: Platform.select({
            ios: height * 0.07, // 7% da altura da tela para iOS
            android: height * 0.05, // 5% da altura da tela para Android
        }),
    },
    progressBarContainer: {
        marginTop: Platform.select({
            ios: height * 0.03, // 3% da altura da tela para iOS
            android: height * 0.02, // 2% da altura da tela para Android
        }),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: height * 0.04, // Margem inferior ajustada
    },
    progressSegment: {
        height: height * 0.008, // Altura ajustada para a barra de progresso
        width: '33%',
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
    },
    progressSegmentFilled: {
        height: height * 0.008,
        width: '33%',
        backgroundColor: '#FF7A00',
        borderRadius: 4,
    },
    progressSegmentHalfFilled: {
        height: height * 0.008,
        width: '33%',
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden', // Esconde a parte não preenchida
    },
    progressSegmentHalfFilledInner: {
        height: '100%',
        width: '50%', // 50% do espaço preenchido
        backgroundColor: '#FF7A00',
    },
    title: {
        fontSize: Platform.select({
            ios: width * 0.06, // Ajuste para iOS
            android: width * 0.055, // Ajuste para Android
        }),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: height * 0.01, // Margem inferior ajustada
    },
    subtitle: {
        fontSize: Platform.select({
            ios: width * 0.045, // Ajuste para iOS
            android: width * 0.04, // Ajuste para Android
        }),
        textAlign: "center",
        color: '#333',
        marginBottom: height * 0.01, // Margem inferior ajustada
    },
    description: {
        fontSize: Platform.select({
            ios: width * 0.04, // Ajuste para iOS
            android: width * 0.035, // Ajuste para Android
        }),
        color: '#666',
        marginBottom: height * 0.02, // Margem inferior ajustada
    },
    optionButton: {
        backgroundColor: '#F4F4F4',
        paddingVertical: height * 0.02, // Padding vertical ajustado
        paddingHorizontal: width * 0.05, // Padding horizontal ajustado
        borderRadius: 15,
        marginBottom: height * 0.015, // Margem inferior ajustada
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    optionButtonSelected: {
        backgroundColor: '#FF7A00',
    },
    optionText: {
        fontSize: Platform.select({
            ios: width * 0.04, // Ajuste para iOS
            android: width * 0.038, // Ajuste para Android
        }),
        color: '#333',
    },
    optionTextSelected: {
        color: '#FFF',
    },
    optionIcon: {
        marginLeft: 10,
    },
    buttonContainer: {
        width: '100%',
    },
    buttonPrimary: {
        backgroundColor: '#FF7A00',
        paddingVertical: height * 0.018, // Padding vertical ajustado
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        marginTop: height * 0.04, // Margem superior ajustada
    },
    buttonDisabled: {
        backgroundColor: '#FFA726', // Cor ligeiramente diferente para indicar carregamento
    },
    buttonText: {
        fontSize: Platform.select({
            ios: width * 0.045, // Ajuste para iOS
            android: width * 0.05, // Ajuste para Android
        }),
        fontWeight: 'bold',
        color: '#FFF',
    },
});
