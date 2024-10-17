import React, { useState, useRef } from 'react';
import {
    Alert,
    Image,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StatusBar,
    Dimensions,
    SafeAreaView,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import axios from 'axios';
import Checkbox from 'expo-checkbox';
import MaskInput, { Masks } from 'react-native-mask-input'; // Para aplicar máscara no CPF
import Svg, { Path } from 'react-native-svg';
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

const DadosProprietarioScreen = ({ route, navigation }) => {
    const { id, classificacao = '', tipo = '', usuario_id, status } = route.params || {};

    // Referências para os inputs
    const nomeCompletoRef = useRef(null);
    const cpfRef = useRef(null);
    const estadoCivilRef = useRef(null);
    const tipoDocumentoRef = useRef(null);

    // Estado dos campos
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [cpf, setCpf] = useState('');
    const [estadoCivil, setEstadoCivil] = useState('');
    const [tipoDocumento, setTipoDocumento] = useState('');

    // Meu imovel 
    const [meuImovel, setmeuImovel] = useState(false);

    const togglemeuImovel = () => {
        setmeuImovel(!meuImovel);
        if (!meuImovel) {
            setmeuImovel(true); // Define o valor como 0 quando marcado
        } else {
            setmeuImovel(false); // Limpa o valor se desmarcado
        }
    };

    // Controle de exibição das listas de opções
    const [showEstadoCivilOptions, setShowEstadoCivilOptions] = useState(false);
    const [showTipoDocumentoOptions, setShowTipoDocumentoOptions] = useState(false);

    const estadoCivilOptions = ['Solteiro', 'Casado', 'Viúvo', 'Divorciado', 'Separado'];
    const tipoDocumentoOptions = ['CNH', 'RG', 'Outros'];

    // Função para selecionar uma opção e fechar a lista
    const selectEstadoCivil = (option) => {
        setEstadoCivil(option);
        setShowEstadoCivilOptions(false);
    };

    const selectTipoDocumento = (option) => {
        setTipoDocumento(option);
        setShowTipoDocumentoOptions(false);
    };

    // Validação para habilitar o botão "Salvar"
    const isFormValid = () => nomeCompleto && cpf && estadoCivil && tipoDocumento;

    const handleSaveImovel = async () => {
        if (!isFormValid()) {
            Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
            return;
        }

        try {
            // Requisição PUT para a API
            const response = await axios.put(`https://imogo.juk.re/api/v1/imoveis/${id}/proprietario`, {
                nome_completo_prop: nomeCompleto,
                cpf_prop: cpf,
                estado_civil_prop: estadoCivil,
                tipo_documento: tipoDocumento,
                usuario_proprietario: meuImovel,
                status: 4 // Status do cadastro de proprietário
            });

            if (response.status === 200) {
                navigation.navigate('CadastroImovel', {
                    id,
                    usuario_id,
                    status: response.status,
                    classificacao,
                    tipo
                });
            } else {
                Alert.alert('Erro', 'Não foi possível salvar os dados.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Houve um problema ao salvar os dados. Tente novamente mais tarde.');
        }
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
                Dados do proprietário
            </Text>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.container}>
                            {/* Checkbox "Eu sou o proprietário deste imóvel" */}
                            <TouchableOpacity style={styles.checkboxRow} onPress={togglemeuImovel}>
                                <Checkbox
                                    value={meuImovel}
                                    onValueChange={togglemeuImovel}
                                    color={meuImovel ? '#FB7D10' : undefined}
                                />
                                <Text style={styles.checkboxLabel} allowFontScaling={false} >Eu sou o proprietário deste imóvel</Text>
                            </TouchableOpacity>

                            {/* Nome Completo */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Nome Completo</Text>
                                <TouchableWithoutFeedback onPress={() => nomeCompletoRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={nomeCompletoRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            placeholder="Nome Completo"
                                            value={nomeCompleto}
                                            onChangeText={setNomeCompleto}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            {/* CPF com máscara */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>CPF</Text>
                                <TouchableWithoutFeedback onPress={() => cpfRef.current.focus()}>
                                    <View style={styles.inputContainer}>
                                        <MaskInput
                                            ref={cpfRef}
                                            allowFontScaling={false}
                                            style={styles.areaInput}
                                            value={cpf}
                                            onChangeText={setCpf}
                                            mask={Masks.BRL_CPF}
                                            keyboardType="numeric"
                                            placeholder="000.000.000-00"
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            {/* Estado Civil */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Estado Civil</Text>
                                <TouchableWithoutFeedback onPress={() => setShowEstadoCivilOptions(!showEstadoCivilOptions)}>
                                    <View style={styles.inputContainer}>
                                        <Text allowFontScaling={false} style={styles.areaInput}>
                                            {estadoCivil ? estadoCivil : 'Selecionar'}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                {showEstadoCivilOptions && (
                                    <View style={styles.optionsContainer}>
                                        {estadoCivilOptions.map((option) => (
                                            <TouchableOpacity
                                                key={option}
                                                style={styles.optionItem}
                                                onPress={() => selectEstadoCivil(option)}
                                            >
                                                <Text style={styles.optionText}>{option}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Tipo de Documento */}
                            <View style={styles.row}>
                                <Text style={styles.subLabel} allowFontScaling={false}>Tipo de Documento</Text>
                                <TouchableWithoutFeedback onPress={() => setShowTipoDocumentoOptions(!showTipoDocumentoOptions)}>
                                    <View style={styles.inputContainer}>
                                        <Text allowFontScaling={false} style={styles.areaInput}>
                                            {tipoDocumento ? tipoDocumento : 'Selecionar'}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                {showTipoDocumentoOptions && (
                                    <View style={styles.optionsContainer}>
                                        {tipoDocumentoOptions.map((option) => (
                                            <TouchableOpacity
                                                key={option}
                                                style={styles.optionItem}
                                                onPress={() => selectTipoDocumento(option)}
                                            >
                                                <Text style={styles.optionText}>{option}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Botão Salvar */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.saveButton, !isFormValid() && { backgroundColor: '#ccc' }]}
                                    onPress={handleSaveImovel}
                                    disabled={!isFormValid()}
                                >
                                    <Text style={styles.saveButtonText} allowFontScaling={false}>Salvar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.laterButton}>
                                    <Image
                                        source={require('../../assets/icons/bookmark.png')} // Ícone de terminar mais tarde
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
        </SafeAreaView>
    );
};

const styles = {

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
        textAlign: 'left',
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
        fontSize: Platform.select({ ios: width * 0.04, android: width * 0.03 }), // Ajuste no tamanho da fonte
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
        fontSize: Platform.select({ ios: width * 0.04, android: width * 0.03 }), // Ajuste no tamanho da fonte
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
};

export default DadosProprietarioScreen;