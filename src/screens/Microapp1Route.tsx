import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {Microapp1Screen} from 'microapp1-rn';

export function Microapp1Route(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Microapp1Screen />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    paddingBottom: 24,
  },
});
