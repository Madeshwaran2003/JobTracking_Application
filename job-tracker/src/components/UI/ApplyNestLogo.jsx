export default function ApplyNestLogo({ compact }) {
  const dots = [
    { cx: 12, cy: 30, fill: 'var(--logo-dot-1)' },
    { cx: 12, cy: 22, fill: 'var(--logo-dot-2)' },
    { cx: 16, cy: 14, fill: 'var(--logo-dot-3)' },
    { cx: 25, cy: 9, fill: 'var(--logo-dot-4)' },
    { cx: 35, cy: 9, fill: 'var(--logo-dot-5)' },
    { cx: 44, cy: 14, fill: 'var(--logo-dot-6)' },
    { cx: 50, cy: 22, fill: 'var(--logo-dot-7)' },
    { cx: 20, cy: 38, fill: 'var(--logo-dot-3)' },
    { cx: 30, cy: 41, fill: 'var(--logo-dot-5)' },
  ];

  return (
    <div
      className={`applynest-logo flex-shrink-0 ${compact ? 'w-10 h-10 p-1.5' : 'w-11 h-11 p-1.5'}`}
      aria-label="ApplyNest logo"
    >
      <svg viewBox="0 0 62 50" role="img" className="w-full h-full">
        <title>ApplyNest</title>
        {dots.map((dot) => (
          <circle key={`${dot.cx}-${dot.cy}`} {...dot} r="5.2" />
        ))}
      </svg>
    </div>
  );
}
