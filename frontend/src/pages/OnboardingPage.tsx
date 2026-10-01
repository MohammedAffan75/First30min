import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import api from "../lib/api";
import toast from "react-hot-toast";

const TONES = [
  { value: "Mother-to-Son", label: "Mother to Son", desc: "Warm, nurturing, gentle" },
  { value: "Father-to-Daughter", label: "Father to Daughter", desc: "Calm, steady, protective" },
  { value: "Neutral", label: "Neutral", desc: "Clear, grounded, non-gendered" },
  { value: "BUA Mode", label: "BUA Mode 🌶️", desc: "Tough love, culturally Indian, secretly caring" },
];

const CONTACT_LABELS = ["Mom", "Dad", "Girlfriend", "Partner", "Best Friend", "Other"];

interface Contact { label: string; name: string; phone: string }

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [tone, setTone] = useState("Neutral");
  const [food, setFood] = useState("");
  const [music, setMusic] = useState("");
  const [activities, setActivities] = useState("");
  const [notes, setNotes] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([{ label: "Mom", name: "", phone: "" }]);

  const addContact = () => setContacts([...contacts, { label: "Other", name: "", phone: "" }]);
  const updateContact = (i: number, field: keyof Contact, val: string) => {
    const updated = [...contacts];
    updated[i] = { ...updated[i], [field]: val };
    setContacts(updated);
  };
  const removeContact = (i: number) => setContacts(contacts.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/profile", {
        support_tone: tone,
        favourite_food: food || undefined,
        preferred_music: music || undefined,
        comfort_activities: activities || undefined,
        behavioural_notes: notes || undefined,
      });
      // Save valid contacts
      const valid = contacts.filter((c) => c.name && c.phone);
      for (const c of valid) {
        await api.post("/profile/contacts", c);
      }
      toast.success("Profile saved");
      navigate("/");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    // Step 0: Tone
    <div key="tone" className="space-y-4">
      <h2 className="text-xl font-bold text-[var(--fg)]">How do you want me to talk to you?</h2>
      <p className="text-sm text-[var(--muted)]">You can change this anytime.</p>
      <div className="grid gap-3">
        {TONES.map((t) => (
          <button
            key={t.value}
            onClick={() => setTone(t.value)}
            className={`w-full p-4 rounded-2xl border-2 text-left transition ${
              tone === t.value
                ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30"
                : "border-[var(--border)] bg-[var(--card)] hover:border-brand-300"
            }`}
          >
            <div className="font-semibold text-[var(--fg)]">{t.label}</div>
            <div className="text-xs text-[var(--muted)] mt-0.5">{t.desc}</div>
          </button>
        ))}
      </div>
    </div>,

    // Step 1: Comfort details
    <div key="comfort" className="space-y-4">
      <h2 className="text-xl font-bold text-[var(--fg)]">What helps you feel better?</h2>
      <p className="text-sm text-[var(--muted)]">All optional – the more I know, the better I can help.</p>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-[var(--fg)] mb-1.5">Favourite comfort food</label>
          <input
            value={food}
            onChange={(e) => setFood(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-brand-400"
            placeholder="e.g. Maggi, pizza, chai..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--fg)] mb-1.5">Music you love</label>
          <input
            value={music}
            onChange={(e) => setMusic(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-brand-400"
            placeholder="e.g. Arijit Singh, Coldplay, lofi..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--fg)] mb-1.5">Comfort activities</label>
          <input
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-brand-400"
            placeholder="e.g. walking, reading, cooking..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--fg)] mb-1.5">Anything else about you</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
            placeholder="e.g. prefers alone time, likes outdoor air..."
          />
        </div>
      </div>
    </div>,

    // Step 2: Emergency contacts
    <div key="contacts" className="space-y-4">
      <h2 className="text-xl font-bold text-[var(--fg)]">Emergency contacts</h2>
      <p className="text-sm text-[var(--muted)]">In a crisis, I'll offer to help you reach these people. All optional.</p>

      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {contacts.map((c, i) => (
          <div key={i} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2">
            <div className="flex items-center justify-between">
              <select
                value={c.label}
                onChange={(e) => updateContact(i, "label", e.target.value)}
                className="text-sm bg-transparent text-[var(--fg)] border-none outline-none font-medium"
              >
                {CONTACT_LABELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <button onClick={() => removeContact(i)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
            </div>
            <input
              value={c.name}
              onChange={(e) => updateContact(i, "name", e.target.value)}
              placeholder="Name"
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
            <input
              value={c.phone}
              onChange={(e) => updateContact(i, "phone", e.target.value)}
              placeholder="Phone number"
              type="tel"
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
          </div>
        ))}
      </div>

      <button
        onClick={addContact}
        className="w-full py-2.5 rounded-xl border-2 border-dashed border-brand-300 dark:border-brand-700 text-brand-500 text-sm font-medium hover:bg-brand-50 dark:hover:bg-brand-950/20 transition"
      >
        + Add another contact
      </button>
    </div>,
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg)]">
      <div className="w-full max-w-md space-y-6">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? "w-8 bg-brand-500" : i < step ? "w-2 bg-brand-300" : "w-2 bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 px-4 py-3 rounded-xl border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--card)] transition"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 flex items-center justify-center gap-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition disabled:opacity-60"
            >
              <Check className="w-4 h-4" />
              {saving ? "Saving..." : "Done – Let's go"}
            </button>
          )}
        </div>

        <button
          onClick={() => navigate("/")}
          className="block w-full text-center text-sm text-[var(--muted)] hover:text-[var(--fg)] transition"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
