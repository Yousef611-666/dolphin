"use client";

import { useState } from "react";
import Link from "next/link";

const menuItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/diary", label: "Diary", icon: "📔" },
  { href: "/academics", label: "Academics", icon: "📚" },
  { href: "/projects", label: "Projects", icon: "🚀" },
  { href: "/applications", label: "Applications", icon: "💼" },
];

export default function TopNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {/* Top Navigation */}
      <div className="navbar bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm">
        {/* Drawer trigger for mobile */}
        <div className="flex-1">
          <label htmlFor="sidebar-drawer" className="btn btn-ghost md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-gray-900 dark:stroke-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>

          {/* Search bar */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="btn btn-ghost btn-sm ml-2 hidden sm:flex gap-2 text-gray-700 dark:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className="text-sm">Search...</span>
            <kbd className="kbd kbd-xs bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300">⌘K</kbd>
          </button>
        </div>

        {/* Right side actions */}
        <div className="flex-none gap-2">
          <button className="btn btn-ghost btn-circle btn-sm text-gray-700 dark:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <div className="drawer md:hidden">
        <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content"></div>
        <div className="drawer-side z-50">
          <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
          <div className="menu p-4 w-80 min-h-full bg-white dark:bg-slate-900 text-gray-900 dark:text-white space-y-2">
            <Link href="/" className="text-2xl font-bold mb-4">
              <span className="text-purple-600">Y</span>ouseF
            </Link>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
