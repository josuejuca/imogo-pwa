import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, Platform, StatusBar, Dimensions } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

const { width, height } = Dimensions.get('window');

const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    const surnameInputRef = useRef(null);
    const phoneInputRef = useRef(null);

    useEffect(() => {
        const isFilled = name && surname && phone.replace(/\D/g, '').length === 11;
        setIsButtonEnabled(isFilled);
    }, [name, surname, phone]);

    const handlePhoneChange = (text) => {
        const numericPhone = text.replace(/\D/g, '');
        if (numericPhone.length <= 11) {
            setPhone(text);
        }
    };

    const handleSubmitEditing = (inputRef) => {
        if (inputRef && inputRef.current) {
            if (inputRef.current.getElement) {
                inputRef.current.getElement().focus();
            } else {
                inputRef.current.focus();
            }
        } else if (Platform.OS === 'ios') {
            Keyboard.dismiss();
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.progressBarContainer}>
                <View style={styles.progressSegmentHalfFilled}>
                    <View style={styles.progressSegmentHalfFilledInner}></View>
                </View>
                <View style={styles.progressSegment}></View>
                <View style={styles.progressSegment}></View>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.title} allowFontScaling={false}>Seus dados</Text>
                <Text style={styles.label} allowFontScaling={false}>Primeiro Nome</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                    returnKeyType="next"
                    onSubmitEditing={() => handleSubmitEditing(surnameInputRef)}
                    allowFontScaling={false}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label} allowFontScaling={false}>Sobrenome</Text>
                <TextInput
                    ref={surnameInputRef}
                    style={styles.input}
                    placeholder="Sobrenome"
                    value={surname}
                    onChangeText={setSurname}
                    returnKeyType="next"
                    onSubmitEditing={() => handleSubmitEditing(phoneInputRef)}
                    allowFontScaling={false}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label} allowFontScaling={false}>Telefone</Text>
                <TextInputMask
                    ref={phoneInputRef}
                    type={'cel-phone'}
                    options={{
                        maskType: 'BRL',
                        withDDD: true,
                        dddMask: '(99) 9 9999-9999',
                    }}
                    style={styles.input}
                    placeholder="(00) 0 0000-0000"
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    returnKeyType="done"
                    maxLength={16}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    allowFontScaling={false}
                />
            </View>

            <TouchableOpacity
                style={[
                    styles.buttonPrimary,
                    {
                        backgroundColor: isButtonEnabled ? '#FB7D10' : '#E9E9E9',
                        borderWidth: isButtonEnabled ? 0 : 1,
                        borderColor: isButtonEnabled ? 'transparent' : '#E9E9E9',
                        opacity: isButtonEnabled ? 1 : 0.5,
                        shadowColor: isButtonEnabled ? 'transparent' : 'transparent',
                        shadowOffset: {
                            width: 0,
                            height: isButtonEnabled ? 4 : 0,
                        },
                        shadowOpacity: isButtonEnabled ? 0.25 : 0,
                        shadowRadius: isButtonEnabled ? 4.65 : 0,
                        elevation: isButtonEnabled ? 8 : 0,
                    }
                ]}
                onPress={() => isButtonEnabled && navigation.navigate('SignupEmailScreen', { name, surname, phone })}
                disabled={!isButtonEnabled}
            >
                <Text
                    style={[
                        styles.buttonText,
                        {
                            color: isButtonEnabled ? '#F5F5F5' : '#C4C4C4',
                        }
                    ]}
                    allowFontScaling={false}
                >
                    Próximo
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
        paddingHorizontal: width * 0.05, // Reduzi o padding horizontal
        paddingTop: Platform.select({
            ios: height * 0.07, // Aproximadamente 7% da altura da tela no iOS
            android: height * 0.05, // Aproximadamente 5% da altura da tela no Android
        }),
    },
    progressBarContainer: {
        marginTop: Platform.select({
            ios: height * 0.02, // Espaço menor no iOS
            android: height * 0.015, // Espaço menor no Android
        }),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: height * 0.04, // Ajuste de margem inferior
    },
    progressSegment: {
        height: height * 0.008, // Ajuste da altura para a barra de progresso
        width: '33%',
        backgroundColor: '#DCDCDC',
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
        backgroundColor: '#DCDCDC',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressSegmentHalfFilledInner: {
        height: '100%',
        width: '50%',
        backgroundColor: '#FB7D10',
    },
    inputContainer: {
        marginBottom: height * 0.02, // Reduzi a margem inferior dos inputs
    },
    label: {
        fontSize: Platform.select({
            ios: width * 0.032, // Ajuste para iOS
            android: width * 0.034, // Ajuste para Android
        }),
        color: '#2F3036',
        marginBottom: height * 0.005, // Reduzi o espaço abaixo do rótulo
    },
    input: {
        width: '100%',
        height: height * 0.06, // Reduzi a altura dos inputs
        borderColor: '#C4C4C4',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: width * 0.03,
        fontSize: Platform.select({
            ios: width * 0.04, // Ajuste para iOS
            android: width * 0.045, // Ajuste para Android
        }),
        backgroundColor: '#F4F4F4',
    },
    buttonPrimary: {
        backgroundColor: '#FF7D10',
        paddingVertical: height * 0.015, // Reduzi o padding vertical do botão
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        marginTop: height * 0.04, // Ajustei a margem superior do botão
    },
    buttonText: {
        color: '#F5F5F5',
        fontSize: Platform.select({
            ios: width * 0.04, // Ajuste para iOS
            android: width * 0.045, // Ajuste para Android
        }),
        fontWeight: 'bold',
    },
    title: {
        fontSize: Platform.select({
            ios: width * 0.055, // Fonte maior para iOS
            android: width * 0.05, // Fonte ligeiramente menor para Android
        }),
        fontWeight: 'bold',
        color: '#1F2024',
        marginBottom: height * 0.015, // Ajuste da margem inferior do título
    },
});
