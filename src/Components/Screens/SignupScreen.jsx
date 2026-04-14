import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {TextInput, ActivityIndicator, Portal, Dialog} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import BackgroundWrapper from '../Com_components/BackgroundWrapper';

const SignupScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const validateName = value => {
    if (!value.trim()) {
      return 'Name is required';
    }

    if (value.trim().length < 3) {
      return 'Name must be at least 3 characters';
    }

    return '';
  };

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

  const validatePhoneNumber = value => {
    if (!value.trim()) {
      return 'Phone number is required';
    }

    const phoneRegex = /^(0\d{9}|\+94\d{9})$/;
    if (!phoneRegex.test(value)) {
      return 'Enter a valid phone number';
    }

    return '';
  };

  const validatePassword = value => {
    if (!value.trim()) {
      return 'Password is required';
    }

    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }

    return '';
  };

  const validateConfirmPassword = (passwordValue, confirmPasswordValue) => {
    if (!confirmPasswordValue.trim()) {
      return 'Confirm Password is required';
    }

    if (passwordValue !== confirmPasswordValue) {
      return 'Passwords do not match';
    }

    return '';
  };

  const validateForm = () => {
    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const phoneValidation = validatePhoneNumber(phoneNumber);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(
      password,
      confirmPassword,
    );

    setNameError(nameValidation);
    setEmailError(emailValidation);
    setPhoneNumberError(phoneValidation);
    setPasswordError(passwordValidation);
    setConfirmPasswordError(confirmPasswordValidation);
    setServerError('');

    return !(
      nameValidation ||
      emailValidation ||
      phoneValidation ||
      passwordValidation ||
      confirmPasswordValidation
    );
  };

  const goSignup = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        'https://expense-tracker-backend-o3ow.onrender.com/users/register',
        {
          name: name.trim(),
          email: email.trim(),
          password: password,
          phone_number: phoneNumber.trim(),
        },
      );

      setShowSuccessAlert(true);
    } catch (error) {
      console.log(error?.response?.data || error.message);
      setServerError(
        error?.response?.data?.message || 'Cannot connect to server',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccessAlert(false);
    navigation.navigate('VerifyOtpScreen', {email: email.trim()});
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

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Sign up to start managing your expenses
        </Text>

        <View style={styles.card}>
          {serverError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{serverError}</Text>
            </View>
          ) : null}

          <TextInput
            label="Full Name"
            style={styles.input}
            onChangeText={text => {
              setName(text);
              if (nameError) setNameError('');
              if (serverError) setServerError('');
            }}
            value={name}
            mode="outlined"
            outlineStyle={styles.inputOutline}
            activeOutlineColor={nameError ? '#ef4444' : '#00a6fb'}
            outlineColor={nameError ? '#ef4444' : '#d9dce3'}
            theme={{roundness: 14}}
            autoCapitalize="words"
            error={!!nameError}
            left={<TextInput.Icon icon="account-outline" />}
          />
          {nameError ? <Text style={styles.helperText}>{nameError}</Text> : null}

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

          <TextInput
            label="Phone Number"
            style={styles.input}
            onChangeText={text => {
              setPhoneNumber(text);
              if (phoneNumberError) setPhoneNumberError('');
              if (serverError) setServerError('');
            }}
            value={phoneNumber}
            mode="outlined"
            outlineStyle={styles.inputOutline}
            activeOutlineColor={phoneNumberError ? '#ef4444' : '#00a6fb'}
            outlineColor={phoneNumberError ? '#ef4444' : '#d9dce3'}
            theme={{roundness: 14}}
            keyboardType="phone-pad"
            error={!!phoneNumberError}
            left={<TextInput.Icon icon="phone-outline" />}
          />
          {phoneNumberError ? (
            <Text style={styles.helperText}>{phoneNumberError}</Text>
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
            theme={{roundness: 14}}
            secureTextEntry={securePassword}
            autoCapitalize="none"
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

          <TextInput
            label="Confirm Password"
            style={styles.input}
            onChangeText={text => {
              setConfirmPassword(text);
              if (confirmPasswordError) setConfirmPasswordError('');
              if (serverError) setServerError('');
            }}
            value={confirmPassword}
            mode="outlined"
            outlineStyle={styles.inputOutline}
            activeOutlineColor={confirmPasswordError ? '#ef4444' : '#00a6fb'}
            outlineColor={confirmPasswordError ? '#ef4444' : '#d9dce3'}
            theme={{roundness: 14}}
            secureTextEntry={secureConfirmPassword}
            autoCapitalize="none"
            error={!!confirmPasswordError}
            left={<TextInput.Icon icon="lock-check-outline" />}
            right={
              <TextInput.Icon
                icon={secureConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() =>
                  setSecureConfirmPassword(!secureConfirmPassword)
                }
              />
            }
          />
          {confirmPasswordError ? (
            <Text style={styles.helperText}>{confirmPasswordError}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.signupButton, loading && styles.disabledButton]}
            onPress={goSignup}
            activeOpacity={0.8}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator animating={true} color="#ffffff" />
            ) : (
              <Text style={styles.signupButtonText}>SIGN UP</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
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
            Signup Successful
          </Dialog.Title>

          <Dialog.Content>
            <Text style={styles.dialogMessage}>
              OTP has been sent to your email
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
  signupButton: {
    marginTop: 18,
    backgroundColor: '#00a6fb',
    paddingVertical: 15,
    borderRadius: 14,
  },
  disabledButton: {
    opacity: 0.7,
  },
  signupButtonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  loginText: {
    fontSize: 14,
    color: '#0b132b',
    opacity: 0.8,
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

export default SignupScreen;