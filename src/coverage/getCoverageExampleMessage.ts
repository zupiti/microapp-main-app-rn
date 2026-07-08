export type CoverageExampleStatus = 'ready' | 'blocked';

export function getCoverageExampleMessage(status: CoverageExampleStatus): string {
  if (status === 'ready') {
    return 'Coverage example is ready';
  }
  return 'Coverage example is blocked';
}
