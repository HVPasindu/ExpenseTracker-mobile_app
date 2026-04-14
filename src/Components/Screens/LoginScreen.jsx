import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { TextInput, ActivityIndicator, Portal, Dialog } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
import BackgroundWrapper from '../Com_components/BackgroundWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const [securePassword, setSecurePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const validateForm = () => {
    let valid = true;

    setEmailError('');
    setPasswordError('');
    setServerError('');

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      setEmailError('Email is required');
      valid = false;
    } else if (!emailRegex.test(trimmedEmail)) {
      setEmailError('Enter a valid email address');
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    return valid;
  };

  const goLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        'https://expense-tracker-backend-o3ow.onrender.com/users/login',
        {
          email: email.trim(),
          password: password,
        },
      );

      //console.log(response.data);
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('userName',response.data.user.name)
      //console.log(response.data.user.name);
      setShowSuccessAlert(true);
    } catch (error) {
      console.log(error?.response?.data || error.message);

      setServerError(
        error?.response?.data?.message || 'Invalid email or password',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccessAlert(false);
    setEmail('');
    setPassword('');
    navigation.replace('MainTabs');
  };

  return (
    <BackgroundWrapper>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        enableOnAndroid={true}
        extraScrollHeight={30}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../Assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Expense Tracker</Text>
        <Text style={styles.subtitle}>Welcome back! Login to your account</Text>

        <View style={styles.card}>
          {serverError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{serverError}</Text>
            </View>
          ) : null}

          <TextInput
            label="Email"
            style={styles.input}
            onChangeText={text => {
              setEmail(text);
              if (emailError) setEmailError('');
              if (serverError) setServerError('');
            }}
            value={email}
            mode="outlined"
            outlineStyle={styles.inputOutline}
            activeOutlineColor={emailError ? '#ef4444' : '#00a6fb'}
            outlineColor={emailError ? '#ef4444' : '#d9dce3'}
            theme={{ roundness: 14 }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!emailError}
            left={<TextInput.Icon icon="email-outline" />}
          />
          {emailError ? (
            <Text style={styles.helperText}>{emailError}</Text>
          ) : null}

          <TextInput
            label="Password"
            style={styles.input}
            onChangeText={text => {
              setPassword(text);
              if (passwordError) setPasswordError('');
              if (serverError) setServerError('');
            }}
            value={password}
            mode="outlined"
            outlineStyle={styles.inputOutline}
            activeOutlineColor={passwordError ? '#ef4444' : '#00a6fb'}
            outlineColor={passwordError ? '#ef4444' : '#d9dce3'}
            theme={{ roundness: 14 }}
            secureTextEntry={securePassword}
            error={!!passwordError}
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={securePassword ? 'eye-off' : 'eye'}
                onPress={() => setSecurePassword(!securePassword)}
              />
            }
          />
          {passwordError ? (
            <Text style={styles.helperText}>{passwordError}</Text>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={goLogin}
            activeOpacity={0.8}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator animating={true} color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>LOGIN</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <Portal>
        <Dialog
          visible={showSuccessAlert}
          onDismiss={handleSuccessOk}
          style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>
            Login Successful
          </Dialog.Title>

          <Dialog.Content>
            <Text style={styles.dialogMessage}>
              Welcome back to Expense Tracker
            </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <TouchableOpacity style={styles.okButton} onPress={handleSuccessOk}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoWrapper: {
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.90)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  logo: {
    width: 62,
    height: 62,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    color: '#0b132b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#0b132b',
    opacity: 0.6,
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    marginTop: 10,
  },
  inputOutline: {
    borderRadius: 14,
  },
  helperText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
    marginLeft: 6,
  },
  forgotText: {
    textAlign: 'right',
    marginTop: 16,
    fontSize: 14,
    color: '#00a6fb',
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 18,
    backgroundColor: '#00a6fb',
    paddingVertical: 15,
    borderRadius: 14,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  registerText: {
    fontSize: 14,
    color: '#0b132b',
    opacity: 0.8,
  },
  registerLink: {
    fontSize: 14,
    color: '#00a6fb',
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: '#ffe5e5',
    borderWidth: 1,
    borderColor: '#ffc9c9',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  errorText: {
    color: '#c62828',
    fontSize: 13,
  },
  dialog: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },

  dialogTitle: {
    textAlign: 'center',
    color: '#0b132b',
    fontWeight: 'bold',
  },

  dialogMessage: {
    textAlign: 'center',
    color: '#4b5563',
    fontSize: 15,
  },

  okButton: {
    backgroundColor: '#00a6fb',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 8,
  },

  okButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default LoginScreen;