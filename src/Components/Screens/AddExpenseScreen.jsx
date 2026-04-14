import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const AddExpenseScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add Expense Screen</Text>
    </View>
  );
};

export default AddExpenseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fbff',
  },
  text: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0b132b',
  },
});