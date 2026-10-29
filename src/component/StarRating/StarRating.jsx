import { useState } from "react";
import "./StarRating.css";

// Clickable 1-5 stars
function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className={n <= (hover || value) ? "star on" : "star"}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default StarRating;
