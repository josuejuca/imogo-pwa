import React, { useEffect, useState } from 'react';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import AppLoading from 'expo-app-loading';

// Componentes importados
import Welcome from './screens/Welcome'; 
import Login from './screens/LoginScreen'; 
import SignupScreen from './screens/SignupScreen/SignupScreenSeusDados';
import SignupEmailScreen from './screens/SignupScreen/SignupScreenEmail';
import SurveyScreen from './screens/SignupScreen/SignupScreenQuery';
import SuccessScreen from './screens/SignupScreen/SignupScreenSuccess';
import OneCadastroImovel from './screens/RegisterPropertyScreen/CaracteristicasScreen'; 
import Home from './screens/HomeScreen';
import CadastroImovel from './screens/RegisterPropertyScreen/CadastroImovelScreen';
import ProfileScreen from './screens/ProfileScreen';
import PreCaracteristicasScreen from './screens/RegisterPropertyScreen/PreCaracteristicasScreen';
import PreEnderecoScreen from './screens/RegisterPropertyScreen/PreEnderecoScreen';
import EnderecoScreen from './screens/RegisterPropertyScreen/EnderecoScreen';
import PreDadosProprietario from './screens/RegisterPropertyScreen/PreDadosProprietarioScreen';
import DadosProprietarioScreen from './screens/RegisterPropertyScreen/DadosProprietarioScreen';
import PreDocumentoScreen from './screens/RegisterPropertyScreen/PreDocumentoScreen';
import TipoFotoScreen from './screens/RegisterPropertyScreen/TipoFotoScreen';
import FotoQRScreen from './screens/RegisterPropertyScreen/FotoQRScreen';
import FotoInteraScreen from './screens/RegisterPropertyScreen/FotoInteraScreen';
import PreSelfieScreen from './screens/RegisterPropertyScreen/PreSelfieScreen';
import SelfieScreen from './screens/RegisterPropertyScreen/SelfieScreen';
import CadastroImovelSuccessScreen from './screens/RegisterPropertyScreen/CadastroImovelSuccessScreen';
import AvaliadorScreen from './screens/AvaliadorScreen';
import ImovelScreen from './screens/ImovelScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null); // Estado para armazenar a rota inicial
  const [usuario_id, setusuario_id] = useState(null); // Estado para armazenar o usuario_id

  // Carregamento das fontes
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });

  useEffect(() => {
    // Verifica se o usuário já fez login
    const checkLoginStatus = async () => {
      try {
        const storedusuario_id = await AsyncStorage.getItem('usuario_id'); // Pega o usuario_id salvo no AsyncStorage
        if (storedusuario_id) {
          setusuario_id(storedusuario_id); // Armazena o usuario_id no estado
          setInitialRoute('Home'); // Define a rota inicial como Home
        } else {
          setInitialRoute('Welcome'); // Redireciona para Welcome se o usuario_id não existir
        }
      } catch (error) {
        console.error('Erro ao verificar o status de login:', error);
        setInitialRoute('Welcome'); // Em caso de erro, redireciona para Welcome
      }
    };

    checkLoginStatus(); // Executa a verificação ao carregar o app
  }, []);

  // Enquanto as fontes ou o estado inicial estiverem sendo verificados, exiba um indicador de carregamento
  if (!fontsLoaded || !initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FB7D10" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* Configuração global da StatusBar */}
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent 
      />
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen 
          name="Welcome"
          component={Welcome} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="Singup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignupEmailScreen" component={SignupEmailScreen} options={{ headerShown: false }} />
        <Stack.Screen name='SurveyScreen' component={SurveyScreen} options={{ headerShown: false }} />
        <Stack.Screen name='SuccessScreen' component={SuccessScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        <Stack.Screen 
          name='Home' 
          component={Home} 
          options={{ headerShown: false }} 
          initialParams={{ usuario_id }} // Passa o usuario_id como parâmetro inicial para a Home
        />
        <Stack.Screen name='CadastroImovel' component={CadastroImovel} options={{ headerShown: false }} />
        <Stack.Screen name='ProfileScreen' component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name='PreCaracteristicasScreen' component={PreCaracteristicasScreen} options={{ headerShown: false }} />
        <Stack.Screen name='OneCadastroImovel' component={OneCadastroImovel} options={{ headerShown: false }} />
        <Stack.Screen name='PreEnderecoScreen' component={PreEnderecoScreen} options={{ headerShown: false }} />
        <Stack.Screen name='EnderecoScreen' component={EnderecoScreen} options={{ headerShown: false }} />
        <Stack.Screen name='PreDadosProprietario' component={PreDadosProprietario} options={{ headerShown: false }} />
        <Stack.Screen name='DadosProprietario' component={DadosProprietarioScreen} options={{ headerShown: false }} />
        <Stack.Screen name='PreDocumentoScreen' component={PreDocumentoScreen} options={{ headerShown: false }} />
        <Stack.Screen name='TipoFotoScreen' component={TipoFotoScreen} options={{ headerShown: false }} />
        <Stack.Screen name='FotoQRScreen' component={FotoQRScreen} options={{ headerShown: false }} />
        <Stack.Screen name='FotoInteraScreen' component={FotoInteraScreen} options={{ headerShown: false }} />
        <Stack.Screen name='PreSelfieScreen' component={PreSelfieScreen} options={{ headerShown: false }} />
        <Stack.Screen name='SelfieScreen' component={SelfieScreen} options={{ headerShown: false }} />
        <Stack.Screen name='CadastroImovelSuccessScreen' component={CadastroImovelSuccessScreen} options={{ headerShown: false }} />
        <Stack.Screen name='AvaliadorScreen' component={AvaliadorScreen} options={{ headerShown: false }} />
        <Stack.Screen name='ImovelScreen' component={ImovelScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
