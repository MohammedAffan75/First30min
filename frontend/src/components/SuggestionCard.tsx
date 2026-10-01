import React from "react";
import { Music, Film, BookOpen, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface SongSuggestion { title: string; artist: string; vibe: string }
interface MovieSuggestion { title: string; type: string; reason: string }
interface Story { title: string; story: string }

interface Props {
  actions?: string[];
  song?: SongSuggestion;
  movie?: MovieSuggestion;
  story?: Story;
}

export default function SuggestionCard({ actions, song, movie, story }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {actions && actions.length > 0 && (
        <div className="rounded-2xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 p-4">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-300 font-medium mb-2">
            <Sparkles className="w-4 h-4" />
            Try this right now
          </div>
          <ul className="space-y-1">
            {actions.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-brand-400 mt-0.5">•</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {song && (
        <div className="rounded-2xl bg-sage-50 dark:bg-sage-950/20 border border-sage-200 dark:border-sage-800 p-4">
          <div className="flex items-center gap-2 text-sage-600 dark:text-sage-400 font-medium mb-1">
            <Music className="w-4 h-4" />
            Song for this moment
          </div>
          <p className="text-sm font-semibold text-gray-800 dark:text-white">{song.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{song.artist} · {song.vibe}</p>
        </div>
      )}

      {movie && (
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium mb-1">
            <Film className="w-4 h-4" />
            Watch this
          </div>
          <p className="text-sm font-semibold text-gray-800 dark:text-white">{movie.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{movie.type} · {movie.reason}</p>
        </div>
      )}

      {story && (
        <div className="rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 p-4">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium mb-2">
            <BookOpen className="w-4 h-4" />
            {story.title}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">"{story.story}"</p>
        </div>
      )}
    </motion.div>
  );
}
