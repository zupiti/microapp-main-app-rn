import type {RootStackParamList} from './navigation/types';

export type MicroappEntry = {
  id: string;
  title: string;
  route: keyof Pick<RootStackParamList, 'Microapp1' | 'Microapp2' | 'Microapp3'>;
};

export const microapps: MicroappEntry[] = [
  {id: 'microapp1', title: 'Microapp 1', route: 'Microapp1'},
  {id: 'microapp2', title: 'Microapp 2', route: 'Microapp2'},
  {id: 'microapp3', title: 'Microapp 3', route: 'Microapp3'},
];
