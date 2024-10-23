import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, Dimensions, Platform, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native'; // Importando useFocusEffect
import ImovelClassificacao from './modal/imovelClassificacaoModal';
import ImoveisList from './ImoveisListModal';
import axios from 'axios'; // Importando axios para fazer a requisição à API

const { width, height } = Dimensions.get('window');

const Home = ({ route, navigation }) => {

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
    
    const { usuario_id } = route.params || {}; // Obtendo o ID do usuário vindo da tela anterior

    const [userInfo, setUserInfo] = useState(null); // Estado para armazenar as informações do usuário
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [modalVisible, setModalVisible] = useState(false); // Controla o primeiro modal (categoria)
    const [classificationModalVisible, setClassificationModalVisible] = useState(false); // Controla o segundo modal (tipo de imóvel)
    const [categoria, setCategoria] = useState('');
    const [tipoImovel, setTipoImovel] = useState('');

    // Se o usuario_id for indefinido, redireciona o usuário para a tela de login
    useEffect(() => {
        if (!usuario_id) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }
    }, [usuario_id, navigation]);

    // Função para buscar os dados do usuário
    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://imogo.juk.re/api/v1/usuarios/${usuario_id}`);
            setUserInfo(response.data); // Armazena as informações do usuário
        } catch (error) {
            console.error('Erro ao buscar informações do usuário:', error);
        } finally {
            setLoading(false);
        }
    };

    // Hook para buscar os dados do usuário toda vez que a tela entra em foco
    useFocusEffect(
        useCallback(() => {
            if (usuario_id) {
                fetchUserInfo(); // Chama a função para buscar os dados do usuário
            }
        }, [usuario_id])
    );

    const handleCategorySelect = (selectedCategoria) => {
        setCategoria(selectedCategoria);
        setModalVisible(false); // Fecha o primeiro modal
        setTimeout(() => setClassificationModalVisible(true), 300); // Abre o segundo modal após 300ms
    };

    // Exibindo um indicador de carregamento enquanto busca as informações do usuário
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FB7D10" />
            </View>
        );
    }


    const status_user = userInfo?.status
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <StatusBar
                    barStyle={Platform.OS === 'ios' ? 'dark-content' : 'dark-content'}
                    backgroundColor="transparent"
                    translucent
                />
                {/* Header com logo e notificação */}
                <View style={styles.headerContainer}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/img/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <TouchableOpacity onPress={() => alert('Notificações')}>
                        <Image
                            source={require('../assets/icons/notificacao.png')}
                            style={styles.IconFooter}
                        />
                    </TouchableOpacity>
                </View>

                {/* Linha de separação do header */}
                <View style={styles.headerLine} />

                {/* Mensagem de boas-vindas */}
                {userInfo?.status === 1 ? (
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeText} allowFontScaling={false}>Bem-vindo à imoGo!</Text>
                        <Text style={styles.subText} allowFontScaling={false}>Seus imóveis publicados aparecerão aqui.</Text>
                    </View>
                ) : (
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeText} allowFontScaling={false}>Meus imóveis {status_user}</Text>
                    </View>
                )}

                {/* Container principal para conteúdo */}
                <View style={styles.bodyContainer}>
                    {/* Verifica o status do usuário para mostrar o botão de adicionar imóvel ou a lista de imóveis */}
                    {userInfo?.status === 1 ? (
                        <View style={styles.noPropertiesContainer}>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => setModalVisible(true)} // Abre o primeiro modal ao clicar no botão
                            >
                                <Text style={styles.addButtonText} allowFontScaling={false}>+ Adicionar Imóvel</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <ImoveisList usuario_id={usuario_id} status_user={status_user} navigation={navigation} />
                    )}
                </View>

                {/* Modal para selecionar a categoria do imóvel */}
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#FFF" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle} allowFontScaling={false}>Escolha a categoria do imóvel</Text>
                            <View style={styles.categoryContainer}>
                                <TouchableOpacity style={styles.categoryButton} onPress={() => handleCategorySelect('Residencial', usuario_id)}>
                                    <Image
                                        source={require('../assets/img/residencial.png')}
                                        style={styles.categoryIcon}
                                    />
                                    <Text style={styles.categoryText} allowFontScaling={false}>Residencial</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.categoryButton} onPress={() => handleCategorySelect('Comercial', usuario_id)}>
                                    <Image
                                        source={require('../assets/img/comercial.png')}
                                        style={styles.categoryIcon}
                                    />
                                    <Text style={styles.categoryText} allowFontScaling={false}>Comercial</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.categoryButton} onPress={() => handleCategorySelect('Outro', usuario_id)}>
                                    <Image
                                        source={require('../assets/img/outro.png')}
                                        style={styles.categoryIcon}
                                    />
                                    <Text style={styles.categoryText} allowFontScaling={false}>Outro</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Modal de Classificação do Imóvel */}
                <ImovelClassificacao
                    modalVisible={classificationModalVisible}
                    setModalVisible={setClassificationModalVisible}
                    categoria={categoria}
                    usuario_id={usuario_id}
                    status_user={status_user}
                    setSelectedTipo={setTipoImovel}
                    navigation={navigation}
                />

                {/* Footer fixo */}
                <View style={styles.footerContainer}>
                    <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Home', { usuario_id })}>
                        <Image
                            source={require('../assets/icons/home.png')}
                            style={styles.IconFooter}
                        />
                        <Text style={styles.footerItemTextActive} allowFontScaling={false}>Meus imóveis</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerItem} onPress={() => setModalVisible(true)}>
                        <Image
                            source={require('../assets/icons/publicar.png')}
                            style={styles.IconFooter}
                        />
                        <Text style={styles.footerItemText} allowFontScaling={false}>Publicar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('AvaliadorScreen')}>
                        <Image
                            source={require('../assets/icons/avaliador.png')}
                            style={styles.IconFooter}
                        />
                        <Text style={styles.footerItemText} allowFontScaling={false}>Precificador</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('ProfileScreen')}>
                        <Image
                            source={require('../assets/icons/perfil.png')}
                            style={styles.IconFooter}
                        />
                        <Text style={styles.footerItemText} allowFontScaling={false}>Perfil</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

