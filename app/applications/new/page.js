"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStories, generateId } from "@/lib/hooks";
import { useToast, ToastContainer } from "@/components/UI";

export default function NewStoryPage() {
  const router = useRouter();
  const [stories, setStories] = useStories();
  const { toasts, showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    role: "",
    status: "draft",
    date: new Date().toISOString().split("T")[0],
    storyType: "leadership",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast("Please enter a title", "error");
      return;
    }

    if (!formData.content.trim()) {
      showToast("Please enter the story content", "error");
      return;
    }

    const newStory = {
      id: generateId(),
      title: formData.title,
      company: formData.company,
      role: formData.role,
      status: formData.status,
      date: formData.date,
      storyType: formData.storyType,
      content: formData.content,
      createdAt: new Date().toISOString(),
    };

    setStories([...stories, newStory]);
    showToast("Story created successfully!");
    router.push("/applications");
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="mb-6">
        <Link href="/applications" className="text-purple-600 dark:text-purple-400 hover:underline text-sm">
          ← Back to Stories
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-4">New Story</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="Story title"
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
              placeholder="E.g., Google, Acme Corp"
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
              placeholder="E.g., Intern, Lead Engineer"
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
              <span className="label-text font-medium text-gray-700 dark:text-gray-300">Story Type</span>
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
            <span className="label-text font-medium text-gray-700 dark:text-gray-300">
              Story Content <span className="text-red-500">*</span>
            </span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Tell your story. Include what happened, what you did, and what you learned."
            rows="8"
            className="textarea textarea-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Link href="/applications" className="btn btn-ghost flex-1">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary flex-1">
            Create Story
          </button>
        </div>
      </form>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
