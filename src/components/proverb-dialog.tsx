"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";

interface ProverbDialogProps {
  proverb: {
    text: string;
    id: string;
  } | null;
  onClose: () => void;
  isOpen: boolean;
}

export function ProverbDialog({
  proverb,
  onClose,
  isOpen,
}: ProverbDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !proverb) return null;

  const handleCopy = () => {
    const textToCopy = `${proverb.text}\n\n`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div
        className="bg-gradient-to-b from-purple-900/90 to-indigo-900/90 rounded-lg border border-purple-500/30 
                  max-w-lg w-full p-6 shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-purple-200">
            Your Cosmic Proverb
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {/* Burmese proverb */}
          <p className="text-xl font-bold text-purple-200 border-l-4 border-purple-500 pl-3 py-1">
            {proverb.text}
          </p>

        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-purple-300/70">
            Share this cosmic wisdom with others
          </p>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              copied
                ? "bg-green-600/30 text-green-200"
                : "bg-purple-800/50 text-purple-200 hover:bg-purple-700/70"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
