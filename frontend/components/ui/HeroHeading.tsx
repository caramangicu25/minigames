interface Props {
  title: string;
  subtitle?: string;
}

export function HeroHeading({ title, subtitle }: Props) {
  return (
    <div className="text-center animate-rise">
      <h1 className="text-4xl sm:text-5xl font-bold text-heading leading-tight mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-muted text-lg max-w-xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
