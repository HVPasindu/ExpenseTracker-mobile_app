import React from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const BackgroundWrapper = ({children}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7fbff" />
      <View style={styles.container}>
        <View style={styles.topCircle} />
        <View style={styles.middleCircle} />
        <View style={styles.bottomCircle} />
        <View style={styles.darkAccent} />
        <View style={styles.overlay} />
        {children}
      </View>
    </SafeAreaView>
  );
};

export default BackgroundWrapper;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7fbff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7fbff',
    position: 'relative',
    overflow: 'hidden',
  },
  topCircle: {
    position: 'absolute',
    top: -90,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(0, 166, 251, 0.14)',
  },
  middleCircle: {
    position: 'absolute',
    top: '28%',
    left: -70,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(0, 166, 251, 0.10)',
  },
  bottomCircle: {
    position: 'absolute',
    bottom: -100,
    left: 20,
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: 'rgba(0, 166, 251, 0.12)',
  },
  darkAccent: {
    position: 'absolute',
    bottom: -40,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(11, 19, 43, 0.05)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
});