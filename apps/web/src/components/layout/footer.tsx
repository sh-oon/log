export const Footer = () => (
  <footer className="px-3 pb-3 sm:px-5 sm:pb-5">
    <div className="glass mx-auto flex max-w-6xl flex-col gap-5 rounded-3xl px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <p className="text-sm font-semibold text-foreground">정성훈 · Frontend Developer</p>
        <p className="mt-1 text-xs text-muted-foreground">
          구조와 프로세스로 오래가는 제품을 만듭니다.
        </p>
      </div>
      <div className="flex items-center gap-5 font-mono text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()}</span>
        <a
          href="https://github.com/sh-oon"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          GitHub
        </a>
        <a
          href="mailto:ajcjcjc@gmail.com"
          className="transition-colors hover:text-foreground"
        >
          Email
        </a>
      </div>
    </div>
  </footer>
);
