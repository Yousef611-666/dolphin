"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDiaryEntries, generateId } from "@/lib/hooks";
import { useToast, ToastContainer } from "@/components/UI";

export default function NewDiaryPage() {
  const router = useRouter();
  const [entries, setEntries] = useDiaryEntries();
  const { toasts, showToast } = useToast();
  const [wordCount, setWordCount] = useState(0);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    title: "",
    tags: "",
    mood: 3,
    whatHappened: "",
    whatIFelt: "",
    whatILearned: "",
    question: "",
    smallWin: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Calculate word count for whatHappened
    if (name === "whatHappened") {
      const words = value.trim() ? value.trim().split(/\s+/).length : 0;
      setWordCount(words);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast("Please enter a title", "error");
      return;
    }

    const newEntry = {
      id: generateId(),
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
      createdAt: new Date().toISOString(),
    };

    setEntries([...entries, newEntry]);
    showToast("Entry created successfully!");
    router.push("/diary");
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="mb-6">
        <Link href="/diary" className="text-purple-600 dark:text-purple-400 hover:underline text-sm">
          ← Back to Diary
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-4">New Reflection</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          <Link href="/diary" className="btn btn-ghost flex-1">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary flex-1">
            Save Entry
          </button>
        </div>
      </form>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
