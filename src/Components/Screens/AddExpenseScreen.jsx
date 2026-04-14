import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';
import {
  TextInput,
  ActivityIndicator,
  Portal,
  Dialog,
} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';

const AddExpenseScreen = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(null);
  const [note, setNote] = useState('');

  const [titleError, setTitleError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [expenseDateError, setExpenseDateError] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setTitleError('');
      setAmountError('');
      setExpenseDateError('');
      setError('');

      return () => {
        setTitleError('');
        setAmountError('');
        setExpenseDateError('');
        setError('');
        setShowDatePicker(false);
      };
    }, []),
  );

  const validateTitle = value => {
    if (!value.trim()) {
      return 'Title is required';
    }
    return '';
  };

  const validateAmount = value => {
    if (!value) {
      return 'Amount is required';
    }

    if (Number(value) <= 0) {
      return 'Amount must be greater than 0';
    }

    return '';
  };

  const validateExpenseDate = value => {
    if (!value) {
      return 'Expense date is required';
    }
    return '';
  };

  const formatDate = date => {
    if (!date) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const openDatePicker = () => {
    Keyboard.dismiss();

    setTimeout(() => {
      setShowDatePicker(true);
    }, 150);
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setExpenseDate(selectedDate);
      if (expenseDateError) {
        setExpenseDateError('');
      }
    }
  };

  const handleAddExpense = async () => {
    setError('');

    const titleValidation = validateTitle(title);
    const amountValidation = validateAmount(amount);
    const expenseDateValidation = validateExpenseDate(expenseDate);

    setTitleError(titleValidation);
    setAmountError(amountValidation);
    setExpenseDateError(expenseDateValidation);

    if (titleValidation || amountValidation || expenseDateValidation) {
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');

      if (!token) {
        navigation.replace('LoginScreen');
        return;
      }

      await axios.post(
        'https://expense-tracker-backend-o3ow.onrender.com/expenses',
        {
          title: title.trim(),
          amount: Number(amount),
          expense_date: formatDate(expenseDate),
          note: note.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setShowSuccessDialog(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccessDialog(false);
    setTitle('');
    setAmount('');
    setExpenseDate(null);
    setNote('');
    setTitleError('');
    setAmountError('');
    setExpenseDateError('');
    setError('');
    navigation.navigate('ExpensesTab');
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      enableOnAndroid={true}
      extraScrollHeight={30}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <View style={{flex: 1}}>
          <Text style={styles.pageTitle}>Add Expense</Text>
          <Text style={styles.pageSubtitle}>Create a new expense record</Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('ExpensesTab')}>
          <Text style={styles.backButtonText}>BACK</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <TextInput
          label="Title"
          style={styles.input}
          value={title}
          onChangeText={text => {
            setTitle(text);
            if (titleError) {
              setTitleError('');
            }
          }}
          mode="outlined"
          outlineStyle={styles.inputOutline}
          activeOutlineColor={titleError ? '#ef4444' : '#00a6fb'}
          outlineColor={titleError ? '#ef4444' : '#d9dce3'}
          theme={{roundness: 14}}
          error={!!titleError}
        />
        {titleError ? <Text style={styles.helperText}>{titleError}</Text> : null}

        <TextInput
          label="Amount"
          style={styles.input}
          value={amount}
          onChangeText={text => {
            setAmount(text);
            if (amountError) {
              setAmountError('');
            }
          }}
          mode="outlined"
          outlineStyle={styles.inputOutline}
          activeOutlineColor={amountError ? '#ef4444' : '#00a6fb'}
          outlineColor={amountError ? '#ef4444' : '#d9dce3'}
          theme={{roundness: 14}}
          keyboardType="numeric"
          error={!!amountError}
        />
        {amountError ? (
          <Text style={styles.helperText}>{amountError}</Text>
        ) : null}

        <TouchableOpacity activeOpacity={0.8} onPress={openDatePicker}>
          <TextInput
            label="Expense Date"
            style={styles.input}
            value={expenseDate ? formatDate(expenseDate) : ''}
            mode="outlined"
            outlineStyle={styles.inputOutline}
            activeOutlineColor={expenseDateError ? '#ef4444' : '#00a6fb'}
            outlineColor={expenseDateError ? '#ef4444' : '#d9dce3'}
            theme={{roundness: 14}}
            error={!!expenseDateError}
            editable={false}
            pointerEvents="none"
            right={<TextInput.Icon icon="calendar-month-outline" />}
          />
        </TouchableOpacity>
        {expenseDateError ? (
          <Text style={styles.helperText}>{expenseDateError}</Text>
        ) : null}

        <TextInput
          label="Note"
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          mode="outlined"
          outlineStyle={styles.inputOutline}
          activeOutlineColor="#00a6fb"
          outlineColor="#d9dce3"
          theme={{roundness: 14}}
          multiline
          numberOfLines={5}
        />

        <TouchableOpacity
          style={[styles.addButton, loading && styles.disabledButton]}
          onPress={handleAddExpense}
          activeOpacity={0.8}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator animating={true} color="#ffffff" />
          ) : (
            <Text style={styles.addButtonText}>ADD EXPENSE</Text>
          )}
        </TouchableOpacity>
      </View>

      {showDatePicker ? (
        <DateTimePicker
          value={expenseDate || new Date()}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={handleDateChange}
        />
      ) : null}

      <Portal>
        <Dialog
          visible={showSuccessDialog}
          onDismiss={handleSuccessOk}
          style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>
            Expense Added
          </Dialog.Title>

          <Dialog.Content>
            <Text style={styles.dialogMessage}>
              Expense added successfully
            </Text>
          </Dialog.Content>

          <Dialog.Actions style={styles.dialogActions}>
            <TouchableOpacity style={styles.okButton} onPress={handleSuccessOk}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAwareScrollView>
  );
};

export default AddExpenseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fbff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  headerRow: {
    marginBottom: 18,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0b132b',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 16,
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#6ec1ff',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
  },
  backButtonText: {
    color: '#00a6fb',
    fontSize: 13,
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: '#ffe5e5',
    borderWidth: 1,
    borderColor: '#ffc9c9',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  errorText: {
    color: '#c62828',
    fontSize: 13,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e6eef5',
  },
  input: {
    backgroundColor: '#ffffff',
    marginTop: 10,
  },
  noteInput: {
    backgroundColor: '#ffffff',
    marginTop: 10,
    minHeight: 120,
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
  addButton: {
    marginTop: 18,
    backgroundColor: '#00a6fb',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.7,
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
  dialogActions: {
    justifyContent: 'center',
    paddingBottom: 16,
  },
  okButton: {
    backgroundColor: '#00a6fb',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  okButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});