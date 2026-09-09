/**
 * SM-2 Spaced Repetition Algorithm Implementation
 * 
 * Rating mapping:
 * - 'again' (Grade 1): Failed card. Reset repetitions to 0, interval to 1 day.
 * - 'hard'  (Grade 2): Hard recall. Small interval step, lower Ease Factor.
 * - 'good'  (Grade 4): Standard recall. Standard interval multiplier, EF unchanged.
 * - 'easy'  (Grade 5): Easy recall. Larger interval multiplier, higher Ease Factor.
 */

export const RATING_GRADES = {
  again: 1,
  hard: 2,
  good: 4,
  easy: 5,
};

/**
 * Calculates the next review date and parameters for a flashcard.
 * 
 * @param {Object} card Current card SM-2 state
 * @param {number} card.easeFactor Current Ease Factor (default 2.5)
 * @param {number} card.interval Current interval in days
 * @param {number} card.repetitions Consecutive successful reviews
 * @param {string} rating 'again' | 'hard' | 'good' | 'easy'
 * @returns {Object} Updated card parameters
 */
export function calculateSM2(card = {}, rating) {
  const currentEF = typeof card.easeFactor === 'number' ? card.easeFactor : 2.5;
  const currentInterval = typeof card.interval === 'number' ? card.interval : 0;
  const currentReps = typeof card.repetitions === 'number' ? card.repetitions : 0;

  const grade = RATING_GRADES[rating] !== undefined ? RATING_GRADES[rating] : 4;

  let newEF = currentEF;
  let newInterval = 1;
  let newReps = 0;
  let newState = 'review';

  if (grade < 3) {
    // Failed recall ('again' / hard failure)
    newReps = 0;
    newInterval = 1;
    newState = 'relearning';
    // Reduce Ease Factor
    newEF = Math.max(1.3, currentEF - 0.2);
  } else {
    // Successful recall ('hard', 'good', 'easy')
    newReps = currentReps + 1;
    newState = 'review';

    if (newReps === 1) {
      newInterval = 1;
    } else if (newReps === 2) {
      newInterval = 6;
    } else {
      if (rating === 'hard') {
        newInterval = Math.max(1, Math.round(currentInterval * 1.2));
      } else if (rating === 'easy') {
        newInterval = Math.max(1, Math.round(currentInterval * currentEF * 1.3));
      } else {
        // 'good'
        newInterval = Math.max(1, Math.round(currentInterval * currentEF));
      }
    }

    // Update Ease Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    newEF = currentEF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (newEF < 1.3) newEF = 1.3;
  }

  // Calculate next review date formatted as YYYY-MM-DD
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);
  const nextReviewDate = nextDate.toISOString().split('T')[0];

  return {
    easeFactor: Number(newEF.toFixed(2)),
    interval: newInterval,
    repetitions: newReps,
    nextReviewDate,
    state: newState,
    lastReviewedAt: Date.now(),
  };
}

/**
 * Categorize cards by due status
 */
export function getCardDueStatus(card) {
  if (!card) return 'new';
  if (!card.lastReviewedAt || card.repetitions === 0) return 'new';

  const todayStr = new Date().toISOString().split('T')[0];
  if (card.nextReviewDate <= todayStr) {
    if (card.state === 'relearning' || card.repetitions < 3) return 'learning';
    return 'due';
  }

  if (card.repetitions >= 5 && card.interval >= 21) return 'mature';
  return 'learning';
}
