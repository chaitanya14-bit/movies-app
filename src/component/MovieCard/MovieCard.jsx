import { Link } from "react-router-dom";
import { posterFallback } from "../../utils";

function MovieCard({ id, title, image, rate, count, year, category }) {
  return (
    <div className="product-card">
      <img
        src={image}
        alt={`${title} poster`}
        className="product-image"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = posterFallback(title);
        }}
      />

      <div className="product-info">
        <p className="category">{category}</p>

        <h3>{title}</h3>

        <p className="price">{year}</p>

        <p className="rating">⭐ {rate} <span className="rating-count">({count})</span></p>

        <Link to={`/movies/${id}`} className="view-btn">View Details</Link>
      </div>
    </div>
  );
}

export default MovieCard;
