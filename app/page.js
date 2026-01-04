"use client";

import { useMemo } from "react";
import { useDiaryEntries, useAcademics, useProjects, useStories, moodEmoji, formatDate, getDaysAgo, extractTextSnippet } from "@/lib/hooks";
import Link from "next/link";

export default function Dashboard() {
  const [diaryEntries] = useDiaryEntries();
  const [semesters] = useAcademics();
  const [projects] = useProjects();
  const [stories] = useStories();

  const getDaysStreak = useMemo(() => {
    const sorted = [...diaryEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    const today = new Date();

    for (const entry of sorted) {
      const entryDate = new Date(entry.date);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - streak);

      if (entryDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [diaryEntries]);

  const recentEntries = useMemo(
    () =>
      [...diaryEntries]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5),
    [diaryEntries]
  );

  const semesterSummary = useMemo(() => {
    if (semesters.length === 0) return null;
    const currentSemester = semesters[semesters.length - 1];
    if (!currentSemester || !currentSemester.courses || currentSemester.courses.length === 0) {
      return { title: currentSemester?.title || "Current Semester", courseCount: 0, avgGrade: 0 };
    }

    const courseCount = currentSemester.courses.length;
    const gradePoints = {
      "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, "C-": 1.7, D: 1.0, F: 0.0,
    };
    
    const avgGrade = currentSemester.courses
      .filter((c) => c.grade && gradePoints[c.grade] !== undefined)
      .reduce((sum, c) => sum + gradePoints[c.grade], 0) / Math.max(currentSemester.courses.filter((c) => c.grade).length, 1);

    return {
      title: currentSemester.title,
      courseCount,
      avgGrade: avgGrade.toFixed(2),
    };
  }, [semesters]);

  const todayEntry = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return diaryEntries.find((e) => e.date === today);
  }, [diaryEntries]);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back to your portfolio and reflections</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Streak */}
        <div className="card p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">🔥 Current Streak</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{getDaysStreak}</p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">consecutive days</p>
            </div>
          </div>
        </div>

        {/* Entries Count */}
        <div className="card p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">📔 Total Entries</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{diaryEntries.length}</p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">reflections documented</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="card p-6">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">✨ Content</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{projects.length + stories.length}</p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">projects & stories</p>
          </div>
        </div>
      </div>

      {/* Today Card */}
      <div className="card p-6 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-l-purple-600">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Today&apos;s Reflection</h2>
        {todayEntry ? (
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{todayEntry.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl">{moodEmoji[todayEntry.mood]}</span>
                <span className="badge">{moodEmoji[todayEntry.mood]}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-slate-700 pt-3">
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {todayEntry.whatHappened && (
                  <p>
                    <strong>What happened:</strong> {extractTextSnippet(todayEntry.whatHappened, 80)}
                  </p>
                )}
                {todayEntry.whatIFelt && (
                  <p>
                    <strong>What I felt:</strong> {extractTextSnippet(todayEntry.whatIFelt, 80)}
                  </p>
                )}
              </div>
            </div>
            <Link href={`/diary/${todayEntry.id}`} className="btn btn-sm btn-primary mt-3">
              View Full Entry
            </Link>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No entry for today yet</p>
            <Link href="/diary/new" className="btn btn-sm btn-primary">
              + Start Writing
            </Link>
          </div>
        )}
      </div>

      {/* Last 5 Entries */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Reflections</h2>
          <Link href="/diary" className="btn btn-sm btn-ghost">
            View All →
          </Link>
        </div>
        <div className="space-y-3">
          {recentEntries.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No entries yet</p>
          ) : (
            recentEntries.map((entry) => (
              <Link
                key={entry.id}
                href={`/diary/${entry.id}`}
                className="p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-gray-300 dark:hover:border-slate-700 cursor-pointer block"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{entry.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {getDaysAgo(entry.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{moodEmoji[entry.mood]}</span>
                    {entry.tags && entry.tags.length > 0 && (
                      <span className="badge text-xs">{entry.tags[0]}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Semester Summary */}
      {semesterSummary && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">This Semester</h2>
            <Link href="/academics" className="btn btn-sm btn-ghost">
              View Full →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Semester</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{semesterSummary.title}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Courses</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{semesterSummary.courseCount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
