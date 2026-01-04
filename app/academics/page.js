"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAcademics, formatDate, generateId } from "@/lib/hooks";
import { EmptyState, useToast, ToastContainer, DeleteConfirmModal } from "@/components/UI";

export default function AcademicsPage() {
  const [semesters, setSemesters] = useAcademics();
  const { toasts, showToast } = useToast();
  const [deleteId, setDeleteId] = useState(null);
  const [expandedSemesterId, setExpandedSemesterId] = useState(null);

  const handleDelete = (id) => {
    setSemesters(semesters.filter((s) => s.id !== id));
    setDeleteId(null);
    showToast("Semester deleted successfully");
  };

  const calculateGPA = (courses) => {
    if (!courses || courses.length === 0) return 0;
    const gradePoints = {
      "A+": 4.0,
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      D: 1.0,
      F: 0.0,
    };
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach((course) => {
      const points = gradePoints[course.grade] || 0;
      totalPoints += points * (course.credits || 0);
      totalCredits += course.credits || 0;
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Academics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {semesters.length} semester{semesters.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/academics/new" className="btn btn-primary">
          + New Semester
        </Link>
      </div>

      {/* Semesters List or Empty State */}
      {semesters.length === 0 ? (
        <EmptyState
          icon="🎓"
          title="No semesters yet"
          description="Track your academic progress by adding your first semester."
          action={
            <Link href="/academics/new" className="btn btn-primary">
              + Add Semester
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {semesters
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .map((semester) => (
              <div key={semester.id} className="card shadow-md">
                <div className="card-body">
                  {/* Semester Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1 cursor-pointer" onClick={() => setExpandedSemesterId(expandedSemesterId === semester.id ? null : semester.id)}>
                      <h2 className="card-title text-gray-900 dark:text-white text-2xl">
                        {semester.title}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(semester.startDate)} — {formatDate(semester.endDate)}
                      </p>
                      {semester.courses && semester.courses.length > 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 font-medium">
                          GPA: <span className="text-purple-600 dark:text-purple-400">{calculateGPA(semester.courses)}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/academics/${semester.id}`} className="btn btn-sm btn-outline">
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(semester.id)}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Courses List */}
                  {expandedSemesterId === semester.id && semester.courses && semester.courses.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Courses</h3>
                      <div className="space-y-3">
                        {semester.courses.map((course, idx) => (
                          <div key={idx} className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {course.code} • {course.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  Prof. {course.professor} • {course.credits} credits
                                </p>
                              </div>
                              <span className="badge badge-lg">{course.grade}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expand/Collapse Toggle */}
                  {semester.courses && semester.courses.length > 0 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setExpandedSemesterId(expandedSemesterId === semester.id ? null : semester.id)}
                        className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        {expandedSemesterId === semester.id ? "▼ Hide Courses" : "▶ Show Courses"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Semester?"
        message="Are you sure you want to delete this semester and all its courses? This action cannot be undone."
        onConfirm={() => handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
}
