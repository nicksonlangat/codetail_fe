"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Skull } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const emojis = ["😢", "😕", "😐", "🙂", "😍"];

export function RatingStars() {
  const [starRating, setStarRating] = useState(0);
  const [starHover, setStarHover] = useState(0);
  const [skullRating, setSkullRating] = useState(0);
  const [skullHover, setSkullHover] = useState(0);
  const [emojiRating, setEmojiRating] = useState(0);
  const [emojiHover, setEmojiHover] = useState(0);

  const activeStars = starHover || starRating;
  const activeSkulls = skullHover || skullRating;
  const activeEmoji = emojiHover || emojiRating;

  return (
    <div className="py-6 space-y-8">
      {/* Star Rating */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Quality Rating
        </p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <motion.button
              key={n}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: activeStars >= n ? 1.1 : 1,
                rotate: activeStars >= n ? 5 : 0,
              }}
              transition={spring}
              onMouseEnter={() => setStarHover(n)}
              onMouseLeave={() => setStarHover(0)}
              onClick={() => setStarRating(n)}
              className="cursor-pointer p-1 transition-all duration-500"
            >
              <Star
                className={`w-6 h-6 transition-all duration-500 ${
                  activeStars >= n
                    ? "fill-[#fbbf24] text-[#fbbf24]"
                    : "text-muted-foreground/30"
                }`}
              />
            </motion.button>
          ))}
          <span className="ml-3 text-sm font-mono tabular-nums text-foreground">
            {starRating > 0 ? `${starRating}.0` : "—"}{" "}
            <span className="text-muted-foreground">/ 5.0</span>
          </span>
        </div>
      </div>

      {/* Skull (Difficulty) Rating */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Difficulty Rating
        </p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <motion.button
              key={n}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: activeSkulls >= n ? 1.1 : 1,
                rotate: activeSkulls >= n ? 5 : 0,
              }}
              transition={spring}
              onMouseEnter={() => setSkullHover(n)}
              onMouseLeave={() => setSkullHover(0)}
              onClick={() => setSkullRating(n)}
              className="cursor-pointer p-1 transition-all duration-500"
            >
              <Skull
                className={`w-6 h-6 transition-all duration-500 ${
                  activeSkulls >= n
                    ? "fill-red-500/20 text-red-500"
                    : "text-muted-foreground/30"
                }`}
              />
            </motion.button>
          ))}
          <span className="ml-3 text-sm font-mono tabular-nums text-foreground">
            {skullRating > 0 ? `${skullRating}.0` : "—"}{" "}
            <span className="text-muted-foreground">/ 5.0</span>
          </span>
        </div>
      </div>

      {/* Emoji Rating */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Satisfaction
        </p>
        <div className="flex items-center gap-2">
          {emojis.map((emoji, i) => {
            const n = i + 1;
            const isActive = activeEmoji === n;
            const isSelected = emojiRating === n;
            return (
              <motion.button
                key={n}
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={spring}
                onMouseEnter={() => setEmojiHover(n)}
                onMouseLeave={() => setEmojiHover(0)}
                onClick={() => setEmojiRating(n)}
                className={`cursor-pointer text-2xl p-1.5 rounded-lg transition-all duration-500 ${
                  isSelected
                    ? "ring-2 ring-primary bg-primary/10"
                    : "hover:bg-muted"
                }`}
              >
                {emoji}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
