"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProjects, generateId } from "@/lib/hooks";
import { useToast, ToastContainer } from "@/components/UI";

export default function NewProjectPage() {
  const router = useRouter();
  const [projects, setProjects] = useProjects();
  const { toasts, showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    image: "",
    link: "",
    github: "",
    technologies: "",
    startDate: "",
    endDate: "",
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

    const newProject = {
      id: generateId(),
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
      description: formData.description,
      image: formData.image,
      link: formData.link,
      github: formData.github,
      technologies: formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      startDate: formData.startDate,
      endDate: formData.endDate,
      createdAt: new Date().toISOString(),
    };

    setProjects([...projects, newProject]);
    showToast("Project created successfully!");
    router.push("/projects");
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="mb-6">
        <Link href="/projects" className="text-purple-600 dark:text-purple-400 hover:underline text-sm">
          ← Back to Projects
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-4">New Project</h1>
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
            placeholder="Project name"
            className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
            required
          />
        </div>

        {/* Description */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium text-gray-700 dark:text-gray-300">Description</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What is this project about?"
            rows="4"
            className="textarea textarea-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
          />
        </div>

        {/* Image URL */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium text-gray-700 dark:text-gray-300">Image URL</span>
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://..."
            className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
          />
        </div>

        {/* Technologies */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium text-gray-700 dark:text-gray-300">Technologies</span>
          </label>
          <input
            type="text"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            placeholder="React, Node.js, PostgreSQL (comma-separated)"
            className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium text-gray-700 dark:text-gray-300">Start Date</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium text-gray-700 dark:text-gray-300">End Date</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
            />
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium text-gray-700 dark:text-gray-300">Live Link</span>
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://..."
              className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium text-gray-700 dark:text-gray-300">GitHub Link</span>
            </label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://..."
              className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Link href="/projects" className="btn btn-ghost flex-1">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary flex-1">
            Create Project
          </button>
        </div>
      </form>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
