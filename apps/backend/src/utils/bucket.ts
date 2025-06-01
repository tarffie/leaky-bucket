import type { BucketState } from '../types/BucketState';

const createBucket = (
  rate: number,
  maxSize: number,
  initialTokens?: number,
  lastRefill?: number,
): BucketState => ({
  rate,
  maxSize,
  currentTokens: initialTokens ?? maxSize,
  lastRefill: lastRefill ?? Date.now(),
});

const refillBucket = (
  state: BucketState,
  now: number = Date.now(),
): BucketState => {
  const timeElapsed = (now - state.lastRefill) / 1000;
  const tokensToAdd = timeElapsed * state.rate;
  const newTokens = Math.min(state.currentTokens + tokensToAdd, state.maxSize);

  return {
    ...state,
    currentTokens: newTokens,
    lastRefill: newTokens > state.currentTokens ? Date.now() : state.lastRefill,
  };
};

const tryConsume = (
  state: BucketState,
  tokens: number,
): [BucketState, boolean] => {
  if (tokens <= 0) return [state, false];

  const updatedState = refillBucket(state);
  if (updatedState.currentTokens >= tokens) {
    return [
      { ...updatedState, currentTokens: updatedState.currentTokens - tokens },
      true,
    ];
  }
  return [updatedState, false];
};

const consumeOrWait = (
  state: BucketState,
  tokens: number,
): [BucketState, number | true] => {
  const [updatedState, success] = tryConsume(state, tokens);
  if (success) return [updatedState, true];

  const tokensNeeded = tokens - updatedState.currentTokens;
  const waitTime = Math.ceil((tokensNeeded / updatedState.rate) * 1000);
  return [updatedState, waitTime];
};

const getCurrentTokens = (state: BucketState): number => {
  return refillBucket(state).currentTokens;
};

export { createBucket, refillBucket, consumeOrWait, getCurrentTokens };
