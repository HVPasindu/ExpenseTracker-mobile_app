import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DashboardHomeScreen from '../Screens/DashboardHomeScreen';
import ExpensesScreen from '../Screens/ExpensesScreen';
import AddExpenseScreen from '../Screens/AddExpenseScreen';
import ReportsScreen from '../Screens/ReportsScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="DashboardTab"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: '#00a6fb',
        tabBarInactiveTintColor: '#7b8794',
        tabBarStyle: {
          height: 66,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          backgroundColor: '#ffffff',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({color, size}) => {
          let iconName = 'view-dashboard-outline';

          if (route.name === 'DashboardTab') {
            iconName = 'view-dashboard-outline';
          } else if (route.name === 'ExpensesTab') {
            iconName = 'clipboard-text-outline';
          } else if (route.name === 'AddExpenseTab') {
            iconName = 'plus-circle-outline';
          } else if (route.name === 'ReportsTab') {
            iconName = 'chart-pie';
          }

          return (
            <MaterialCommunityIcons
              name={iconName}
              size={size || 24}
              color={color}
            />
          );
        },
      })}>
      <Tab.Screen
        name="DashboardTab"
        component={DashboardHomeScreen}
        options={{tabBarLabel: 'Dashboard'}}
      />
      <Tab.Screen
        name="ExpensesTab"
        component={ExpensesScreen}
        options={{tabBarLabel: 'Expenses'}}
      />
      <Tab.Screen
        name="AddExpenseTab"
        component={AddExpenseScreen}
        options={{tabBarLabel: 'Add Expense'}}
      />
      <Tab.Screen
        name="ReportsTab"
        component={ReportsScreen}
        options={{tabBarLabel: 'Reports'}}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;