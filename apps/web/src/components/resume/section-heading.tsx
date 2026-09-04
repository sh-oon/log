interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
}

export const SectionHeading = ({ id, eyebrow, title, description }: SectionHeadingProps) => (
  <header className="mb-10 max-w-2xl">
    <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
      {eyebrow}
    </p>
    <h2
      id={id}
      className="text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl"
    >
      {title}
    </h2>
    {description ? (
      <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>
    ) : null}
  </header>
);
