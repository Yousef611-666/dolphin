"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import { useProjects, formatDate } from "@/lib/hooks";
import { useToast, ToastContainer, DeleteConfirmModal } from "@/components/UI";

export default function ProjectDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const router = useRouter();
  const [projects, setProjects] = useProjects();
  const { toasts, showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const project = useMemo(() => projects.find((p) => p.id === id), [projects, id]);

  const [formData, setFormData] = useState({
    title: project?.title || "",
    slug: project?.slug || "",
    description: project?.description || "",
    image: project?.image || "",
    link: project?.link || "",
    github: project?.github || "",
    technologies: project?.technologies?.join(", ") || "",
    startDate: project?.startDate || "",
    endDate: project?.endDate || "",
  });

  if (!project) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Project not found</p>
        <Link href="/projects" className="btn btn-primary">
          Back to Projects
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

    const updatedProject = {
      ...project,
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
    };

    const updatedProjects = projects.map((p) => (p.id === id ? updatedProject : p));
    setProjects(updatedProjects);
    showToast("Project updated successfully!");
    setIsEditing(false);
  };

  const handleDelete = () => {
    const filteredProjects = projects.filter((p) => p.id !== id);
    setProjects(filteredProjects);
    showToast("Project deleted");
    router.push("/projects");
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-6">
        <Link href="/projects" className="text-purple-600 dark:text-purple-400 hover:underline text-sm">
          ← Back to Projects
        </Link>
      </div>

      {!isEditing ? (
        // View Mode
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h1>
              <p className="text-gray-500 dark:text-gray-400">
                {formatDate(project.startDate)} {project.endDate && `— ${formatDate(project.endDate)}`}
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

          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="badge badge-lg">
                  {tech}
                </span>
              ))}
            </div>
          )}

          {project.description && (
            <div className="card bg-white dark:bg-slate-800 shadow">
              <div className="card-body">
                <h2 className="card-title text-gray-900 dark:text-white">Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          )}

          {project.image && (
            <div className="card bg-white dark:bg-slate-800 shadow">
              <div className="card-body">
                <h2 className="card-title text-gray-900 dark:text-white">Image</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{project.image}</p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                View Live →
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                GitHub →
              </a>
            )}
          </div>
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSave} className="space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Project</h1>
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

          {/* Description */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium text-gray-700 dark:text-gray-300">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
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
                className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
              />
            </div>
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
        title="Delete Project?"
        message={`Are you sure you want to delete "${project.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
}
