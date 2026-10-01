import React from "react";
import { ShieldAlert } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs">
      <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
      <p>
        I&apos;m an AI support router, not a therapist or crisis service. If you&apos;re in immediate danger,
        please call <strong>Tele-MANAS: 14416</strong> or <strong>AASRA: 9820466627</strong>.
      </p>
    </div>
  );
}
