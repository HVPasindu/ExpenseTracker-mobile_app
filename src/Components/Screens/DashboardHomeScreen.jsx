import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Card, ActivityIndicator, Avatar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {PieChart} from 'react-native-gifted-charts';
import {useFocusEffect} from '@react-navigation/native';

const DashboardHomeScreen = ({navigation}) => {
  const [summary, setSummary] = useState(null);
  const [userName, setUserName] = useState('User');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
  useCallback(() => {
    fetchDashboardSummary();
  }, []),
);

  const fetchDashboardSummary = async () => {
    try {
      setLoading(true);
      setError('');

      const token = await AsyncStorage.getItem('token');
      const savedUserName = await AsyncStorage.getItem('userName');

      if (savedUserName) {
        setUserName(savedUserName);
      }

      if (!token) {
        navigation.replace('LoginScreen');
        return;
      }

      const response = await axios.get(
        'https://expense-tracker-backend-o3ow.onrender.com/expenses/dashboard-summary',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSummary(response.data.summary);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const pieData =
    summary?.latest_expenses?.map((expense, index) => {
      const colors = ['#00a6fb', '#38bdf8', '#7dd3fc', '#0284c7', '#0ea5e9'];

      return {
        value: Number(expense.amount),
        color: colors[index % colors.length],
        text: expense.title,
      };
    }) || [];

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userName');
    navigation.replace('LoginScreen');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" color="#00a6fb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.smallTitle}>Welcome back</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        <Avatar.Text
          size={46}
          label={userName?.charAt(0)?.toUpperCase() || 'U'}
          style={styles.avatar}
          color="#ffffff"
        />
      </View>

      <View style={styles.summaryGrid}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.cardLabel}>Total Expenses</Text>
            <Text style={styles.cardValue}>{summary?.total_expenses || 0}</Text>
            <Text style={styles.cardSubText}>Total added expenses</Text>
          </Card.Content>
        </Card>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.cardLabel}>Today Total</Text>
            <Text style={styles.cardValue}>Rs. {summary?.today_total || 0}</Text>
            <Text style={styles.cardSubText}>Today expense amount</Text>
          </Card.Content>
        </Card>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.cardLabel}>Monthly Total</Text>
            <Text style={styles.cardValue}>
              Rs. {summary?.monthly_total || 0}
            </Text>
            <Text style={styles.cardSubText}>This month expense amount</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Recent Expense Overview</Text>
          <Text style={styles.sectionSubTitle}>
            Pie chart of your latest expenses
          </Text>

          <View style={styles.chartWrapper}>
            {pieData.length > 0 ? (
              <PieChart
                data={pieData}
                donut
                radius={110}
                innerRadius={55}
                textColor="black"
                showText={false}
                centerLabelComponent={() => (
                  <View style={{alignItems: 'center'}}>
                    <Text style={styles.centerChartText}>Last</Text>
                    <Text style={styles.centerChartBold}>5</Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.emptyText}>No recent expenses found.</Text>
            )}
          </View>

          <View style={styles.legendWrapper}>
            {summary?.latest_expenses?.map((expense, index) => {
              const colors = ['#00a6fb', '#38bdf8', '#7dd3fc', '#0284c7', '#0ea5e9'];

              return (
                <View key={expense.id} style={styles.legendRow}>
                  <View
                    style={[
                      styles.legendColor,
                      {backgroundColor: colors[index % colors.length]},
                    ]}
                  />
                  <Text style={styles.legendText}>
                    {expense.title} - Rs. {expense.amount}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.recentCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Recent Expense Details</Text>

          {summary?.latest_expenses?.length > 0 ? (
            summary.latest_expenses.map(expense => (
              <View key={expense.id} style={styles.expenseItem}>
                <Text style={styles.expenseTitle}>{expense.title}</Text>
                <Text style={styles.expenseMeta}>Date: {expense.expense_date}</Text>
                <Text style={styles.expenseMeta}>Amount: Rs. {expense.amount}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent expenses found.</Text>
          )}
        </Card.Content>
      </Card>

      <TouchableOpacity
        style={styles.logoutButton}
        activeOpacity={0.8}
        onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>LOGOUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DashboardHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fbff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fbff',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 15,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  smallTitle: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0b132b',
    width: 260,
  },
  avatar: {
    backgroundColor: '#00a6fb',
  },
  summaryGrid: {
    gap: 14,
    marginBottom: 18,
  },
  summaryCard: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  cardLabel: {
    fontSize: 15,
    color: '#5f6f81',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0b132b',
  },
  cardSubText: {
    fontSize: 13,
    color: '#7b8794',
    marginTop: 6,
  },
  chartCard: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0b132b',
    marginBottom: 6,
  },
  sectionSubTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 18,
  },
  chartWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  centerChartText: {
    fontSize: 13,
    color: '#6b7280',
  },
  centerChartBold: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0b132b',
  },
  legendWrapper: {
    marginTop: 8,
    gap: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
  },
  recentCard: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginBottom: 18,
  },
  expenseItem: {
    backgroundColor: '#f8fbff',
    borderWidth: 1,
    borderColor: '#e6eef5',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0b132b',
    marginBottom: 4,
  },
  expenseMeta: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutButton: {
    backgroundColor: '#00a6fb',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});