// Estilização
const styles = StyleSheet.create({

    IconFooter: {
        width: 24,
        height: 24
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        width: '100%',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
        backgroundColor: '#F5F5F5',
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: width * 0.55,
        height: height * 0.05,
    },
    headerLine: {
        height: 1,
        backgroundColor: '#E9E9E9',
        width: '100%',
    },
    welcomeContainer: {
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    welcomeText: {
        fontFamily: 'Nunito_700Bold',
        fontSize: Platform.select({
            ios: width * 0.05,
            android: width * 0.05,
        }),
        color: '#1F2024',
        marginBottom: height * 0.005,
        textAlign: 'center',
    },
    subText: {
        fontFamily: 'Nunito_400Regular',
        fontSize: Platform.select({
            ios: width * 0.04,
            android: width * 0.04,
        }),
        color: '#7A7A7A',
        textAlign: 'center',
    },
    bodyContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 0, // Remove padding lateral
        marginTop: height * 0.03,
    },
    noPropertiesContainer: {
        width: '100%',
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#FF7A00',
        borderRadius: 30,
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    addButtonText: {
        fontFamily: 'Nunito_700Bold',
        color: '#FFF',
        fontSize: Platform.select({
            ios: width * 0.045,
            android: width * 0.045,
        }),
        textAlign: 'center',
    },
    propertiesContainer: {
        flex: 1, // Garantir que ocupe toda a altura
        width: '100%', // Garantir que ocupe toda a largura
        paddingHorizontal: 0, // Remover padding que pode centralizar os itens
    },
    propertyItem: {
        backgroundColor: '#FFF',
        padding: height * 0.02,
        marginVertical: height * 0.01,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    propertyText: {
        fontFamily: 'Nunito_700Bold',
        fontSize: Platform.select({
            ios: width * 0.045,
            android: width * 0.045,
        }),
        color: '#1F2024',
    },
    propertyButton: {
        marginTop: height * 0.01,
        paddingVertical: height * 0.01,
        backgroundColor: '#FF7A00',
        borderRadius: 10,
        alignItems: 'center',
    },
    propertyButtonText: {
        fontFamily: 'Nunito_700Bold',
        color: '#FFF',
        fontSize: Platform.select({
            ios: width * 0.04,
            android: width * 0.04,
        }),
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: width,
        paddingVertical: height * 0.03,
        paddingHorizontal: width * 0.05,
        backgroundColor: '#FF7A00',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: height * 0.02,
        left: width * 0.05,
    },
    modalTitle: {
        fontSize: width * 0.05,
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: height * 0.03,
        textAlign: 'center',
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    categoryButton: {
        width: width * 0.22,
        height: width * 0.22,
        backgroundColor: '#FFF',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: width * 0.02,
        marginBottom: width * 0.05
    },
    categoryIcon: {
        width: '60%',
        height: '60%',
        resizeMode: 'contain',
    },
    categoryText: {
        marginTop: height * 0.01,
        fontSize: width * 0.03,
        color: '#FB7D10',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    footerLine: {
        height: 1,
        backgroundColor: '#E9E9E9',
        width: '100%',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: height * 0.015,
        backgroundColor: '#F5F5F5',
    },
    footerItem: {
        alignItems: 'center',
    },
    footerItemText: {
        fontSize: Platform.select({
            ios: width * 0.03,
            android: width * 0.03,
        }),
        fontFamily: 'Nunito_400Regular',
        color: '#7A7A7A',
        marginTop: 4,
    },
    footerItemTextActive: {
        fontSize: Platform.select({
            ios: width * 0.03,
            android: width * 0.03,
        }),
        fontFamily: 'Nunito_700Bold',
        color: '#FF7A00',
        marginTop: 4,
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


export default Home;
