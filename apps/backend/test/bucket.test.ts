import { createBucket, refillBucket, consumeOrWait } from '../src/utils/bucket';

describe('Functional Token Bucket', () => {
  const fixedTime = 1625097600000; // Fixed timestamp for testing

  test('refills tokens correctly', () => {
    const state = createBucket(10, 100, 0, fixedTime);
    const newState = refillBucket(state, fixedTime + 1000); // +1 sec
    expect(newState.currentTokens).toBe(10);
  });

  test('consumes with state updates', () => {
    const initialState = createBucket(10, 100, 50, fixedTime);
    const [newState, result] = consumeOrWait(initialState, 30);

    expect(result).toBe(true);
    expect(newState.currentTokens).toBe(20);
  });

  test('returns wait time when insufficient', () => {
    const state = createBucket(10, 100, 5, fixedTime);
    const [_, result] = consumeOrWait(state, 10);

    expect(result).not.toBe(true);
    expect(typeof result).toBe('number');
    expect(result).toBe(500); // 5 missing tokens / 10 tokens/sec = 0.5s = 500ms
  });
});
