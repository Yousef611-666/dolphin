import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Yousef Ali Ahmed – Portfolio & Diary",
  description: "Personal portfolio and reflection diary",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <script>{`
          const theme = localStorage.getItem('theme') || 'light';
          document.documentElement.setAttribute('data-theme', theme);
        `}</script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-slate-900`}>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopNav />
            <main className="flex-1 overflow-auto bg-white dark:bg-slate-900">
              <div className="container mx-auto px-4 py-6 max-w-6xl">
                {children}
              </div>
            </main>
          </div>
        </div>
        <script>{`
          const btn = document.createElement('button');
          btn.className = 'fixed bottom-6 right-6 btn btn-circle z-50 btn-primary shadow-lg';
          btn.textContent = '🌙';
          btn.title = 'Toggle dark mode';
          btn.style.width = '56px';
          btn.style.height = '56px';
          btn.style.fontSize = '24px';
          btn.onclick = () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            btn.textContent = next === 'light' ? '🌙' : '☀️';
          };
          if (document.documentElement.getAttribute('data-theme') === 'dark') {
            btn.textContent = '☀️';
          }
          document.body.appendChild(btn);
        `}</script>
      </body>
    </html>
  );
}
