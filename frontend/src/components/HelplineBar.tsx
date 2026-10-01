import React, { useState } from "react";
import { Phone, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HELPLINES = [
  { name: "Tele-MANAS", number: "14416", region: "India" },
  { name: "iCall", number: "9152987821", region: "India" },
  { name: "AASRA", number: "9820466627", region: "India" },
  { name: "Vandrevala", number: "9999666555", region: "India" },
  { name: "988 Lifeline", number: "988", region: "USA" },
];

export default function HelplineBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-center gap-2 py-2 bg-rose-600 dark:bg-rose-700 text-white text-sm font-medium hover:bg-rose-700 dark:hover:bg-rose-600 transition-colors"
        aria-label="Show crisis helplines"
      >
        <Phone className="w-4 h-4" />
        Crisis Helplines – Always Available
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-rose-50 dark:bg-rose-950 border-t border-rose-200 dark:border-rose-800"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 p-3">
              {HELPLINES.map((h) => (
                <a
                  key={h.number}
                  href={`tel:${h.number}`}
                  className="flex flex-col items-center p-2 rounded-lg bg-white dark:bg-rose-900 hover:bg-rose-100 dark:hover:bg-rose-800 transition text-center"
                >
                  <span className="text-xs text-rose-600 dark:text-rose-300 font-medium">{h.name}</span>
                  <span className="text-sm font-bold text-rose-700 dark:text-white">{h.number}</span>
                  <span className="text-xs text-gray-500 dark:text-rose-400">{h.region}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
