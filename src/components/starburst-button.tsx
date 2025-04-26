"use client"

import type React from "react"
import type { ButtonHTMLAttributes } from "react"

interface StarburstButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function StarburstButton({ children, onClick, disabled = false, ...props }: StarburstButtonProps) {
  return (
    <button
      className={`
        px-6 py-3 rounded-lg text-lg font-medium
        bg-gradient-to-r from-purple-700 to-fuchsia-600
        text-white shadow-lg
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
