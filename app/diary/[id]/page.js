"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import { useDiaryEntries, moodEmoji, moodLabel, formatDate, getDaysAgo } from "@/lib/hooks";
import { useToast, ToastContainer, DeleteConfirmModal } from "@/components/UI";

export default function DiaryDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const router = useRouter();
  const [entries, setEntries] = useDiaryEntries();
  const { toasts, showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const entry = useMemo(() => entries.find((e) => e.id === id), [entries, id]);

  const [formData, setFormData] = useState({
    date: entry?.date || "",
    title: entry?.title || "",
    tags: entry?.tags?.join(", ") || "",
    mood: entry?.mood || 3,
    whatHappened: entry?.whatHappened || "",
    whatIFelt: entry?.whatIFelt || "",
    whatILearned: entry?.whatILearned || "",
    question: entry?.question || "",
    smallWin: entry?.smallWin || "",
  });

  if (!entry) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Entry not found</p>
        <Link href="/diary" className="btn btn-primary">
          Back to Diary
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "whatHappened") {
      const words = value.trim() ? value.trim().split(/\s+/).length : 0;
      setWordCount(words);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast("Please enter a title", "error");
      return;
    }

    const updatedEntry = {
      ...entry,
      date: formData.date,
      title: formData.title,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      mood: parseInt(formData.mood),
      whatHappened: formData.whatHappened,
      whatIFelt: formData.whatIFelt,
      whatILearned: formData.whatILearned,
      question: formData.question,
      smallWin: formData.smallWin,
    };

    const updatedEntries = entries.map((e) => (e.id === id ? updatedEntry : e));
    setEntries(updatedEntries);
    showToast("Entry updated successfully!");
    setIsEditing(false);
  };

  const handleDelete = () => {
    const filteredEntries = entries.filter((e) => e.id !== id);
    setEntries(filteredEntries);
    showToast("Entry deleted");
    router.push("/diary");
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-6">
        <Link href="/diary" className="text-purple-600 dark:text-purple-400 hover:underline text-sm">
          ← Back to Diary
        </Link>
      </div>

      {!isEditing ? (
        // View Mode
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{entry.title}</h1>
              <p className="text-gray-500 dark:text-gray-400">
                {formatDate(entry.date)} • {getDaysAgo(entry.date)} • {moodEmoji[entry.mood]} {moodLabel[entry.mood]}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(true)} className="btn btn-sm btn-outline">
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-sm btn-outline btn-error"
              >
                Delete
              </button>
            </div>
          </div>

          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span key={tag} className="badge badge-lg badge-outline">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content Sections */}
          {entry.whatHappened && (
            <div className="card bg-white dark:bg-slate-800 shadow">
              <div className="card-body">
                <h2 className="card-title text-gray-900 dark:text-white">What Happened?</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {entry.whatHappened}
                </p>
              </div>
            </div>
          )}

          {entry.whatIFelt && (
            <div className="card bg-white dark:bg-slate-800 shadow">
              <div className="card-body">
                <h2 className="card-title text-gray-900 dark:text-white">What Did I Feel?</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {entry.whatIFelt}
                </p>
              </div>
            </div>
          )}

          {entry.whatILearned && (
            <div className="card bg-white dark:bg-slate-800 shadow">
              <div className="card-body">
                <h2 className="card-title text-gray-900 dark:text-white">What Did I Learn?</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {entry.whatILearned}
                </p>
              </div>
            </div>
          )}

          {entry.question && (
            <div className="card bg-white dark:bg-slate-800 shadow">
              <div className="card-body">
                <h2 className="card-title text-gray-900 dark:text-white">A Question I&apos;m Asking</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {entry.question}
                </p>
              </div>
            </div>
          )}

          {entry.smallWin && (
            <div className="card bg-purple-50 dark:bg-purple-900 shadow border-l-4 border-purple-600">
              <div className="card-body">
                <h2 className="card-title text-gray-900 dark:text-white">🎉 Small Win</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {entry.smallWin}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSave} className="space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Entry</h1>
          </div>

          {/* Date */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                Date <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
              required
            />
          </div>

          {/* Title */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                Title <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="E.g., First day at new job"
              className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
              required
            />
          </div>

          {/* Mood */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium text-gray-700 dark:text-gray-300">Mood</span>
            </label>
            <select
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              className="select select-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
            >
              <option value="1">😢 Very Bad</option>
              <option value="2">😕 Bad</option>
              <option value="3">😐 Okay</option>
              <option value="4">🙂 Good</option>
              <option value="5">😄 Great</option>
            </select>
          </div>

          {/* Tags */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium text-gray-700 dark:text-gray-300">Tags</span>
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="E.g., work, learning, personal (comma-separated)"
              className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
            />
          </div>

          {/* What Happened */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium text-gray-700 dark:text-gray-300">What Happened?</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{wordCount} words</span>
            </label>
            <textarea
              name="whatHappened"
              value={formData.whatHappened}
              onChange={handleChange}
              placeholder="Describe the events of your day..."
              rows="4"
              className="textarea textarea-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
            />
          </div>

          {/* What I Felt */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium text-gray-700 dark:text-gray-300">What Did I Feel?</span>
            </label>
            <textarea
              name="whatIFelt"
              value={formData.whatIFelt}
              onChange={handleChange}
              placeholder="Describe your emotions and feelings..."
              rows="3"
              className="textarea textarea-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
            />
          </div>

          {/* What I Learned */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium text-gray-700 dark:text-gray-300">What Did I Learn?</span>
            </label>
            <textarea
              name="whatILearned"
              value={formData.whatILearned}
              onChange={handleChange}
              placeholder="What insights or lessons did you gain?"
              rows="3"
              className="textarea textarea-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
            />
          </div>

          {/* Question */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium text-gray-700 dark:text-gray-300">A Question I&apos;m Asking</span>
            </label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="What are you pondering? What do you need to figure out?"
              rows="2"
              className="textarea textarea-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
            />
          </div>

          {/* Small Win */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium text-gray-700 dark:text-gray-300">Small Win 🎉</span>
            </label>
            <textarea
              name="smallWin"
              value={formData.smallWin}
              onChange={handleChange}
              placeholder="What went well today? Celebrate a small victory..."
              rows="2"
              className="textarea textarea-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-ghost flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              Save Changes
            </button>
          </div>
        </form>
      )}

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Entry?"
        message={`Are you sure you want to delete "${entry.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
}
