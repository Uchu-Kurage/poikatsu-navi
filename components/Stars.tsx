export function Stars({ score }: { score: number }) {
  const full = Math.floor(score);
  const half = score - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="stars" aria-label={`5段階中 ${score}`}>
      {"★".repeat(full)}
      {half ? "☆" : ""}
      {"·".repeat(Math.max(0, empty))}
    </span>
  );
}
