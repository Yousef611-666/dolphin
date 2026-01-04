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
  3: "Neutral",
  4: "Good",
  5: "Excellent",
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateLong = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const getDaysAgo = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const diff = today - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(dateString);
};

export const extractTextSnippet = (text, maxLength = 100) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
