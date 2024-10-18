import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Linking, Keyboard, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SignupEmailScreen = ({ route, navigation }) => {
    const { name, surname, phone } = route.params;
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const confirmPasswordInputRef = useRef(null);

    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        setPasswordMatchError(text && text !== password);
    };

    const handleEmailChange = (text) => {
        setEmail(text);
        if (!validateEmail(text)) {
            setEmailError('Por favor, insira um e-mail válido.');
        } else {
            setEmailError('');
        }
    };

    const handleSubmitEditing = (inputRef) => {
        if (inputRef && inputRef.current) {
            inputRef.current.focus();
        } else {
            Keyboard.dismiss();
        }
    };

    const isButtonEnabled = email && !emailError && password && confirmPassword === password && isChecked;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Barra de Progresso */}
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressSegmentFilled}></View>
                    <View style={styles.progressSegmentHalfFilled}>
                        <View style={styles.progressSegmentHalfFilledInner}></View>
                    </View>
                    <View style={styles.progressSegment}></View>
                </View>

                {/* Inputs de E-mail, Senha e Confirmar Senha */}
                <View style={styles.inputContainer}>
                    <Text style={styles.title} allowFontScaling={false}>Criar cadastro</Text>
                    <Text style={styles.label} allowFontScaling={false}>Email</Text>
                    <TextInput
                        ref={emailInputRef}
                        style={[styles.input, emailError && styles.inputError]}
                        placeholder="exemplo@email.com"
                        keyboardType="email-address"
                        placeholderTextColor="#A9A9A9"
                        value={email}
                        onChangeText={handleEmailChange}
                        returnKeyType="next"
                        onSubmitEditing={() => handleSubmitEditing(passwordInputRef)}
                        allowFontScaling={false}
                    />
                    {emailError ? <Text style={styles.errorText} allowFontScaling={false}>{emailError}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label} allowFontScaling={false}>Senha</Text>
                    <View style={styles.inputContainerWithIcon}>
                        <TextInput
                            ref={passwordInputRef}
                            style={styles.input}
                            placeholder="Criar Senha"
                            placeholderTextColor="#A9A9A9"
                            secureTextEntry={!passwordVisible}
                            value={password}
                            onChangeText={setPassword}
                            returnKeyType="next"
                            onSubmitEditing={() => handleSubmitEditing(confirmPasswordInputRef)}
                            allowFontScaling={false}
                        />
                        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.iconContainer}>
                            <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.inputContainerWithIcon}>
                        <TextInput
                            ref={confirmPasswordInputRef}
                            style={styles.input}
                            placeholder="Confirmar Senha"
                            secureTextEntry={!passwordVisible}
                            value={confirmPassword}
                            onChangeText={handleConfirmPasswordChange}
                            placeholderTextColor="#A9A9A9"
                            returnKeyType="done"
                            onSubmitEditing={() => Keyboard.dismiss()}
                            allowFontScaling={false}
                        />
                        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.iconContainer}>
                            <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
                        </TouchableOpacity>
                    </View>
                    {passwordMatchError && <Text style={styles.errorText} allowFontScaling={false}>As senhas não coincidem</Text>}
                </View>

                {/* Caixa de seleção para Termos e Condições */}
                <View style={styles.checkboxContainer}>
                    <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
                        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                            {isChecked && <Ionicons name="checkmark" size={18} color="#FFF" />}
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.checkboxLabel} allowFontScaling={false}>
                        Eu li e estou de acordo com os{' '}
                        <Text
                            style={styles.linkText}
                            onPress={() => Linking.openURL('https://www.exemplo.com/termos')}
                        >
                            Termos e Condições
                        </Text>{' '}
                        e a{' '}
                        <Text
                            style={styles.linkText}
                            onPress={() => Linking.openURL('https://www.exemplo.com/politica')}
                        >
                            Política de Privacidade
                        </Text>
                    </Text>
                </View>

                {/* Botão de Confirmação */}
                <TouchableOpacity
                    style={[
                        styles.buttonPrimary,
                        {
                            backgroundColor: isButtonEnabled ? '#FB7D10' : '#E9E9E9',
                            borderWidth: isButtonEnabled ? 0 : 1,
                            borderColor: isButtonEnabled ? 'transparent' : '#E9E9E9',
                            opacity: isButtonEnabled ? 1 : 0.5,
                            shadowColor: isButtonEnabled ? 'transparent' : 'transparent',
                            shadowOffset: { width: 0, height: isButtonEnabled ? 4 : 0 },
                            shadowOpacity: isButtonEnabled ? 0.25 : 0,
                            shadowRadius: isButtonEnabled ? 4.65 : 0,
                            elevation: isButtonEnabled ? 8 : 0,
                        },
                    ]}
                    onPress={() => isButtonEnabled && navigation.navigate('SurveyScreen', { name, surname, email, password, phone })}
                    disabled={!isButtonEnabled}
                >
                    <Text
                        style={[styles.buttonText, { color: isButtonEnabled ? '#F5F5F5' : '#C4C4C4' }]}
                        allowFontScaling={false}
                    >
                        Cadastrar
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export default SignupEmailScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    },

    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
        paddingHorizontal: width * 0.06, // Ajuste do padding horizontal
        paddingTop: Platform.select({
            ios: height * 0.07, // 7% da altura da tela no iOS
            android: height * 0.05, // 5% da altura da tela no Android
        }),
    },
    progressBarContainer: {
        marginTop: Platform.select({
            ios: height * 0.02, // Espaço menor no iOS
            android: height * 0.015, // Espaço menor no Android
        }),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: height * 0.04, // Ajuste da margem inferior
    },
    progressSegment: {
        height: height * 0.008, // Ajuste da altura da barra de progresso
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
        marginBottom: height * 0.02, // Margem inferior dos inputs
    },
    label: {
        fontSize: Platform.select({
            ios: width * 0.035, // Ajuste para iOS
            android: width * 0.04, // Ajuste para Android
        }),
        color: '#2F3036',
        marginBottom: height * 0.005, // Ajuste do espaço abaixo do rótulo
    },
    input: {
        width: '100%',
        height: height * 0.06, // Ajuste da altura dos inputs
        borderColor: '#C4C4C4',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: width * 0.03, // Ajuste do padding interno
        fontSize: Platform.select({
            ios: width * 0.04, // Ajuste para iOS
            android: width * 0.045, // Ajuste para Android
        }),
        backgroundColor: '#F4F4F4',
    },
    inputError: {
        borderColor: 'red',
    },
    inputContainerWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        position: 'absolute',
        right: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.02, // Ajuste da margem inferior
    },
    checkbox: {
        width: width * 0.06, // Largura do checkbox em relação à largura da tela
        height: width * 0.06, // Altura do checkbox em relação à largura da tela
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        marginRight: width * 0.02, // Espaço à direita do checkbox
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#FF7A00',
    },
    checkboxLabel: {
        fontSize: Platform.select({
            ios: width * 0.035, // Ajuste para iOS
            android: width * 0.04, // Ajuste para Android
        }),
        color: '#71727A',
        flex: 1,
    },
    linkText: {
        color: '#FB7D10',
        textDecorationLine: 'none',
    },
    buttonPrimary: {
        backgroundColor: '#FF7A00',
        paddingVertical: height * 0.02, // Padding vertical do botão
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        marginTop: height * 0.04, // Margem superior do botão
    },
    buttonText: {
        color: '#F5F5F5',
        fontSize: Platform.select({
            ios: width * 0.045, // Ajuste para iOS
            android: width * 0.05, // Ajuste para Android
        }),
        fontWeight: 'bold',
    },
    title: {
        fontSize: Platform.select({
            ios: width * 0.06, // Tamanho maior para iOS
            android: width * 0.055, // Tamanho ligeiramente menor para Android
        }),
        fontWeight: 'bold',
        color: '#1F2024',
        marginBottom: height * 0.02, // Margem inferior do título
    },
    errorText: {
        color: 'red',
        fontSize: Platform.select({
            ios: width * 0.03, // Ajuste para iOS
            android: width * 0.035, // Ajuste para Android
        }),
        marginTop: height * 0.005, // Margem superior do erro
    },
});
