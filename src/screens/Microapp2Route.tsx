import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {Microapp2Screen} from 'microapp2-rn';

export function Microapp2Route(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Microapp2Screen />
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
