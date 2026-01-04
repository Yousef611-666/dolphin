"use client";

import { useState } from "react";

function Counter(props) {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center justify-center">
      <div className="w-64 h-40 flex flex-col items-center justify-center gap-3 rounded-2xl bg-linear-to-br from-purple-700 via-purple-600 to-violet-500 text-white font-semibold text-2xl shadow-2xl ring-2 ring-purple-300 p-4">
        <div className="text-sm opacity-90">{props.title ?? 'count'}</div>
        <div className="text-3xl" aria-live="polite">{count}</div>
        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={() => setCount((prev) => Math.max(0, prev - 1))}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-white text-lg"
            aria-label="decrement"
          >
            −
          </button>
          <button
            onClick={() => setCount((prev) => prev + 1)}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-white text-lg"
            aria-label="increment"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default Counter;
