import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { getMovies } from "../../services/api";

function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMovies()
      .then((data) => setMovies(data))
      .catch(() => setError("Could not load data. Start the API with: npm run server"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="dash-message">Loading dashboard…</p>;
  if (error) return <p className="dash-message error">{error}</p>;

  // 1. Total movies
  const totalMovies = movies.length;

  // 2. Average rating (weighted by how many people rated each movie)
  const totalVotes = movies.reduce((sum, m) => sum + m.rating.count, 0);
  const averageRating = totalVotes
    ? movies.reduce((sum, m) => sum + m.rating.rate * m.rating.count, 0) / totalVotes
    : 0;

  // 3. Highest rated movie
  const highest = movies.reduce(
    (best, m) => (!best || m.rating.rate > best.rating.rate ? m : best),
    null
  );

  // 4. Movies by genre
  const genreCounts = {};
  movies.forEach((m) => {
    genreCounts[m.category] = (genreCounts[m.category] || 0) + 1;
  });
  const genreRows = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = genreRows.length ? genreRows[0][1] : 1;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stat-grid">
        <div className="stat-card">
          <p className="stat-label">Total Movies</p>
          <p className="stat-value">{totalMovies}</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">Average Rating</p>
          <p className="stat-value">⭐ {averageRating.toFixed(1)}</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">Highest Rated Movie</p>
          {highest ? (
            <>
              <p className="stat-title">
                <Link to={`/movies/${highest.id}`}>{highest.title}</Link>
              </p>
              <p className="stat-sub">⭐ {highest.rating.rate} · {highest.category}</p>
            </>
          ) : (
            <p className="stat-sub">No movies yet</p>
          )}
        </div>
      </div>

      <div className="genre-card">
        <h2>Movies by Genre</h2>
        {genreRows.length === 0 ? (
          <p className="stat-sub">No movies yet</p>
        ) : (
          <ul className="genre-list">
            {genreRows.map(([genre, count]) => (
              <li key={genre}>
                <span className="genre-name">{genre}</span>
                <span className="genre-track">
                  <span className="genre-fill" style={{ width: `${(count / maxCount) * 100}%` }} />
                </span>
                <span className="genre-count">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;