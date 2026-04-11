import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';

import SplashScreen from './src/Components/Screens/SplashScreen';
import LoginScreen from './src/Components/Screens/LoginScreen';
import SignupScreen from './src/Components/Screens/SignupScreen';
import VerifyOtpScreen from './src/Components/Screens/VerifyOtpScreen';
import ForgotPasswordScreen from './src/Components/Screens/ForgotPasswordScreen';
import VerifyResetOtpScreen from './src/Components/Screens/VerifyResetOtpScreen';
import ResetPasswordScreen from './src/Components/Screens/ResetPasswordScreen';


const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00a6fb',
    background: '#eef8ff',
    text: '#0b132b',
  },
};

const HomeScreen = () => {
  return (
    <View style={styles.center}>
      <Text style={styles.homeText}>Home Screen</Text>
    </View>
  );
};






function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="SplashScreen"
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
            <Stack.Screen name="VerifyOtpScreen" component={VerifyOtpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="VerifyResetOtpScreen" component={VerifyResetOtpScreen} />
            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />

          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loginText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0b132b',
  },
});