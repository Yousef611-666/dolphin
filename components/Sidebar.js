"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/diary", label: "Diary", icon: "📔" },
  { href: "/academics", label: "Academics", icon: "📚" },
  { href: "/projects", label: "Projects", icon: "🚀" },
  { href: "/applications", label: "Applications", icon: "💼" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex-col h-screen sticky top-0 shadow-none">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-800">
        <Link href="/" className="inline-block">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            YouseF
          </span>
        </Link>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">Portfolio & Diary</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-800 text-xs text-gray-600 dark:text-gray-400">
        <p>© 2025 Yousef Ali Ahmed</p>
      </div>
    </aside>
  );
}
