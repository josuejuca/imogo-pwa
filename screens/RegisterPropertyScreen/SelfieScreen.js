import React, { useState } from 'react';
import {
    Alert,
    Image,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    StatusBar,
    Dimensions,
    SafeAreaView,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker'; // Importar o ImagePicker
import * as DocumentPicker from 'expo-document-picker'; // Importar o DocumentPicker
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

const SelfieScreen = ({ route, navigation }) => {
    const { id, classificacao = '', tipo = '', tipo_documento, usuario_id, galeria = false, imageUriQR } = route.params || {};

    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal
    const [selectedImage, setSelectedImage] = useState(null); // Estado para armazenar o arquivo selecionado
    const [selectedDocument, setSelectedDocument] = useState(null); // Estado para armazenar o documento selecionado
    const [loading, setLoading] = useState(false); // Estado para controlar o carregamento

    // Função para abrir o modal
    const openModal = () => {
        setModalVisible(true);
    };

    // Função para fechar o modal
    const closeModal = () => {
        setModalVisible(false);
    };


    // Função para abrir a câmera e permitir a captura da foto
    const openCamera = async () => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permissão negada", "É necessária a permissão para acessar a câmera.");
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Apenas imagens
            allowsEditing: true, // Permitir edição
            aspect: [4, 3], // Definir a proporção
            quality: 1, // Qualidade máxima da imagem
        });

        // Verificar se o usuário cancelou a seleção e se há uma imagem selecionada
        if (!result.canceled && result.assets.length > 0) {
            const imageUriSelfie = result.assets[0].uri;
            setSelectedImage(imageUriSelfie); // Armazenar o URI da imagem
            closeModal(); // Fechar o modal
            console.log({ imageUriSelfie, id, classificacao, tipo, usuario_id});

            // Ativar tela de carregamento e enviar a imagem capturada para a API
            setLoading(true); // Ativar o carregamento
            await sendImageToAPI(imageUriSelfie); // Enviar a imagem
        }
    };

    // Função para enviar a imagem para a API
    const sendImageToAPI = async (imageUriSelfie) => {
        try {
            const formData = new FormData();

            const cnhMimeType = getMimeType(imageUriSelfie);
            

            // Adicionar o arquivo CNH ao FormData
            formData.append('foto_pessoal_file', {
                uri: imageUriSelfie,
                type: cnhMimeType,
                name: `foto_pessoal_file.${cnhMimeType.split('/')[1]}`,
            });

            const response = await axios.post(`https://imogo.juk.re/api/v1/imoveis/${id}/upload_foto_pessoal/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'accept': 'application/json',
                },
            });

            if (response.status === 200) {
                const { id, usuario_id, classificacao, tipo } = response.data;
                // Alert.alert("Sucesso", "Imagem enviada com sucesso!");
                navigation.navigate('CadastroImovelSuccessScreen', {usuario_id });
                console.log('Resposta da API:', response.data);
            } else {
                throw new Error(`Erro: Código de status ${response.status}`);
            }
        } catch (error) {
            console.error('Erro ao enviar a imagem:', error.response ? error.response.data : error.message);
            Alert.alert("Erro", "Falha ao enviar a imagem. Tente novamente.");
        } finally {
            setLoading(false); // Desativar o carregamento após o término
        }
    };

    const getMimeType = (uri) => {
        const extension = uri.split('.').pop();
        if (extension === 'jpg' || extension === 'jpeg') {
            return 'image/jpeg';
        } else if (extension === 'png') {
            return 'image/png';
        }
        return 'application/octet-stream';
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
                Siga as orientações
            </Text>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.container}>
                            <View style={styles.row}>
                                <Text style={styles.checkboxLabel} allowFontScaling={false}>
                                    Isso pode facilitar a sua aprovação
                                </Text>
                            </View>
                            <Image
                                source={require('../../assets/img/stape5.png')}
                                style={styles.image}
                                resizeMode="contain"
                            />
                            {/* Botões de ação */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.saveButton} onPress={openCamera}>
                                    <Text style={styles.saveButtonText} allowFontScaling={false}>Entendi</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            {/* Modal de carregamento */}
            <Modal transparent={true} animationType="fade" visible={loading}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF7A00" />
                    <Text style={styles.loadingText}>Enviando imagem...</Text>
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
};

export default SelfieScreen;