import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Keyboard,
} from 'react-native';
import {TextInput, ActivityIndicator, Card} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';

const ReportsScreen = () => {
  const today = new Date();

  const [date, setDate] = useState(null);
  const [weekStartDate, setWeekStartDate] = useState(null);
  const [weekEndDate, setWeekEndDate] = useState(null);
  const [rangeStartDate, setRangeStartDate] = useState(null);
  const [rangeEndDate, setRangeEndDate] = useState(null);

  const [monthYear, setMonthYear] = useState(null);

  const [dateResult, setDateResult] = useState(null);
  const [weekResult, setWeekResult] = useState(null);
  const [monthResult, setMonthResult] = useState(null);
  const [rangeResult, setRangeResult] = useState(null);

  const [error, setError] = useState('');
  const [loadingType, setLoadingType] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWeekStartPicker, setShowWeekStartPicker] = useState(false);
  const [showWeekEndPicker, setShowWeekEndPicker] = useState(false);
  const [showRangeStartPicker, setShowRangeStartPicker] = useState(false);
  const [showRangeEndPicker, setShowRangeEndPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setDate(null);
      setWeekStartDate(null);
      setWeekEndDate(null);
      setRangeStartDate(null);
      setRangeEndDate(null);
      setMonthYear(null);

      setDateResult(null);
      setWeekResult(null);
      setMonthResult(null);
      setRangeResult(null);

      setError('');
      setLoadingType('');

      setShowDatePicker(false);
      setShowWeekStartPicker(false);
      setShowWeekEndPicker(false);
      setShowRangeStartPicker(false);
      setShowRangeEndPicker(false);
      setShowMonthPicker(false);

      return () => {
        setDate(null);
        setWeekStartDate(null);
        setWeekEndDate(null);
        setRangeStartDate(null);
        setRangeEndDate(null);
        setMonthYear(null);

        setDateResult(null);
        setWeekResult(null);
        setMonthResult(null);
        setRangeResult(null);

        setError('');
        setLoadingType('');
      };
    }, []),
  );

  const formatDate = value => {
    if (!value) {
      return '';
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const formatMonth = value => {
    if (!value) {
      return '';
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}`;
  };

  const openPicker = setter => {
    Keyboard.dismiss();
    setTimeout(() => {
      setter(true);
    }, 120);
  };

  const headers = async () => {
    const token = await AsyncStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const handleGetDateTotal = async () => {
    if (!date) {
      setError('You must select a date');
      return;
    }

    try {
      setError('');
      setLoadingType('date');

      const response = await axios.get(
        `https://expense-tracker-backend-o3ow.onrender.com/expenses/date/${formatDate(date)}`,
        {
          headers: await headers(),
        },
      );

      setDateResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch date total');
    } finally {
      setLoadingType('');
    }
  };

  const handleGetWeekTotal = async () => {
    if (!weekStartDate || !weekEndDate) {
      setError('You must select start date and end date');
      return;
    }

    if (weekEndDate < weekStartDate) {
      setError('End date cannot be earlier than start date');
      return;
    }

    try {
      setError('');
      setLoadingType('week');

      const response = await axios.get(
        `https://expense-tracker-backend-o3ow.onrender.com/expenses/weekly?start_date=${formatDate(
          weekStartDate,
        )}&end_date=${formatDate(weekEndDate)}`,
        {
          headers: await headers(),
        },
      );

      setWeekResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch weekly total');
    } finally {
      setLoadingType('');
    }
  };

  const handleGetMonthTotal = async () => {
    if (!monthYear) {
      setError('You must select a month');
      return;
    }

    const year = monthYear.getFullYear();
    const month = String(monthYear.getMonth() + 1).padStart(2, '0');

    try {
      setError('');
      setLoadingType('month');

      const response = await axios.get(
        `https://expense-tracker-backend-o3ow.onrender.com/expenses/monthly?year=${year}&month=${month}`,
        {
          headers: await headers(),
        },
      );

      setMonthResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch monthly total');
    } finally {
      setLoadingType('');
    }
  };

  const handleGetRangeTotal = async () => {
    if (!rangeStartDate || !rangeEndDate) {
      setError('You must select start date and end date');
      return;
    }

    if (rangeEndDate < rangeStartDate) {
      setError('End date cannot be earlier than start date');
      return;
    }

    try {
      setError('');
      setLoadingType('range');

      const response = await axios.get(
        `https://expense-tracker-backend-o3ow.onrender.com/expenses/date-range?start_date=${formatDate(
          rangeStartDate,
        )}&end_date=${formatDate(rangeEndDate)}`,
        {
          headers: await headers(),
        },
      );

      setRangeResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch range total');
    } finally {
      setLoadingType('');
    }
  };

  const resetDateSection = () => {
    setDate(null);
    setDateResult(null);
    setError('');
  };

  const resetWeekSection = () => {
    setWeekStartDate(null);
    setWeekEndDate(null);
    setWeekResult(null);
    setError('');
  };

  const resetMonthSection = () => {
    setMonthYear(null);
    setMonthResult(null);
    setError('');
  };

  const resetRangeSection = () => {
    setRangeStartDate(null);
    setRangeEndDate(null);
    setRangeResult(null);
    setError('');
  };

  const renderExpenses = expenses => {
    if (!expenses || expenses.length === 0) {
      return <Text style={styles.noDataText}>No expenses found</Text>;
    }

    return expenses.map(expense => (
      <View key={expense.id} style={styles.expenseItem}>
        <Text style={styles.expenseTitle}>{expense.title}</Text>
        <Text style={styles.expenseMeta}>Amount: Rs. {expense.amount}</Text>
        <Text style={styles.expenseMeta}>Date: {expense.expense_date}</Text>
        <Text style={styles.expenseMeta}>Note: {expense.note || '-'}</Text>
      </View>
    ));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Expense Reports</Text>
      <Text style={styles.pageSubtitle}>
        Check expense totals by date, week, month, or custom range
      </Text>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Total for Date</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.flexOne}
              activeOpacity={0.8}
              onPress={() => openPicker(setShowDatePicker)}>
              <TextInput
                label="Select Date"
                value={date ? formatDate(date) : ''}
                mode="outlined"
                editable={false}
                pointerEvents="none"
                right={<TextInput.Icon icon="calendar-month-outline" />}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkButton} onPress={handleGetDateTotal}>
              {loadingType === 'date' ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.checkButtonText}>CHECK</Text>
              )}
            </TouchableOpacity>
          </View>

          {dateResult ? (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>
                Total Amount: Rs. {dateResult.total_amount}
              </Text>
              <Text style={styles.resultSubText}>
                Date: {dateResult.expense_date}
              </Text>

              {renderExpenses(dateResult.expenses)}

              <TouchableOpacity style={styles.okOutlineButton} onPress={resetDateSection}>
                <Text style={styles.okOutlineButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Total for Week</Text>

          <View style={styles.doubleColumn}>
            <TouchableOpacity
              style={styles.doubleInput}
              activeOpacity={0.8}
              onPress={() => openPicker(setShowWeekStartPicker)}>
              <TextInput
                label="Start Date"
                value={weekStartDate ? formatDate(weekStartDate) : ''}
                mode="outlined"
                editable={false}
                pointerEvents="none"
                right={<TextInput.Icon icon="calendar-month-outline" />}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.doubleInput}
              activeOpacity={0.8}
              onPress={() => openPicker(setShowWeekEndPicker)}>
              <TextInput
                label="End Date"
                value={weekEndDate ? formatDate(weekEndDate) : ''}
                mode="outlined"
                editable={false}
                pointerEvents="none"
                right={<TextInput.Icon icon="calendar-month-outline" />}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkButtonFull} onPress={handleGetWeekTotal}>
              {loadingType === 'week' ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.checkButtonText}>CHECK</Text>
              )}
            </TouchableOpacity>
          </View>

          {weekResult ? (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>
                Total Amount: Rs. {weekResult.total_amount}
              </Text>
              <Text style={styles.resultSubText}>
                Start Date: {weekResult.start_date}
              </Text>
              <Text style={styles.resultSubText}>
                End Date: {weekResult.end_date}
              </Text>

              {renderExpenses(weekResult.expenses)}

              <TouchableOpacity style={styles.okOutlineButton} onPress={resetWeekSection}>
                <Text style={styles.okOutlineButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Total for Month</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.flexOne}
              activeOpacity={0.8}
              onPress={() => openPicker(setShowMonthPicker)}>
              <TextInput
                label="Select Month"
                value={monthYear ? formatMonth(monthYear) : ''}
                mode="outlined"
                editable={false}
                pointerEvents="none"
                right={<TextInput.Icon icon="calendar-month-outline" />}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkButton} onPress={handleGetMonthTotal}>
              {loadingType === 'month' ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.checkButtonText}>CHECK</Text>
              )}
            </TouchableOpacity>
          </View>

          {monthResult ? (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>
                Total Amount: Rs. {monthResult.total_amount}
              </Text>
              <Text style={styles.resultSubText}>Year: {monthResult.year}</Text>
              <Text style={styles.resultSubText}>Month: {monthResult.month}</Text>

              {renderExpenses(monthResult.expenses)}

              <TouchableOpacity style={styles.okOutlineButton} onPress={resetMonthSection}>
                <Text style={styles.okOutlineButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Total for Range</Text>

          <View style={styles.doubleColumn}>
            <TouchableOpacity
              style={styles.doubleInput}
              activeOpacity={0.8}
              onPress={() => openPicker(setShowRangeStartPicker)}>
              <TextInput
                label="Start Date"
                value={rangeStartDate ? formatDate(rangeStartDate) : ''}
                mode="outlined"
                editable={false}
                pointerEvents="none"
                right={<TextInput.Icon icon="calendar-month-outline" />}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.doubleInput}
              activeOpacity={0.8}
              onPress={() => openPicker(setShowRangeEndPicker)}>
              <TextInput
                label="End Date"
                value={rangeEndDate ? formatDate(rangeEndDate) : ''}
                mode="outlined"
                editable={false}
                pointerEvents="none"
                right={<TextInput.Icon icon="calendar-month-outline" />}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkButtonFull} onPress={handleGetRangeTotal}>
              {loadingType === 'range' ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.checkButtonText}>CHECK</Text>
              )}
            </TouchableOpacity>
          </View>

          {rangeResult ? (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>
                Total Amount: Rs. {rangeResult.total_amount}
              </Text>
              <Text style={styles.resultSubText}>
                Start Date: {rangeResult.start_date}
              </Text>
              <Text style={styles.resultSubText}>
                End Date: {rangeResult.end_date}
              </Text>

              {renderExpenses(rangeResult.expenses)}

              <TouchableOpacity style={styles.okOutlineButton} onPress={resetRangeSection}>
                <Text style={styles.okOutlineButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </Card.Content>
      </Card>

      {showDatePicker ? (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          maximumDate={today}
          onChange={(event, selectedDate) => {
            if (Platform.OS === 'android') {
              setShowDatePicker(false);
            }

            if (selectedDate) {
              setDate(selectedDate);
              setDateResult(null);
            }
          }}
        />
      ) : null}

      {showWeekStartPicker ? (
        <DateTimePicker
          value={weekStartDate || new Date()}
          mode="date"
          display="default"
          maximumDate={today}
          onChange={(event, selectedDate) => {
            if (Platform.OS === 'android') {
              setShowWeekStartPicker(false);
            }

            if (selectedDate) {
              setWeekStartDate(selectedDate);
              setWeekResult(null);

              if (weekEndDate && selectedDate > weekEndDate) {
                setWeekEndDate(null);
              }
            }
          }}
        />
      ) : null}

      {showWeekEndPicker ? (
        <DateTimePicker
          value={weekEndDate || weekStartDate || new Date()}
          mode="date"
          display="default"
          minimumDate={weekStartDate || undefined}
          maximumDate={today}
          onChange={(event, selectedDate) => {
            if (Platform.OS === 'android') {
              setShowWeekEndPicker(false);
            }

            if (selectedDate) {
              setWeekEndDate(selectedDate);
              setWeekResult(null);
            }
          }}
        />
      ) : null}

      {showMonthPicker ? (
        <DateTimePicker
          value={monthYear || new Date()}
          mode="date"
          display="default"
          maximumDate={today}
          onChange={(event, selectedDate) => {
            if (Platform.OS === 'android') {
              setShowMonthPicker(false);
            }

            if (selectedDate) {
              setMonthYear(selectedDate);
              setMonthResult(null);
            }
          }}
        />
      ) : null}

      {showRangeStartPicker ? (
        <DateTimePicker
          value={rangeStartDate || new Date()}
          mode="date"
          display="default"
          maximumDate={today}
          onChange={(event, selectedDate) => {
            if (Platform.OS === 'android') {
              setShowRangeStartPicker(false);
            }

            if (selectedDate) {
              setRangeStartDate(selectedDate);
              setRangeResult(null);

              if (rangeEndDate && selectedDate > rangeEndDate) {
                setRangeEndDate(null);
              }
            }
          }}
        />
      ) : null}

      {showRangeEndPicker ? (
        <DateTimePicker
          value={rangeEndDate || rangeStartDate || new Date()}
          mode="date"
          display="default"
          minimumDate={rangeStartDate || undefined}
          maximumDate={today}
          onChange={(event, selectedDate) => {
            if (Platform.OS === 'android') {
              setShowRangeEndPicker(false);
            }

            if (selectedDate) {
              setRangeEndDate(selectedDate);
              setRangeResult(null);
            }
          }}
        />
      ) : null}
    </ScrollView>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fbff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
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
    marginBottom: 18,
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
    marginBottom: 18,
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0b132b',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flexOne: {
    flex: 1,
  },
  doubleColumn: {
    gap: 12,
  },
  doubleInput: {
    width: '100%',
  },
  checkButton: {
    backgroundColor: '#00a6fb',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 86,
  },
  checkButtonFull: {
    backgroundColor: '#00a6fb',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  checkButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  resultBox: {
    marginTop: 18,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0b132b',
    marginBottom: 8,
  },
  resultSubText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  expenseItem: {
    marginTop: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f8fbff',
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0b132b',
    marginBottom: 6,
  },
  expenseMeta: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  noDataText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6b7280',
  },
  okOutlineButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#6ec1ff',
    borderRadius: 12,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  okOutlineButtonText: {
    color: '#00a6fb',
    fontWeight: '700',
  },
});