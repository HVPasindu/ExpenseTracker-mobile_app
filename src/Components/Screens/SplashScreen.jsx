import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import BackgroundWrapper from '../Com_components/BackgroundWrapper';


const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../Assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Expense Tracker</Text>
        <Text style={styles.subtitle}>Track your spending simply and smartly</Text>

        <View style={styles.dotRow}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>

        <ActivityIndicator
          animating={true}
          size="small"
          color="#00a6fb"
          style={styles.loader}
        />

        <Text style={styles.loadingText}>Loading your finance space...</Text>
      </View>
    </BackgroundWrapper>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 26,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  logo: {
    width: 82,
    height: 82,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0b132b',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5f6f81',
    textAlign: 'center',
    marginBottom: 28,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#c7ddeb',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#00a6fb',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  loader: {
    marginBottom: 14,
  },
  loadingText: {
    fontSize: 14,
    color: '#708090',
    textAlign: 'center',
  },
});