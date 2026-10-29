import { useEffect, useState } from "react";
import "./Movies.css";
import MovieCard from "../../component/MovieCard/MovieCard";
import { getMovies } from "../../services/api";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    getMovies()
      .then((data) => setMovies(data))
      .catch(() => setError("Could not load movies. Start the API with: npm run server"))
      .finally(() => setLoading(false));
  }, []);

  const genres = [...new Set(movies.map((m) => m.category))].sort();
  const years = [...new Set(movies.map((m) => m.year))].sort((a, b) => b - a);

  const filtered = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(search.trim().toLowerCase()) &&
      (!genre || m.category === genre) &&
      (!year || String(m.year) === year)
  );

  if (loading) return <p className="message">Loading movies…</p>;
  if (error) return <p className="message error">{error}</p>;

  return (
    <>
      <div className="filters">
        <input
          type="search"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="message">No movies match your search.</p>
      ) : (
        <div className="product-container">
          {filtered.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              image={movie.image}
              year={movie.year}
              rate={movie.rating.rate}
              count={movie.rating.count}
              category={movie.category}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default Movies;
