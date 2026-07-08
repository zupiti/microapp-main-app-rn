import {
  getCoverageExampleMessage,
  type CoverageExampleStatus,
} from '../src/coverage/getCoverageExampleMessage';

describe('getCoverageExampleMessage', () => {
  it('returns the ready message', () => {
    const status: CoverageExampleStatus = 'ready';
    const message: string = getCoverageExampleMessage(status);
    expect(message).toBe('Coverage example is ready');
  });
  it('returns the blocked message', () => {
    const status: CoverageExampleStatus = 'blocked';
    const message: string = getCoverageExampleMessage(status);
    expect(message).toBe('Coverage example is blocked');
  });
});
