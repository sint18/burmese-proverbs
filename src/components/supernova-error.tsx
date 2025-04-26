"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface SupernovaErrorProps {
  message: string;
  onRetry: () => void;
}

export function SupernovaError({ message, onRetry }: SupernovaErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 bg-red-900/20 rounded-lg border border-red-500/30">
      <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
      <p className="text-xl font-bold text-red-400 mb-6">{message}</p>
      <Button
        className="py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
        onClick={onRetry}
      >
        Retry
      </Button>
    </div>
  );
}
