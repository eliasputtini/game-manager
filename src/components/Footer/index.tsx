export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto mt-16 flex gap-2 flex-wrap items-center text-gray-700 justify-center text-sm">
      Copyright © 2025. Made by
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-600 hover:text-gray-800"
        href="https://github.com/eliasputtini"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-gray-700"
        >
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.11.82-.26.82-.578 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.547-1.39-1.337-1.76-1.337-1.76-1.093-.75.082-.735.082-.735 1.207.085 1.84 1.238 1.84 1.238 1.074 1.84 2.816 1.308 3.504 1 .108-.778.42-1.308.763-1.61-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.47-2.38 1.235-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3-.404c1.02.005 2.047.138 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.805 5.624-5.476 5.92.43.37.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.293 0 .32.217.694.826.576C20.565 21.796 24 17.297 24 12 24 5.37 18.627 0 12 0z" />
        </svg>
        @eliasputtini
      </a>
    </footer>
  );
}
