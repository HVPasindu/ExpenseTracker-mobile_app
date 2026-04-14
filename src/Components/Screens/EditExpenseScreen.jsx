import React, {useEffect, useState} from 'react';
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

const EditExpenseScreen = ({navigation, route}) => {
  const {expenseId} = route.params;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(null);
  const [note, setNote] = useState('');

  const [titleError, setTitleError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [expenseDateError, setExpenseDateError] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = date => {
    if (!date) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        setLoading(true);
        setError('');

        const token = await AsyncStorage.getItem('token');

        if (!token) {
          navigation.replace('LoginScreen');
          return;
        }

        const res = await axios.get(
          `https://expense-tracker-backend-o3ow.onrender.com/expenses/${expenseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const exp = res.data.expense;

        setTitle(exp.title || '');
        setAmount(String(exp.amount || ''));
        setExpenseDate(exp.expense_date ? new Date(exp.expense_date) : null);
        setNote(exp.note || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load expense');
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [expenseId, navigation]);

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

  const handleUpdate = async () => {
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
      setSubmitLoading(true);

      const token = await AsyncStorage.getItem('token');

      if (!token) {
        navigation.replace('LoginScreen');
        return;
      }

      await axios.put(
        `https://expense-tracker-backend-o3ow.onrender.com/expenses/${expenseId}`,
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
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  const goExpensesTab = () => {
    navigation.navigate('MainTabs', {
      screen: 'ExpensesTab',
    });
  };

  const handleOk = () => {
    setShowSuccessDialog(false);
    goExpensesTab();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00a6fb" />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      enableOnAndroid={true}
      extraScrollHeight={30}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Edit Expense</Text>
      <Text style={styles.subtitle}>Update your expense information</Text>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TextInput
        label="Title"
        value={title}
        onChangeText={text => {
          setTitle(text);
          if (titleError) {
            setTitleError('');
          }
        }}
        style={styles.input}
        mode="outlined"
        outlineStyle={styles.inputOutline}
        activeOutlineColor={titleError ? '#ef4444' : '#00a6fb'}
        outlineColor={titleError ? '#ef4444' : '#d9dce3'}
        error={!!titleError}
      />
      {titleError ? <Text style={styles.helperText}>{titleError}</Text> : null}

      <TextInput
        label="Amount"
        value={amount}
        onChangeText={text => {
          setAmount(text);
          if (amountError) {
            setAmountError('');
          }
        }}
        style={styles.input}
        keyboardType="numeric"
        mode="outlined"
        outlineStyle={styles.inputOutline}
        activeOutlineColor={amountError ? '#ef4444' : '#00a6fb'}
        outlineColor={amountError ? '#ef4444' : '#d9dce3'}
        error={!!amountError}
      />
      {amountError ? <Text style={styles.helperText}>{amountError}</Text> : null}

      <TouchableOpacity activeOpacity={0.8} onPress={openDatePicker}>
        <TextInput
          label="Expense Date"
          value={expenseDate ? formatDate(expenseDate) : ''}
          style={styles.input}
          mode="outlined"
          outlineStyle={styles.inputOutline}
          activeOutlineColor={expenseDateError ? '#ef4444' : '#00a6fb'}
          outlineColor={expenseDateError ? '#ef4444' : '#d9dce3'}
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
        value={note}
        onChangeText={setNote}
        style={styles.input}
        mode="outlined"
        outlineStyle={styles.inputOutline}
        activeOutlineColor="#00a6fb"
        outlineColor="#d9dce3"
        multiline
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={handleUpdate}
        disabled={submitLoading}>
        {submitLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>UPDATE EXPENSE</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.backBtn} onPress={goExpensesTab}>
        <Text style={styles.backText}>BACK</Text>
      </TouchableOpacity>

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
          onDismiss={handleOk}
          style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Success</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogMessage}>
              Expense updated successfully
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <TouchableOpacity style={styles.okButton} onPress={handleOk}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAwareScrollView>
  );
};

export default EditExpenseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fbff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0b132b',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 18,
  },
  input: {
    marginTop: 10,
    backgroundColor: '#ffffff',
  },
  inputOutline: {
    borderRadius: 14,
  },
  btn: {
    marginTop: 20,
    backgroundColor: '#00a6fb',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  backBtn: {
    marginTop: 12,
    alignItems: 'center',
  },
  backText: {
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
  helperText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
    marginLeft: 6,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fbff',
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