"use client";

import { useState } from "react";
import Link from "next/link";
import { useProjects, formatDate } from "@/lib/hooks";
import { EmptyState, useToast, ToastContainer, DeleteConfirmModal } from "@/components/UI";

export default function ProjectsPage() {
  const [projects, setProjects] = useProjects();
  const { toasts, showToast } = useToast();
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
    setDeleteId(null);
    showToast("Project deleted successfully");
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/projects/new" className="btn btn-primary">
          + New Project
        </Link>
      </div>

      {/* Projects Grid or Empty State */}
      {projects.length === 0 ? (
        <EmptyState
          icon="🚀"
          title="No projects yet"
          description="Showcase your work by adding your first project."
          action={
            <Link href="/projects/new" className="btn btn-primary">
              + Add Project
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="card shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="card-body">
                <Link href={`/projects/${project.id}`} className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400">
                  <h2 className="card-title text-lg text-gray-900 dark:text-white">{project.title}</h2>
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech Stack */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="badge badge-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {formatDate(project.startDate)} • {project.link || ""}
                </p>

                <div className="card-actions justify-between mt-4">
                  <Link href={`/projects/${project.id}`} className="btn btn-ghost btn-sm">
                    View
                  </Link>
                  <button
                    onClick={() => setDeleteId(project.id)}
                    className="btn btn-ghost btn-sm btn-error"
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
        title="Delete Project?"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={() => handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
}
