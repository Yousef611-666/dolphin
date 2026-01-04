"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import { useAcademics, formatDate } from "@/lib/hooks";
import { useToast, ToastContainer, DeleteConfirmModal } from "@/components/UI";

export default function SemesterDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const router = useRouter();
  const [semesters, setSemesters] = useAcademics();
  const { toasts, showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const semester = useMemo(() => semesters.find((s) => s.id === id), [semesters, id]);

  const [formData, setFormData] = useState({
    title: semester?.title || "",
    startDate: semester?.startDate || "",
    endDate: semester?.endDate || "",
    courses: semester?.courses || [{ code: "", name: "", credits: 3, grade: "A", professor: "" }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCourseChange = (index, field, value) => {
    const newCourses = [...formData.courses];
    newCourses[index] = {
      ...newCourses[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      courses: newCourses,
    }));
  };

  const addCourse = () => {
    setFormData((prev) => ({
      ...prev,
      courses: [
        ...prev.courses,
        { code: "", name: "", credits: 3, grade: "A", professor: "" },
      ],
    }));
  };

  const removeCourse = (index) => {
    if (formData.courses.length > 1) {
      setFormData((prev) => ({
        ...prev,
        courses: prev.courses.filter((_, i) => i !== index),
      }));
    }
  };

  const calculateGPA = (courses) => {
    if (!courses || courses.length === 0) return 0;
    const gradePoints = {
      "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, "C-": 1.7, D: 1.0, F: 0.0,
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

  if (!semester) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Semester not found</p>
        <Link href="/academics" className="btn btn-primary">
          Back to Academics
        </Link>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast("Please enter a semester title", "error");
      return;
    }

    const validCourses = formData.courses.filter((c) => c.code.trim() && c.name.trim());
    if (validCourses.length === 0) {
      showToast("Please add at least one course", "error");
      return;
    }

    const updatedSemester = {
      ...semester,
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      courses: validCourses.map((c) => ({
        ...c,
        credits: parseInt(c.credits) || 3,
      })),
    };

    const updatedSemesters = semesters.map((s) => (s.id === id ? updatedSemester : s));
    setSemesters(updatedSemesters);
    showToast("Semester updated successfully!");
    setIsEditing(false);
  };

  const handleDelete = () => {
    const filteredSemesters = semesters.filter((s) => s.id !== id);
    setSemesters(filteredSemesters);
    showToast("Semester deleted");
    router.push("/academics");
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-6">
        <Link href="/academics" className="text-purple-600 dark:text-purple-400 hover:underline text-sm">
          ← Back to Academics
        </Link>
      </div>

      {!isEditing ? (
        // View Mode
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{semester.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {formatDate(semester.startDate)} — {formatDate(semester.endDate)}
              </p>
              <p className="text-lg text-purple-600 dark:text-purple-400 font-semibold mt-2">
                GPA: {calculateGPA(semester.courses)}
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

          {semester.courses && semester.courses.length > 0 && (
            <div className="card bg-white dark:bg-slate-800 shadow">
              <div className="card-body">
                <h2 className="card-title text-gray-900 dark:text-white">Courses ({semester.courses.length})</h2>
                <div className="space-y-3 mt-4">
                  {semester.courses.map((course, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
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
            </div>
          )}
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSave} className="space-y-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Semester</h1>
          </div>

          {/* Semester Info */}
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Semester Information</h2>

            {/* Title */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                  Semester Title <span className="text-red-500">*</span>
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

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                    Start Date <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
                  required
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium text-gray-700 dark:text-gray-300">
                    End Date <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
                  required
                />
              </div>
            </div>
          </div>

          {/* Courses */}
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Courses</h2>

            <div className="space-y-4">
              {formData.courses.map((course, idx) => (
                <div key={idx} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Course {idx + 1}</h3>
                    {formData.courses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCourse(idx)}
                        className="btn btn-sm btn-ghost btn-circle"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-sm text-gray-700 dark:text-gray-300">Code</span>
                      </label>
                      <input
                        type="text"
                        value={course.code}
                        onChange={(e) => handleCourseChange(idx, "code", e.target.value)}
                        placeholder="E.g., CS101"
                        className="input input-bordered input-sm text-gray-900 dark:text-white bg-white dark:bg-slate-700"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-sm text-gray-700 dark:text-gray-300">Grade</span>
                      </label>
                      <select
                        value={course.grade}
                        onChange={(e) => handleCourseChange(idx, "grade", e.target.value)}
                        className="select select-bordered select-sm text-gray-900 dark:text-white bg-white dark:bg-slate-700"
                      >
                        <option>A+</option>
                        <option>A</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B</option>
                        <option>B-</option>
                        <option>C+</option>
                        <option>C</option>
                        <option>C-</option>
                        <option>D</option>
                        <option>F</option>
                      </select>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => handleCourseChange(idx, "name", e.target.value)}
                    placeholder="Course name"
                    className="input input-bordered input-sm w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-sm text-gray-700 dark:text-gray-300">Credits</span>
                      </label>
                      <input
                        type="number"
                        value={course.credits}
                        onChange={(e) => handleCourseChange(idx, "credits", e.target.value)}
                        min="1"
                        max="4"
                        className="input input-bordered input-sm text-gray-900 dark:text-white bg-white dark:bg-slate-700"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-sm text-gray-700 dark:text-gray-300">Professor</span>
                      </label>
                      <input
                        type="text"
                        value={course.professor}
                        onChange={(e) => handleCourseChange(idx, "professor", e.target.value)}
                        placeholder="Name"
                        className="input input-bordered input-sm text-gray-900 dark:text-white bg-white dark:bg-slate-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addCourse}
              className="btn btn-outline w-full"
            >
              + Add Another Course
            </button>
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
        title="Delete Semester?"
        message={`Are you sure you want to delete "${semester.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
}
