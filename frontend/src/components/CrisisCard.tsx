import React from "react";
import { Phone, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { CrisisResource, EmergencyContact } from "../types";

interface Props {
  resources: CrisisResource[];
  contacts?: EmergencyContact[];
}

export default function CrisisCard({ resources, contacts }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border-2 border-red-400 bg-red-50 dark:bg-red-950/30 p-4 space-y-3"
    >
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold">
        <AlertTriangle className="w-5 h-5" />
        Please reach out to a real person right now
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {resources.slice(0, 4).map((r) => (
          <a
            key={r.number}
            href={`tel:${r.number}`}
            className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-red-900/40 hover:bg-red-100 dark:hover:bg-red-800/40 transition group"
          >
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-700 flex items-center justify-center shrink-0 group-hover:bg-red-200 transition">
              <Phone className="w-4 h-4 text-red-600 dark:text-red-200" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800 dark:text-white">{r.name}</div>
              <div className="text-xs text-red-600 dark:text-red-300">{r.number} · {r.available}</div>
            </div>
          </a>
        ))}
      </div>

      {contacts && contacts.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Or call someone you trust:</p>
          <div className="flex flex-wrap gap-2">
            {contacts.map((c) => (
              <a
                key={c.id}
                href={`tel:${c.phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-200 text-sm font-medium hover:bg-brand-200 transition"
              >
                <Phone className="w-3 h-3" />
                Call {c.label} ({c.name})
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
