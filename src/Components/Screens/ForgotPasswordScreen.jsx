import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {TextInput, ActivityIndicator, Portal, Dialog} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import BackgroundWrapper from '../Com_components/BackgroundWrapper';

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const validateEmail = value => {
    if (!value.trim()) {
      return 'Email is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Enter a valid email address';
    }

    return '';
  };

  const handleForgotPassword = async () => {
    setServerError('');

    const emailValidation = validateEmail(email);
    setEmailError(emailValidation);

    if (emailValidation) {
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        'https://expense-tracker-backend-o3ow.onrender.com/users/forgot-password',
        {
          email: email.trim(),
        },
      );

      setShowSuccessAlert(true);
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Cannot connect to server',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccessAlert(false);
    navigation.navigate('VerifyResetOtpScreen', {email: email.trim()});
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

        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email to receive a reset OTP
        </Text>

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
            theme={{roundness: 14}}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!emailError}
            left={<TextInput.Icon icon="email-outline" />}
          />
          {emailError ? <Text style={styles.helperText}>{emailError}</Text> : null}

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={handleForgotPassword}
            activeOpacity={0.8}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator animating={true} color="#ffffff" />
            ) : (
              <Text style={styles.primaryButtonText}>SEND RESET OTP</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Back to </Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.loginLink}>Login</Text>
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
            Reset OTP Sent
          </Dialog.Title>

          <Dialog.Content>
            <Text style={styles.dialogMessage}>
              A reset OTP has been sent to your email
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
    shadowOffset: {width: 0, height: 8},
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
    color: '#00a6fb',
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
    shadowOffset: {width: 0, height: 10},
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
  primaryButton: {
    marginTop: 18,
    backgroundColor: '#00a6fb',
    paddingVertical: 15,
    borderRadius: 14,
  },
  primaryButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: '#0b132b',
    opacity: 0.85,
  },
  loginLink: {
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

export default ForgotPasswordScreen;