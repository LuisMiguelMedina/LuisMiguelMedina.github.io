export function LumivoxMark() {
  return (
    <span className="lumivox-mark">
      <LumivoxSun />
      <span>Lumivox</span>
    </span>
  );
}

function LumivoxSun() {
  // Placeholder oil-painted sun. Replaced when the real asset is ready.
  const rays = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  return (
    <svg className="lumivox-mark-sun" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="6.2" fill="var(--lvx-sun)" />
      <circle cx="18" cy="18" r="6.2" fill="none" stroke="var(--lvx-sun-deep)" strokeWidth="1" />
      {rays.map((angle) => (
        <line
          key={angle}
          x1="18"
          y1="18"
          x2="18"
          y2="3.5"
          stroke="var(--lvx-sun)"
          strokeWidth="1.6"
          strokeLinecap="round"
          transform={`rotate(${angle} 18 18)`}
        />
      ))}
    </svg>
  );
}
