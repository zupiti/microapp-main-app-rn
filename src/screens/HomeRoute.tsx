import React from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppBar, PrimaryButton} from 'shared-rn';
import {microapps} from '../microapps';
import type {RootStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

/**
 * The main app owns no business logic: it only instantiates the navigator
 * and links to each microapp screen, which is fully implemented inside its
 * own package.
 */
export function HomeRoute({navigation}: Props): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <AppBar
        title="microapp-main-app-rn"
        subtitle="Main app consuming N microapps (each with N microfronts)"
      />
      <ScrollView contentContainerStyle={styles.content}>
        {microapps.map(microapp => (
          <View key={microapp.id} style={styles.buttonSlot}>
            <PrimaryButton
              label={`Abrir ${microapp.title}`}
              onPress={() => navigation.navigate(microapp.route)}
            />
          </View>
        ))}
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
    padding: 16,
  },
  buttonSlot: {
    marginBottom: 12,
  },
});
