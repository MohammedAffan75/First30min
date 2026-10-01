import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Plus, Trash2, LogOut } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { UserProfile, EmergencyContact } from "../types";
import toast from "react-hot-toast";

const TONES = ["Mother-to-Son", "Father-to-Daughter", "Neutral", "BUA Mode"];
const CONTACT_LABELS = ["Mom", "Dad", "Girlfriend", "Partner", "Best Friend", "Other"];

export default function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    nickname: "",
    support_tone: "Neutral",
  });
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [newContact, setNewContact] = useState({ label: "Mom", name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/profile"), api.get("/profile/contacts")])
      .then(([profileRes, contactsRes]) => {
        setProfile(profileRes.data);
        setContacts(contactsRes.data);
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoadingData(false));
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.put("/profile", profile);
      toast.success("Profile updated");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const addContact = async () => {
    if (!newContact.name || !newContact.phone) {
      toast.error("Please fill in name and phone");
      return;
    }
    try {
      const res = await api.post("/profile/contacts", newContact);
      setContacts([...contacts, res.data]);
      setNewContact({ label: "Mom", name: "", phone: "" });
      toast.success("Contact added");
    } catch {
      toast.error("Failed to add contact");
    }
  };

  const removeContact = async (id: number) => {
    try {
      await api.delete(`/profile/contacts/${id}`);
      setContacts(contacts.filter((c) => c.id !== id));
      toast.success("Contact removed");
    } catch {
      toast.error("Failed to remove contact");
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-10">
      <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-[var(--card)] border-b border-[var(--border)]">
        <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-[var(--bg)] transition" aria-label="Back">
          <ArrowLeft className="w-5 h-5 text-[var(--fg)]" />
        </button>
        <h1 className="font-bold text-[var(--fg)]">Your Profile</h1>
        <div className="ml-auto">
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto px-4 py-6 space-y-6"
      >
        {/* Basic Info */}
        <section className="space-y-4 p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <h2 className="font-semibold text-[var(--fg)]">Basic Info</h2>

          <div>
            <label className="block text-sm font-medium text-[var(--fg)] mb-1.5">Nickname</label>
            <input
              value={profile.nickname}
              onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--fg)] mb-1.5">Support Tone</label>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setProfile({ ...profile, support_tone: t as UserProfile["support_tone"] })}
                  className={`py-2 px-3 rounded-xl text-sm text-left transition border-2 ${
                    profile.support_tone === t
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300"
                      : "border-[var(--border)] text-[var(--fg)] hover:border-brand-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Comfort Section */}
        <section className="space-y-4 p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <h2 className="font-semibold text-[var(--fg)]">Comfort & Preferences</h2>

          {[
            { label: "Favourite food", key: "favourite_food", placeholder: "Maggi, chai, pizza..." },
            { label: "Music you love", key: "preferred_music", placeholder: "Arijit Singh, Coldplay, lofi..." },
            { label: "Comfort activities", key: "comfort_activities", placeholder: "Walking, reading, cooking..." },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-[var(--fg)] mb-1.5">{label}</label>
              <input
                value={(profile as any)[key] || ""}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-[var(--fg)] mb-1.5">About you (optional)</label>
            <textarea
              value={profile.behavioural_notes || ""}
              onChange={(e) => setProfile({ ...profile, behavioural_notes: e.target.value })}
              rows={2}
              placeholder="Prefers alone time, likes outdoor air..."
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
            />
          </div>
        </section>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {/* Emergency Contacts */}
        <section className="space-y-4 p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <h2 className="font-semibold text-[var(--fg)]">Emergency Contacts</h2>

          {contacts.length === 0 && (
            <p className="text-sm text-[var(--muted)]">No contacts added yet.</p>
          )}

          <div className="space-y-2">
            {contacts.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                <div>
                  <span className="text-xs font-medium text-brand-500">{c.label}</span>
                  <div className="text-sm text-[var(--fg)]">{c.name} · {c.phone}</div>
                </div>
                <button
                  onClick={() => removeContact(c.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition"
                  aria-label="Remove contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-[var(--border)]">
            <p className="text-xs font-medium text-[var(--muted)]">Add new contact</p>
            <select
              value={newContact.label}
              onChange={(e) => setNewContact({ ...newContact, label: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              {CONTACT_LABELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <input
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              placeholder="Name"
              className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <input
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              placeholder="Phone number"
              type="tel"
              className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button
              onClick={addContact}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-brand-400 text-brand-500 text-sm font-medium hover:bg-brand-50 dark:hover:bg-brand-950/20 transition"
            >
              <Plus className="w-4 h-4" /> Add Contact
            </button>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
