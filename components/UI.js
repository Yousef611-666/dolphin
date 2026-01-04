"use client";

import { useState } from "react";

/**
 * Toast Notification Component
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return { toasts, showToast };
}

export function ToastContainer({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg text-white shadow-lg animate-fadeInUp ${
            toast.type === "success"
              ? "bg-green-500"
              : toast.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

/**
 * Delete Confirmation Modal
 */
export function DeleteConfirmModal({ isOpen, title, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="card p-6 max-w-sm bg-white dark:bg-slate-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Delete {title}?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="btn btn-ghost flex-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn bg-red-500 hover:bg-red-600 text-white border-0 flex-1"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Empty State Component
 */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {description}
      </p>
      {action && action}
    </div>
  );
}

/**
 * Modal Form Component
 */
export function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full bg-white dark:bg-slate-800 max-h-screen overflow-y-auto">
        <div className="sticky top-0 p-6 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Form Input Component
 */
export function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  rows,
}) {
  if (type === "textarea") {
    return (
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
          </span>
        </label>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 3}
          className="textarea textarea-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
          required={required}
        />
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
          </span>
        </label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="select select-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
          required={required}
        >
          <option value="">Select {label}</option>
          {children}
        </select>
      </div>
    );
  }

  return (
    <div className="form-control w-full mb-4">
      <label className="label">
        <span className="label-text font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input input-bordered w-full text-gray-900 dark:text-white bg-white dark:bg-slate-700"
        required={required}
      />
    </div>
  );
}

/**
 * Button Group Component
 */
export function FormButtons({ onSave, onCancel, isSaving = false }) {
  return (
    <div className="flex gap-3 mt-6">
      <button
        type="button"
        onClick={onCancel}
        className="btn btn-ghost flex-1"
      >
        Cancel
      </button>
      <button
        type="submit"
        onClick={onSave}
        disabled={isSaving}
        className="btn btn-primary flex-1"
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
