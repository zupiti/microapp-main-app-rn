import React, {useEffect} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoadingScreen} from 'shared-rn';
import type {RootStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Loading'>;

const BOOT_DELAY_MS = 900;

export function LoadingRoute({navigation}: Props): React.JSX.Element {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, BOOT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [navigation]);

  return <LoadingScreen label="Carregando microapp-main-app-rn…" />;
}
