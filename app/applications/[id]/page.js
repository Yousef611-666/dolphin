"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import { useStories, formatDate } from "@/lib/hooks";
import { useToast, ToastContainer, DeleteConfirmModal } from "@/components/UI";

export default function StoryDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const router = useRouter();
  const [stories, setStories] = useStories();
  const { toasts, showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const story = useMemo(() => stories.find((s) => s.id === id), [stories, id]);

  const [formData, setFormData] = useState({
    title: story?.title || "",
    company: story?.company || "",
    role: story?.role || "",
    status: story?.status || "draft",
    date: story?.date || new Date().toISOString().split("T")[0],
    storyType: story?.storyType || "leadership",
    content: story?.content || "",
  });

  if (!story) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Story not found</p>
        <Link href="/applications" className="btn btn-primary">
          Back to Stories
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
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast("Please enter a title", "error");
      return;
    }

    const updatedStory = {
      ...story,
      title: formData.title,
      company: formData.company,
      role: formData.role,
      status: formData.status,
      date: formData.date,
      storyType: formData.storyType,
      content: formData.content,
    };

    const updatedStories = stories.map((s) => (s.id === id ? updatedStory : s));
    setStories(updatedStories);
    showToast("Story updated successfully!");
    setIsEditing(false);
  };

  const handleDelete = () => {
    const filteredStories = stories.filter((s) => s.id !== id);
    setStories(filteredStories);
    showToast("Story deleted");
    router.push("/applications");
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-6">
        <Link href="/applications" className="text-purple-600 dark:text-purple-400 hover:underline text-sm">
          ← Back to Stories
        </Link>
      </div>

      {!isEditing ? (
        // View Mode
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{story.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {story.company} • {story.role}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {formatDate(story.date)} • Type: {story.storyType}
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

          <div className="flex gap-2 items-center">
            <span className={`badge badge-lg ${
              story.status === "submitted"
                ? "badge-success"
                : story.status === "refined"
                ? "badge-info"
                : "badge-ghost"
            }`}>
              {story.status}
            </span>
          </div>

          {story.content && (
            <div className="card bg-white dark:bg-slate-800 shadow">
              <div className="card-body">
                <h2 className="card-title text-gray-900 dark:text-white">Story</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {story.content}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSave} className="space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Story</h1>
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
              className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
              required
            />
          </div>

          {/* Company and Role */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-gray-700 dark:text-gray-300">Company</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-gray-700 dark:text-gray-300">Role</span>
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
              />
            </div>
          </div>

          {/* Date and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-gray-700 dark:text-gray-300">Date</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-gray-700 dark:text-gray-300">Type</span>
              </label>
              <select
                name="storyType"
                value={formData.storyType}
                onChange={handleChange}
                className="select select-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
              >
                <option value="leadership">Leadership</option>
                <option value="challenge">Challenge</option>
                <option value="collaboration">Collaboration</option>
                <option value="growth">Growth</option>
                <option value="failure">Failure & Learning</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium text-gray-700 dark:text-gray-300">Status</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="select select-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
            >
              <option value="draft">Draft</option>
              <option value="refined">Refined</option>
              <option value="submitted">Submitted</option>
            </select>
          </div>

          {/* Content */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium text-gray-700 dark:text-gray-300">Story Content</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Tell your story..."
              rows="8"
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
        title="Delete Story?"
        message={`Are you sure you want to delete "${story.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
}
