import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Importando o axios

const { width, height } = Dimensions.get('window');

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Animação para o botão
  const fadeAnim = useRef(new Animated.Value(0.5)).current;

  // Validação de email usando regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para salvar login no AsyncStorage
  const saveLoginInfo = async (usuario_id) => {
    try {
      await AsyncStorage.setItem('usuario_id', usuario_id);
    } catch (error) {
      console.error('Error saving user ID', error);
    }
  };
  // Função para remover o login do AsyncStorage
  const removeLoginInfo = async () => {
    try {
      await AsyncStorage.removeItem('usuario_id');
    } catch (error) {
      console.error('Error removing user ID', error);
    }
  };

  // Função para lidar com o login via API utilizando axios
  // Função para lidar com o login via API utilizando axios
  const handleLogin = async () => {
    try {
      const response = await axios.post('https://imogo.juk.re/login', {
        email: email,
        senha: password,
      });

      if (response.status === 200) {
        const data = response.data;
        console.log('Resposta da API:', data);

        // Verifique se o usuario_id existe
        if (data.usuario_id) {
          if (remember) {
            console.log('Salvando usuario_id:', data.usuario_id);
            await AsyncStorage.setItem('usuario_id', String(data.usuario_id)); // Salva o usuario_id no AsyncStorage
          } else {
            console.log('Removendo usuario_id');
            await removeLoginInfo(); // Remove o usuario_id se "Lembrar senha" não estiver marcado
          }

          // Redefine a navegação e define "Home" como a única tela no histórico
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home', params: { usuario_id: data.usuario_id } }],
          });
        } else {
          Alert.alert('Erro de Login', 'ID de usuário não encontrado. Tente novamente.');
        }
      } else {
        Alert.alert('Erro de Login', 'Credenciais inválidas, tente novamente.');
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Erro de Login', error.response.data.message || 'Credenciais inválidas.');
      } else if (error.request) {
        Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão ou tente mais tarde.');
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao fazer login.');
      }
    }
  };




  useEffect(() => {
    // Habilitar botão se email e senha estiverem preenchidos corretamente
    if (email !== '' && password !== '' && validateEmail(email)) {
      setIsButtonEnabled(true);
      setEmailError(''); // Limpar erro se o email for válido
      // Animar o botão para opacidade total
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setIsButtonEnabled(false);
      if (email !== '' && !validateEmail(email)) {
        setEmailError('Por favor, insira um email válido.');
      } else {
        setEmailError('');
      }
      // Animar o botão para meia opacidade
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [email, password]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.background}>
        <StatusBar
          barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
          backgroundColor="transparent"
          translucent
        />
        <ImageBackground
          source={require('../assets/img/Splashcreen.png')}
          style={styles.imageBackground}
          imageStyle={styles.imageBackgroundStyle}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={Platform.select({ ios: 0, android: -150 })}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
              scrollEnabled={false}
            >
              {/* Logo Container */}
              <View style={styles.logoContainer}>
                <Image
                  source={require('../assets/img/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              {/* White Container */}
              <View style={styles.whiteContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title} allowFontScaling={false}>
                    Bem-Vindo!
                  </Text>
                </View>

                {/* Email Input */}
                <TextInput
                  style={[styles.input, emailError ? styles.inputError : null]}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  allowFontScaling={false}
                  placeholderTextColor="#A9A9A9"
                />
                {emailError ? (
                  <Text style={styles.errorText} allowFontScaling={false}>
                    {emailError}
                  </Text>
                ) : null}

                {/* Password Input */}
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.inputPassword}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                    allowFontScaling={false}
                    placeholderTextColor="#A9A9A9"
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={isPasswordVisible ? 'eye-off' : 'eye'}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>

                {/* Remember Me and Forgot Password */}
                <View style={styles.rememberContainer}>
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      value={remember}
                      onValueChange={setRemember}
                      color={remember ? '#FB7D10' : '#FB7D10'}
                    />
                    <Text style={styles.rememberText} allowFontScaling={false}>
                      Lembrar senha.
                    </Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.forgotText} allowFontScaling={false}>
                      Esqueceu sua senha?
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Login Button with animation */}
                <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
                  <TouchableOpacity
                    style={[
                      isButtonEnabled ? styles.buttonPrimary : styles.buttonSecondary,
                    ]}
                    onPress={handleLogin}
                    disabled={!isButtonEnabled}
                  >
                    <Text
                      style={
                        isButtonEnabled
                          ? styles.buttonTextPrimary
                          : styles.buttonTextSecondary
                      }
                      allowFontScaling={false}
                    >
                      Entrar
                    </Text>
                  </TouchableOpacity>
                </Animated.View>

                {/* Separator Text */}
                <Text style={styles.separatorText} allowFontScaling={false}>
                  Ou acesse com
                </Text>

                {/* Social Buttons */}
                <TouchableOpacity style={styles.buttonSocial}>
                  <Ionicons
                    name="logo-google"
                    size={24}
                    color="#EA4335"
                    style={styles.socialIcon}
                  />
                  <Text
                    style={styles.buttonTextSocial}
                    allowFontScaling={false}
                  >
                    Continuar com Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonSocial}>
                  <Ionicons
                    name="logo-facebook"
                    size={24}
                    color="#3B5998"
                    style={styles.socialIcon}
                  />
                  <Text
                    style={styles.buttonTextSocial}
                    allowFontScaling={false}
                  >
                    Continuar com Facebook
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonSocial}>
                  <Ionicons
                    name="logo-apple"
                    size={24}
                    color="#000"
                    style={styles.socialIcon}
                  />
                  <Text
                    style={styles.buttonTextSocial}
                    allowFontScaling={false}
                  >
                    Continuar com Apple
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  imageBackgroundStyle: {
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    height: height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.35,
    height: height * 0.08,
  },
  whiteContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
    minHeight: height * 0.75,
    paddingBottom: height * 0.05,
    flexGrow: 1,
    flexShrink: 0,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: Platform.select({
      ios: width * 0.055,
      android: width * 0.05,
    }),
    fontWeight: 'bold',
    color: '#1F2024',
    marginBottom: height * 0.015,
    textAlign: 'left',
  },
  input: {
    width: '100%',
    height: height * 0.055,
    borderColor: '#EAEAEA',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: width * 0.04,
    fontSize: Platform.select({
      ios: width * 0.04,
      android: width * 0.038,
    }),
    marginBottom: height * 0.012,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: width * 0.03,
    marginBottom: height * 0.012,
    alignSelf: 'flex-start',
  },
  inputError: {
    borderColor: 'red', // Borda vermelha quando houver erro
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  inputPassword: {
    flex: 1,
    height: height * 0.055,
    borderColor: '#EAEAEA',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: width * 0.04,
    fontSize: Platform.select({
      ios: width * 0.04,
      android: width * 0.038,
    }),
    backgroundColor: '#fff',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: height * 0.01,
    marginBottom: height * 0.015,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    fontSize: Platform.select({
      ios: width * 0.033,
      android: width * 0.032,
    }),
    color: '#FB7D10',
    marginLeft: 10,
  },
  forgotText: {
    fontSize: Platform.select({
      ios: width * 0.033,
      android: width * 0.032,
    }),
    color: '#FB7D10',
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
  separatorText: {
    fontSize: Platform.select({
      ios: width * 0.038,
      android: width * 0.037,
    }),
    color: '#71727A',
    marginVertical: height * 0.015,
  },
  buttonSocial: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 30,
    paddingVertical: height * 0.014,
    width: '100%',
    marginBottom: height * 0.012,
    justifyContent: 'center',
  },
  buttonTextSocial: {
    fontSize: Platform.select({
      ios: width * 0.043,
      android: width * 0.04,
    }),
    color: '#333',
    fontWeight: 'bold',
  },
  socialIcon: {
    marginRight: 10,
  },
});

export default Login;
