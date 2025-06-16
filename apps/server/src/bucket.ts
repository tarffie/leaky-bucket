import { Mutex } from 'async-mutex';

class TokenError extends Error {}
class InvalidTokenError extends TokenError {}
class CriticalError extends TokenError {}

// Mutex to ensure thread-safe access to shared bucket state
const mutex = new Mutex();

/**
 * Represents the state of a token bucket for rate limiting.
 */
type BucketState = {
  refillInterval: number;
  capacity: number;
  tokens: number;
  lastRefill: number;
};

/**
 * Creates a new token bucket for rate limiting.
 * @param refillInterval - Interval in seconds at which tokens are added (tokens per second)
 * @param capacity - Maximum number of tokens the bucket can hold, supporting burst requests
 * @returns A new BucketState initialized with full tokens
 * @throws Error if refillInterval or capacity is not positive
 */
const createBucket = (
  refillInterval: number,
  capacity: number,
): BucketState => {
  // validate inputs to ensure positive values
  if (refillInterval <= 0)
    throw new CriticalError(
      'refillInterval must be a positive number greater than 0',
    );
  if (capacity <= 0)
    throw new CriticalError(
      'capacity must be a positive number greater than 0',
    );

  return {
    refillInterval: refillInterval,
    capacity: capacity,
    tokens: capacity,
    lastRefill: performance.now(), // Use monotonic clock for safety
  };
};

/**
 * Refills the token bucket based on elapsed time, mutating the state for performance.
 * @param state - Current bucket state
 * @param now - Current timestamp in milliseconds (defaults to performance.now())
 * @returns Updated bucket state with refilled tokens
 * @throws Error if state properties are invalid or if now is earlier than lastRefill
 * @remarks Mutates the input state for performance; ensure thread safety (e.g., via mutex)
 */

const refillBucket = (
  state: BucketState,
  now: number = performance.now(),
): BucketState => {
  if (now < state.lastRefill) {
    throw new CriticalError(
      "Invalid timestamp: 'now' cannot be earlier than lastRefill",
    );
  }

  if (
    typeof state.tokens !== 'number' ||
    typeof state.capacity !== 'number' ||
    typeof state.refillInterval !== 'number' ||
    typeof state.lastRefill !== 'number' ||
    isNaN(state.tokens) ||
    isNaN(state.capacity) ||
    isNaN(state.refillInterval) ||
    isNaN(state.lastRefill)
  ) {
    throw new CriticalError(
      'Invalid BucketState: All properties must be numbers.',
    );
  }

  if (state.tokens <= 0 || state.capacity <= 0 || state.refillInterval <= 0) {
    throw new TokenError(
      'Invalid BucketState: "tokens", "capacity" and "refillInterval" must non negative and higher than 0.',
    );
  }

  const timeElapsed = (now - state.lastRefill) / 1000;
  if (timeElapsed < 1 / state.refillInterval) return state;

  // Calculate tokens to add, rounding to avoid floating-point precision issues
  const tokensToAdd = Math.floor(timeElapsed * state.refillInterval);
  const newTokens = Math.min(state.tokens + tokensToAdd, state.capacity);

  const updatedState = {
    ...state,
    tokens: newTokens,
    lastRefill: newTokens > state.tokens ? now : state.lastRefill,
  };

  return updatedState;
};

/**
 * Attempts to consume tokens from the bucket, ensuring thread safety with a mutex.
 * @param state - Current bucket state
 * @param tokens - Number of tokens to consume
 * @returns Promise resolving to updated state and boolean indicating success
 * @throws TokenError if tokens is invalid or critical errors occur in refill
 * @remarks Returns [state, false] for invalid tokens (<= 0) for fault tolerance
 * @internal
 */

const tryConsume = async (
  state: BucketState,
  tokens: number,
): Promise<[BucketState, boolean]> => {
  const release = await mutex.acquire();
  try {
    if (typeof tokens !== 'number' || isNaN(tokens))
      throw new InvalidTokenError('tokens must be a valid number');

    if (tokens < 0) {
      throw new InvalidTokenError('tokens must be positive');
    }

    let updatedState = refillBucket(state); // this might throw

    const canConsume = updatedState.tokens >= tokens;

    if (canConsume) {
      updatedState = {
        ...updatedState,
        tokens: updatedState.tokens - tokens,
      };
    }

    return [updatedState, true];
  } catch (e) {
    const { message } = e as Error;
    if (message === 'tokens must be positive') {
      console.warn(`Warning in tryConsume: ${message}`);
      return [state, false]; // Fault-tolerant return
    }
    // Log and rethrow critical errors
    console.error('Error in tryConsume:', e);
    throw e;
  } finally {
    release();
  }
};

/**
 * Attempts to consume tokens or returns the wait time until enough tokens are available.
 * @param state - Current bucket state
 * @param tokens - Number of tokens to consume
 * @returns Promise resolving to updated state and either true (success) or wait time (ms)
 * @remarks Wait time is at least 1ms to prevent busy-waiting
 */
const consumeOrWait = async (
  state: BucketState,
  tokens: number,
): Promise<[BucketState, number | true]> => {
  const [updatedState, success] = await tryConsume(state, tokens);
  if (success) return [updatedState, true];

  const tokensNeeded = tokens - updatedState.tokens;

  const waitTime = Math.max(
    (tokensNeeded / updatedState.refillInterval) * 1000,
  );

  return [updatedState, waitTime];
};

/**
 * Returns the current number of tokens in the bucket after refilling.
 * @param state - Current bucket state
 * @returns Number of available tokens
 * @remarks Calls refillBucket, which might throw for invalid state
 */
const getCurrentTokens = (state: BucketState): number | undefined => {
  try {
    return refillBucket(state).tokens;
  } catch (error) {
    console.error('Error getting current tokens:', error);
    return undefined;
  }
};

export { createBucket, refillBucket, consumeOrWait, getCurrentTokens };
