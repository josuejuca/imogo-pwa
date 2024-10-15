// components/Welcome.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, StatusBar, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';

// Obter a largura e altura da tela
const { width, height } = Dimensions.get('window');

const Welcome = ({ navigation }) => {
    // Carregar as fontes
    let [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_700Bold,
    });

    // Exibir indicador de carregamento enquanto as fontes não carregam
    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FB7D10" />
            </View>
        );
    }

    // Verificar se é web e largura da tela
    if (Platform.OS === 'web' && width > 768) {
        return (
            <View style={styles.webContainer}>
                <Text style={styles.webMessage}>
                    Este app foi projetado para ser usado em dispositivos móveis. Por favor, acesse-o em um celular.
                </Text>
            </View>
        );
    }

    return (
        <ImageBackground
            source={require('../assets/img/Splashcreen.png')}
            style={styles.background}
        >
            {/* Definir o estilo da StatusBar conforme a plataforma */}
            <StatusBar
                barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
                backgroundColor="transparent"
                translucent
            />
            <View style={styles.container}>
                {/* Logo centralizada na parte superior */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/img/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Parte inferior branca ocupando 50% do espaço com altura fixa */}
                <View style={styles.whiteContainer}>
                    <Text style={styles.title} allowFontScaling={false}>Faça parte da imoGo</Text>
                    <Text style={styles.subtitle} allowFontScaling={false}>
                        Aqui a venda do seu imóvel é segura, descomplicada e está na palma da sua mão.
                    </Text>

                    {/* Botões */}
                    <TouchableOpacity
                        style={styles.buttonPrimary}
                        onPress={() => navigation.navigate('Singup')}
                    >
                        <Text style={styles.buttonTextPrimary} allowFontScaling={false}>Criar cadastro</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonSecondary}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.buttonTextSecondary} allowFontScaling={false}>Já tenho acesso</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
    },
    logoContainer: {
        height: height * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: width * 0.35,
        height: height * 0.12,
    },
    whiteContainer: {
        width: '100%',
        height: height * 0.5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: width * 0.06,
        paddingVertical: height * 0.02,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
    },
    title: {
        fontFamily: 'Nunito_700Bold',
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#1F2024',
        marginBottom: height * 0.01,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Nunito_400Regular',
        fontSize: Platform.select({
            ios: width * 0.038,
            android: width * 0.038,
        }),
        color: '#1F2024',
        textAlign: 'center',
        marginBottom: Platform.select({
            ios: height * 0.045,
            android: height * 0.04,
        }),
    },
    buttonTextPrimary: {
        fontFamily: 'Nunito_700Bold',
        color: '#F5F5F5',
        fontSize: width * 0.04,
        fontWeight: 'bold',
    },
    buttonTextSecondary: {
        fontFamily: 'Nunito_700Bold',
        color: '#1F2024',
        fontSize: width * 0.04,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    buttonPrimary: {
        backgroundColor: '#FB7D10',
        paddingVertical: height * 0.012,
        paddingHorizontal: width * 0.1,
        borderRadius: 30,
        marginBottom: height * 0.012,
        width: '100%',
        alignItems: 'center',
    },
    buttonSecondary: {
        borderColor: '#1F2024',
        borderWidth: 1,
        paddingVertical: height * 0.012,
        paddingHorizontal: width * 0.1,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
    },
    // Estilo para web
    webContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    webMessage: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 24,
        color: '#1F2024',
        textAlign: 'center',
    },
});

export default Welcome;
