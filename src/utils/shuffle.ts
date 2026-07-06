/** Fisher–Yates shuffle — returns a new array. */
export function shuffleArray<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Shuffle options for multiple-choice — never leaves correct answer always on top. */
export function shuffledMcOptions(options: readonly string[], correct: string): string[] {
  let shuffled = shuffleArray(options);
  // If shuffle left correct first (common with small pools), reshuffle once.
  if (shuffled.length > 1 && shuffled[0] === correct) {
    shuffled = shuffleArray(options);
  }
  return shuffled;
}
