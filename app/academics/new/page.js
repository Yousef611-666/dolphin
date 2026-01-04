"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAcademics, generateId } from "@/lib/hooks";
import { useToast, ToastContainer } from "@/components/UI";

export default function NewSemesterPage() {
  const router = useRouter();
  const [semesters, setSemesters] = useAcademics();
  const { toasts, showToast } = useToast();
  const [courseCount, setCourseCount] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    courses: [{ code: "", name: "", credits: 3, grade: "A", professor: "" }],
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
    setCourseCount(courseCount + 1);
  };

  const removeCourse = (index) => {
    if (formData.courses.length > 1) {
      setFormData((prev) => ({
        ...prev,
        courses: prev.courses.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast("Please enter a semester title", "error");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      showToast("Please enter start and end dates", "error");
      return;
    }

    const validCourses = formData.courses.filter((c) => c.code.trim() && c.name.trim());
    if (validCourses.length === 0) {
      showToast("Please add at least one course", "error");
      return;
    }

    const newSemester = {
      id: generateId(),
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      courses: validCourses.map((c) => ({
        ...c,
        credits: parseInt(c.credits) || 3,
      })),
      createdAt: new Date().toISOString(),
    };

    setSemesters([...semesters, newSemester]);
    showToast("Semester created successfully!");
    router.push("/academics");
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-6">
        <Link href="/academics" className="text-purple-600 dark:text-purple-400 hover:underline text-sm">
          ← Back to Academics
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-4">New Semester</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
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
              placeholder="E.g., Fall 2024, Spring 2025"
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
          <Link href="/academics" className="btn btn-ghost flex-1">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary flex-1">
            Save Semester
          </button>
        </div>
      </form>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
