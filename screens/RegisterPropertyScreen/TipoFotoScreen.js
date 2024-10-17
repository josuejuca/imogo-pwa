import React, { useState } from 'react';
import {
    Alert,
    Image,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    Platform,
    SafeAreaView,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import axios from 'axios';
import Svg, { Path } from 'react-native-svg';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system'; // Importar o FileSystem para conversão base64
import { Dimensions } from 'react-native'; 

const { width } = Dimensions.get('window');

// Ícone de seta para voltar
const BackArrowIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
            d="M18.5489 0.939645C19.151 1.52543 19.151 2.47518 18.5489 3.06097L9.36108 12.0003L18.5489 20.9396C19.151 21.5254 19.151 22.4752 18.5489 23.061C17.9469 23.6468 16.9707 23.6468 16.3686 23.061L5.00049 12.0003L16.3686 0.939645C16.9707 0.353859 17.9469 0.353859 18.5489 0.939645Z"
            fill="#FB7D10"
        />
    </Svg>
);

const TipoFotoScreen = ({ route, navigation }) => {
    const { id, classificacao = '', tipo = '', usuario_id, tipo_documento } = route.params || {};

    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    // Função para abrir o armazenamento e selecionar um documento (PDF ou outro tipo de arquivo)
    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (result.type === 'cancel') {
                Alert.alert('Ação cancelada', 'Nenhum documento foi selecionado.');
                return;
            }

            if (result.uri) {
                const documentUri = result.uri;
                const documentName = result.name || documentUri.split('/').pop();

                // Ler o arquivo em base64
                const base64Data = await FileSystem.readAsStringAsync(documentUri, {
                    encoding: FileSystem.EncodingType.Base64
                });

                // Converter base64 para binário
                const binaryData = base64ToBinary(base64Data);

                setLoading(true);
                await sendDocumentToAPI(binaryData, documentName); 
            } else {
                Alert.alert('Erro', 'Não foi possível selecionar o documento. Tente novamente.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao tentar selecionar o documento.');
            console.error('Erro no DocumentPicker: ', error);
        }
    };

    // Função para converter base64 para binário
    const base64ToBinary = (base64) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };

    // Função para enviar o documento para a API
    const sendDocumentToAPI = async (binaryData, documentName) => {
        try {
            const payload = {
                cnh_file: binaryData,
                qr_cnh_file: "", // Preencher conforme o seu caso
            };

            const response = await axios.post(`http://192.168.120.185:8000/api/v1/imoveis/${id}/upload_pdf_cnh/`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
            });

            if (response.status === 200) {
                const { id, usuario_id, classificacao, tipo } = response.data;
                navigation.navigate('CadastroImovel', { status: 5, id, classificacao, tipo, usuario_id });
            } else {
                throw new Error(`Erro: Código de status ${response.status}`);
            }
        } catch (error) {
            console.error('Erro ao enviar o documento:', error.response ? error.response.data : error.message);
            Alert.alert('Erro', 'Falha ao enviar o documento. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = (galeriaAtualizada) => {
        navigation.navigate('FotoQRScreen', { tipo_documento, id, classificacao, tipo, usuario_id, galeria: galeriaAtualizada });
        closeModal();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle} allowFontScaling={false}>
                    {classificacao} - {tipo}
                </Text>
            </View>
            <Text style={styles.classificacaoText} allowFontScaling={false}>
                Cadastre um documento
            </Text>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.container}>
                            <View style={styles.row}>
                                <Text style={styles.checkboxLabel} allowFontScaling={false}>Selecione uma das opções abaixo</Text>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.optionButtonsContainer}>
                                    <TouchableOpacity style={styles.optionButton} onPress={openModal}>
                                        <Image
                                            source={require('../../assets/icons/upload_file.png')}
                                            style={styles.optionIcon}
                                        />
                                        <View style={styles.optionTextContainer}>
                                            <Text style={styles.optionTextTitle} allowFontScaling={false}>Carregar um arquivo</Text>
                                            <Text style={styles.optionTextSubtitle} allowFontScaling={false}>Use uma imagem da galeria</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.optionButton} onPress={() => { handleNext(false); }}>
                                        <Image
                                            source={require('../../assets/icons/foto_camera.png')}
                                            style={styles.optionIcon}
                                        />
                                        <View style={styles.optionTextContainer}>
                                            <Text style={styles.optionTextTitle} allowFontScaling={false}>Tirar uma foto</Text>
                                            <Text style={styles.optionTextSubtitle} allowFontScaling={false}>Use a câmera do celular ou tablet</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={closeModal}
                            >
                                <TouchableWithoutFeedback onPress={closeModal}>
                                    <View style={styles.modalContainer}>
                                        <TouchableWithoutFeedback>
                                            <View style={styles.modalContent}>
                                                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                                    <Text style={styles.closeButtonText} allowFontScaling={false}>X</Text>
                                                </TouchableOpacity>
                                                <Text style={styles.modalTitle} allowFontScaling={false}>Escolha um formato</Text>

                                                <TouchableOpacity style={styles.modalOptionButton} onPress={() => { handleNext(true); }}>
                                                    <Image
                                                        source={require('../../assets/icons/imagem_galeria.png')}
                                                        style={styles.modalIcon}
                                                    />
                                                    <View style={styles.modalOptionTextContainer}>
                                                        <Text style={styles.modalOptionText} allowFontScaling={false}>Imagem</Text>
                                                        <Text style={styles.modalOptionSubtitle} allowFontScaling={false}>
                                                            Use uma imagem do documento da galeria
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={styles.modalOptionButton} onPress={pickDocument}>
                                                    <Image
                                                        source={require('../../assets/icons/arquivo.png')}
                                                        style={styles.modalIcon}
                                                    />
                                                    <View style={styles.modalOptionTextContainer}>
                                                        <Text style={styles.modalOptionText} allowFontScaling={false}>Digital</Text>
                                                        <Text style={styles.modalOptionSubtitle} allowFontScaling={false}>
                                                            Use um arquivo digital da CNH
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </TouchableWithoutFeedback>
                            </Modal>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.laterButton}>
                                    <Image
                                        source={require('../../assets/icons/bookmark.png')}
                                        style={styles.laterIcon}
                                    />
                                    <Text
                                        style={styles.laterButtonText}
                                        allowFontScaling={false}
                                        onPress={() => navigation.navigate('Home', { usuario_id })}
                                    >
                                        Terminar mais tarde
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            <Modal transparent={true} animationType="fade" visible={loading}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF7A00" />
                    <Text style={styles.loadingText}>Enviando documento...</Text>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = {

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo translúcido
    },
    loadingText: {
        color: '#FFF',
        marginTop: 10,
        fontSize: 16,
    },

    // voltar 
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: width * 0.055
    },
    headerTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#1F2024',
        textAlign: 'center'
    },
    classificacaoText: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#1F2024',
        marginBottom: 10,
        textAlign: 'center',
        paddingLeft: 20,
    },
    stepsContainer: {
        flex: 1,
        paddingHorizontal: width * 0.05,
    },
    backButton: {
        position: 'absolute',
        left: 20,
    },
    //
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40, // Maior espaçamento para a barra de status
    },
    scrollContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    container: {
        width: '90%',
    },
    row: {
        marginBottom: 20,
        width: '100%',
    },
    subLabel: {
        fontSize: Platform.select({ ios: width * 0.037, android: width * 0.035 }),
        fontWeight: '600',
        color: '#1F2024',
        marginBottom: 10,
    },
    titleLabel: {
        fontSize: Platform.select({ ios: width * 0.057, android: width * 0.055 }),
        fontWeight: '600',
        color: '#1F2024',
        marginBottom: 10,
    },
    orientacaoText: {
        fontSize: Platform.select({ ios: width * 0.033, android: width * 0.035 }),
    },
    optionGroup: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionGroupSuite: {
        marginLeft: Platform.select({ ios: width * -0.01, android: width * 0.01 }),
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'start',
    },
    optionButton: {
        borderWidth: 1,
        borderColor: '#E9E9E9',
        borderRadius: 25,
        marginHorizontal: 6,
        backgroundColor: '#E9E9E9',
        width: Platform.select({ ios: width * 0.11, android: width * 0.11 }),
        height: Platform.select({ ios: width * 0.11, android: width * 0.11 }),
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: '#FF7A00',
        borderColor: '#FF7A00',
    },
    optionText: {
        fontSize: width * 0.029,
        color: '#494A50',
    },
    selectedOptionText: {
        color: '#FFF',
    },
    suitesGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: Platform.select({ ios: -10, android: 10 }),
        marginTop: 10,
    },
    suitesNumberContainer: {
        width: 34,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    suitesText: {
        fontSize: width * 0.04,
        color: '#1F2024',
        textAlign: 'center',
    },
    incrementDecrementButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        width: 44,
        height: 44,
    },
    incrementDecrementButtonText: {
        fontSize: 20,
        color: '#494A50',
    },
    orientationGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    orientationButton: {
        borderRadius: 25,
        backgroundColor: '#E9E9E9',
        padding: 10,
        alignItems: 'center',
        width: '30%',
    },
    selectedOptionOrientation: {
        backgroundColor: '#FF7A00',
    },
    areaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10
    },
    areaColumn: {
        width: '48%',
    },
    areaInput: {
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#FFF',
    },

    // modal 

    detalhesWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
        marginTop: 10,
        maxWidth: '100%',  // Definir tamanho máximo para o container
        justifyContent: 'flex-start',
    },
    detalheItem: {
        backgroundColor: '#E9E9E9',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 8,
    },
    detalheText: {
        color: '#000',
        fontSize: 14,
        maxWidth: Platform.select({ ios: 100, android: 90 }), // Controla a largura máxima do texto
    },
    detalheAddButton: {
        backgroundColor: '#E9E9E9',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginLeft: 8,
    },
    detalheAddText: {
        fontSize: 20,
        color: '#000',
    },
    detalheExtra: {
        backgroundColor: '#FF7A00',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginLeft: 8,
    },
    detalheExtraText: {
        color: '#FFF',
    },

    // descrição 

    descriptionBox: {
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#F5F5F5',
        minHeight: 50,
        justifyContent: 'center',
    },
    descriptionText: {
        fontSize: 14,
        color: '#494A50',
    },
    placeholderText: {
        color: '#D3D3D3',  // Estilo de placeholder
    },
    descriptionFilled: {
        color: '#1F2024',  // Cor do texto quando preenchido
    },
    helperText: {
        fontSize: 12,
        color: '#7A7A7A',
        marginTop: 5,
    },

    // pagamento 
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 15,
        width: '100%',
    },



    // salvar 

    areaInput: {
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#F5F5F5',
    },
    inputContainer: {
        width: '100%',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    checkboxLabel: {
        textAlign: "center",
        fontSize: 14,
        color: '#7A7A7A',
        marginLeft: 10,
    },
    buttonContainer: {
        marginTop: 40, // Ajuste do espaçamento superior
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#FF7A00',
        paddingVertical: 15,
        paddingHorizontal: width * 0.2, // Mais largura
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: Platform.select({ ios: width * 0.04, android: width * 0.04 }), // Ajuste no tamanho da fonte
        fontWeight: '600',
    },
    laterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    laterIcon: {
        width: 15,
        height: 20,
        marginRight: 8,
    },
    laterButtonText: {
        color: '#FF7A00',
        fontSize: Platform.select({ ios: width * 0.04, android: width * 0.04 }), // Ajuste no tamanho da fonte
        fontWeight: '600',
    },
    // input que abre 

    optionsContainer: {
        backgroundColor: '#F5F5F5',
        borderColor: '#D3D3D3',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 5,
    },
    optionItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    optionText: {
        fontSize: 16,
        color: '#1F2024',
    },

    // inputs de upload 

    optionButtonsContainer: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#F5F5F5',
        borderColor: '#D3D3D3',
        borderWidth: 1,
        borderRadius: 10,
        width: '100%',
        padding: 15,
        marginBottom: 10,
    },
    optionIcon: {
        width: 24,
        height: 24,
        marginRight: 15,
        tintColor: '#FF7A00', // Deixa a cor dos ícones laranja
    },
    optionTextContainer: {
        flexDirection: 'column',
    },
    optionTextTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2024',
    },
    optionTextSubtitle: {
        fontSize: 14,
        color: '#7A7A7A',
    },
    // Estilos para o modal

    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end', // Modal no rodapé
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo translúcido
    },
    modalContent: {
        backgroundColor: '#FF7A00', // Cor laranja do fundo
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center', // Centralizar conteúdo
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        left: 20, // Botão de fechar alinhado ao início
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 18,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 20,
        textAlign: 'center', // Texto centralizado
    },


    // 

    modalOptionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start', // Alinha o ícone e o texto à esquerda
        backgroundColor: '#FF7A00',
        borderColor: '#FFF',
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        width: '100%',
    },
    modalIcon: {
        width: 24,
        height: 24,
        marginRight: 10, // Reduzi a margem entre o ícone e o texto
        tintColor: '#FFF',
    },
    modalOptionTextContainer: {
        flexDirection: 'column',
    },
    modalOptionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    modalOptionSubtitle: {
        fontSize: 14,
        color: '#FFF',
    },
};

export default TipoFotoScreen;