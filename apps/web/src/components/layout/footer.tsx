export const Footer = () => (
  <footer className="border-t border-gray-200 dark:border-white/10 py-12">
    <div className="max-w-3xl mx-auto px-6 flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm font-mono">
      <div>&copy; 2025 Jeong Seong Hun</div>
      <div className="flex space-x-6">
        <a
          href="https://github.com/sh-oon"
          className="hover:text-black dark:hover:text-white transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
        <a
          href="mailto:ajcjcjc@gmail.com"
          className="hover:text-black dark:hover:text-white transition-colors"
        >
          Mail
        </a>
      </div>
    </div>
  </footer>
);
