import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {TextInput, ActivityIndicator, Portal, Dialog} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import BackgroundWrapper from '../Com_components/BackgroundWrapper';

const VerifyOtpScreen = ({navigation, route}) => {
  const email = route?.params?.email || '';

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const validateOtp = value => {
    if (!value.trim()) {
      return 'OTP is required';
    }

    if (value.length !== 6) {
      return 'OTP must be 6 digits';
    }

    if (!/^\d+$/.test(value)) {
      return 'OTP must contain only numbers';
    }

    return '';
  };

  const handleVerifyOtp = async () => {
    setServerError('');
    setSuccessMessage('');

    if (!email) {
      setServerError('Email not found. Please register again.');
      return;
    }

    const otpValidation = validateOtp(otp);
    setOtpError(otpValidation);

    if (otpValidation) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        'https://expense-tracker-backend-o3ow.onrender.com/users/verify-otp',
        {
          email: email,
          otp: otp,
        },
      );

      setSuccessMessage(response.data.message || 'OTP verified successfully');
      setShowSuccessAlert(true);
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Cannot connect to server',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setServerError('');
    setSuccessMessage('');

    if (!email) {
      setServerError('Email not found. Please register again.');
      return;
    }

    try {
      setResendLoading(true);

      const response = await axios.post(
        'https://expense-tracker-backend-o3ow.onrender.com/users/resend-otp',
        {
          email: email,
        },
      );

      setSuccessMessage(response.data.message || 'OTP sent again');
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Cannot connect to server',
      );
    } finally {
      setResendLoading(false);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccessAlert(false);
    navigation.replace('LoginScreen');
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

        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>Enter the OTP sent to your email</Text>

        {email ? <Text style={styles.emailText}>{email}</Text> : null}

        <View style={styles.card}>
          {serverError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{serverError}</Text>
            </View>
          ) : null}

          {successMessage && !showSuccessAlert ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          <TextInput
            label="Enter OTP"
            style={styles.input}
            onChangeText={text => {
              setOtp(text);
              if (otpError) setOtpError('');
              if (serverError) setServerError('');
            }}
            value={otp}
            mode="outlined"
            outlineStyle={styles.inputOutline}
            activeOutlineColor={otpError ? '#ef4444' : '#00a6fb'}
            outlineColor={otpError ? '#ef4444' : '#d9dce3'}
            theme={{roundness: 14}}
            keyboardType="number-pad"
            autoCapitalize="none"
            maxLength={6}
            error={!!otpError}
          />
          {otpError ? <Text style={styles.helperText}>{otpError}</Text> : null}

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={handleVerifyOtp}
            activeOpacity={0.8}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator animating={true} color="#ffffff" />
            ) : (
              <Text style={styles.primaryButtonText}>VERIFY OTP</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.outlineButton, resendLoading && styles.disabledButton]}
            onPress={handleResendOtp}
            activeOpacity={0.8}
            disabled={resendLoading}>
            {resendLoading ? (
              <ActivityIndicator animating={true} color="#00a6fb" />
            ) : (
              <Text style={styles.outlineButtonText}>RESEND OTP</Text>
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
            OTP Verified
          </Dialog.Title>

          <Dialog.Content>
            <Text style={styles.dialogMessage}>
              {successMessage || 'OTP verified successfully'}
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
    width: 90,
    height: 90,
    borderRadius: 45,
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
    width: 58,
    height: 58,
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
    marginBottom: 10,
  },
  emailText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#0b132b',
    opacity: 0.7,
    marginBottom: 22,
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
    marginTop: 6,
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
  outlineButton: {
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: '#6ec1ff',
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: 'transparent',
  },
  outlineButtonText: {
    textAlign: 'center',
    color: '#00a6fb',
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
    marginBottom: 12,
  },
  errorText: {
    color: '#c62828',
    fontSize: 13,
  },
  successBox: {
    backgroundColor: '#e8f8ee',
    borderWidth: 1,
    borderColor: '#bfe8cb',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  successText: {
    color: '#1f7a3d',
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

export default VerifyOtpScreen;