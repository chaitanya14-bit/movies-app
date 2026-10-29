import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./MovieDetails.css";
import StarRating from "../../component/StarRating/StarRating";
import { getMovieById, getReviews, addReview, updateMovie } from "../../services/api";
import { posterFallback } from "../../utils";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [thanks, setThanks] = useState(false);

  const loadReviews = () =>
    getReviews().then((all) => setReviews(all.filter((r) => String(r.movieId) === String(id)).reverse()));

  useEffect(() => {
    Promise.all([getMovieById(id), loadReviews()])
      .then(([m]) => setMovie(m))
      .catch(() => setError("Could not load this movie. Make sure the API is running (npm run server)."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Enter your name.";
    if (!rating) newErrors.rating = "Choose a rating from 1 to 5 stars.";
    if (comment.trim().length < 5) newErrors.comment = "Write at least 5 characters.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaving(true);
    try {
      // 1. save the review
      await addReview({
        movieId: Number(id),
        name: name.trim(),
        rating,
        comment: comment.trim(),
        date: new Date().toISOString().slice(0, 10),
      });

      // 2. update the movie's average rating
      const { rate, count } = movie.rating;
      const newCount = count + 1;
      const newRate = Math.round(((rate * count + rating) / newCount) * 10) / 10;
      const updated = await updateMovie(id, { ...movie, rating: { rate: newRate, count: newCount } });
      setMovie(updated);

      await loadReviews();
      setName("");
      setRating(0);
      setComment("");
      setThanks(true);
    } catch {
      setErrors({ form: "Could not save your rating. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (error) return <p className="message error">{error}</p>;
  if (!movie) return <p className="message">Loading…</p>;

  return (
    <div className="details-page">
      <Link to="/movies" className="back-link">← Back to movies</Link>

      <div className="details-card">
        <img
          src={movie.image}
          alt={`${movie.title} poster`}
          className="details-poster"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = posterFallback(movie.title);
          }}
        />

        <div className="details-info">
          <p className="category">{movie.category}</p>
          <h1>{movie.title}</h1>
          <p className="details-rating">
            ⭐ {movie.rating.rate} <span className="rating-count">({movie.rating.count} ratings)</span>
          </p>
          <p className="details-desc">{movie.description}</p>

          <dl className="facts">
            <div><dt>Release year</dt><dd>{movie.year}</dd></div>
            <div><dt>Duration</dt><dd>{movie.duration} min</dd></div>
            <div><dt>Director</dt><dd>{movie.director}</dd></div>
            <div><dt>Cast</dt><dd>{movie.cast}</dd></div>
          </dl>
        </div>
      </div>

      <div className="rate-section">
        <form className="rate-form" onSubmit={handleSubmit} noValidate>
          <h2>Rate this movie</h2>

          {thanks && <p className="thanks">Thank you! Your rating has been added.</p>}

          <label htmlFor="name">Your name</label>
          <input id="name" value={name} onChange={(e) => { setName(e.target.value); setThanks(false); }} />
          {errors.name && <p className="field-error">{errors.name}</p>}

          <label>Your rating</label>
          <StarRating value={rating} onChange={(n) => { setRating(n); setThanks(false); }} />
          {errors.rating && <p className="field-error">{errors.rating}</p>}

          <label htmlFor="comment">Your review</label>
          <textarea id="comment" rows="4" value={comment} onChange={(e) => { setComment(e.target.value); setThanks(false); }} />
          {errors.comment && <p className="field-error">{errors.comment}</p>}

          {errors.form && <p className="field-error">{errors.form}</p>}
          <button className="submit-btn" disabled={saving}>
            {saving ? "Submitting…" : "Submit rating"}
          </button>
        </form>

        <div className="reviews">
          <h2>Reviews ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <p className="muted">No reviews yet. Be the first to review this movie.</p>
          ) : (
            <ul>
              {reviews.map((r) => (
                <li key={r.id}>
                  <div className="review-head">
                    <strong>{r.name}</strong>
                    <span>⭐ {r.rating}</span>
                    <span className="muted">{r.date}</span>
                  </div>
                  <p>{r.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
