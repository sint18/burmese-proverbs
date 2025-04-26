"use client"

import type React from "react"
import type { InputHTMLAttributes } from "react"

interface BlackHoleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function BlackHoleInput({ onChange, ...props }: BlackHoleInputProps) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full px-6 py-3 text-lg bg-purple-900/50 border border-purple-400 rounded-lg 
                  text-purple-100 placeholder-purple-300/70 outline-none"
        onChange={onChange}
        {...props}
      />
    </div>
  )
}
