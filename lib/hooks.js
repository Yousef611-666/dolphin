"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Hook to manage localStorage-persisted state
 * Automatically saves to localStorage on change
 * Hydrates from localStorage on mount
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === "undefined") {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * Hook for diary entries
 */
export function useDiaryEntries() {
  return useLocalStorage("diary_entries", []);
}

/**
 * Hook for academics (semesters and courses)
 */
export function useAcademics() {
  return useLocalStorage("academics_data", []);
}

/**
 * Hook for projects
 */
export function useProjects() {
  return useLocalStorage("projects_data", []);
}

/**
 * Hook for applications/stories
 */
export function useStories() {
  return useLocalStorage("stories_data", []);
}

/**
 * Generate a unique ID for new entries
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Format date for display
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get days ago for relative time display
 */
export function getDaysAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

/**
 * Mood emoji and label mapping
 */
export const moodEmoji = {
  1: "😢",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😄",
};

export const moodLabel = {
  1: "Very Bad",
  2: "Bad",
  3: "Okay",
  4: "Good",
  5: "Great",
};

/**
 * Extract text snippet for previews
 */
export function extractTextSnippet(text, length = 80) {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
}

/**
 * Clear all localStorage data
 */
export function clearAllData() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("diary_entries");
    window.localStorage.removeItem("academics_data");
    window.localStorage.removeItem("projects_data");
    window.localStorage.removeItem("stories_data");
  }
}
