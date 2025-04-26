"use client";

import { useState, useRef } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { updateVoteCount } from "@/lib/firebase";

interface ProverbCardProps {
  proverb: Proverb;
}

export function ProverbCard({ proverb }: ProverbCardProps) {
  // Vote can be 1 (upvoted), -1 (downvoted), or 0 (no vote)
  const [voteStatus, setVoteStatus] = useState<1 | 0 | -1>(0);
  const [voteCount, setVoteCount] = useState(proverb.voteCount);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleUpvote = async () => {
    if (voteStatus === 1) {
      // If already upvoted, remove the upvote
      setVoteStatus(0);
      setVoteCount((prev) => prev - 1);
      await updateVoteCount(proverb.id, -1);
    } else {
      // If not voted or downvoted, apply upvote
      // If previously downvoted, add 2 (remove -1 and add 1)
      setVoteCount((prev) => prev + (voteStatus === -1 ? 2 : 1));
      setVoteStatus(1);
      await updateVoteCount(proverb.id, 1);
    }
  };

  const handleDownvote = async () => {
    if (voteStatus === -1) {
      // If already downvoted, remove the downvote
      setVoteStatus(0);
      setVoteCount((prev) => prev + 1);
      await updateVoteCount(proverb.id, 1);
    } else {
      // If not voted or upvoted, apply downvote
      // If previously upvoted, subtract 2 (remove 1 and add -1)
      setVoteCount((prev) => prev - (voteStatus === 1 ? 2 : 1));
      setVoteStatus(-1);
      await updateVoteCount(proverb.id, -1);
    }
  };

  return (
    <div
      ref={cardRef}
      className="relative p-6 rounded-lg bg-purple-900/30 border border-purple-500/30 h-full"
    >
      {/* Content */}
      <div className="relative z-10">
        {/* Burmese proverb */}
        <p className="text-xl font-bold mb-3 text-purple-200">{proverb.text}</p>

        {/* Voting system */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                voteStatus === 1
                  ? "bg-green-700/50 text-green-300"
                  : "bg-purple-800/30 hover:bg-purple-700/50 text-gray-300"
              }`}
              aria-label="Upvote"
              aria-pressed={voteStatus === 1}
            >
              <ThumbsUp
                className={`w-5 h-5 ${voteStatus === 1 ? "text-green-400" : "text-gray-400"}`}
              />
            </button>

            <span
              className={`font-bold text-lg ${
                voteCount > 0
                  ? "text-green-400"
                  : voteCount < 0
                    ? "text-red-400"
                    : "text-gray-400"
              }`}
            >
              {voteCount}
            </span>

            <button
              onClick={handleDownvote}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                voteStatus === -1
                  ? "bg-red-700/50 text-red-300"
                  : "bg-purple-800/30 hover:bg-purple-700/50 text-gray-300"
              }`}
              aria-label="Downvote"
              aria-pressed={voteStatus === -1}
            >
              <ThumbsDown
                className={`w-5 h-5 ${voteStatus === -1 ? "text-red-400" : "text-gray-400"}`}
              />
            </button>
          </div>
          <span className="text-white/90">
            {proverb.createdAt.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
