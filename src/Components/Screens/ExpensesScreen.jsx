import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Card, ActivityIndicator, Portal, Dialog} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ExpensesScreen = ({navigation}) => {
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [error, setError] = useState('');

  const [openSlipExpenseId, setOpenSlipExpenseId] = useState(null);
  const [expenseSlips, setExpenseSlips] = useState({});
  const [slipLoadingId, setSlipLoadingId] = useState(null);
  const [slipDeleteLoadingId, setSlipDeleteLoadingId] = useState(null);

  const [showDeleteExpenseDialog, setShowDeleteExpenseDialog] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  const [showDeleteSlipDialog, setShowDeleteSlipDialog] = useState(false);
  const [selectedSlipId, setSelectedSlipId] = useState(null);
  const [selectedSlipExpenseId, setSelectedSlipExpenseId] = useState(null);

  useEffect(() => {
    fetchExpenses(page);
  }, [page]);

  const fetchExpenses = async currentPage => {
    try {
      setLoading(true);
      setError('');

      const token = await AsyncStorage.getItem('token');

      if (!token) {
        navigation.replace('LoginScreen');
        return;
      }

      const response = await axios.get(
        `https://expense-tracker-backend-o3ow.onrender.com/expenses?page=${currentPage}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setExpenses(response.data.expenses || []);
      setPagination(response.data.pagination || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpensePress = id => {
    setSelectedExpenseId(id);
    setShowDeleteExpenseDialog(true);
  };

  const handleConfirmDeleteExpense = async () => {
    try {
      setDeleteLoadingId(selectedExpenseId);
      setShowDeleteExpenseDialog(false);

      const token = await AsyncStorage.getItem('token');

      await axios.delete(
        `https://expense-tracker-backend-o3ow.onrender.com/expenses/${selectedExpenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchExpenses(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete expense');
    } finally {
      setDeleteLoadingId(null);
      setSelectedExpenseId(null);
    }
  };

  const fetchSlipsByExpense = async expenseId => {
    try {
      setSlipLoadingId(expenseId);
      setError('');

      const token = await AsyncStorage.getItem('token');

      const response = await axios.get(
        `https://expense-tracker-backend-o3ow.onrender.com/expense-slips/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setExpenseSlips(prev => ({
        ...prev,
        [expenseId]: response.data.slips || [],
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load slips');
    } finally {
      setSlipLoadingId(null);
    }
  };

  const handleToggleSlipSection = async expenseId => {
    if (openSlipExpenseId === expenseId) {
      setOpenSlipExpenseId(null);
      return;
    }

    setOpenSlipExpenseId(expenseId);
    await fetchSlipsByExpense(expenseId);
  };

  const handleDeleteSlipPress = (expenseId, slipId) => {
    setSelectedSlipExpenseId(expenseId);
    setSelectedSlipId(slipId);
    setShowDeleteSlipDialog(true);
  };

  const handleConfirmDeleteSlip = async () => {
    try {
      setSlipDeleteLoadingId(selectedSlipId);
      setShowDeleteSlipDialog(false);

      const token = await AsyncStorage.getItem('token');

      await axios.delete(
        `https://expense-tracker-backend-o3ow.onrender.com/expense-slips/slip/${selectedSlipId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchSlipsByExpense(selectedSlipExpenseId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete slip');
    } finally {
      setSlipDeleteLoadingId(null);
      setSelectedSlipId(null);
      setSelectedSlipExpenseId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" color="#00a6fb" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <View style={{flex: 1}}>
          <Text style={styles.pageTitle}>All Expenses</Text>
          <Text style={styles.pageSubtitle}>
            View, update, delete, and manage your expense slips
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddExpenseTab')}>
          <Text style={styles.addButtonText}>+ ADD EXPENSE</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {expenses.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text style={styles.emptyTitle}>No expenses found</Text>
            <Text style={styles.emptySubTitle}>
              Start by adding your first expense
            </Text>
          </Card.Content>
        </Card>
      ) : (
        <>
          {expenses.map(expense => {
            const slips = expenseSlips[expense.id] || [];

            return (
              <Card key={expense.id} style={styles.expenseCard}>
                <Card.Content>
                  <View style={styles.expenseTopRow}>
                    <View style={styles.expenseInfo}>
                      <Text style={styles.expenseTitle}>{expense.title}</Text>
                      <Text style={styles.expenseMeta}>
                        Amount: Rs. {expense.amount}
                      </Text>
                      <Text style={styles.expenseMeta}>
                        Date: {expense.expense_date}
                      </Text>
                      <Text style={styles.expenseMeta}>
                        Note: {expense.note || '-'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.updateButton}
                      onPress={() =>
                        navigation.navigate('EditExpenseScreen', {
                          expenseId: expense.id,
                        })
                      }>
                      <Text style={styles.updateButtonText}>UPDATE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      disabled={deleteLoadingId === expense.id}
                      onPress={() => handleDeleteExpensePress(expense.id)}>
                      <Text style={styles.deleteButtonText}>
                        {deleteLoadingId === expense.id ? 'DELETING...' : 'DELETE'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.slipButton}
                      disabled={slipLoadingId === expense.id}
                      onPress={() => handleToggleSlipSection(expense.id)}>
                      <Text style={styles.slipButtonText}>
                        {openSlipExpenseId === expense.id ? 'CLOSE SLIP' : 'SLIP'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {openSlipExpenseId === expense.id ? (
                    <View style={styles.slipSection}>
                      <Text style={styles.slipSectionTitle}>Expense Slips</Text>

                      {slipLoadingId === expense.id ? (
                        <ActivityIndicator animating={true} color="#00a6fb" />
                      ) : slips.length > 0 ? (
                        slips.map(slip => (
                          <View key={slip.id} style={styles.slipCard}>
                            <Image
                              source={{uri: slip.file_url}}
                              style={styles.slipImage}
                              resizeMode="cover"
                            />

                            <Text style={styles.slipMeta}>
                              Uploaded At:{' '}
                              {new Date(slip.uploaded_at).toLocaleString()}
                            </Text>

                            <TouchableOpacity
                              style={styles.deleteSlipButton}
                              disabled={slipDeleteLoadingId === slip.id}
                              onPress={() =>
                                handleDeleteSlipPress(expense.id, slip.id)
                              }>
                              <Text style={styles.deleteSlipButtonText}>
                                {slipDeleteLoadingId === slip.id
                                  ? 'DELETING...'
                                  : 'DELETE SLIP'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.noSlipText}>
                          No slips uploaded for this expense
                        </Text>
                      )}
                    </View>
                  ) : null}
                </Card.Content>
              </Card>
            );
          })}

          <View style={styles.paginationRow}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                page === 1 && styles.paginationButtonDisabled,
              ]}
              disabled={page === 1}
              onPress={() => setPage(prev => prev - 1)}>
              <Text style={styles.paginationButtonText}>Previous</Text>
            </TouchableOpacity>

            <Text style={styles.pageText}>
              Page {pagination?.current_page || page} of{' '}
              {pagination?.total_pages || 1}
            </Text>

            <TouchableOpacity
              style={[
                styles.paginationButton,
                page === pagination?.total_pages &&
                  styles.paginationButtonDisabled,
              ]}
              disabled={page === pagination?.total_pages}
              onPress={() => setPage(prev => prev + 1)}>
              <Text style={styles.paginationButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Portal>
        <Dialog
          visible={showDeleteExpenseDialog}
          onDismiss={() => setShowDeleteExpenseDialog(false)}
          style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Delete Expense</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogMessage}>
              Are you sure you want to delete this expense?
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowDeleteExpenseDialog(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmDeleteButton}
              onPress={handleConfirmDeleteExpense}>
              <Text style={styles.confirmDeleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog
          visible={showDeleteSlipDialog}
          onDismiss={() => setShowDeleteSlipDialog(false)}
          style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Delete Slip</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogMessage}>
              Are you sure you want to delete this slip?
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowDeleteSlipDialog(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmDeleteButton}
              onPress={handleConfirmDeleteSlip}>
              <Text style={styles.confirmDeleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

export default ExpensesScreen;

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
  addButton: {
    backgroundColor: '#00a6fb',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
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
  emptyCard: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0b132b',
  },
  emptySubTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 6,
  },
  expenseCard: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  expenseTopRow: {
    marginBottom: 14,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0b132b',
    marginBottom: 8,
  },
  expenseMeta: {
    fontSize: 14,
    color: '#374151',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  updateButton: {
    borderWidth: 1,
    borderColor: '#6ec1ff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  updateButtonText: {
    color: '#00a6fb',
    fontSize: 13,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#e53935',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  slipButton: {
    backgroundColor: '#0b132b',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  slipButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  slipSection: {
    marginTop: 18,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#f8fbff',
    borderWidth: 1,
    borderColor: '#dbe7f3',
  },
  slipSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0b132b',
    marginBottom: 14,
  },
  slipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  slipImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },
  slipMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 10,
  },
  deleteSlipButton: {
    backgroundColor: '#e53935',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteSlipButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  noSlipText: {
    fontSize: 14,
    color: '#6b7280',
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  paginationButton: {
    backgroundColor: '#00a6fb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  pageText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#0b132b',
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
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 14,
  },
  confirmDeleteButton: {
    backgroundColor: '#e53935',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  confirmDeleteButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});