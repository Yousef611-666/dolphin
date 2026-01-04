"use client";

import { useState } from "react";
import Link from "next/link";
import { useStories, formatDate } from "@/lib/hooks";
import { EmptyState, useToast, ToastContainer, DeleteConfirmModal } from "@/components/UI";

export default function ApplicationsPage() {
  const [stories, setStories] = useStories();
  const { toasts, showToast } = useToast();
  const [deleteId, setDeleteId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const filteredStories = statusFilter
    ? stories.filter((s) => s.status === statusFilter)
    : stories;

  const handleDelete = (id) => {
    setStories(stories.filter((s) => s.id !== id));
    setDeleteId(null);
    showToast("Story deleted successfully");
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Application Stories</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {stories.length} story{stories.length !== 1 ? "ies" : ""}
          </p>
        </div>
        <Link href="/applications/new" className="btn btn-primary">
          + New Story
        </Link>
      </div>

      {/* Status Filter */}
      {stories.length > 0 && (
        <div className="card p-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-bordered select-sm w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
          >
            <option value="">All Stories</option>
            <option value="draft">Draft</option>
            <option value="refined">Refined</option>
            <option value="submitted">Submitted</option>
          </select>
        </div>
      )}

      {/* Stories List or Empty State */}
      {stories.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No stories yet"
          description="Build your application narrative by documenting your stories."
          action={
            <Link href="/applications/new" className="btn btn-primary">
              + Add Story
            </Link>
          }
        />
      ) : filteredStories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No stories with this status</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStories
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((story) => (
              <div key={story.id} className="card p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <Link
                    href={`/applications/${story.id}`}
                    className="flex-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{story.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {story.company} • {story.role}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Added {formatDate(story.date)}
                    </p>
                  </Link>
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`badge badge-sm ${
                      story.status === "submitted"
                        ? "badge-success"
                        : story.status === "refined"
                        ? "badge-info"
                        : "badge-ghost"
                    }`}>
                      {story.status}
                    </span>
                    <Link href={`/applications/${story.id}`} className="btn btn-outline btn-xs">
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteId(story.id)}
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
        title="Delete Story?"
        message="Are you sure you want to delete this story? This action cannot be undone."
        onConfirm={() => handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
}
