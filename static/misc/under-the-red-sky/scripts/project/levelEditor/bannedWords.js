// Banned Words List for Level Editor
// This file contains words that are not allowed in level text content
// You can modify this list to add or remove banned words

export const bannedWords = ["problem"];

// Function to check if text contains any banned words
export function containsBannedWord(text) {
  if (!text || typeof text !== "string") {
    return null;
  }

  const lowerText = text.toLowerCase();

  for (const word of bannedWords) {
    const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, "i");
    if (regex.test(lowerText)) {
      return word;
    }
  }

  return null;
}

// Function to get all banned words (for reference)
export function getBannedWords() {
  return [...bannedWords];
}
