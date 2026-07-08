import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {Microapp3Screen} from 'microapp3-rn';

export function Microapp3Route(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Microapp3Screen />
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
