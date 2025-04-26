import React from "react";

export const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t border-purple-500/20 bg-purple-900/20">
      <div className="mx-auto flex max-w-4xl justify-between items-center gap-4 px-4 py-6 text-purple-300">
        <p className="flex items-center gap-2">
          Built with <span className="text-red-500">❤️</span> by AI Code Lab
          Team
        </p>
        <div className="flex gap-4">
          <a
            href="https://www.facebook.com/AICodeLab"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-purple-200"
          >
            Facebook
          </a>
          <a
            href="https://www.youtube.com/@AICodeLabMM"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-purple-200"
          >
            YouTube
          </a>
        </div>
        <p>© 2025</p>
      </div>
    </footer>
  );
};
