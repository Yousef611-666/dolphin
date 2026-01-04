"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useDiaryEntries, formatDate, getDaysAgo, moodEmoji, moodLabel, extractTextSnippet } from "@/lib/hooks";
import { EmptyState, useToast, ToastContainer, DeleteConfirmModal } from "@/components/UI";

export default function DiaryPage() {
  const [entries, setEntries] = useDiaryEntries();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const { toasts, showToast } = useToast();

  const allTags = useMemo(() => {
    const tags = new Set();
    entries.forEach((entry) => {
      if (entry.tags && Array.isArray(entry.tags)) {
        entry.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .filter((entry) => {
        const matchesSearch =
          entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (entry.whatHappened && entry.whatHappened.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesMood = !selectedMood || entry.mood.toString() === selectedMood;
        const matchesTag = !selectedTag || (entry.tags && entry.tags.includes(selectedTag));
        return matchesSearch && matchesMood && matchesTag;
      });
  }, [entries, searchTerm, selectedMood, selectedTag]);

  const handleDelete = (id) => {
    setEntries(entries.filter((e) => e.id !== id));
    setDeleteId(null);
    showToast("Entry deleted successfully");
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Diary</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {filteredEntries.length} reflection{filteredEntries.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/diary/new" className="btn btn-primary">
          ✨ New Entry
        </Link>
      </div>

      {/* Filters */}
      {entries.length > 0 && (
        <div className="card p-6">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Filter Entries</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700 dark:text-gray-300">Search</span>
              </label>
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered input-sm text-gray-900 dark:text-white bg-white dark:bg-slate-700"
              />
            </div>

            {/* Mood Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700 dark:text-gray-300">Mood</span>
              </label>
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="select select-bordered select-sm text-gray-900 dark:text-white bg-white dark:bg-slate-700"
              >
                <option value="">All moods</option>
                {[1, 2, 3, 4, 5].map((m) => (
                  <option key={m} value={m}>
                    {moodEmoji[m]} {moodLabel[m]}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            {allTags.length > 0 && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700 dark:text-gray-300">Tag</span>
                </label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="select select-bordered select-sm text-gray-900 dark:text-white bg-white dark:bg-slate-700"
                >
                  <option value="">All tags</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Entries List or Empty State */}
      {filteredEntries.length === 0 && entries.length === 0 ? (
        <EmptyState
          icon="📔"
          title="No entries yet"
          description="Start your reflection journey by creating your first diary entry."
          action={
            <Link href="/diary/new" className="btn btn-primary">
              + Create Entry
            </Link>
          }
        />
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No entries match your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <Link
                  href={`/diary/${entry.id}`}
                  className="flex-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">{entry.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(entry.date)} • {getDaysAgo(entry.date)}
                  </p>
                  {entry.whatHappened && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {extractTextSnippet(entry.whatHappened, 100)}
                    </p>
                  )}
                </Link>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-lg">{moodEmoji[entry.mood]}</span>
                  {entry.tags && entry.tags.length > 0 && (
                    <span className="badge text-xs">{entry.tags[0]}</span>
                  )}
                  <Link href={`/diary/${entry.id}`} className="btn btn-outline btn-xs">
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteId(entry.id)}
                    className="btn btn-outline btn-xs btn-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Diary Entry"
        onConfirm={() => handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
