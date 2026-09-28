const stars = Array.from({ length: 18 }, (_, index) => ({
  x: `${(index * 47 + 13) % 100}%`,
  delay: `${-((index * 7) % 23)}s`,
  duration: `${18 + ((index * 11) % 14)}s`,
  size: `${index % 6 === 0 ? 2 : 1}px`,
  rest: `${5 + ((index * 13) % 88)}%`,
}));

export const FallingStars = () => (
  <div className="falling-stars" aria-hidden="true">
    {stars.map((star, index) => (
      <span
        className="falling-star"
        key={index}
        style={{
          "--star-x": star.x,
          "--star-delay": star.delay,
          "--star-duration": star.duration,
          "--star-size": star.size,
          "--star-rest": star.rest,
        }}
      />
    ))}
  </div>
);
